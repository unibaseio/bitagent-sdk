import lodash from 'lodash';
const { uniqBy } = lodash;
import { countDecimals, countLeadingZeros, handleScientificNotation } from './numbers';
import { GenerateStepArgs } from '../types/bond.types';

export const enum CurveEnum {
  FLAT = 'FLAT',
  LINEAR = 'LINEAR',
  EXPONENTIAL = 'EXPONENTIAL',
  LOGARITHMIC = 'LOGARITHMIC',
}

export const graphTypes = [CurveEnum.FLAT, CurveEnum.LINEAR, CurveEnum.EXPONENTIAL, CurveEnum.LOGARITHMIC] as const;

// interval range: max supply decimal count + 3
// price: starting price decimal count + 3
export function formatGraphPoint(value: number, relativeValue: number, maxDecimalPoints?: number) {
  const relativeValueDecimalCount = countDecimals(relativeValue) + 3;
  let formattedValue;
  if (maxDecimalPoints !== undefined && relativeValueDecimalCount > maxDecimalPoints) {
    formattedValue = Number(value?.toFixed(maxDecimalPoints));
  } else {
    formattedValue = Number(value?.toFixed(relativeValueDecimalCount));
  }
  // it should format the value, not return 0
  if (value !== 0 && formattedValue === 0) return value;
  return formattedValue;
}

export function generateSteps(form: GenerateStepArgs) {
  const {
    tokenType,
    reserveToken,
    curveData: {
      curveType,
      stepCount: _stepCount,
      maxSupply,
      creatorAllocation = 0,
      initialMintingPrice,
      finalMintingPrice,
    },
  } = form;

  const maxPrice = finalMintingPrice;
  const startingPrice = initialMintingPrice;
  const stepPoints: Array<{ x: number; y: number }> = [];
  let stepCount = curveType === CurveEnum.FLAT ? 1 : _stepCount;

  if (tokenType === 'ERC1155' && stepCount > maxSupply) {
    stepCount = maxSupply;
  }

  // here we need to calculate the extra step count if the starting price is 0
  let extraStepCount = 0;

  if (startingPrice === 0) {
    extraStepCount = 1;
  }

  const deltaX = (maxSupply - creatorAllocation) / (stepCount + extraStepCount);
  const totalX = maxSupply - creatorAllocation - deltaX;
  const totalY = maxPrice - startingPrice;

  /*
  In the EXPONENTIAL case, the formula used is y = startingPrice + a(x - creatorAllocation)^2, where "a" is the coefficient and "x" is the current step.
  */
  const coefficientExponential = totalY / Math.pow(totalX, 2);
  /*
  In the LOGARITHMIC case, the formula is y = startingPrice + b * ln(x - creatorAllocation), where "b" is the coefficient and "x" is the current step.
  */
  // OLD: this is the old formula, but it's too steep
  // const coefficientLogarithmic = totalY / Math.log(totalX);

  // NEW: this is the new formula, which is less steep, using Math.pow
  const exponent = 0.5; // This can be adjusted to control the curve steepness
  const coefficientPower = totalY / Math.pow(totalX, exponent);

  for (let i = extraStepCount; i <= stepCount + extraStepCount; i++) {
    let x = i * deltaX + creatorAllocation;
    if (tokenType === 'ERC1155') x = Math.ceil(x);
    let y: number;

    switch (curveType) {
      case CurveEnum.FLAT:
        y = startingPrice;
        break;
      case CurveEnum.LINEAR:
        const stepPerPrice = totalY / totalX;
        y = stepPerPrice * (x - creatorAllocation) + startingPrice;
        break;
      case CurveEnum.EXPONENTIAL:
        y = startingPrice + coefficientExponential * Math.pow(x - creatorAllocation, 2);
        break;
      case CurveEnum.LOGARITHMIC:
        if (x - creatorAllocation === 0) y = startingPrice;
        else {
          // OLD - using Math.log
          // y =
          //   startingPrice +
          //   coefficientLogarithmic * Math.log(x - creatorAllocation);

          // NEW - using Math.pow
          y = startingPrice + coefficientPower * Math.pow(x - creatorAllocation, exponent);
        }
        break;
      default:
        y = 0;
    }

    // interval range: leading 0 of deltaX + 3
    // price: max price decimal count + 3
    const leadingZeros = countLeadingZeros(handleScientificNotation(deltaX));
    if (tokenType === 'ERC1155') {
      x = Number(x.toFixed(0));
    } else if (leadingZeros !== undefined && leadingZeros > 0) {
      x = Number(x.toFixed(leadingZeros + 3));
    } else {
      x = formatGraphPoint(x, maxSupply, 18);
    }

    y = formatGraphPoint(y, maxPrice, reserveToken.decimals);

    // last point is used to ensure the max price is reached
    // x is the range, y is the price
    if (i === stepCount && curveType !== CurveEnum.FLAT) {
      stepPoints.push({ x, y: maxPrice });
    } else {
      // there are cases where y is negative (e.g. when the curve is logarithmic and the starting price is 0)
      // in those cases, we set y to 0
      stepPoints.push({ x, y: Math.min(y || 0, maxPrice) });
    }
  }

  // If the starting price is 0, call it again to set the first step to the first point
  if (startingPrice === 0) {
    return generateSteps({
      ...form,
      curveData: {
        ...form.curveData,
        initialMintingPrice: stepPoints[0].y,
      },
    });
  }

  let mergeCount = 0;
  let clonedPoints = structuredClone(stepPoints);
  // merge same ange points. price can be different, because user can change them. ignore the last point
  for (let i = 0; i < clonedPoints.length - 2; i++) {
    if (clonedPoints[i].x === clonedPoints[i + 1].x) {
      clonedPoints.splice(i, 1);
      mergeCount++;
      i--;
    }
  }

  const finalData = uniqBy(clonedPoints, (point) => `${point.x}-${point.y}`).map((point) => {
    return { rangeTo: point.x, price: point.y };
  });

  return { stepData: finalData, mergeCount };
}

export function calculateArea(steps: { x: number; y: number }[], partialIndex?: number) {
  const clonedSteps = structuredClone(steps);
  clonedSteps.sort((a, b) => a.x - b.x);
  let intervalArea = 0;
  let totalArea = 0;

  let lastIndex = clonedSteps.length - 1;

  if (partialIndex !== undefined) {
    lastIndex = Math.min(lastIndex, partialIndex);
  }

  // Starting from the second point, calculate the area of the trapezoid formed by each step and add it to the total
  for (let i = 1; i <= lastIndex; i++) {
    const height = clonedSteps[i - 1].y;
    const width = clonedSteps[i].x - clonedSteps[i - 1].x;

    if (width > 0 && height > 0) {
      const plotArea = width * height;
      totalArea += plotArea;
      if (partialIndex === i) {
        intervalArea = plotArea;
      }
    }
  }

  return { intervalArea, totalArea };
}

export type TableData = {
  start: number;
  end: number;
  price: number;
  tvl: number;
};

export function generateTableData(steps: { x: number; y: number }[]) {
  const clonedSteps = structuredClone(steps);
  clonedSteps.sort((a, b) => a.x - b.x);
  let data: TableData[] = [];
  let totalTVL = 0;

  // Starting from the second point, calculate the area of the trapezoid formed by each step and add it to the total
  for (let i = 1; i < clonedSteps.length; i++) {
    const height = clonedSteps[i - 1].y;
    const width = clonedSteps[i].x - clonedSteps[i - 1].x;
    const obj: Partial<TableData> = {};
    obj.start = clonedSteps[i - 1].x;
    obj.end = clonedSteps[i].x;
    obj.price = clonedSteps[i - 1].y;

    if (width > 0 && height > 0) {
      const tvl = width * height;
      obj.tvl = tvl;
      totalTVL += tvl;
    }

    data.push(obj as TableData);
  }

  return { data, totalTVL };
}
