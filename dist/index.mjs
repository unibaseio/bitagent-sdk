import * as chains from 'viem/chains';
import { mainnet, optimism, optimismSepolia, arbitrum, avalanche, polygon, bsc, bscTestnet, base, baseSepolia, sepolia, blast, blastSepolia, avalancheFuji, degen, cyberTestnet, kaia, cyber, ham, zora } from 'viem/chains';
import { parseUnits, formatUnits, isAddress, http, createWalletClient, custom, createPublicClient, fallback, publicActions, stringToHex, keccak256, hexToBytes, getAddress, bytesToHex, maxUint256 } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import MerkleTree from 'merkletreejs';
import { randomBytes } from 'crypto';
import lodash from 'lodash';
import ky from 'ky';
import { PinataSDK } from 'pinata-web3';

const DOCUMENTATION_URL = "https://sdk.mint.club";

function truncateString(str, length = 100) {
  if (str.length > length) {
    return str.slice(0, length - 3) + "...";
  }
  return str;
}
function getSubscriptCharacter(number) {
  let str = number.toString();
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      newStr += String.fromCharCode(code + 8272);
    } else {
      newStr += str[i];
    }
  }
  return newStr;
}

function commify(x) {
  const parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
function uncommify(str) {
  return str.toString().replace(/,/g, "");
}
function handleScientificNotation(num) {
  const str = num?.toString();
  if (str?.includes("e")) {
    const [coefficient, exponent] = str.split("e");
    const decimalCount = countDecimals(Number(coefficient));
    const exponentValue = parseInt(exponent, 10);
    if (exponentValue >= 0) {
      const result = Number(num).toLocaleString();
      return result;
    } else {
      const result = Number(num).toFixed(Math.abs(exponentValue) + decimalCount);
      return result;
    }
  }
  return str;
}
function countLeadingZeros(num) {
  const stringValue = handleScientificNotation(num?.toString());
  if (!stringValue || !stringValue?.includes(".")) return 0;
  const [, decimalPart] = stringValue.split(".");
  const leadingZeros = decimalPart ? decimalPart.match(/^0*/)?.[0]?.length : 0;
  return leadingZeros ?? 0;
}
function getValueAfterLeadingZeros(num) {
  const numStr = handleScientificNotation(num?.toString());
  if (!numStr) return;
  const matches = /\.0*([1-9]\d*)$/.exec(numStr);
  if (matches && matches[1]) {
    return parseInt(matches[1], 10);
  }
  return num;
}
function countDecimals(value) {
  const numStr = handleScientificNotation(value?.toString());
  const length = numStr?.split(".")?.[1]?.length;
  return length ?? 0;
}
function toFixed(value, t) {
  return Number(Number(value).toFixed(t));
}
function wei$1(num, decimals = 18) {
  const stringified = handleScientificNotation(num.toString());
  return parseUnits(stringified, decimals);
}
function toNumber(num, decimals) {
  return Number(formatUnits(num, decimals));
}
function shortenNumber(num, prefix = "") {
  num = Number(num.toString().replaceAll(",", ""));
  if (num >= 1e12) {
    return `${prefix}${toFixed(num / 1e12, 2)}T`;
  } else if (num >= 1e9) {
    return `${prefix}${toFixed(num / 1e9, 2)}B`;
  } else if (num >= 1e6) {
    return `${prefix}${toFixed(num / 1e6, 2)}M`;
  } else if (num >= 1e3) {
    return `${prefix}${toFixed(num / 1e3, 2)}K`;
  } else if (num === 0) {
    return `${prefix}0`;
  } else if (num <= 1e-6) {
    return `< ${prefix}0.000001`;
  }
  return prefix + num.toLocaleString("en-US", {
    maximumFractionDigits: 6
  });
}
function applyDecimals(num) {
  const toNum = Number(num);
  let decimalPlaces;
  if (toNum >= 1e5) {
    decimalPlaces = 0;
  } else if (toNum >= 1e3) {
    decimalPlaces = 2;
  } else if (toNum >= 10) {
    decimalPlaces = 3;
  } else if (toNum >= 1) {
    decimalPlaces = 4;
  } else if (toNum >= 0.1) {
    decimalPlaces = 5;
  } else if (toNum >= 0.01) {
    decimalPlaces = 6;
  }
  if (decimalPlaces === void 0) {
    return handleScientificNotation(toNum.toString());
  }
  return handleScientificNotation(
    toNum.toLocaleString("en-US", {
      maximumFractionDigits: decimalPlaces
    })
  );
}
function precisionRound(number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
function getSubscriptNumber(params) {
  const { number, maxDecimals = 18, allowedLeadingZeros = 3 } = params;
  const leadingZeros = countLeadingZeros(Number(number));
  const valueAfterZeros = getValueAfterLeadingZeros(Number(number));
  if (number?.toString().includes("e+") || Number(number) >= 1 || leadingZeros <= allowedLeadingZeros) {
    return shortenNumber(number, "");
  }
  let numberToDisplay;
  numberToDisplay = Number(number).toFixed(maxDecimals);
  numberToDisplay = applyDecimals(handleScientificNotation(number));
  numberToDisplay = commify(numberToDisplay);
  return ["0.0", getSubscriptCharacter(leadingZeros), valueAfterZeros].join("");
}

var name = "@bitagent/sdk";
var files = [
	"./dist/**/*",
	"./src/**/*"
];
var type = "module";
var license = "BSD-3-Clause";
var version = "0.6.0";
var main = "./dist/index.cjs";
var module = "./dist/index.mjs";
var types = "./dist/index.d.ts";
var browser = {
	"./dist/index.mjs": "./dist/index.mjs",
	"./dist/index.cjs": "./dist/index.cjs"
};
var exports = {
	".": {
		"import": "./dist/index.mjs",
		require: "./dist/index.cjs",
		"default": "./dist/index.mjs",
		types: "./dist/index.d.ts"
	},
	"./node": {
		"import": "./dist/node.mjs",
		require: "./dist/node.cjs",
		"default": "./dist/node.cjs",
		types: "./dist/index.d.ts"
	}
};
var scripts = {
	"docs:deploy": "",
	build: "npm run purge && npx pkgroll",
	prepublishOnly: "git push && npm run build",
	purge: "npx rimraf ./dist",
	test: "npx bun test",
	"test:watch": "npx bun test --watch",
	hardhat: "NODE_ENV=hardhat npx bun test hardhat"
};
var devDependencies = {
	"@nomicfoundation/hardhat-toolbox": "^4.0.0",
	"@nomicfoundation/hardhat-viem": "^2.0.0",
	"@openzeppelin/contracts": "^5.0.2",
	"@rollup/plugin-alias": "^5.1.0",
	"@rollup/plugin-dynamic-import-vars": "^2.1.2",
	"@rollup/plugin-terser": "^0.4.4",
	"@rollup/plugin-typescript": "^11.1.6",
	"@types/bun": "^1.0.8",
	"@typescript-eslint/eslint-plugin": "^7.1.0",
	"@typescript-eslint/parser": "^7.1.0",
	bun: "^1.0.25",
	eslint: "^8.57.0",
	"eslint-config-prettier": "^9.1.0",
	hardhat: "^2.20.1",
	"mint-club-v2": "github:Steemhunt/mint.club-v2-contract",
	pkgroll: "^2.0.1",
	prettier: "^3.2.5",
	rimraf: "^5.0.5",
	"ts-node": "^10.9.2",
	typescript: "^5.0.4"
};
var dependencies = {
	"@rollup/plugin-node-resolve": "^15.2.3",
	"@types/jsdom": "^21.1.6",
	"@types/lodash": "^4.14.202",
	abitype: "^1.0.0",
	"aws-sdk": "^2.1578.0",
	dotenv: "^16.4.5",
	jsdom: "^24.0.0",
	"ky-universal": "^0.12.0",
	lodash: "^4.17.21",
	merkletreejs: "^0.3.11",
	"pinata-web3": "^0.5.2",
	viem: "^2.21.15"
};
var pkg = {
	name: name,
	files: files,
	type: type,
	license: license,
	version: version,
	main: main,
	module: module,
	types: types,
	browser: browser,
	exports: exports,
	scripts: scripts,
	devDependencies: devDependencies,
	dependencies: dependencies
};

function wei(num, decimals = 18) {
  const stringified = handleScientificNotation(num.toString());
  return parseUnits(stringified, decimals);
}
function getVersion() {
  return pkg.version;
}

class BaseError extends Error {
  details;
  docsPath;
  metaMessages;
  shortMessage;
  name = "MintClubSDKError";
  version = getVersion();
  constructor(shortMessage, args = {}) {
    super();
    const details = args.cause instanceof BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
    const docsPath = args.cause instanceof BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
    this.message = [
      shortMessage || "An error occurred.",
      "",
      ...args.metaMessages ? [...args.metaMessages, ""] : [],
      ...docsPath ? [`Docs: ${DOCUMENTATION_URL}/${docsPath}${args.docsSlug ? `#${args.docsSlug}` : ""}`] : [],
      ...details ? [`Details: ${details}`] : [],
      `Version: ${this.version}`
    ].join("\n");
    if (args.cause) this.cause = args.cause;
    this.details = details;
    this.docsPath = docsPath;
    this.metaMessages = args.metaMessages;
    this.shortMessage = shortMessage;
  }
  walk(fn) {
    return walk(this, fn);
  }
}
function walk(err, fn) {
  if (fn?.(err)) return err;
  if (err && typeof err === "object" && "cause" in err) return walk(err.cause, fn);
  return fn ? null : err;
}

class TokenAlreadyExistsError extends BaseError {
  constructor() {
    super("Token already exists", {
      docsPath: "docs/sdk/network/token"
    });
  }
}
class ChainNotSupportedError extends BaseError {
  constructor(chain) {
    super(`Chain ${chain} is not supported`);
  }
}
class SymbolNotDefinedError extends BaseError {
  constructor() {
    super("You must pass in a symbol, not an address to call the `create` function", {
      docsPath: "docs/sdk/network/token/create"
    });
  }
}
class InvalidImageProvidedError extends BaseError {
  constructor() {
    super(
      "You must provide a valid url for the media. It should be either a http/https url, or a CIDv0 or CIDv1 ipfs hash that starts with `ipfs://...`",
      {
        docsPath: "docs/sdk/network/nft/create"
      }
    );
  }
}
class PinataKeyNeededErrror extends BaseError {
  constructor() {
    super("You must provide a  PinataApiKey to upload Files to the IPFS", {
      docsPath: "docs/sdk/network/nft/create"
    });
  }
}
class NoEthereumProviderError extends BaseError {
  constructor() {
    super("window.ethereum not found", {
      docsPath: "docs/sdk/network/transactions"
    });
  }
}
class WalletNotConnectedError extends BaseError {
  constructor() {
    super("Wallet not connected", {
      docsPath: "docs/sdk/network/transactions"
    });
  }
}
class InvalidClientError extends BaseError {
  constructor() {
    super("Client with no chain was passed", {
      docsPath: "docs/sdk/network/transactions/withPublicClient"
    });
  }
}
class CreationError extends BaseError {
  constructor(message, extra) {
    super(message, {
      docsPath: "/docs/sdk/network/token/create",
      ...extra
    });
  }
}
class AirdropContainsInvalidWalletError extends BaseError {
  constructor() {
    super("Airdrop contains invalid wallet", {
      docsPath: "docs/sdk/network/token/createAirdrop"
    });
  }
}

const BOND_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "tokenImplementation", type: "address", internalType: "address" },
      { name: "multiTokenImplementation", type: "address", internalType: "address" },
      { name: "protocolBeneficiary_", type: "address", internalType: "address" },
      { name: "creationFee_", type: "uint256", internalType: "uint256" },
      { name: "maxSteps", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "BURN_ADDRESS",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "burn",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "tokensToBurn", type: "uint256", internalType: "uint256" },
      { name: "minRefund", type: "uint256", internalType: "uint256" },
      { name: "receiver", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "burnRoyalties",
    inputs: [{ name: "reserveToken", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "claimRoyalties",
    inputs: [{ name: "reserveToken", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "createMultiToken",
    inputs: [
      {
        name: "tp",
        type: "tuple",
        internalType: "struct MCV2_Bond.MultiTokenParams",
        components: [
          { name: "name", type: "string", internalType: "string" },
          { name: "symbol", type: "string", internalType: "string" },
          { name: "uri", type: "string", internalType: "string" }
        ]
      },
      {
        name: "bp",
        type: "tuple",
        internalType: "struct MCV2_Bond.BondParams",
        components: [
          { name: "mintRoyalty", type: "uint16", internalType: "uint16" },
          { name: "burnRoyalty", type: "uint16", internalType: "uint16" },
          { name: "reserveToken", type: "address", internalType: "address" },
          { name: "maxSupply", type: "uint128", internalType: "uint128" },
          { name: "stepRanges", type: "uint128[]", internalType: "uint128[]" },
          { name: "stepPrices", type: "uint128[]", internalType: "uint128[]" }
        ]
      }
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "createToken",
    inputs: [
      {
        name: "tp",
        type: "tuple",
        internalType: "struct MCV2_Bond.TokenParams",
        components: [
          { name: "name", type: "string", internalType: "string" },
          { name: "symbol", type: "string", internalType: "string" },
          { name: "agentHash", type: "bytes32", internalType: "bytes32" }
        ]
      },
      {
        name: "bp",
        type: "tuple",
        internalType: "struct MCV2_Bond.BondParams",
        components: [
          { name: "mintRoyalty", type: "uint16", internalType: "uint16" },
          { name: "burnRoyalty", type: "uint16", internalType: "uint16" },
          { name: "reserveToken", type: "address", internalType: "address" },
          { name: "maxSupply", type: "uint128", internalType: "uint128" },
          { name: "stepRanges", type: "uint128[]", internalType: "uint128[]" },
          { name: "stepPrices", type: "uint128[]", internalType: "uint128[]" }
        ]
      }
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "creationFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "exists",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getDetail",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "detail",
        type: "tuple",
        internalType: "struct MCV2_Bond.BondDetail",
        components: [
          { name: "mintRoyalty", type: "uint16", internalType: "uint16" },
          { name: "burnRoyalty", type: "uint16", internalType: "uint16" },
          {
            name: "info",
            type: "tuple",
            internalType: "struct MCV2_Bond.BondInfo",
            components: [
              { name: "creator", type: "address", internalType: "address" },
              { name: "token", type: "address", internalType: "address" },
              { name: "decimals", type: "uint8", internalType: "uint8" },
              { name: "symbol", type: "string", internalType: "string" },
              { name: "name", type: "string", internalType: "string" },
              { name: "createdAt", type: "uint40", internalType: "uint40" },
              { name: "currentSupply", type: "uint128", internalType: "uint128" },
              { name: "maxSupply", type: "uint128", internalType: "uint128" },
              { name: "priceForNextMint", type: "uint128", internalType: "uint128" },
              { name: "reserveToken", type: "address", internalType: "address" },
              { name: "reserveDecimals", type: "uint8", internalType: "uint8" },
              { name: "reserveSymbol", type: "string", internalType: "string" },
              { name: "reserveName", type: "string", internalType: "string" },
              { name: "reserveBalance", type: "uint256", internalType: "uint256" }
            ]
          },
          {
            name: "steps",
            type: "tuple[]",
            internalType: "struct MCV2_Bond.BondStep[]",
            components: [
              { name: "rangeTo", type: "uint128", internalType: "uint128" },
              { name: "price", type: "uint128", internalType: "uint128" }
            ]
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getList",
    inputs: [
      { name: "start", type: "uint256", internalType: "uint256" },
      { name: "stop", type: "uint256", internalType: "uint256" }
    ],
    outputs: [
      {
        name: "info",
        type: "tuple[]",
        internalType: "struct MCV2_Bond.BondInfo[]",
        components: [
          { name: "creator", type: "address", internalType: "address" },
          { name: "token", type: "address", internalType: "address" },
          { name: "decimals", type: "uint8", internalType: "uint8" },
          { name: "symbol", type: "string", internalType: "string" },
          { name: "name", type: "string", internalType: "string" },
          { name: "createdAt", type: "uint40", internalType: "uint40" },
          { name: "currentSupply", type: "uint128", internalType: "uint128" },
          { name: "maxSupply", type: "uint128", internalType: "uint128" },
          { name: "priceForNextMint", type: "uint128", internalType: "uint128" },
          { name: "reserveToken", type: "address", internalType: "address" },
          { name: "reserveDecimals", type: "uint8", internalType: "uint8" },
          { name: "reserveSymbol", type: "string", internalType: "string" },
          { name: "reserveName", type: "string", internalType: "string" },
          { name: "reserveBalance", type: "uint256", internalType: "uint256" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getRefundForTokens",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "tokensToBurn", type: "uint256", internalType: "uint256" }
    ],
    outputs: [
      { name: "refundAmount", type: "uint256", internalType: "uint256" },
      { name: "royalty", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getReserveForToken",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "tokensToMint", type: "uint256", internalType: "uint256" }
    ],
    outputs: [
      { name: "reserveAmount", type: "uint256", internalType: "uint256" },
      { name: "royalty", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getRoyaltyInfo",
    inputs: [
      { name: "wallet", type: "address", internalType: "address" },
      { name: "reserveToken", type: "address", internalType: "address" }
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getSteps",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct MCV2_Bond.BondStep[]",
        components: [
          { name: "rangeTo", type: "uint128", internalType: "uint128" },
          { name: "price", type: "uint128", internalType: "uint128" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getTokensByCreator",
    inputs: [
      { name: "creator", type: "address", internalType: "address" },
      { name: "start", type: "uint256", internalType: "uint256" },
      { name: "stop", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "addresses", type: "address[]", internalType: "address[]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getTokensByReserveToken",
    inputs: [
      { name: "reserveToken", type: "address", internalType: "address" },
      { name: "start", type: "uint256", internalType: "uint256" },
      { name: "stop", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "addresses", type: "address[]", internalType: "address[]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxRoyaltyRange",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxSupply",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "tokensToMint", type: "uint256", internalType: "uint256" },
      { name: "maxReserveAmount", type: "uint256", internalType: "uint256" },
      { name: "receiver", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "priceForNextMint",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "protocolBeneficiary",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  { type: "function", name: "renounceOwnership", inputs: [], outputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "tokenBond",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "creator", type: "address", internalType: "address" },
      { name: "mintRoyalty", type: "uint16", internalType: "uint16" },
      { name: "burnRoyalty", type: "uint16", internalType: "uint16" },
      { name: "createdAt", type: "uint40", internalType: "uint40" },
      { name: "reserveToken", type: "address", internalType: "address" },
      { name: "reserveBalance", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "tokenCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "tokens",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "updateBondCreator",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "creator", type: "address", internalType: "address" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "updateCreationFee",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "updateMaxRoyaltyRange",
    inputs: [{ name: "ratio", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "updateProtocolBeneficiary",
    inputs: [{ name: "protocolBeneficiary_", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "userTokenRoyaltyBalance",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "userTokenRoyaltyClaimed",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "pure"
  },
  {
    type: "event",
    name: "BondCreatorUpdated",
    inputs: [
      { name: "token", type: "address", indexed: true, internalType: "address" },
      { name: "creator", type: "address", indexed: true, internalType: "address" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Burn",
    inputs: [
      { name: "token", type: "address", indexed: true, internalType: "address" },
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "receiver", type: "address", indexed: false, internalType: "address" },
      { name: "amountBurned", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "reserveToken", type: "address", indexed: true, internalType: "address" },
      { name: "refundAmount", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "CreationFeeUpdated",
    inputs: [{ name: "amount", type: "uint256", indexed: false, internalType: "uint256" }],
    anonymous: false
  },
  {
    type: "event",
    name: "Mint",
    inputs: [
      { name: "token", type: "address", indexed: true, internalType: "address" },
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "receiver", type: "address", indexed: false, internalType: "address" },
      { name: "amountMinted", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "reserveToken", type: "address", indexed: true, internalType: "address" },
      { name: "reserveAmount", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "MultiTokenCreated",
    inputs: [
      { name: "token", type: "address", indexed: true, internalType: "address" },
      { name: "name", type: "string", indexed: false, internalType: "string" },
      { name: "symbol", type: "string", indexed: false, internalType: "string" },
      { name: "uri", type: "string", indexed: false, internalType: "string" },
      { name: "reserveToken", type: "address", indexed: true, internalType: "address" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "previousOwner", type: "address", indexed: true, internalType: "address" },
      { name: "newOwner", type: "address", indexed: true, internalType: "address" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "ProtocolBeneficiaryUpdated",
    inputs: [{ name: "protocolBeneficiary", type: "address", indexed: false, internalType: "address" }],
    anonymous: false
  },
  {
    type: "event",
    name: "RoyaltyClaimed",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "reserveToken", type: "address", indexed: false, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "RoyaltyRangeUpdated",
    inputs: [{ name: "ratio", type: "uint256", indexed: false, internalType: "uint256" }],
    anonymous: false
  },
  {
    type: "event",
    name: "TokenCreated",
    inputs: [
      { name: "token", type: "address", indexed: true, internalType: "address" },
      { name: "name", type: "string", indexed: false, internalType: "string" },
      { name: "symbol", type: "string", indexed: false, internalType: "string" },
      { name: "reserveToken", type: "address", indexed: true, internalType: "address" },
      { name: "agenthash", type: "bytes32", indexed: true, internalType: "bytes32" }
    ],
    anonymous: false
  },
  { type: "error", name: "AddressEmptyCode", inputs: [{ name: "target", type: "address", internalType: "address" }] },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [{ name: "account", type: "address", internalType: "address" }]
  },
  { type: "error", name: "ERC1167FailedCreateClone", inputs: [] },
  { type: "error", name: "FailedInnerCall", inputs: [] },
  { type: "error", name: "MCV2_BOND__InvalidPaginationParameters", inputs: [] },
  { type: "error", name: "MCV2_Bond__CreationFeeTransactionFailed", inputs: [] },
  { type: "error", name: "MCV2_Bond__ExceedMaxSupply", inputs: [] },
  { type: "error", name: "MCV2_Bond__ExceedTotalSupply", inputs: [] },
  {
    type: "error",
    name: "MCV2_Bond__InvalidConstructorParams",
    inputs: [{ name: "reason", type: "string", internalType: "string" }]
  },
  { type: "error", name: "MCV2_Bond__InvalidCreationFee", inputs: [] },
  { type: "error", name: "MCV2_Bond__InvalidCreatorAddress", inputs: [] },
  { type: "error", name: "MCV2_Bond__InvalidCurrentSupply", inputs: [] },
  { type: "error", name: "MCV2_Bond__InvalidReceiver", inputs: [] },
  {
    type: "error",
    name: "MCV2_Bond__InvalidReserveToken",
    inputs: [{ name: "reason", type: "string", internalType: "string" }]
  },
  {
    type: "error",
    name: "MCV2_Bond__InvalidStepParams",
    inputs: [{ name: "reason", type: "string", internalType: "string" }]
  },
  { type: "error", name: "MCV2_Bond__InvalidTokenAmount", inputs: [] },
  {
    type: "error",
    name: "MCV2_Bond__InvalidTokenCreationParams",
    inputs: [{ name: "reason", type: "string", internalType: "string" }]
  },
  { type: "error", name: "MCV2_Bond__PermissionDenied", inputs: [] },
  { type: "error", name: "MCV2_Bond__SlippageLimitExceeded", inputs: [] },
  { type: "error", name: "MCV2_Bond__TokenNotFound", inputs: [] },
  { type: "error", name: "MCV2_Bond__TokenSymbolAlreadyExists", inputs: [] },
  { type: "error", name: "MCV2_Royalty__InvalidParams", inputs: [] },
  { type: "error", name: "MCV2_Royalty__NothingToClaim", inputs: [] },
  { type: "error", name: "OwnableInvalidOwner", inputs: [{ name: "owner", type: "address", internalType: "address" }] },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }]
  },
  {
    type: "error",
    name: "SafeCastOverflowedUintDowncast",
    inputs: [
      { name: "bits", type: "uint8", internalType: "uint8" },
      { name: "value", type: "uint256", internalType: "uint256" }
    ]
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address", internalType: "address" }]
  }
];

const ERC1155_ABI = [
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "ERC1155InsufficientBalance",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC1155InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "idsLength", type: "uint256" },
      { internalType: "uint256", name: "valuesLength", type: "uint256" }
    ],
    name: "ERC1155InvalidArrayLength",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "ERC1155InvalidOperator",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC1155InvalidReceiver",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC1155InvalidSender",
    type: "error"
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "address", name: "owner", type: "address" }
    ],
    name: "ERC1155MissingApprovalForAll",
    type: "error"
  },
  { inputs: [], name: "MCV2_MultiToken__AlreadyInitialized", type: "error" },
  {
    inputs: [],
    name: "MCV2_MultiToken__BurnAmountExceedsTotalSupply",
    type: "error"
  },
  { inputs: [], name: "MCV2_MultiToken__NotApproved", type: "error" },
  { inputs: [], name: "MCV2_MultiToken__PermissionDenied", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]"
      }
    ],
    name: "TransferBatch",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "TransferSingle",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" }
    ],
    name: "URI",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" }
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" }
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "bond",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "burnByBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" },
      { internalType: "string", name: "uri_", type: "string" }
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" }
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "mintByBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  }
];

const ERC20_ABI = [
  {
    type: "function",
    name: "agentHash",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "bond",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "burnByBond",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "init",
    inputs: [
      { name: "name_", type: "string", internalType: "string" },
      { name: "symbol_", type: "string", internalType: "string" },
      { name: "agentHash_", type: "bytes32", internalType: "bytes32" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "mintByBond",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true, internalType: "address" },
      { name: "spender", type: "address", indexed: true, internalType: "address" },
      { name: "value", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      { name: "to", type: "address", indexed: true, internalType: "address" },
      { name: "value", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "error",
    name: "ERC20InsufficientAllowance",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "allowance", type: "uint256", internalType: "uint256" },
      { name: "needed", type: "uint256", internalType: "uint256" }
    ]
  },
  {
    type: "error",
    name: "ERC20InsufficientBalance",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "balance", type: "uint256", internalType: "uint256" },
      { name: "needed", type: "uint256", internalType: "uint256" }
    ]
  },
  {
    type: "error",
    name: "ERC20InvalidApprover",
    inputs: [{ name: "approver", type: "address", internalType: "address" }]
  },
  {
    type: "error",
    name: "ERC20InvalidReceiver",
    inputs: [{ name: "receiver", type: "address", internalType: "address" }]
  },
  { type: "error", name: "ERC20InvalidSender", inputs: [{ name: "sender", type: "address", internalType: "address" }] },
  {
    type: "error",
    name: "ERC20InvalidSpender",
    inputs: [{ name: "spender", type: "address", internalType: "address" }]
  },
  { type: "error", name: "MCV2_Token__AlreadyInitialized", inputs: [] },
  { type: "error", name: "MCV2_Token__PermissionDenied", inputs: [] }
];

const LOCKER_ABI = [
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "LockUp__AlreadyClaimed", type: "error" },
  { inputs: [], name: "LockUp__InvalidPaginationParameters", type: "error" },
  {
    inputs: [{ internalType: "string", name: "param", type: "string" }],
    name: "LockUp__InvalidParams",
    type: "error"
  },
  { inputs: [], name: "LockUp__NotYetUnlocked", type: "error" },
  { inputs: [], name: "LockUp__PermissionDenied", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lockUpId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "isERC20", type: "bool" },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint40",
        name: "unlockTime",
        type: "uint40"
      }
    ],
    name: "LockedUp",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lockUpId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "isERC20", type: "bool" },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Unlocked",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint40", name: "unlockTime", type: "uint40" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "string", name: "title", type: "string" }
    ],
    name: "createLockUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getLockUpIdsByReceiver",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getLockUpIdsByToken",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lockUpCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "lockUps",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint40", name: "unlockTime", type: "uint40" },
      { internalType: "bool", name: "unlocked", type: "bool" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "string", name: "title", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "lockUpId", type: "uint256" }],
    name: "unlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const MERKLE_ABI = [
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "MerkleDistributor__AlreadyClaimed", type: "error" },
  { inputs: [], name: "MerkleDistributor__AlreadyRefunded", type: "error" },
  { inputs: [], name: "MerkleDistributor__Finished", type: "error" },
  { inputs: [], name: "MerkleDistributor__InvalidCaller", type: "error" },
  {
    inputs: [],
    name: "MerkleDistributor__InvalidPaginationParameters",
    type: "error"
  },
  {
    inputs: [{ internalType: "string", name: "param", type: "string" }],
    name: "MerkleDistributor__InvalidParams",
    type: "error"
  },
  { inputs: [], name: "MerkleDistributor__InvalidProof", type: "error" },
  {
    inputs: [],
    name: "MerkleDistributor__NoClaimableTokensLeft",
    type: "error"
  },
  { inputs: [], name: "MerkleDistributor__NotStarted", type: "error" },
  { inputs: [], name: "MerkleDistributor__NothingToRefund", type: "error" },
  { inputs: [], name: "MerkleDistributor__PermissionDenied", type: "error" },
  { inputs: [], name: "MerkleDistributor__Refunded", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "distributionId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Claimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "distributionId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "isERC20", type: "bool" },
      {
        indexed: false,
        internalType: "uint40",
        name: "startTime",
        type: "uint40"
      }
    ],
    name: "Created",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "distributionId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Refunded",
    type: "event"
  },
  {
    inputs: [
      { internalType: "uint256", name: "distributionId", type: "uint256" },
      { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" }
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint176", name: "amountPerClaim", type: "uint176" },
      { internalType: "uint40", name: "walletCount", type: "uint40" },
      { internalType: "uint40", name: "startTime", type: "uint40" },
      { internalType: "uint40", name: "endTime", type: "uint40" },
      { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "ipfsCID", type: "string" }
    ],
    name: "createDistribution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "distributionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "distributions",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint40", name: "walletCount", type: "uint40" },
      { internalType: "uint40", name: "claimedCount", type: "uint40" },
      { internalType: "uint176", name: "amountPerClaim", type: "uint176" },
      { internalType: "uint40", name: "startTime", type: "uint40" },
      { internalType: "uint40", name: "endTime", type: "uint40" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint40", name: "refundedAt", type: "uint40" },
      { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "ipfsCID", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "getAmountClaimed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "getAmountLeft",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getDistributionIdsByOwner",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getDistributionIdsByToken",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "distributionId", type: "uint256" },
      { internalType: "address", name: "wallet", type: "address" }
    ],
    name: "isClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "isWhitelistOnly",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "distributionId", type: "uint256" },
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" }
    ],
    name: "isWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const ONEINCH_ABI = [
  {
    inputs: [
      {
        internalType: "contract MultiWrapper",
        name: "_multiWrapper",
        type: "address"
      },
      {
        internalType: "contract IOracle[]",
        name: "existingOracles",
        type: "address[]"
      },
      {
        internalType: "enum OffchainOracle.OracleType[]",
        name: "oracleTypes",
        type: "uint8[]"
      },
      {
        internalType: "contract IERC20[]",
        name: "existingConnectors",
        type: "address[]"
      },
      { internalType: "contract IERC20", name: "wBase", type: "address" },
      { internalType: "address", name: "owner", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "ArraysLengthMismatch", type: "error" },
  { inputs: [], name: "ConnectorAlreadyAdded", type: "error" },
  { inputs: [], name: "InvalidOracleTokenKind", type: "error" },
  { inputs: [], name: "OracleAlreadyAdded", type: "error" },
  { inputs: [], name: "SameTokens", type: "error" },
  { inputs: [], name: "TooBigThreshold", type: "error" },
  { inputs: [], name: "UnknownConnector", type: "error" },
  { inputs: [], name: "UnknownOracle", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "connector",
        type: "address"
      }
    ],
    name: "ConnectorAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "connector",
        type: "address"
      }
    ],
    name: "ConnectorRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract MultiWrapper",
        name: "multiWrapper",
        type: "address"
      }
    ],
    name: "MultiWrapperUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IOracle",
        name: "oracle",
        type: "address"
      },
      {
        indexed: false,
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleType",
        type: "uint8"
      }
    ],
    name: "OracleAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IOracle",
        name: "oracle",
        type: "address"
      },
      {
        indexed: false,
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleType",
        type: "uint8"
      }
    ],
    name: "OracleRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [{ internalType: "contract IERC20", name: "connector", type: "address" }],
    name: "addConnector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IOracle", name: "oracle", type: "address" },
      {
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleKind",
        type: "uint8"
      }
    ],
    name: "addOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "connectors",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "allConnectors",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "contract IERC20", name: "dstToken", type: "address" },
      { internalType: "bool", name: "useWrappers", type: "bool" }
    ],
    name: "getRate",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "bool", name: "useSrcWrappers", type: "bool" }
    ],
    name: "getRateToEth",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "bool", name: "useSrcWrappers", type: "bool" },
      {
        internalType: "contract IERC20[]",
        name: "customConnectors",
        type: "address[]"
      },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateToEthWithCustomConnectors",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "bool", name: "useSrcWrappers", type: "bool" },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateToEthWithThreshold",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "contract IERC20", name: "dstToken", type: "address" },
      { internalType: "bool", name: "useWrappers", type: "bool" },
      {
        internalType: "contract IERC20[]",
        name: "customConnectors",
        type: "address[]"
      },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateWithCustomConnectors",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "contract IERC20", name: "dstToken", type: "address" },
      { internalType: "bool", name: "useWrappers", type: "bool" },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateWithThreshold",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "multiWrapper",
    outputs: [{ internalType: "contract MultiWrapper", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "oracles",
    outputs: [
      {
        internalType: "contract IOracle[]",
        name: "allOracles",
        type: "address[]"
      },
      {
        internalType: "enum OffchainOracle.OracleType[]",
        name: "oracleTypes",
        type: "uint8[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "contract IERC20", name: "connector", type: "address" }],
    name: "removeConnector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IOracle", name: "oracle", type: "address" },
      {
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleKind",
        type: "uint8"
      }
    ],
    name: "removeOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract MultiWrapper",
        name: "_multiWrapper",
        type: "address"
      }
    ],
    name: "setMultiWrapper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const ZAP_ABI = [
  {
    inputs: [
      { internalType: "address", name: "bondAddress", type: "address" },
      { internalType: "address", name: "wethAddress", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__EthTransferFailed", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__InvalidReceiver", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__ReserveIsNotWETH", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__SlippageLimitExceeded", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "BOND",
    outputs: [{ internalType: "contract MCV2_Bond", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [{ internalType: "contract IWETH", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToBurn", type: "uint256" },
      { internalType: "uint256", name: "minRefund", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "burnToEth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToMint", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "mintWithEth",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "rescueETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
];

const SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [optimism.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [optimismSepolia.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [arbitrum.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [avalanche.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [polygon.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [bsc.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [bscTestnet.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [base.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [baseSepolia.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [sepolia.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [blast.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [blastSepolia.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [avalancheFuji.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [degen.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [cyberTestnet.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [kaia.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [cyber.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB",
    [ham.id]: "0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB"
  },
  ERC1155: {
    [mainnet.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [optimism.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [optimismSepolia.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [arbitrum.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [avalanche.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [polygon.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [bsc.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [bscTestnet.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [base.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [baseSepolia.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [sepolia.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [blast.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [blastSepolia.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [avalancheFuji.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [degen.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [cyberTestnet.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [kaia.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [cyber.id]: "0x187E536C5404dD472476B9e4C716878d359a506A",
    [ham.id]: "0x187E536C5404dD472476B9e4C716878d359a506A"
  },
  BOND: {
    [mainnet.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [optimism.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [optimismSepolia.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [arbitrum.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [avalanche.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [polygon.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [bsc.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [bscTestnet.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [base.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [baseSepolia.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [sepolia.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [blast.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [blastSepolia.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [avalancheFuji.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [degen.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [cyberTestnet.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [kaia.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [cyber.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B",
    [ham.id]: "0x912e3153a021b092ab85EA79B2a5d07b04B0073B"
  },
  ZAP: {
    [mainnet.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [optimism.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [optimismSepolia.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [arbitrum.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [avalanche.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [polygon.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [bsc.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [bscTestnet.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [base.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [baseSepolia.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [sepolia.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [blast.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [blastSepolia.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [avalancheFuji.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [degen.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [cyberTestnet.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [kaia.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [cyber.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537",
    [ham.id]: "0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537"
  },
  LOCKER: {
    [mainnet.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [optimism.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [optimismSepolia.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [arbitrum.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [avalanche.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [polygon.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [bsc.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [bscTestnet.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [base.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [baseSepolia.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [sepolia.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [blast.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [blastSepolia.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [avalancheFuji.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [degen.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [cyberTestnet.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [kaia.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [cyber.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867",
    [ham.id]: "0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867"
  },
  MERKLE: {
    [mainnet.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [optimism.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [optimismSepolia.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [arbitrum.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [avalanche.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [polygon.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [bsc.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [bscTestnet.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [base.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [baseSepolia.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [sepolia.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [blast.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [blastSepolia.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [avalancheFuji.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [degen.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [cyberTestnet.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [kaia.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [cyber.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225",
    [ham.id]: "0xDF407862072B4de05aae94c1A2f0bE5EF8C72225"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimismSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bscTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [kaia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [baseSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blast.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blastSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalancheFuji.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [degen.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyberTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyber.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [ham.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8"
  }
};
const V2_SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [optimism.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [optimismSepolia.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [arbitrum.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [avalanche.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [polygon.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [bsc.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [bscTestnet.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [base.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [baseSepolia.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [sepolia.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [blast.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [blastSepolia.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [avalancheFuji.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [degen.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [cyberTestnet.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [kaia.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [cyber.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a",
    [ham.id]: "0x72C2AFf46bE96f86a4a0Ca03DcCbC13fabA1388a"
  },
  ERC1155: {
    [mainnet.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [optimism.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [optimismSepolia.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [arbitrum.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [avalanche.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [polygon.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [bsc.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [bscTestnet.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [base.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [baseSepolia.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [sepolia.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [blast.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [blastSepolia.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [avalancheFuji.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [degen.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [cyberTestnet.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [kaia.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [cyber.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3",
    [ham.id]: "0x31cA89a5D7Ff696f691bDaC8f7F2D3b03C5011c3"
  },
  BOND: {
    [mainnet.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [optimism.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [optimismSepolia.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [arbitrum.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [avalanche.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [polygon.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [bsc.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [bscTestnet.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [base.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [baseSepolia.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [sepolia.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [blast.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [blastSepolia.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [avalancheFuji.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [degen.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [cyberTestnet.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [kaia.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [cyber.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868",
    [ham.id]: "0xCadA74C15F911Fdb653F8ecCc3Ef109b590Cf868"
  },
  ZAP: {
    [mainnet.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [optimism.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [optimismSepolia.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [arbitrum.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [avalanche.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [polygon.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [bsc.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [bscTestnet.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [base.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [baseSepolia.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [sepolia.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [blast.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [blastSepolia.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [avalancheFuji.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [degen.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [cyberTestnet.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [kaia.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [cyber.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06",
    [ham.id]: "0xE9af8f69DF5cb825012d07cBd5C811A3a4c70c06"
  },
  LOCKER: {
    [mainnet.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [optimism.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [optimismSepolia.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [arbitrum.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [avalanche.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [polygon.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [bsc.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [bscTestnet.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [base.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [baseSepolia.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [sepolia.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [blast.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [blastSepolia.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [avalancheFuji.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [degen.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [cyberTestnet.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [kaia.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [cyber.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9",
    [ham.id]: "0x3A6EDDf80d55E35A1fc2f92EE07800999E4d3fd9"
  },
  MERKLE: {
    [mainnet.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [optimism.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [optimismSepolia.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [arbitrum.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [avalanche.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [polygon.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [bsc.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [bscTestnet.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [base.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [baseSepolia.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [sepolia.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [blast.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [blastSepolia.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [avalancheFuji.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [degen.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [cyberTestnet.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [kaia.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [cyber.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604",
    [ham.id]: "0x3e1C761024e1f93959F409641E8e0AbC63333604"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimismSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bscTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [kaia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [baseSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blast.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blastSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalancheFuji.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [degen.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyberTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyber.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [ham.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8"
  }
};
const V3_SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [optimism.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [optimismSepolia.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [arbitrum.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [avalanche.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [polygon.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [bsc.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [bscTestnet.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [base.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [baseSepolia.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [sepolia.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [blast.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [blastSepolia.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [avalancheFuji.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [degen.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [cyberTestnet.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [kaia.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [cyber.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa",
    [ham.id]: "0x0aDFA11353f98004554Bc4c5Ec7d5e62a235bABa"
  },
  ERC1155: {
    [mainnet.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [optimism.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [optimismSepolia.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [arbitrum.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [avalanche.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [polygon.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [bsc.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [bscTestnet.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [base.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [baseSepolia.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [sepolia.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [blast.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [blastSepolia.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [avalancheFuji.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [degen.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [cyberTestnet.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [kaia.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [cyber.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60",
    [ham.id]: "0xDfbB35E7fE82245691D7df41BfCE6FE15118Df60"
  },
  BOND: {
    [mainnet.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [optimism.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [optimismSepolia.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [arbitrum.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [avalanche.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [polygon.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [bsc.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [bscTestnet.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [base.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [baseSepolia.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [sepolia.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [blast.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [blastSepolia.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [avalancheFuji.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [degen.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [cyberTestnet.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [kaia.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [cyber.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E",
    [ham.id]: "0xdcd4D5CE277A5F48E478967e21105DF29453009E"
  },
  ZAP: {
    [mainnet.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [optimism.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [optimismSepolia.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [arbitrum.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [avalanche.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [polygon.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [bsc.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [bscTestnet.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [base.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [baseSepolia.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [sepolia.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [blast.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [blastSepolia.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [avalancheFuji.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [degen.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [cyberTestnet.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [kaia.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [cyber.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586",
    [ham.id]: "0x1F032dE2be7A730EF5035dDfcAC92D8f928A9586"
  },
  LOCKER: {
    [mainnet.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [optimism.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [optimismSepolia.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [arbitrum.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [avalanche.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [polygon.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [bsc.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [bscTestnet.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [base.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [baseSepolia.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [sepolia.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [blast.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [blastSepolia.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [avalancheFuji.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [degen.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [cyberTestnet.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [kaia.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [cyber.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92",
    [ham.id]: "0x985A6F0D07ea503f5Ff2C99f4B4C813769793C92"
  },
  MERKLE: {
    [mainnet.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [optimism.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [optimismSepolia.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [arbitrum.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [avalanche.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [polygon.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [bsc.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [bscTestnet.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [base.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [baseSepolia.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [sepolia.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [blast.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [blastSepolia.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [avalancheFuji.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [degen.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [cyberTestnet.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [kaia.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [cyber.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85",
    [ham.id]: "0xA081Ae7e0472CdAB5dbb339F8EB6d588E2a7fD85"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimismSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bscTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [kaia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [baseSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blast.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blastSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalancheFuji.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [degen.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyberTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyber.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [ham.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8"
  }
};
const V31_SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [optimism.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [optimismSepolia.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [arbitrum.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [avalanche.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [polygon.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [bsc.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [bscTestnet.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [base.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [baseSepolia.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [sepolia.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [blast.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [blastSepolia.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [avalancheFuji.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [degen.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [cyberTestnet.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [kaia.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [cyber.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af",
    [ham.id]: "0x71465F54E6D9Ed9ddA62cA8fD843a6AaA14a37Af"
  },
  ERC1155: {
    [mainnet.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [optimism.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [optimismSepolia.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [arbitrum.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [avalanche.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [polygon.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [bsc.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [bscTestnet.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [base.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [baseSepolia.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [sepolia.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [blast.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [blastSepolia.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [avalancheFuji.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [degen.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [cyberTestnet.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [kaia.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [cyber.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412",
    [ham.id]: "0x2b63d5a9864ce4a00d3C4bcFd007a80aA4EDc412"
  },
  BOND: {
    [mainnet.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [optimism.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [optimismSepolia.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [arbitrum.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [avalanche.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [polygon.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [bsc.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [bscTestnet.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [base.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [baseSepolia.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [sepolia.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [blast.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [blastSepolia.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [avalancheFuji.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [degen.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [cyberTestnet.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [kaia.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [cyber.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d",
    [ham.id]: "0xb27e3733C163CCa8Cdcfe45E684c1afA2D5bF07d"
  },
  ZAP: {
    [mainnet.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [optimism.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [optimismSepolia.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [arbitrum.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [avalanche.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [polygon.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [bsc.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [bscTestnet.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [base.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [baseSepolia.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [sepolia.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [blast.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [blastSepolia.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [avalancheFuji.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [degen.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [cyberTestnet.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [kaia.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [cyber.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5",
    [ham.id]: "0xD073656c90A22FB4C87409957496D2d4359200d5"
  },
  LOCKER: {
    [mainnet.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [optimism.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [optimismSepolia.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [arbitrum.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [avalanche.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [polygon.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [bsc.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [bscTestnet.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [base.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [baseSepolia.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [sepolia.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [blast.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [blastSepolia.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [avalancheFuji.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [degen.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [cyberTestnet.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [kaia.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [cyber.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5",
    [ham.id]: "0xb1303bCc370057AE779FF6D4cCA86537574806f5"
  },
  MERKLE: {
    [mainnet.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [optimism.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [optimismSepolia.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [arbitrum.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [avalanche.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [polygon.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [bsc.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [bscTestnet.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [base.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [baseSepolia.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [sepolia.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [blast.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [blastSepolia.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [avalancheFuji.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [degen.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [cyberTestnet.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [kaia.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [cyber.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887",
    [ham.id]: "0x6284b6f50BE9be1421239D0797FA7BeED45B2887"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimismSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bscTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [kaia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [baseSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blast.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blastSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalancheFuji.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x",
    [degen.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyberTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyber.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [ham.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8"
  }
};
const v4_SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [optimism.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [optimismSepolia.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [arbitrum.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [avalanche.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [polygon.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [bsc.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [bscTestnet.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [base.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [baseSepolia.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [sepolia.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [blast.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [blastSepolia.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [avalancheFuji.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [degen.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [cyberTestnet.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [kaia.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [cyber.id]: "0xC846B4791cf6BA661475f073c39ec51779048755",
    [ham.id]: "0xC846B4791cf6BA661475f073c39ec51779048755"
  },
  ERC1155: {
    [mainnet.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [optimism.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [optimismSepolia.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [arbitrum.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [avalanche.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [polygon.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [bsc.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [bscTestnet.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [base.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [baseSepolia.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [sepolia.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [blast.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [blastSepolia.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [avalancheFuji.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [degen.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [cyberTestnet.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [kaia.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [cyber.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886",
    [ham.id]: "0x5B905d22761dc9737ABEe1B642067676804Bf886"
  },
  BOND: {
    [mainnet.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [optimism.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [optimismSepolia.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [arbitrum.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [avalanche.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [polygon.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [bsc.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [bscTestnet.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [base.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [baseSepolia.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [sepolia.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [blast.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [blastSepolia.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [avalancheFuji.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [degen.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [cyberTestnet.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [kaia.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [cyber.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c",
    [ham.id]: "0xc4d2A58180DFe389917186FcF1C767F5459EEF4c"
  },
  ZAP: {
    [mainnet.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [optimism.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [optimismSepolia.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [arbitrum.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [avalanche.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [polygon.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [bsc.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [bscTestnet.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [base.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [baseSepolia.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [sepolia.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [blast.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [blastSepolia.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [avalancheFuji.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [degen.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [cyberTestnet.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [kaia.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [cyber.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04",
    [ham.id]: "0x307567862AEA0291dbeecBC1019d9c54eDf15F04"
  },
  LOCKER: {
    [mainnet.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [optimism.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [optimismSepolia.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [arbitrum.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [avalanche.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [polygon.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [bsc.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [bscTestnet.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [base.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [baseSepolia.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [sepolia.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [blast.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [blastSepolia.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [avalancheFuji.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [degen.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [cyberTestnet.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [kaia.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [cyber.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528",
    [ham.id]: "0xb533C387107b1cecbB0bc3cC5444044C41B76528"
  },
  MERKLE: {
    [mainnet.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [optimism.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [optimismSepolia.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [arbitrum.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [avalanche.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [polygon.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [bsc.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [bscTestnet.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [base.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [baseSepolia.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [sepolia.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [blast.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [blastSepolia.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [avalancheFuji.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [degen.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [cyberTestnet.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [kaia.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [cyber.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6",
    [ham.id]: "0x2210a4A6234fFDa20E31D2EF72a8DB8CC626c9f6"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimismSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bscTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [kaia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [baseSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blast.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blastSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalancheFuji.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [degen.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyberTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyber.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [ham.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8"
  }
};
const v5_SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [optimism.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [optimismSepolia.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [arbitrum.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [avalanche.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [polygon.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [bsc.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [bscTestnet.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [base.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [baseSepolia.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [sepolia.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [blast.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [blastSepolia.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [avalancheFuji.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [degen.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [cyberTestnet.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [kaia.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [cyber.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e",
    [ham.id]: "0x55fDe4803CAB3f3929ebbF98D44C303b5f67600e"
  },
  ERC1155: {
    [mainnet.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [optimism.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [optimismSepolia.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [arbitrum.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [avalanche.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [polygon.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [bsc.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [bscTestnet.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [base.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [baseSepolia.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [sepolia.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [blast.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [blastSepolia.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [avalancheFuji.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [degen.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [cyberTestnet.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [kaia.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [cyber.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06",
    [ham.id]: "0xc9ADF8d18E663c52d39E67fDc204323b09Bd3e06"
  },
  BOND: {
    [mainnet.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [optimism.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [optimismSepolia.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [arbitrum.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [avalanche.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [polygon.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [bsc.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [bscTestnet.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [base.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [baseSepolia.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [sepolia.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [blast.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [blastSepolia.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [avalancheFuji.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [degen.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [cyberTestnet.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [kaia.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [cyber.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC",
    [ham.id]: "0x9464bd78CA8E90BE1c21da939B4a994e51129BdC"
  },
  ZAP: {
    [mainnet.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [optimism.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [optimismSepolia.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [arbitrum.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [avalanche.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [polygon.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [bsc.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [bscTestnet.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [base.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [baseSepolia.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [sepolia.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [blast.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [blastSepolia.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [avalancheFuji.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [degen.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [cyberTestnet.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [kaia.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [cyber.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657",
    [ham.id]: "0x3805A4D5a475B48e884ca5f80bEc0fb984dC8657"
  },
  LOCKER: {
    [mainnet.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [optimism.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [optimismSepolia.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [arbitrum.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [avalanche.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [polygon.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [bsc.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [bscTestnet.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [base.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [baseSepolia.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [sepolia.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [blast.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [blastSepolia.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [avalancheFuji.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [degen.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [cyberTestnet.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [kaia.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [cyber.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1",
    [ham.id]: "0x629D32Bedfe4fa8C8dfA3Da45Ef2480870BF84c1"
  },
  MERKLE: {
    [mainnet.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [optimism.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [optimismSepolia.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [arbitrum.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [avalanche.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [polygon.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [bsc.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [bscTestnet.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [base.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [baseSepolia.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [sepolia.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [blast.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [blastSepolia.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [avalancheFuji.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [degen.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [cyberTestnet.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [kaia.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [cyber.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60",
    [ham.id]: "0x2b69fe0e1944398094900BA6260148f526Db6f60"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimismSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bscTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [kaia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [baseSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blast.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blastSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalancheFuji.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [degen.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyberTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyber.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [ham.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8"
  }
};
const v6_SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [optimism.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [optimismSepolia.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [arbitrum.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [avalanche.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [polygon.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [bsc.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [bscTestnet.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [base.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [baseSepolia.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [sepolia.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [blast.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [blastSepolia.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [avalancheFuji.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [degen.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [cyberTestnet.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [kaia.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [cyber.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D",
    [ham.id]: "0xF365F9bFE959C8f3251A3d5426a0Fa091E8Cc61D"
  },
  ERC1155: {
    [mainnet.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [optimism.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [optimismSepolia.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [arbitrum.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [avalanche.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [polygon.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [bsc.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [bscTestnet.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [base.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [baseSepolia.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [sepolia.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [blast.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [blastSepolia.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [avalancheFuji.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [degen.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [cyberTestnet.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [kaia.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [cyber.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9",
    [ham.id]: "0xb2468e9B5fD8856699C81BAc9BF4eDBA4B6bd9A9"
  },
  BOND: {
    [mainnet.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [optimism.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [optimismSepolia.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [arbitrum.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [avalanche.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [polygon.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [bsc.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [bscTestnet.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [base.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [baseSepolia.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [sepolia.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [blast.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [blastSepolia.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [avalancheFuji.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [degen.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [cyberTestnet.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [kaia.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [cyber.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5",
    [ham.id]: "0x5eaeB4E56D750D5AA1C313bE59C3a5a082Ee6fe5"
  },
  ZAP: {
    [mainnet.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [optimism.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [optimismSepolia.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [arbitrum.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [avalanche.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [polygon.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [bsc.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [bscTestnet.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [base.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [baseSepolia.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [sepolia.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [blast.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [blastSepolia.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [avalancheFuji.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [degen.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [cyberTestnet.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [kaia.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [cyber.id]: "0x778175D18084085a672522ec2B13a7765385cC55",
    [ham.id]: "0x778175D18084085a672522ec2B13a7765385cC55"
  },
  LOCKER: {
    [mainnet.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [optimism.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [optimismSepolia.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [arbitrum.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [avalanche.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [polygon.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [bsc.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [bscTestnet.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [base.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [baseSepolia.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [sepolia.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [blast.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [blastSepolia.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [avalancheFuji.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [degen.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [cyberTestnet.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [kaia.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [cyber.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359",
    [ham.id]: "0xa65Af9db4F3E92E75b92eDa4392171C23F3BA359"
  },
  MERKLE: {
    [mainnet.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [optimism.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [optimismSepolia.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [arbitrum.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [avalanche.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [polygon.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [bsc.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [bscTestnet.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [base.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [baseSepolia.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [sepolia.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [blast.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [blastSepolia.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [avalancheFuji.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [degen.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [cyberTestnet.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [kaia.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [cyber.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb",
    [ham.id]: "0x08ff20673A086c26bA4bba0dDb7BcC7bD38765bb"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimismSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bscTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [kaia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [baseSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blast.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [blastSepolia.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalancheFuji.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [degen.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyberTestnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [cyber.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [ham.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8"
  }
};
const VERSION_TO_SDK_CONTRACT_ADDRESSES = {
  "0.1.0": SDK_CONTRACT_ADDRESSES,
  "0.2.0": V2_SDK_CONTRACT_ADDRESSES,
  "0.3.0": V3_SDK_CONTRACT_ADDRESSES,
  "0.3.1": V31_SDK_CONTRACT_ADDRESSES,
  "0.4.0": v4_SDK_CONTRACT_ADDRESSES,
  "0.5.0": v5_SDK_CONTRACT_ADDRESSES,
  "0.6.0": v6_SDK_CONTRACT_ADDRESSES
};
function getMintClubContractAddress(contractName, chainId, version = "0.1.0") {
  let contractAddress = VERSION_TO_SDK_CONTRACT_ADDRESSES[version][contractName][chainId];
  if (process.env.NODE_ENV === "hardhat") {
    contractAddress = global.mcv2Hardhat?.[contractName]?.[chainId];
  }
  if (!contractAddress) {
    throw new Error(`Contract address for ${contractName} on chain ${chainId} not found`);
  }
  return contractAddress;
}

const CHAINS = [
  {
    id: mainnet.id,
    name: "Ethereum",
    icon: "https://mint.club/assets/networks/ethereum@2x.png",
    color: "#627EEA",
    openseaSlug: "ethereum",
    enabled: isAddress(getMintClubContractAddress("BOND", mainnet.id)),
    chain: mainnet
  },
  {
    id: base.id,
    name: "Base",
    icon: "https://mint.club/assets/networks/base@2x.png",
    color: "#0052FF",
    openseaSlug: "base",
    enabled: isAddress(getMintClubContractAddress("BOND", base.id)),
    chain: base
  },
  {
    id: blast.id,
    name: "Blast",
    icon: "https://mint.club/assets/networks/blast@2x.png",
    color: "#FCFC03",
    openseaSlug: "blast",
    enabled: isAddress(getMintClubContractAddress("BOND", blast.id)),
    chain: blast
  },
  {
    id: optimism.id,
    name: "Optimism",
    icon: "https://mint.club/assets/networks/optimism@2x.png",
    color: "#FF0420",
    openseaSlug: "optimism",
    enabled: isAddress(getMintClubContractAddress("BOND", optimism.id)),
    chain: optimism
  },
  {
    id: optimismSepolia.id,
    name: "OptimismSepolia",
    icon: "https://mint.club/assets/networks/optimism@2x.png",
    color: "#FF0420",
    openseaSlug: "optimism",
    enabled: isAddress(getMintClubContractAddress("BOND", optimismSepolia.id)),
    chain: optimism
  },
  {
    id: degen.id,
    name: "Degen",
    icon: "https://mint.club/assets/networks/degen@2x.png",
    color: "#A36EFD",
    openseaSlug: "degen",
    enabled: isAddress(getMintClubContractAddress("BOND", degen.id)),
    chain: degen
  },
  {
    id: arbitrum.id,
    name: "Arbitrum",
    icon: "https://mint.club/assets/networks/arbitrum@2x.png",
    color: "#12AAFF",
    openseaSlug: "arbitrum",
    enabled: isAddress(getMintClubContractAddress("BOND", arbitrum.id)),
    chain: arbitrum
  },
  {
    id: avalanche.id,
    name: "Avalanche",
    icon: "https://mint.club/assets/networks/avalanche@2x.png",
    color: "#E94143",
    openseaSlug: "avalanche",
    enabled: isAddress(getMintClubContractAddress("BOND", avalanche.id)),
    chain: avalanche
  },
  {
    id: polygon.id,
    name: "Polygon",
    icon: "https://mint.club/assets/networks/polygon@2x.png",
    color: "#8247E5",
    openseaSlug: "matic",
    enabled: isAddress(getMintClubContractAddress("BOND", polygon.id)),
    chain: polygon
  },
  {
    id: bsc.id,
    name: "BNBChain",
    icon: "https://mint.club/assets/networks/bnb@2x.png",
    color: "#F0B90B",
    openseaSlug: "bsc",
    enabled: isAddress(getMintClubContractAddress("BOND", bsc.id)),
    chain: bsc
  },
  {
    id: bscTestnet.id,
    name: "BNBChainTestnet",
    icon: "https://mint.club/assets/networks/bnb@2x.png",
    color: "#F0B90B",
    openseaSlug: "bscTestnet",
    enabled: isAddress(getMintClubContractAddress("BOND", bscTestnet.id)),
    chain: bsc
  },
  {
    id: sepolia.id,
    name: "Sepolia",
    icon: "https://mint.club/assets/networks/ethereum@2x.png",
    color: "#627EEA",
    openseaSlug: "sepolia",
    enabled: isAddress(getMintClubContractAddress("BOND", sepolia.id)),
    isTestnet: true,
    chain: sepolia
  },
  {
    id: baseSepolia.id,
    name: "BaseSepolia",
    icon: "https://mint.club/assets/networks/base@2x.png",
    color: "#0052FF",
    openseaSlug: "base-sepolia",
    enabled: isAddress(getMintClubContractAddress("BOND", baseSepolia.id)),
    isTestnet: true,
    chain: sepolia
  },
  {
    id: blastSepolia.id,
    name: "BlastSepolia",
    icon: "https://mint.club/assets/networks/blast@2x.png",
    color: "#FCFC03",
    openseaSlug: "blast-sepolia",
    enabled: isAddress(getMintClubContractAddress("BOND", blastSepolia.id)),
    isTestnet: true,
    chain: blastSepolia
  },
  {
    id: cyber.id,
    name: "Cyber",
    icon: "https://mint.club/assets/networks/cyber@2x.png",
    color: "#32A0CD",
    openseaSlug: "cyber",
    enabled: isAddress(getMintClubContractAddress("BOND", cyber.id)),
    chain: cyber
  },
  {
    id: ham.id,
    name: "Ham",
    icon: "https://mint.club/assets/networks/ham@2x.png",
    color: "#EB4747",
    openseaSlug: "ham",
    enabled: isAddress(getMintClubContractAddress("BOND", ham.id)),
    chain: ham
  },
  {
    id: avalancheFuji.id,
    name: "AvalancheFuji",
    icon: "https://mint.club/assets/networks/avalanche@2x.png",
    color: "#E94143",
    openseaSlug: "avalanche-fuji",
    enabled: isAddress(getMintClubContractAddress("BOND", avalancheFuji.id)),
    isTestnet: true,
    chain: avalancheFuji
  },
  {
    id: cyberTestnet.id,
    name: "CyberTestnet",
    icon: "https://mint.club/assets/networks/cyber@2x.png",
    color: "#32A0CD",
    openseaSlug: "cyber-testnet",
    enabled: isAddress(getMintClubContractAddress("BOND", cyberTestnet.id)),
    isTestnet: true,
    chain: cyberTestnet
  },
  {
    id: kaia.id,
    name: "Kaia",
    icon: "https://mint.club/assets/networks/kaia@2x.png",
    color: "#BFF009",
    openseaSlug: "klaytn",
    enabled: isAddress(getMintClubContractAddress("BOND", kaia.id)),
    chain: kaia
  }
];
function chainIdToViemChain(chainId) {
  return CHAINS.find((chain) => chain.id === chainId)?.chain;
}
function chainIdToString(chainId) {
  const found = CHAINS.find((chain) => chain.id === chainId);
  if (!found) throw new ChainNotSupportedError(chainId);
  return found?.name?.toLowerCase();
}
function chainStringToId(name) {
  const found = CHAINS.find((chain) => chain?.name?.toLowerCase?.() === name?.toLowerCase?.());
  if (!found) throw new ChainNotSupportedError(name);
  return found.id;
}
function getChain(chainId) {
  let chain = Object.values(chains).find((c) => c.id === chainId) ?? CHAINS.find((c) => c.id === chainId)?.chain;
  if (!chain) {
    throw new ChainNotSupportedError(chainId);
  }
  return chain;
}
const CHAIN_MAP = CHAINS.reduce((prev, curr) => {
  prev[curr.id] = curr;
  return prev;
}, {});
const CHAIN_NAME_ID_MAP = {
  sepolia: sepolia.id
};

const RPCS = [
  {
    id: mainnet.id,
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7",
      "https://public.stackup.sh/api/v1/node/ethereum-mainnet",
      "https://rpc.flashbots.net",
      // 'https://api.zmok.io/mainnet/oaen6dy8ff6hju9k', // NOTE: 503 error
      "https://rpc.mevblocker.io",
      "https://rpc.mevblocker.io/fast",
      // 'https://go.getblock.io/d9fde9abc97545f4887f56ae54f3c2c0', // NOTE: 429 error
      "https://rpc.mevblocker.io/noreverts",
      "https://rpc.mevblocker.io/fullprivacy",
      "https://eth1.lava.build/lava-referer-ed07f753-8c19-4309-b632-5a4a421aa589",
      "https://rpc.flashbots.net/fast",
      "https://eth1.lava.build/lava-referer-16223de7-12c0-49f3-8d87-e5f1e6a0eb3b",
      "https://core.gashawk.io/rpc",
      "https://eth.meowrpc.com",
      "https://gateway.subquery.network/rpc/eth",
      "https://eth-pokt.nodies.app",
      // 'https://gateway.tenderly.co/public/mainnet', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://mainnet.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      "https://eth-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf",
      "https://rpc.builder0x69.io"
    ]
  },
  {
    id: base.id,
    rpcs: [
      "https://mainnet.base.org",
      "https://base-pokt.nodies.app",
      // 'https://base.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://gateway.tenderly.co/public/base', // NOTE: 400 on `eth_getFilterChanges`
      "https://base-rpc.publicnode.com",
      "https://developer-access-mainnet.base.org",
      "https://base.meowrpc.com"
    ]
  },
  {
    id: cyber.id,
    rpcs: ["https://cyber.alt.technology/", "https://rpc.cyber.co/"]
  },
  {
    id: cyberTestnet.id,
    rpcs: ["https://cyber-testnet.alt.technology"]
  },
  {
    id: optimism.id,
    rpcs: [
      // 'https://api.tatum.io/v3/blockchain/node/optimism-mainnet', // NOTE: CORS issue
      // 'https://optimism.drpc.org', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://gateway.tenderly.co/public/optimism', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://optimism.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      "https://optimism-rpc.publicnode.com",
      "https://op-pokt.nodies.app",
      "https://optimism.meowrpc.com"
    ]
  },
  {
    id: arbitrum.id,
    rpcs: [
      "https://arbitrum-one.publicnode.com",
      "https://arbitrum.rpc.subquery.network/public",
      "https://public.stackup.sh/api/v1/node/arbitrum-one",
      "https://arbitrum.meowrpc.com",
      "https://arb-pokt.nodies.app",
      "https://arbitrum-one-rpc.publicnode.com"
      // 'https://arb-mainnet.g.alchemy.com/v2/654scodAkt2_QjvbCk8oPbAV6wJHoR8j', // Alchemy private API because public RPCs are often unstable
    ]
  },
  {
    id: polygon.id,
    rpcs: [
      "https://polygon-bor-rpc.publicnode.com",
      "https://polygon-pokt.nodies.app",
      "https://public.stackup.sh/api/v1/node/polygon-mainnet",
      "https://rpc-mainnet.matic.quiknode.pro",
      // 'https://gateway.tenderly.co/public/polygon', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://polygon.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      "https://polygon.meowrpc.com",
      "https://polygon-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf",
      "https://polygon.rpc.subquery.network/public"
    ]
  },
  {
    id: bsc.id,
    rpcs: [
      "https://bsc-dataseed4.ninicoin.io",
      "https://bsc.rpc.blxrbdn.com",
      "https://bsc-dataseed1.bnbchain.org",
      "https://bsc-dataseed2.bnbchain.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed3.ninicoin.io",
      // 'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3', // NOTE: 429 error
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed.bnbchain.org",
      "https://bsc-dataseed3.bnbchain.org",
      "https://bsc-dataseed4.bnbchain.org",
      "https://binance.nodereal.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-pokt.nodies.app",
      "https://public.stackup.sh/api/v1/node/bsc-mainnet",
      "https://bsc-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf",
      "https://rpc-bsc.48.club",
      "https://koge-rpc-bsc.48.club",
      "https://bsc.meowrpc.com"
    ]
  },
  {
    id: avalanche.id,
    rpcs: [
      "https://avalanche-c-chain-rpc.publicnode.com",
      // 'https://api.tatum.io/v3/blockchain/node/avax-mainnet', // NOTE: CORS issue
      "https://avax-pokt.nodies.app/ext/bc/C/rpc",
      "https://avax.meowrpc.com",
      "https://api.avax.network/ext/bc/C/rpc"
    ]
  },
  {
    id: blast.id,
    rpcs: [
      "https://rpc.blast.io"
      // 'https://blast.din.dev/rpc' // NOTE: 503 error
    ]
  },
  {
    id: sepolia.id,
    rpcs: [
      "https://ethereum-sepolia-rpc.publicnode.com",
      "https://rpc2.sepolia.org",
      // 'https://sepolia.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://gateway.tenderly.co/public/sepolia', // NOTE: 400 on `eth_getFilterChanges`
      "https://public.stackup.sh/api/v1/node/ethereum-sepolia",
      "https://eth-sepolia-public.unifra.io",
      "https://sepolia.drpc.org",
      "https://rpc-sepolia.rockx.com",
      "https://ethereum-sepolia.rpc.subquery.network/public"
    ]
  },
  {
    id: degen.id,
    rpcs: ["https://rpc.degen.tips", "https://nitrorpc-degen-mainnet-1.t.conduit.xyz"]
  },
  {
    id: zora.id,
    rpcs: ["https://rpc.zora.energy"]
  },
  {
    id: kaia.id,
    rpcs: [
      "https://public-en.node.kaia.io",
      // ✅ - All checks passed
      "https://rpc.ankr.com/klaytn",
      // ✅ - All checks passed
      "https://kaia.blockpi.network/v1/rpc/public",
      // 🤔 - Old block NOT supported
      "https://klaytn-pokt.nodies.app",
      // 🤔 - Old block NOT supported
      "https://klaytn.api.onfinality.io/public",
      // 🤔 - Old block NOT supported
      "https://public-en-cypress.klaytn.net",
      // ❌ - Both checks failed
      "https://klaytn-rpc.gateway.pokt.network/",
      // ❌ - Both checks failed
      "https://klaytn-mainnet.g.allthatnode.com/full/evm"
      // ❌ - Both checks failed
    ]
  }
];
function customTransport(params) {
  const { rpc, fetchOptions } = params;
  return http(rpc, {
    key: rpc,
    name: rpc,
    fetchOptions,
    retryCount: 0,
    timeout: 4e3
  });
}
function chainRPCFallbacks(chain, fetchOptions = {
  cache: "no-store"
}) {
  return RPCS.find((c) => c.id === chain.id)?.rpcs.map(
    (rpc) => customTransport({
      rpc,
      fetchOptions
    })
  ) || [http()];
}
const DEFAULT_RANK_OPTIONS = {
  retryCount: 0,
  rank: {
    interval: 1e5,
    sampleCount: 5,
    timeout: 4e3,
    weights: {
      latency: 0.3,
      stability: 0.7
    }
  }
};

const BOND_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The address field cannot be empty. Please provide a valid address.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "The address does not have enough balance to proceed with the transaction.",
    reportToBugsnag: false
  },
  ERC1167FailedCreateClone: {
    message: "Failed to create a clone due to an ERC1167 cloning error. Please check the implementation.",
    reportToBugsnag: true
  },
  FailedInnerCall: {
    message: "An internal call within the contract failed, indicating a potential issue with contract logic or state.",
    reportToBugsnag: true
  },
  MCV2_Bond__CreationFeeTransactionFailed: {
    message: "The transaction for the creation fee has failed. Ensure you have enough funds and the fee is correctly set.",
    reportToBugsnag: true
  },
  MCV2_Bond__ExceedMaxSupply: {
    message: "The creation of this token would exceed its maximum supply limit. No further tokens can be created.",
    reportToBugsnag: false
  },
  MCV2_Bond__ExceedTotalSupply: {
    message: "Attempting to exceed the total supply of tokens. Please verify the token amount.",
    reportToBugsnag: false
  },
  MCV2_Bond__InvalidConstructorParams: {
    message: "The constructor parameters provided are invalid. Please check and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidCreationFee: {
    message: "The creation fee provided is invalid. Ensure the fee meets the required criteria.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidCreatorAddress: {
    message: "The creator address is invalid. A valid creator address is required to proceed.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidCurrentSupply: {
    message: "The current supply value is invalid. Please check the supply amount and try again.",
    reportToBugsnag: true
  },
  MCV2_BOND__InvalidPaginationParameters: {
    message: "Pagination parameters are invalid. Please adjust your request and try again.",
    reportToBugsnag: false
  },
  MCV2_Bond__InvalidReceiver: {
    message: "The receiver address is invalid. Transactions require a valid receiver address.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidReserveToken: {
    message: "The reserve token specified is invalid. Check the token address and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidStepParams: {
    message: "The step parameters provided are invalid. Please review and correct them.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidTokenAmount: {
    message: "The token amount specified is invalid. Ensure the amount is correct and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidTokenCreationParams: {
    message: "The token creation parameters are invalid. Check the documentation and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__PermissionDenied: {
    message: "You do not have permission to perform this action. Ensure you have the necessary rights.",
    reportToBugsnag: true
  },
  MCV2_Bond__SlippageLimitExceeded: {
    message: "The slippage limit has been exceeded. Adjust your slippage settings and try again.",
    reportToBugsnag: false
  },
  MCV2_Bond__TokenNotFound: {
    message: "The specified token could not be found. Check the token address and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__TokenSymbolAlreadyExists: {
    message: "The token symbol already exists. Use a unique symbol and try again.",
    reportToBugsnag: true
  },
  MCV2_Royalty__InvalidParams: {
    message: "The parameters provided for royalty settings are invalid. Please review and correct them.",
    reportToBugsnag: true
  },
  MCV2_Royalty__NothingToClaim: {
    message: "There is nothing to claim at this time. Check back later or verify your entitlement.",
    reportToBugsnag: false
  },
  OwnableInvalidOwner: {
    message: "The operation was attempted by an invalid owner. Only the contract owner can perform this action.",
    reportToBugsnag: true
  },
  OwnableUnauthorizedAccount: {
    message: "The account is unauthorized. This action is restricted to authorized accounts only.",
    reportToBugsnag: true
  },
  SafeCastOverflowedUintDowncast: {
    message: "Overflow encountered during uint downcasting. Please check the values being cast.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An operation with ERC20 tokens failed. Ensure the contract and token addresses are correct.",
    reportToBugsnag: true
  }
};
const ERC20_ERROR_MESSAGES = {
  ERC20InsufficientAllowance: {
    message: "Your allowance for spending these tokens is insufficient. Please approve more tokens before proceeding.",
    reportToBugsnag: true
  },
  ERC20InsufficientBalance: {
    message: "Your balance is insufficient to complete this transaction. Please ensure you have enough tokens.",
    reportToBugsnag: false
  },
  ERC20InvalidApprover: {
    message: "The approver address is invalid or does not have permission to approve these tokens.",
    reportToBugsnag: true
  },
  ERC20InvalidReceiver: {
    message: "The receiver address is invalid. Please provide a valid address to complete the transaction.",
    reportToBugsnag: true
  },
  ERC20InvalidSender: {
    message: "The sender address is invalid or does not have permission to send these tokens.",
    reportToBugsnag: true
  },
  ERC20InvalidSpender: {
    message: "The spender address is invalid or not allowed to spend tokens on behalf of the sender.",
    reportToBugsnag: true
  },
  MCV2_Token__AlreadyInitialized: {
    message: "This token has already been initialized. Token initialization can only occur once.",
    reportToBugsnag: true
  },
  MCV2_Token__PermissionDenied: {
    message: "Permission denied. You do not have the necessary permissions to perform this action.",
    reportToBugsnag: true
  }
};
const ERC1155_ERROR_MESSAGES = {
  ERC1155InsufficientBalance: {
    message: "Your balance for one or more tokens is insufficient to complete this transaction.",
    reportToBugsnag: false
  },
  ERC1155InvalidApprover: {
    message: "The approver for this operation is invalid or does not have approval rights.",
    reportToBugsnag: true
  },
  ERC1155InvalidArrayLength: {
    message: "The length of the array provided does not match the expected length for this operation.",
    reportToBugsnag: true
  },
  ERC1155InvalidOperator: {
    message: "The operator address provided is invalid or not authorized to perform this operation.",
    reportToBugsnag: true
  },
  ERC1155InvalidReceiver: {
    message: "The receiver address provided is invalid. A valid address is required to receive the tokens.",
    reportToBugsnag: true
  },
  ERC1155InvalidSender: {
    message: "The sender address is invalid or unauthorized to send these tokens.",
    reportToBugsnag: true
  },
  ERC1155MissingApprovalForAll: {
    message: "Approval for all tokens has not been given. Please approve all tokens before proceeding.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__AlreadyInitialized: {
    message: "The multi-token contract has already been initialized and cannot be initialized again.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__BurnAmountExceedsTotalSupply: {
    message: "The amount to be burned exceeds the total supply of the token.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__NotApproved: {
    message: "The operation was not approved. Ensure you have the necessary approvals before retrying.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__PermissionDenied: {
    message: "Permission denied for this operation. Required permissions are not met.",
    reportToBugsnag: true
  }
};
const LOCKER_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The provided address is empty. Please ensure you input a valid address.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "The address has an insufficient balance for this operation. Please check your balance and try again.",
    reportToBugsnag: false
  },
  FailedInnerCall: {
    message: "An internal contract call failed. Please review the contract logic or contact support.",
    reportToBugsnag: true
  },
  LockUp__AlreadyClaimed: {
    message: "The rewards or tokens have already been claimed. You cannot claim them again.",
    reportToBugsnag: true
  },
  LockUp__InvalidPaginationParameters: {
    message: "Pagination parameters provided are invalid. Please adjust and retry your request.",
    reportToBugsnag: true
  },
  LockUp__InvalidParams: {
    message: "Parameters provided for the operation are invalid. Please review and correct them.",
    reportToBugsnag: true
  },
  LockUp__NotYetUnlocked: {
    message: "The locked tokens are not yet available for claim. Please wait until the unlock period has passed.",
    reportToBugsnag: true
  },
  LockUp__PermissionDenied: {
    message: "You do not have permission to perform this action. Check your account permissions and try again.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An operation with ERC20 tokens failed. Ensure the contract addresses and token details are correct.",
    reportToBugsnag: true
  }
};
const MERKLE_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The address provided is empty. A valid address is required for this operation.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "Insufficient balance for the operation. Please ensure your balance is sufficient to proceed.",
    reportToBugsnag: false
  },
  FailedInnerCall: {
    message: "An internal call within the contract failed, indicating a potential issue. Please investigate further.",
    reportToBugsnag: true
  },
  MerkleDistributor__AlreadyClaimed: {
    message: "The claim has already been made. Duplicate claims are not allowed.",
    reportToBugsnag: true
  },
  MerkleDistributor__AlreadyRefunded: {
    message: "The refund has already been processed. Duplicate refunds are not permitted.",
    reportToBugsnag: true
  },
  MerkleDistributor__Finished: {
    message: "The distribution period has ended. No further claims can be processed.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidCaller: {
    message: "The caller is not authorized for this operation. Please check the caller\u2019s permissions.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidPaginationParameters: {
    message: "Provided pagination parameters are invalid. Please correct them and try again.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidParams: {
    message: "The parameters provided are invalid. Check the input parameters and retry.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidProof: {
    message: "The provided proof is invalid. Ensure you connected the correct address for your airdrop claim.",
    reportToBugsnag: true
  },
  MerkleDistributor__NoClaimableTokensLeft: {
    message: "There are no tokens left to claim. All tokens have been distributed.",
    reportToBugsnag: true
  },
  MerkleDistributor__NothingToRefund: {
    message: "There is nothing to refund. Please check your claim status.",
    reportToBugsnag: true
  },
  MerkleDistributor__NotStarted: {
    message: "The distribution has not started yet. Please wait for the distribution period to begin.",
    reportToBugsnag: true
  },
  MerkleDistributor__PermissionDenied: {
    message: "Permission denied for this action. You do not have the necessary permissions.",
    reportToBugsnag: true
  },
  MerkleDistributor__Refunded: {
    message: "Your tokens have been refunded. Check your account for the refunded tokens.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An ERC20 operation failed. Ensure the contract address and token details are correct and try again.",
    reportToBugsnag: true
  }
};
const ZAP_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The provided address is empty. A valid address must be used for this operation.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "The address has insufficient balance for the intended operation. Please check your balance.",
    reportToBugsnag: false
  },
  FailedInnerCall: {
    message: "An internal call failed. This may indicate an issue with contract interactions or logic.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__EthTransferFailed: {
    message: "ETH transfer failed. Ensure you have enough ETH and the recipient address is correct.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__InvalidReceiver: {
    message: "The receiver address is invalid. Transactions require a valid receiver address.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__ReserveIsNotWETH: {
    message: "The reserve is not WETH. This operation requires WETH as the reserve currency.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__SlippageLimitExceeded: {
    message: "The slippage limit was exceeded. Adjust your slippage tolerance and try again.",
    reportToBugsnag: false
  },
  OwnableInvalidOwner: {
    message: "The action was attempted by an invalid owner. Only the contract owner can perform this action.",
    reportToBugsnag: true
  },
  OwnableUnauthorizedAccount: {
    message: "This account is unauthorized to perform the requested action. Check account permissions.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An operation involving ERC20 tokens failed. Check the contract and token details before retrying.",
    reportToBugsnag: true
  }
};
const CONTRACT_ERROR_MESSAGES = {
  ...BOND_ERROR_MESSAGES,
  ...ERC20_ERROR_MESSAGES,
  ...ERC1155_ERROR_MESSAGES,
  ...LOCKER_ERROR_MESSAGES,
  ...MERKLE_ERROR_MESSAGES,
  ...ZAP_ERROR_MESSAGES
};

const ARBITRUM_TOKENS = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x912CE59144191C1204E64559FE8253a0e49E6548": {
    name: "Arbitrum",
    symbol: "ARB",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    decimals: 18,
    image: "https://mint.club/assets/tokens/arbitrum.png"
  },
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": {
    name: "Bridged USDC",
    symbol: "USDC.e",
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a": {
    name: "GMX Token",
    symbol: "GMX",
    address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/18323/large/arbit.png"
  },
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdt.png"
  },
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    decimals: 8,
    image: "https://mint.club/assets/tokens/wbtc.png"
  },
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
    image: "https://mint.club/assets/tokens/dai.png"
  },
  "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    decimals: 18,
    image: "https://mint.club/assets/tokens/link.png"
  },
  "0x00CBcF7B3d37844e44b888Bc747bDd75FCf4E555": {
    name: "xPet.tech XPET",
    symbol: "XPET",
    address: "0x00CBcF7B3d37844e44b888Bc747bDd75FCf4E555",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/33553/large/xpet_token.jpeg"
  },
  "0x5979D7b546E38E414F7E9822514be443A4800529": {
    name: "Wrapped stETH",
    symbol: "wstETH",
    address: "0x5979D7b546E38E414F7E9822514be443A4800529",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/18834/large/wstETH.png"
  },
  "0x6fD58f5a2F3468e35fEb098b5F59F04157002407": {
    name: "poor guy",
    symbol: "pogai",
    address: "0x6fD58f5a2F3468e35fEb098b5F59F04157002407",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/30116/large/pogai.jpeg"
  },
  "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8": {
    name: "Pendle",
    symbol: "PENDLE",
    address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/15069/large/Pendle_Logo_Normal-03.png"
  },
  "0x539bdE0d7Dbd336b79148AA742883198BBF60342": {
    name: "Magic",
    symbol: "MAGIC",
    address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/18623/large/magic.png"
  },
  "0x6dAF586B7370B14163171544fca24AbcC0862ac5": {
    name: "xPet.tech BPET",
    symbol: "BPET",
    address: "0x6dAF586B7370B14163171544fca24AbcC0862ac5",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/33848/large/BPET_logo.png"
  },
  "0x4e352cF164E64ADCBad318C3a1e222E9EBa4Ce42": {
    name: "MUX Protocol",
    symbol: "MCB",
    address: "0x4e352cF164E64ADCBad318C3a1e222E9EBa4Ce42",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/11796/large/mux.jpg"
  },
  "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F": {
    name: "Frax",
    symbol: "FRAX",
    address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
    decimals: 18,
    image: "https://mint.club/assets/tokens/frax.png"
  },
  "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0": {
    name: "Uniswap",
    symbol: "UNI",
    address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    decimals: 18,
    image: "https://mint.club/assets/tokens/uni.png"
  },
  "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60": {
    name: "Lido DAO",
    symbol: "LDO",
    address: "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ldo.png"
  },
  "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978": {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
    decimals: 18,
    image: "https://mint.club/assets/tokens/curve.png"
  }
};

const AVALANCHE_TOKENS = {
  "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7": {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    decimals: 18,
    image: "https://mint.club/assets/tokens/avalanche.png"
  },
  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7": {
    name: "TetherToken",
    symbol: "USDt",
    address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdt.png"
  },
  "0x152b9d0FdC40C096757F570A51E494bd4b943E50": {
    name: "Bitcoin",
    symbol: "BTC.b",
    address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
    decimals: 8,
    image: "https://assets.coingecko.com/coins/images/26115/large/btcb.png"
  },
  "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590": {
    name: "StargateToken",
    symbol: "STG",
    address: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png"
  },
  "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd": {
    name: "JoeToken",
    symbol: "JOE",
    address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/17569/large/JoeToken.png"
  },
  "0x714f020C54cc9D104B6F4f6998C63ce2a31D1888": {
    name: "Step App",
    symbol: "FITFI",
    address: "0x714f020C54cc9D104B6F4f6998C63ce2a31D1888",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/25015/large/200x200.png"
  }
};

const AVALANCHE_FUJI_TOKENS = {
  "0xd00ae08403B9bbb9124bB305C09058E32C39A48c": {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    decimals: 18,
    image: "https://mint.club/assets/tokens/avalanche.png"
  }
};

const BASE_TOKENS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": {
    name: "USDC",
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA": {
    name: "Bridged USDC",
    symbol: "USDBC",
    address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb": {
    name: "Dai",
    symbol: "DAI",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    image: "https://mint.club/assets/tokens/dai.png"
  },
  "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22": {
    name: "Coinbase Wrapped Staked ETH",
    symbol: "CBETH",
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/27008/large/cbeth.png"
  },
  "0x940181a94A35A4569E4529A3CDfB74e38FD98631": {
    name: "Aerodrome Finance",
    symbol: "AERO",
    address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/31745/large/token.png"
  },
  "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8": {
    name: "Bald",
    symbol: "BALD",
    address: "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/31119/large/cdjxKSjo_400x400.jpg"
  },
  "0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b": {
    name: "Echelon Prime",
    symbol: "PRIME",
    address: "0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/29053/large/prime-logo-small-border_%282%29.png"
  },
  "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b": {
    name: "tBTC",
    symbol: "TBTC",
    address: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/11224/large/0x18084fba666a33d37592fa2633fd49a74dd93a88.png"
  },
  "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1": {
    name: "Balancer",
    symbol: "BAL",
    address: "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/11683/large/Balancer.png"
  },
  "0xdCf5130274753c8050aB061B1a1DCbf583f5bFd0": {
    name: "ViciCoin",
    symbol: "VCNT",
    address: "0xdCf5130274753c8050aB061B1a1DCbf583f5bFd0",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/31305/large/ViciCoin_-_small.png"
  },
  "0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4": {
    name: "Electronic USD",
    symbol: "EUSD",
    address: "0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/28445/large/0xa0d69e286b938e21cbf7e51d71f6a4c8918f482f.png"
  },
  "0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85": {
    name: "Seamless",
    symbol: "SEAM",
    address: "0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/33480/large/Seamless_Logo_Black_Transparent.png"
  },
  "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9": {
    name: "BaseSwap",
    symbol: "BSWAP",
    address: "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/31245/large/Baseswap_LogoNew.jpg"
  }
};

const BLAST_TOKENS = {
  "0x4300000000000000000000000000000000000004": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4300000000000000000000000000000000000004",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x4300000000000000000000000000000000000003": {
    name: "USDBlast",
    symbol: "USDB",
    address: "0x4300000000000000000000000000000000000003",
    decimals: 18,
    image: "https://mint.club/assets/tokens/blast.png"
  }
};

const BLAST_SEPOLIA_TOKENS = {
  "0x4200000000000000000000000000000000000023": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000023",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x4200000000000000000000000000000000000022": {
    name: "USDBlast",
    symbol: "USDB",
    address: "0x4200000000000000000000000000000000000022",
    decimals: 18,
    image: "https://mint.club/assets/tokens/blast.png"
  }
};

const BSC_TOKENS = {
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": {
    name: "Wrapped BNB",
    symbol: "WBNB",
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
  },
  "0x1f3Af095CDa17d63cad238358837321e95FC5915": {
    name: "Mint.club",
    symbol: "MINT",
    address: "0x1f3Af095CDa17d63cad238358837321e95FC5915",
    decimals: 18,
    image: "https://mint.club/assets/tokens/mint.png"
  },
  "0x55d398326f99059ff775485246999027b3197955": {
    name: "Binance-Peg BSC-USD",
    symbol: "BSC-USD",
    address: "0x55d398326f99059ff775485246999027b3197955",
    decimals: 18,
    image: "https://mint.club/assets/tokens/usdt.png"
  },
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": {
    name: "PancakeSwap Token",
    symbol: "Cake",
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png"
  },
  "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63": {
    name: "Venus",
    symbol: "XVS",
    address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/12677/large/download.jpg"
  },
  "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1": {
    name: "Biswap",
    symbol: "BSW",
    address: "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/16845/large/biswap.png"
  },
  "0x2170Ed0880ac9A755fd29B2688956BD959F933F8": {
    name: "Binance-Peg Ethereum Token",
    symbol: "ETH",
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d": {
    name: "Binance-Peg USD Coin",
    symbol: "USDC",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    decimals: 18,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3": {
    name: "Binance-Peg Dai Token",
    symbol: "DAI",
    address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    decimals: 18,
    image: "https://mint.club/assets/tokens/dai.png"
  },
  "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": {
    name: "Binance-Peg BTCB Token",
    symbol: "BTCB",
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    decimals: 18,
    image: "https://mint.club/assets/tokens/wbtc.png"
  },
  "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE": {
    name: "Binance-Peg XRP Token",
    symbol: "XRP",
    address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
    decimals: 18,
    image: "https://mint.club/assets/tokens/xrp.png"
  },
  "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD": {
    name: "Binance-Peg ChainLink Token",
    symbol: "LINK",
    address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
    decimals: 18,
    image: "https://mint.club/assets/tokens/link.png"
  },
  "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56": {
    name: "Binance-Peg BUSD Token",
    symbol: "BUSD",
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    decimals: 18,
    image: "https://mint.club/assets/tokens/busd.png"
  },
  "0xd17479997F34dd9156Deef8F95A52D81D265be9c": {
    name: "Decentralized USD",
    symbol: "USDD",
    address: "0xd17479997F34dd9156Deef8F95A52D81D265be9c",
    decimals: 18,
    image: "https://mint.club/assets/tokens/usdd.png"
  },
  "0xCC42724C6683B7E57334c4E856f4c9965ED682bD": {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
    decimals: 18,
    image: "https://mint.club/assets/tokens/matic.png"
  },
  "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350": {
    name: "Binance-Peg Maker",
    symbol: "MKR",
    address: "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350",
    decimals: 18,
    image: "https://mint.club/assets/tokens/mkr.png"
  },
  "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1": {
    name: "Binance-Peg Uniswap",
    symbol: "UNI",
    address: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
    decimals: 18,
    image: "https://mint.club/assets/tokens/uni.png"
  },
  "0x111111111117dC0aa78b770fA6A738034120C302": {
    name: "1INCH Token",
    symbol: "1INCH",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    decimals: 18,
    image: "https://mint.club/assets/tokens/1inch.svg"
  },
  "0x8595F9dA7b868b1822194fAEd312235E43007b49": {
    name: "Binance-Peg BitTorrent Token",
    symbol: "BTT",
    address: "0x8595F9dA7b868b1822194fAEd312235E43007b49",
    decimals: 18,
    image: "https://mint.club/assets/tokens/btt.png"
  },
  "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D": {
    name: "Binance-Peg Shiba Inu Token",
    symbol: "SHIB",
    address: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
    decimals: 18,
    image: "https://mint.club/assets/tokens/shib.png"
  },
  "0xbA2aE424d960c26247Dd6c32edC70B295c744C43": {
    name: "Binance-Peg Dogecoin Token",
    symbol: "DOGE",
    address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    decimals: 8,
    image: "https://mint.club/assets/tokens/doge.png"
  },
  "0xc748673057861a797275CD8A068AbB95A902e8de": {
    name: "Baby Doge Coin",
    symbol: "BabyDoge",
    address: "0xc748673057861a797275CD8A068AbB95A902e8de",
    decimals: 9,
    image: "https://mint.club/assets/tokens/babydoge.png"
  },
  "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47": {
    name: "Binance-Peg Cardano Token",
    symbol: "ADA",
    address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
    decimals: 18,
    image: "https://mint.club/assets/tokens/cardano.png"
  },
  "0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3": {
    name: "TRON",
    symbol: "TRX",
    address: "0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3",
    decimals: 6,
    image: "https://mint.club/assets/tokens/tron.png"
  },
  "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94": {
    name: "Binance-Peg Litecoin Token",
    symbol: "LTC",
    address: "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ltc.png"
  },
  "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402": {
    name: "Binance-Peg Polkadot Token",
    symbol: "DOT",
    address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
    decimals: 18,
    image: "https://mint.club/assets/tokens/dot.png"
  }
};

const MAINNET_TOKENS = {
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x9AAb071B4129B083B01cB5A0Cb513Ce7ecA26fa5": {
    name: "Hunt Token",
    symbol: "HUNT",
    address: "0x9AAb071B4129B083B01cB5A0Cb513Ce7ecA26fa5",
    decimals: 18,
    image: "https://mint.club/assets/tokens/hunt.png"
  },
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdt.png"
  },
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    image: "https://mint.club/assets/tokens/dai.png"
  },
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    image: "https://mint.club/assets/tokens/wbtc.png"
  },
  "0x4d224452801ACEd8B2F0aebE155379bb5D594381": {
    name: "ApeCoin",
    symbol: "APE",
    address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ape.png"
  },
  "0x6982508145454ce325ddbe47a25d4ec3d2311933": {
    name: "Pepe",
    symbol: "PEPE",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    decimals: 18,
    image: "https://mint.club/assets/tokens/pepe.webp"
  },
  "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE": {
    name: "Shiba Inu",
    symbol: "SHIB",
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    decimals: 18,
    image: "https://mint.club/assets/tokens/shib.png"
  },
  "0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74": {
    name: "Memecoin",
    symbol: "MEME",
    address: "0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/32528/large/memecoin_%282%29.png"
  },
  "0x514910771AF9Ca656af840dff83E8264EcF986CA": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    decimals: 18,
    image: "https://mint.club/assets/tokens/link.png"
  },
  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0": {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    decimals: 18,
    image: "https://mint.club/assets/tokens/matic.png"
  },
  "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2": {
    name: "Maker",
    symbol: "MKR",
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    decimals: 18,
    image: "https://mint.club/assets/tokens/mkr.png"
  },
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": {
    name: "Uniswap",
    symbol: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    image: "https://mint.club/assets/tokens/uni.png"
  },
  "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32": {
    name: "Lido DAO Token",
    symbol: "LDO",
    address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ldo.png"
  },
  "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": {
    name: "Wrapped stETH",
    symbol: "wstETH",
    address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/18834/large/wstETH.png"
  },
  "0x111111111117dC0aa78b770fA6A738034120C302": {
    name: "1INCH Token",
    symbol: "1INCH",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    decimals: 18,
    image: "https://mint.club/assets/tokens/1inch.svg"
  },
  "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2": {
    name: "SushiToken",
    symbol: "SUSHI",
    address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/12271/large/512x512_Logo_no_chop.png"
  },
  "0x5283D291DBCF85356A21bA090E6db59121208b44": {
    name: "Blur",
    symbol: "BLUR",
    address: "0x5283D291DBCF85356A21bA090E6db59121208b44",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/28453/large/blur.png"
  },
  "0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF": {
    name: "Immutable X",
    symbol: "IMX",
    address: "0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/17233/large/immutableX-symbol-BLK-RGB.png"
  },
  "0xf4d2888d29D722226FafA5d9B24F9164c092421E": {
    name: "LooksRare Token",
    symbol: "LOOKS",
    address: "0xf4d2888d29D722226FafA5d9B24F9164c092421E",
    decimals: 18,
    image: "https://mint.club/assets/tokens/looks.png"
  },
  "0x6810e776880C02933D47DB1b9fc05908e5386b96": {
    name: "Gnosis Token",
    symbol: "GNO",
    address: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
    decimals: 18,
    image: "https://mint.club/assets/tokens/gno.png"
  },
  "0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8": {
    name: "agEUR",
    symbol: "agEUR",
    address: "0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ageur.png"
  },
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9": {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    decimals: 18,
    image: "https://mint.club/assets/tokens/aave.png"
  }
};

const OPTIMISM_TOKENS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x4200000000000000000000000000000000000042": {
    name: "Optimism",
    symbol: "OP",
    address: "0x4200000000000000000000000000000000000042",
    decimals: 18,
    image: "https://mint.club/assets/tokens/optimism.png"
  },
  "0x7F5c764cBc14f9669B88837ca1490cCa17c31607": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdt.png"
  },
  "0x68f180fcCe6836688e9084f035309E29Bf0A2095": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    decimals: 8,
    image: "https://mint.club/assets/tokens/wbtc.png"
  },
  "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1": {
    name: "Worldcoin",
    symbol: "WLD",
    address: "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1",
    decimals: 18,
    image: "https://mint.club/assets/tokens/worldcoin.png"
  },
  "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
    decimals: 18,
    image: "https://mint.club/assets/tokens/link.png"
  },
  "0xFdb794692724153d1488CcdBE0C56c252596735F": {
    name: "Lido DAO Token",
    symbol: "LDO",
    address: "0xFdb794692724153d1488CcdBE0C56c252596735F",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ldo.png"
  },
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
    image: "https://mint.club/assets/tokens/dai.png"
  },
  "0x2E3D870790dC77A83DD1d18184Acc7439A53f475": {
    name: "Frax",
    symbol: "FRAX",
    address: "0x2E3D870790dC77A83DD1d18184Acc7439A53f475",
    decimals: 18,
    image: "https://mint.club/assets/tokens/frax.png"
  },
  "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9": {
    name: "Synth sUSD",
    symbol: "sUSD",
    address: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
    decimals: 18,
    image: "https://mint.club/assets/tokens/sUSD.png"
  },
  "0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db": {
    name: "VelodromeV2",
    symbol: "VELO",
    address: "0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db",
    decimals: 18,
    image: "https://mint.club/assets/tokens/velo.png"
  },
  "0x76FB31fb4af56892A25e32cFC43De717950c9278": {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
    decimals: 18,
    image: "https://mint.club/assets/tokens/aave.png"
  },
  "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb": {
    name: "Wrapped stETH",
    symbol: "wstETH",
    address: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/18834/large/wstETH.png"
  },
  "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4": {
    name: "Synthetix Network Token",
    symbol: "SNX",
    address: "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/3406/large/SNX.png"
  },
  "0x9e1028F5F1D5eDE59748FFceE5532509976840E0": {
    name: "Perpetual",
    symbol: "PERP",
    address: "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/12381/large/60d18e06844a844ad75901a9_mark_only_03.png"
  },
  "0x9485aca5bbBE1667AD97c7fE7C4531a624C8b1ED": {
    name: "agEUR",
    symbol: "agEUR",
    address: "0x9485aca5bbBE1667AD97c7fE7C4531a624C8b1ED",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ageur.png"
  }
};

const POLYGON_TOKENS = {
  "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270": {
    name: "Wrapped Matic",
    symbol: "WMATIC",
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    decimals: 18,
    image: "https://mint.club/assets/tokens/matic.png"
  },
  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdt.png"
  },
  "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    decimals: 8,
    image: "https://mint.club/assets/tokens/wbtc.png"
  },
  "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    decimals: 18,
    image: "https://mint.club/assets/tokens/link.png"
  },
  "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89": {
    name: "Frax",
    symbol: "FRAX",
    address: "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89",
    decimals: 18,
    image: "https://mint.club/assets/tokens/frax.png"
  },
  "0xb33EaAd8d922B1083446DC23f610c2567fB5180f": {
    name: "Uniswap",
    symbol: "UNI",
    address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
    decimals: 18,
    image: "https://mint.club/assets/tokens/uni.png"
  },
  "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756": {
    name: "Lido DAO Token",
    symbol: "LDO",
    address: "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ldo.png"
  },
  "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f": {
    name: "1INCH Token",
    symbol: "1INCH",
    address: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
    decimals: 18,
    image: "https://mint.club/assets/tokens/1inch.svg"
  },
  "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    decimals: 18,
    image: "https://mint.club/assets/tokens/dai.png"
  },
  "0xB7b31a6BC18e48888545CE79e83E06003bE70930": {
    name: "ApeCoin",
    symbol: "APE",
    address: "0xB7b31a6BC18e48888545CE79e83E06003bE70930",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ape.png"
  },
  "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec": {
    name: "Shiba Inu",
    symbol: "SHIB",
    address: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
    decimals: 18,
    image: "https://mint.club/assets/tokens/shib.png"
  },
  "0xD6DF932A45C0f255f85145f286eA0b292B21C90B": {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    decimals: 18,
    image: "https://mint.club/assets/tokens/aave.png"
  },
  "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683": {
    name: "SAND",
    symbol: "SAND",
    address: "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683",
    decimals: 18,
    image: "https://mint.club/assets/tokens/sandbox.png"
  },
  "0x172370d5Cd63279eFa6d502DAB29171933a610AF": {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
    decimals: 18,
    image: "https://mint.club/assets/tokens/curve.png"
  },
  "0x61299774020dA444Af134c82fa83E3810b309991": {
    name: "Render Token",
    symbol: "RNDR",
    address: "0x61299774020dA444Af134c82fa83E3810b309991",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/11636/large/rndr.png"
  },
  "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4": {
    name: "agEUR",
    symbol: "agEUR",
    address: "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4",
    decimals: 18,
    image: "https://mint.club/assets/tokens/ageur.png"
  },
  "0x50B728D8D964fd00C2d0AAD81718b71311feF68a": {
    name: "Synthetix Network Token",
    symbol: "SNX",
    address: "0x50B728D8D964fd00C2d0AAD81718b71311feF68a",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/3406/large/SNX.png"
  }
};

const SEPOLIA_TOKENS = {
  "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  }
};

const DEGEN_TOKENS = {
  "0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387": {
    name: "Wrapped Degen",
    symbol: "WDEGEN",
    address: "0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387",
    decimals: 18,
    image: "https://mint.club/assets/tokens/degen.png"
  }
};

const BASE_SEPOLIA_TOKENS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  }
};

const CYBER_TESTNET_TOKENS = {
  "0xf760686C2b40F7C526D040b979641293D2F55816": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xf760686C2b40F7C526D040b979641293D2F55816",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  }
};

const CYBER_TOKENS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  }
};

const KAIA_TOKENS = {
  "0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432": {
    name: "Wrapped Klaytn",
    symbol: "WKLAY",
    address: "0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432",
    decimals: 18,
    image: "https://mint.club/assets/tokens/kaia.png"
  },
  "0x98A8345bB9D3DDa9D808Ca1c9142a28F6b0430E1": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x98A8345bB9D3DDa9D808Ca1c9142a28F6b0430E1",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0x608792Deb376CCE1c9FA4D0E6B7b44f507CfFa6A": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x608792Deb376CCE1c9FA4D0E6B7b44f507CfFa6A",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  },
  "0x5C13E303a62Fc5DEdf5B52D66873f2E59fEdADC2": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x5C13E303a62Fc5DEdf5B52D66873f2E59fEdADC2",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdt.png"
  }
};

const HAM_TOKENS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: "https://mint.club/assets/tokens/weth.png"
  },
  "0xE8DD44d0791B73afe9066C3A77721f42d0844bEB": {
    name: "The Next 100x Memecoin on Base",
    symbol: "TN100x",
    address: "0xE8DD44d0791B73afe9066C3A77721f42d0844bEB",
    decimals: 18,
    image: "https://mint.club/assets/tokens/tn100x.png"
  },
  "0x30005Fd5eE0480D0ccFdDe168BBe4527Ffb27062": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x30005Fd5eE0480D0ccFdDe168BBe4527Ffb27062",
    decimals: 6,
    image: "https://mint.club/assets/tokens/usdc.png"
  }
  // NOTE:
  // Disable the following tokens because the bridge doesn't work properly with them at the moment and some of their contracts are not verified
  // We can enable them later if we confirm the bridge works properly and contracts are verified.
  // '0x2c7Bb8516A08cB83776E038934a3e9b3Bbb54b80': {
  //   name: 'Hunt Token',
  //   symbol: 'HUNT',
  //   address: '0x2c7Bb8516A08cB83776E038934a3e9b3Bbb54b80',
  //   decimals: 18,
  //   image: '/assets/tokens/hunt.png',
  // },
  // '0x489A9121ac2D99a29556AbbCA80c02fd3C755418': {
  //   name: 'Based Chad',
  //   symbol: 'CHAD',
  //   address: '0x489A9121ac2D99a29556AbbCA80c02fd3C755418',
  //   decimals: 18,
  //   image: '/assets/tokens/chad.png',
  // },
  // '0x1259276781757704EfD471c7F73F343C7f60Ac4a': {
  //   name: 'Degen',
  //   symbol: 'DEGEN',
  //   address: '0x1259276781757704EfD471c7F73F343C7f60Ac4a',
  //   decimals: 18,
  //   image: '/assets/tokens/degen.png',
  // },
  // '0x7172ACB16Ac0C11f717fF699CC23bf881b60124F': {
  //   name: '747 Airlines (boeing)',
  //   symbol: 'CRASH',
  //   address: '0x7172ACB16Ac0C11f717fF699CC23bf881b60124F',
  //   decimals: 18,
  //   image: '/assets/tokens/crash.png',
  // },
  // '0x822c3f852A395975D10dEBB8886518621b508954': {
  //   name: 'BORED',
  //   symbol: 'BORED',
  //   address: '0x822c3f852A395975D10dEBB8886518621b508954',
  //   decimals: 18,
  //   image: '/assets/tokens/bored.png',
  // },
  // '0x8F5e92accBcacd7585926E00C88b7F596F2A8Dfd': {
  //   name: 'higher',
  //   symbol: 'HIGHER',
  //   address: '0x8F5e92accBcacd7585926E00C88b7F596F2A8Dfd',
  //   decimals: 18,
  //   image: '/assets/tokens/higher.png',
  // },
  // '0x2EEE4f5631f0863114601aAFF0706940AECb791c': {
  //   name: 'PURR',
  //   symbol: 'PURRCOIN',
  //   address: '0x2EEE4f5631f0863114601aAFF0706940AECb791c',
  //   decimals: 18,
  //   image: '/assets/tokens/purrcoin.png',
  // },
  // '0xa5781A046B10B38355AaDA3039951356fEE26A5c': {
  //   name: 'mfercoin',
  //   symbol: 'MFER',
  //   address: '0xa5781A046B10B38355AaDA3039951356fEE26A5c',
  //   decimals: 18,
  //   image: '/assets/tokens/mfer.png',
  // },
  // '0x46D1639976a19443D36203853bFC156fC05eaF03': {
  //   name: 'member',
  //   symbol: 'MEMBER',
  //   address: '0x46D1639976a19443D36203853bFC156fC05eaF03',
  //   decimals: 18,
  //   image: '/assets/tokens/member.png',
  // },
  // '0x1548CA622cd77e07d1B05F667E814D6320eA6FAF': {
  //   name: 'Penjamin Blinkerton',
  //   symbol: 'PEN',
  //   address: '0x1548CA622cd77e07d1B05F667E814D6320eA6FAF',
  //   decimals: 18,
  //   image: '/assets/tokens/pen.png',
  // },
  // '0x9dFb118ba733785216726A35EBeDD5c181bea03A': {
  //   name: 'wrappedRAWR',
  //   symbol: 'wRAWR',
  //   address: '0x9dFb118ba733785216726A35EBeDD5c181bea03A',
  //   decimals: 18,
  //   image: '/assets/tokens/wrawr.png',
  // },
  // '0x397B539003888e05e7Bf291cef5FfD69424E1b6C': {
  //   name: 'Base God',
  //   symbol: 'TYBG',
  //   address: '0x397B539003888e05e7Bf291cef5FfD69424E1b6C',
  //   decimals: 18,
  //   image: '/assets/tokens/tybg.png',
  // },
  // '0x3b301bBca166f9523bBADf0F55dc733cb69C8b52': {
  //   name: 'Shaka',
  //   symbol: 'SHAKA',
  //   address: '0x3b301bBca166f9523bBADf0F55dc733cb69C8b52',
  //   decimals: 18,
  //   image: '/assets/tokens/shaka.png',
  // },
  // '0x39874feF8dAca2a4fb8eE4abC44DA31AD8167853': {
  //   name: 'Virtual Protocol',
  //   symbol: 'VIRTUAL',
  //   address: '0x39874feF8dAca2a4fb8eE4abC44DA31AD8167853',
  //   decimals: 18,
  //   image: '/assets/tokens/virtual.png',
  // },
  // '0x437EBFaa970345b7FbCb4C9aC278902856610c9B': {
  //   name: 'Gloom',
  //   symbol: 'GLOOM',
  //   address: '0x437EBFaa970345b7FbCb4C9aC278902856610c9B',
  //   decimals: 18,
  //   image: '/assets/tokens/gloom.png',
  // },
  // '0x72CB15d01D1219678Cc7B1f3B545459A66D74Ac3': {
  //   name: 'BLACK ROCK',
  //   symbol: 'ROCK',
  //   address: '0x72CB15d01D1219678Cc7B1f3B545459A66D74Ac3',
  //   decimals: 18,
  //   image: '/assets/tokens/rock.png',
  // },
  // '0x8EEd334826BaBA2bf0FCB03e97D5e6b39b41d230': {
  //   name: 'PILL',
  //   symbol: 'PILL',
  //   address: '0x8EEd334826BaBA2bf0FCB03e97D5e6b39b41d230',
  //   decimals: 18,
  //   image: '/assets/tokens/pill.png',
  // },
  // '0xBfe9C207508CCcEAc8bD60D0A01Eada13B55bE79': {
  //   name: 'dude',
  //   symbol: 'DUDE',
  //   address: '0xBfe9C207508CCcEAc8bD60D0A01Eada13B55bE79',
  //   decimals: 18,
  //   image: '/assets/tokens/dude.png',
  // },
  // '0x9922B08815Bf00B72060A8596335fd80Bc915515': {
  //   name: 'doginme',
  //   symbol: 'DOGINME',
  //   address: '0x9922B08815Bf00B72060A8596335fd80Bc915515',
  //   decimals: 18,
  //   image: '/assets/tokens/doginme.png',
  // },
  // '0xD6b018D25e16381B52049e04875a290B9Ec42dEB': {
  //   name: 'SPX6900',
  //   symbol: 'SPX',
  //   address: '0xD6b018D25e16381B52049e04875a290B9Ec42dEB',
  //   decimals: 18,
  //   image: '/assets/tokens/spx.png',
  // },
  // '0x334B2b98087d555598AFBe3C3823D3981C0DD156': {
  //   name: 'Japan',
  //   symbol: 'JAPAN',
  //   address: '0x334B2b98087d555598AFBe3C3823D3981C0DD156',
  //   decimals: 18,
  //   image: '/assets/tokens/japan.png',
  // },
  // '0x059Be3ad5F7dCa3CF41e376a3d367fe9ae58C8dB': {
  //   name: 'nomad',
  //   symbol: 'NOM',
  //   address: '0x059Be3ad5F7dCa3CF41e376a3d367fe9ae58C8dB',
  //   decimals: 18,
  //   image: '/assets/tokens/nom.png',
  // },
  // '0x7210D62c1893433C144e69CB94730Ad1aA93ddbb': {
  //   name: 'Noggles',
  //   symbol: 'NOGS',
  //   address: '0x7210D62c1893433C144e69CB94730Ad1aA93ddbb',
  //   decimals: 18,
  //   image: '/assets/tokens/nogs.png',
  // },
  // '0x8221ccad6E9327B5F0978e42df0c5A2f8f7fAAc0': {
  //   name: 'L2VE',
  //   symbol: 'L2VE',
  //   address: '0x8221ccad6E9327B5F0978e42df0c5A2f8f7fAAc0',
  //   decimals: 18,
  //   image: '/assets/tokens/l2ve.png',
  // },
  // '0xd11512c866Eb8BA500966e5bd5623C5dC3fb0C3f': {
  //   name: 'Toshi',
  //   symbol: 'TOSHI',
  //   address: '0xd11512c866Eb8BA500966e5bd5623C5dC3fb0C3f',
  //   decimals: 18,
  //   image: '/assets/tokens/toshi.png',
  // },
  // '0xbf816855d2420BE98D19c429d35f3DCb63397466': {
  //   name: 'Mochi',
  //   symbol: 'MOCHI',
  //   address: '0xbf816855d2420BE98D19c429d35f3DCb63397466',
  //   decimals: 18,
  //   image: '/assets/tokens/mochi.png',
  // },
  // '0xF20e5B2d748572F73BB5e143b312188DFa95952c': {
  //   name: 'duh',
  //   symbol: 'DUH',
  //   address: '0xF20e5B2d748572F73BB5e143b312188DFa95952c',
  //   decimals: 18,
  //   image: '/assets/tokens/duh.png',
  // },
  // '0xC8ee20E5dfB6Ab465324B07cda356ba62EEDeaB2': {
  //   name: 'lower',
  //   symbol: 'LOWER',
  //   address: '0xC8ee20E5dfB6Ab465324B07cda356ba62EEDeaB2',
  //   decimals: 18,
  //   image: '/assets/tokens/lower.png',
  // },
  // '0xb313B6B101E0DE4139D07C4Fd690A89fb9e2E789': {
  //   name: 'The Doge NFT',
  //   symbol: 'DOG',
  //   address: '0xb313B6B101E0DE4139D07C4Fd690A89fb9e2E789',
  //   decimals: 18,
  //   image: '/assets/tokens/dog.png',
  // },
  // '0x5440ABD35ED274b1783AA66ecB70fa5dC041F275': {
  //   name: 'Pizza',
  //   symbol: 'PIZZA',
  //   address: '0x5440ABD35ED274b1783AA66ecB70fa5dC041F275',
  //   decimals: 18,
  //   image: '/assets/tokens/pizza.png',
  // },
  // '0xB209C83d18c5AB079331b5d1708723F2Bc0C0fA6': {
  //   name: 'Sendit',
  //   symbol: 'SENDIT',
  //   address: '0xB209C83d18c5AB079331b5d1708723F2Bc0C0fA6',
  //   decimals: 18,
  //   image: '/assets/tokens/sendit.png',
  // },
  // '0xe374BD638d5f1529DAB101ac6198C5A517D873B8': {
  //   name: 'BMX',
  //   symbol: 'BMX',
  //   address: '0xe374BD638d5f1529DAB101ac6198C5A517D873B8',
  //   decimals: 18,
  //   image: '/assets/tokens/bmx.png',
  // },
  // '0xa155274497e8fd5a22C77B687D73810F0531e9Da': {
  //   name: 'PHAM',
  //   symbol: 'pHAM',
  //   address: '0xa155274497e8fd5a22C77B687D73810F0531e9Da',
  //   decimals: 18,
  //   image: '/assets/tokens/bleu.png',
  // },
  // '0x83F4507Fd5DE223D3DcC0aAA274f4FCF28a06Dc1': {
  //   name: 'BLEU',
  //   symbol: 'BLEU',
  //   address: '0x83F4507Fd5DE223D3DcC0aAA274f4FCF28a06Dc1',
  //   decimals: 18,
  //   image: '/assets/tokens/bleu.png',
  // },
  // '0xBD16e51B1513107989AE357A561dBE545b2e1b1A': {
  //   name: 'AM',
  //   symbol: 'AM',
  //   address: '0xBD16e51B1513107989AE357A561dBE545b2e1b1A',
  //   decimals: 18,
  //   image: '/assets/tokens/am.png',
  // },
};

const BSC_TESTNET_TOKENS = {
  "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd": {
    name: "Wrapped BNB",
    symbol: "WBNB",
    address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
  }
};

const COINGECKO_NETWORK_IDS = {
  [mainnet.id]: "ethereum",
  [optimism.id]: "optimistic-ethereum",
  [arbitrum.id]: "arbitrum-one",
  [avalanche.id]: "avalanche",
  [base.id]: "base",
  [polygon.id]: "polygon-pos",
  [bsc.id]: "binance-smart-chain",
  [sepolia.id]: "ethereum",
  // sepolia not supported by coingecko API
  [blast.id]: "ethereum",
  // blast not supported by coingecko API
  [blastSepolia.id]: "ethereum",
  // blast sepolia not supported by coingecko API
  [avalancheFuji.id]: "ethereum"
  // avalanche-fuji not supported by coingecko API
};
const WRAPPED_NATIVE_TOKENS = {
  [mainnet.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [optimism.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [optimismSepolia.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [arbitrum.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [avalanche.id]: {
    image: "https://mint.club/assets/tokens/avalanche.png",
    tokenAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    nativeSymbol: "AVAX",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [polygon.id]: {
    image: "https://mint.club/assets/tokens/matic.png",
    tokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    nativeSymbol: "MATIC",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [bsc.id]: {
    image: "https://mint.club/assets/tokens/bnb.png",
    tokenAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    nativeSymbol: "BNB",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [bscTestnet.id]: {
    image: "https://mint.club/assets/tokens/bnb.png",
    tokenAddress: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    nativeSymbol: "BNB",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [base.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDbC",
    decimals: 18
  },
  [sepolia.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [baseSepolia.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [blast.id]: {
    image: "https://mint.club/assets/tokens/blast.png",
    tokenAddress: "0x4300000000000000000000000000000000000004",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDB",
    decimals: 18
  },
  [blastSepolia.id]: {
    image: "https://mint.club/assets/tokens/blast.png",
    tokenAddress: "0x4200000000000000000000000000000000000023",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDB",
    decimals: 18
  },
  [avalancheFuji.id]: {
    image: "https://mint.club/assets/tokens/avalanche.png",
    tokenAddress: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    nativeSymbol: "AVAX",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [degen.id]: {
    image: "https://mint.club/assets/tokens/degen.png",
    tokenAddress: "0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387",
    nativeSymbol: "DEGEN",
    oneInchSymbol: "USDC",
    decimals: 18
  },
  [cyber.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [cyberTestnet.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0xf760686C2b40F7C526D040b979641293D2F55816",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDC",
    decimals: 18
  },
  [kaia.id]: {
    image: "https://mint.club/assets/tokens/kaia.png",
    tokenAddress: "0x608792Deb376CCE1c9FA4D0E6B7b44f507CfFa6A",
    nativeSymbol: "KLAY",
    oneInchSymbol: "USDC",
    decimals: 6
  },
  [ham.id]: {
    image: "https://mint.club/assets/tokens/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDC",
    decimals: 18
  }
};
const TOKENS = {
  // export const TOKENS = {
  [mainnet.id]: MAINNET_TOKENS,
  [optimism.id]: OPTIMISM_TOKENS,
  [optimismSepolia.id]: OPTIMISM_TOKENS,
  [arbitrum.id]: ARBITRUM_TOKENS,
  [avalanche.id]: AVALANCHE_TOKENS,
  [polygon.id]: POLYGON_TOKENS,
  [bsc.id]: BSC_TOKENS,
  [bscTestnet.id]: BSC_TESTNET_TOKENS,
  [base.id]: BASE_TOKENS,
  [blast.id]: BLAST_TOKENS,
  [blastSepolia.id]: BLAST_SEPOLIA_TOKENS,
  [sepolia.id]: SEPOLIA_TOKENS,
  [baseSepolia.id]: BASE_SEPOLIA_TOKENS,
  [avalancheFuji.id]: AVALANCHE_FUJI_TOKENS,
  [degen.id]: DEGEN_TOKENS,
  [cyber.id]: CYBER_TOKENS,
  [cyberTestnet.id]: CYBER_TESTNET_TOKENS,
  [kaia.id]: KAIA_TOKENS,
  [ham.id]: HAM_TOKENS
};

const MCV2_WALLET_STATE_LOCALSTORAGE = "mcv2_wallet_state";
class Client {
  static instance;
  walletClient;
  // these are always defined, singleton
  publicClients = {};
  constructor() {
    if (Client.instance) {
      return Client.instance;
    }
    Client.instance = this;
  }
  getDefaultProvider() {
    if (typeof window.ethereum === "undefined") throw new NoEthereumProviderError();
    return window?.ethereum;
  }
  isPrivateKey() {
    return this.walletClient?.account?.source === "privateKey";
  }
  async connect(provider) {
    let addressToReturn = null;
    if (this.walletClient?.account || this.isPrivateKey()) {
      if (this.walletClient?.account?.address) {
        addressToReturn = this.walletClient?.account?.address;
      }
    }
    if (this.walletClient) {
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(provider ?? this.walletClient.transport)
      });
      addressToReturn = address;
    } else {
      this.walletClient = createWalletClient({
        transport: custom(provider ?? this.getDefaultProvider())
      });
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(provider ?? this.getDefaultProvider())
      });
      addressToReturn = address;
    }
    if (addressToReturn) this.walletState = "connected";
    return addressToReturn;
  }
  get walletState() {
    if (typeof window === "undefined") {
      return "none";
    }
    return window?.localStorage?.getItem?.(MCV2_WALLET_STATE_LOCALSTORAGE) ?? "none";
  }
  set walletState(newState) {
    window?.localStorage?.setItem?.(MCV2_WALLET_STATE_LOCALSTORAGE, newState);
  }
  async change() {
    await this.walletClient?.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });
  }
  disconnect() {
    this.walletClient = void 0;
    this.walletState = "disconnected";
  }
  async account() {
    if (this.walletState === "disconnected") return null;
    if (!this.walletClient && window?.ethereum !== void 0) {
      this.walletClient = createWalletClient({
        transport: custom(window.ethereum)
      });
    }
    const accounts = await this.walletClient?.getAddresses();
    return accounts?.[0] || null;
  }
  async getNativeBalance(params) {
    const { walletAddress, chainId } = params || {};
    if (chainId !== void 0 && walletAddress)
      return this._getPublicClient(chainId).getBalance({ address: walletAddress });
    await this.connect();
    const address = await this.account();
    const connectedChain = this.walletClient?.chain?.id;
    if (!address || connectedChain === void 0) throw new WalletNotConnectedError();
    return this._getPublicClient(connectedChain).getBalance({
      address
    });
  }
  _getPublicClient(id) {
    if (this.publicClients[id] !== void 0) return this.publicClients[id];
    const chain = Object.values(chains).find((chain2) => chain2.id === id) ?? chainIdToViemChain(id);
    if (!chain) throw new ChainNotSupportedError(id);
    this.publicClients[chain.id] = createPublicClient({
      chain,
      transport: fallback(chainRPCFallbacks(chain), DEFAULT_RANK_OPTIONS)
    });
    this.publicClients[chain.id].transport.onResponse((response) => {
      if (!response.response && response.status === "success") {
        throw new Error("Empty RPC Response");
      }
    });
    return this.publicClients[chain.id];
  }
  getWalletClient() {
    return this.walletClient;
  }
  withPublicClient(publicClient) {
    if (publicClient.chain?.id === void 0) throw new ChainNotSupportedError(publicClient.chain);
    this.publicClients[publicClient.chain.id] = publicClient;
    return this;
  }
  withWalletClient(walletClient) {
    this.walletClient = walletClient;
    return this;
  }
  withPrivateKey(privateKey) {
    const account = privateKeyToAccount(privateKey);
    this.walletClient = createWalletClient({
      transport: fallback(chainRPCFallbacks(chains.mainnet), DEFAULT_RANK_OPTIONS),
      account
    });
    return this;
  }
  withAccount(account, provider) {
    const providerToUse = provider || this.getDefaultProvider();
    this.walletClient = createWalletClient({
      account,
      transport: custom(providerToUse)
    });
    return this;
  }
  async withProvider(provider) {
    this.walletClient = createWalletClient({
      transport: custom(provider)
    });
    return this;
  }
}

class GenericContractLogic {
  abi;
  contractType;
  chainId;
  clientHelper;
  chain;
  version;
  constructor(params) {
    const { chainId, type, abi, version } = params;
    this.contractType = type;
    this.abi = abi;
    this.chainId = chainId;
    this.chain = getChain(chainId);
    this.clientHelper = new Client();
    this.version = version;
  }
  read(params) {
    const { functionName } = params;
    const args = "args" in params ? params.args : void 0;
    let address;
    if ("tokenAddress" in params) {
      address = params.tokenAddress;
    } else {
      address = getMintClubContractAddress(this.contractType, this.chainId, this.version);
    }
    const publicClient = this.clientHelper._getPublicClient(this.chainId);
    return publicClient.readContract({
      abi: this.abi,
      address,
      functionName,
      args
    });
  }
  async write(params) {
    const { functionName, value, debug, onError, onSignatureRequest, onSigned, onSuccess } = params;
    let args, simulationArgs;
    args = "args" in params ? params.args : void 0;
    let address;
    if ("tokenAddress" in params) {
      address = params.tokenAddress;
    } else {
      address = getMintClubContractAddress(this.contractType, this.chainId, this.version);
    }
    try {
      const walletClient = this.clientHelper.getWalletClient();
      const isPrivateKey = this.clientHelper.isPrivateKey();
      if (isPrivateKey && !walletClient?.account) {
        throw new WalletNotConnectedError();
      } else if (!walletClient || !walletClient.account) {
        await this.clientHelper.connect();
        return;
      } else if (!isPrivateKey) {
        await walletClient.addChain({ chain: this.chain });
        await walletClient.switchChain({ id: this.chainId });
      }
      simulationArgs = {
        chain: this.chain,
        account: walletClient.account,
        abi: this.abi,
        address,
        functionName,
        args,
        ...value !== void 0 && { value }
      };
      debug?.(simulationArgs);
      let tx;
      if (isPrivateKey) {
        const client = createWalletClient({
          chain: this.chain,
          account: walletClient.account,
          transport: fallback(chainRPCFallbacks(this.chain), DEFAULT_RANK_OPTIONS)
        }).extend(publicActions);
        const { request } = await client.simulateContract(simulationArgs);
        onSignatureRequest?.();
        tx = await client.writeContract(request);
      } else {
        const { request } = await this.clientHelper._getPublicClient(this.chainId).simulateContract(simulationArgs);
        onSignatureRequest?.();
        tx = await walletClient.writeContract(request);
      }
      onSigned?.(tx);
      const receipt = await this.clientHelper._getPublicClient(this.chainId).waitForTransactionReceipt({
        hash: tx
      });
      onSuccess?.(receipt);
      return receipt;
    } catch (e) {
      if (e) {
        Object.assign(e, { functionName, args, simulationArgs, value });
      }
      onError?.(e);
      return;
    }
  }
}

class GenericContract {
  contractType;
  abi;
  constructor(type) {
    this.contractType = type;
    if (type === "BOND") {
      this.abi = BOND_ABI;
    } else if (type === "ERC20") {
      this.abi = ERC20_ABI;
    } else if (type === "ERC1155") {
      this.abi = ERC1155_ABI;
    } else if (type === "LOCKER") {
      this.abi = LOCKER_ABI;
    } else if (type === "MERKLE") {
      this.abi = MERKLE_ABI;
    } else if (type === "ZAP") {
      this.abi = ZAP_ABI;
    } else if (type === "ONEINCH") {
      this.abi = ONEINCH_ABI;
    } else {
      throw new Error(`Contract type ${type} not supported`);
    }
  }
  network(id, version) {
    let chainId;
    if (typeof id === "string") {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }
    return new GenericContractLogic({
      chainId,
      type: this.contractType,
      abi: this.abi,
      version
    });
  }
}

const bondContract = new GenericContract("BOND");
const erc20Contract = new GenericContract("ERC20");
const erc1155Contract = new GenericContract("ERC1155");
const zapContract = new GenericContract("ZAP");
const airdropContract = new GenericContract("MERKLE");
const lockupContract = new GenericContract("LOCKER");
const oneInchContract = new GenericContract("ONEINCH");

class Bond {
  chainId;
  version;
  constructor(chainId, version) {
    this.chainId = chainId;
    this.version = version;
  }
  getCreationFee() {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "creationFee"
    });
  }
  getTokensByReserveToken(params) {
    const { reserveToken, start = 0, end = 1e3 } = params;
    return bondContract.network(this.chainId, this.version).read({
      functionName: "getTokensByReserveToken",
      args: [reserveToken, BigInt(start), BigInt(end)]
    });
  }
  getTokensByCreator(params) {
    const { creator, start = 0, end = 1e3 } = params;
    return bondContract.network(this.chainId, this.version).read({
      functionName: "getTokensByCreator",
      args: [creator, BigInt(start), BigInt(end)]
    });
  }
}

function computeCreate2Address(chainId, tokenType, tokenSymbol, version) {
  const bondAddress = getMintClubContractAddress("BOND", chainId, version);
  const tokenImplementation = getMintClubContractAddress(
    tokenType === "ERC20" ? "ERC20" : "ERC1155",
    chainId,
    version
  );
  const hexedSymbol = stringToHex(tokenSymbol);
  const packed = `0x${[bondAddress, hexedSymbol].map((x) => x?.replace("0x", "")).join("").toLowerCase()}`;
  const salt = keccak256(packed);
  const creationCode = [
    "0x3d602d80600a3d3981f3363d3d373d3d3d363d73",
    tokenImplementation?.replace(/0x/, "").toLowerCase(),
    "5af43d82803e903d91602b57fd5bf3"
  ].join("");
  const params = `0x${["ff", bondAddress, salt, keccak256(creationCode)].map((x) => x?.replace(/0x/, "")).join("")}`;
  const hexed = hexToBytes(params);
  const hash = keccak256(hexed);
  const address = getAddress(`0x${hash.slice(-40)}`);
  return address;
}
function createRandomAddress() {
  const randBytes = randomBytes(20);
  return bytesToHex(randBytes);
}

const { uniqBy } = lodash;
var CurveEnum = /* @__PURE__ */ ((CurveEnum2) => {
  CurveEnum2["FLAT"] = "FLAT";
  CurveEnum2["LINEAR"] = "LINEAR";
  CurveEnum2["EXPONENTIAL"] = "EXPONENTIAL";
  CurveEnum2["LOGARITHMIC"] = "LOGARITHMIC";
  return CurveEnum2;
})(CurveEnum || {});
const graphTypes = ["FLAT" /* FLAT */, "LINEAR" /* LINEAR */, "EXPONENTIAL" /* EXPONENTIAL */, "LOGARITHMIC" /* LOGARITHMIC */];
function formatGraphPoint(value, maxDecimalPoints) {
  const maxWeiDecimals = 18;
  let formattedValue;
  if (maxDecimalPoints !== void 0 && maxWeiDecimals > maxDecimalPoints) {
    formattedValue = Number(value?.toFixed(maxDecimalPoints));
  } else {
    formattedValue = Number(value?.toFixed(maxWeiDecimals));
  }
  if (value !== 0 && formattedValue === 0) return value;
  return formattedValue;
}
function generateSteps(form) {
  const {
    tokenType,
    reserveToken,
    curveData: {
      curveType,
      stepCount: _stepCount,
      maxSupply,
      creatorAllocation = 0,
      initialMintingPrice,
      finalMintingPrice
    }
  } = form;
  const maxPrice = finalMintingPrice;
  const startingPrice = initialMintingPrice;
  const stepPoints = [];
  let stepCount = curveType === "FLAT" /* FLAT */ ? 1 : _stepCount;
  let extraStepCount = 0;
  if (startingPrice === 0) {
    extraStepCount = 1;
  }
  if (tokenType === "ERC1155" && stepCount > maxSupply) {
    stepCount = Math.max(maxSupply, 2);
    extraStepCount = 1;
  }
  const deltaX = (maxSupply - creatorAllocation) / (stepCount + extraStepCount);
  const totalX = maxSupply - creatorAllocation - deltaX;
  const totalY = maxPrice - startingPrice;
  const exponent = 0.5;
  const coefficientPower = totalY / Math.pow(totalX, exponent);
  const percentageIncrease = Math.pow(maxPrice / startingPrice, 1 / (stepCount - 1));
  for (let i = extraStepCount; i <= stepCount + extraStepCount; i++) {
    let x = i * deltaX + creatorAllocation;
    if (tokenType === "ERC1155") x = Math.ceil(x);
    let y;
    switch (curveType) {
      case "FLAT" /* FLAT */:
        y = startingPrice;
        break;
      case "LINEAR" /* LINEAR */:
        const stepPerPrice = totalY / totalX;
        y = stepPerPrice * (x - extraStepCount - creatorAllocation) + startingPrice;
        break;
      case "EXPONENTIAL" /* EXPONENTIAL */:
        if (i === 0) {
          y = startingPrice;
        } else {
          const prevY = stepPoints[i - 1].y;
          y = prevY * percentageIncrease;
        }
        break;
      case "LOGARITHMIC" /* LOGARITHMIC */:
        if (x - creatorAllocation === 0) y = startingPrice;
        else {
          y = startingPrice + coefficientPower * Math.pow(x - extraStepCount - creatorAllocation, exponent);
        }
        break;
      default:
        y = 0;
    }
    if (tokenType === "ERC1155") {
      x = Number(x.toFixed(0));
    } else {
      x = formatGraphPoint(x, 18);
    }
    y = Math.max(Math.min(y, maxPrice), initialMintingPrice);
    y = formatGraphPoint(y, reserveToken.decimals);
    if (i === stepCount && curveType !== "FLAT" /* FLAT */) {
      stepPoints.push({ x, y: maxPrice });
    } else {
      stepPoints.push({ x, y: Math.min(y ?? 0, maxPrice) });
    }
  }
  if (startingPrice === 0) {
    return generateSteps({
      ...form,
      curveData: {
        ...form.curveData,
        initialMintingPrice: stepPoints[0].y
      }
    });
  }
  let mergeCount = 0;
  let clonedPoints = structuredClone(stepPoints);
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
function calculateArea(steps, partialIndex) {
  const clonedSteps = structuredClone(steps);
  clonedSteps.sort((a, b) => a.x - b.x);
  let intervalArea = 0;
  let totalArea = 0;
  let lastIndex = clonedSteps.length - 1;
  if (partialIndex !== void 0) {
    lastIndex = Math.min(lastIndex, partialIndex);
  }
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
function generateTableData(steps) {
  const clonedSteps = structuredClone(steps);
  clonedSteps.sort((a, b) => a.x - b.x);
  let data = [];
  let totalTVL = 0;
  for (let i = 1; i < clonedSteps.length; i++) {
    const height = clonedSteps[i - 1].y;
    const width = clonedSteps[i].x - clonedSteps[i - 1].x;
    const obj = {};
    obj.start = clonedSteps[i - 1].x;
    obj.end = clonedSteps[i].x;
    obj.price = clonedSteps[i - 1].y;
    if (width > 0 && height > 0) {
      const tvl = width * height;
      obj.tvl = tvl;
      totalTVL += tvl;
    }
    data.push(obj);
  }
  return { data, totalTVL };
}

const { cloneDeep } = lodash;
function generateCreateArgs(params) {
  const {
    tokenType,
    name,
    symbol,
    agentHash,
    curveData,
    reserveToken,
    buyRoyalty = 0.03,
    sellRoyalty = 0.03,
    stepData: _stepData
  } = params;
  if (curveData === void 0 && _stepData === void 0) {
    throw new CreationError("Either curveData or stepData is required for creation");
  }
  const stepRanges = [];
  const stepPrices = [];
  let stepData = [];
  const { creatorAllocation = 0, maxSupply = 0 } = curveData || {};
  if (curveData) {
    const { stepData: generatedSteps } = generateSteps({
      ...params,
      curveData
    });
    if (creatorAllocation > maxSupply) {
      throw new CreationError("Generating argument for creation failed", {
        metaMessages: ["Creator allocation cannot be greater than max supply"]
      });
    }
    stepData = generatedSteps;
    const cloned = cloneDeep(generatedSteps);
    for (let i = cloned.length - 1; i > 0; i--) {
      cloned[i].price = cloned[i - 1].price;
    }
    cloned.shift();
    stepData = cloned;
    if (creatorAllocation > 0) {
      stepRanges.unshift(wei$1(creatorAllocation, tokenType === "ERC20" ? 18 : 0));
      stepPrices.unshift(0n);
    }
    if (tokenType === "ERC1155" && maxSupply === 1) {
      stepData = [{ rangeTo: 1, price: curveData.finalMintingPrice }];
    } else if (stepData[0].price !== curveData.initialMintingPrice) {
      throw new CreationError(`Generated step data's initial price does not match your desired value.`, {
        metaMessages: ["Please try a different step count", JSON.stringify(stepData)]
      });
    } else if (stepData[stepData.length - 1].price !== curveData.finalMintingPrice) {
      throw new CreationError(`Generated step data's final price does not match your desired value.`, {
        metaMessages: ["Please try a different step count", JSON.stringify(stepData)]
      });
    }
  } else {
    stepData = _stepData;
  }
  stepData.forEach(({ rangeTo, price }) => {
    if (isNaN(rangeTo) || isNaN(price) || rangeTo < 0 || price < 0) {
      throw new CreationError("Invalid arguments passed for creation", {
        metaMessages: ["Please double check the step data"]
      });
    }
    stepRanges.push(wei$1(rangeTo, tokenType === "ERC20" ? 18 : 0));
    stepPrices.push(wei$1(price, reserveToken.decimals));
  });
  for (let i = 0; i < stepPrices.length; i++) {
    if (stepPrices[i] === stepPrices[i + 1]) {
      stepRanges.splice(i, 1);
      stepPrices.splice(i, 1);
      i--;
    }
  }
  if (tokenType === "ERC1155") {
    for (let i = 0; i < stepRanges.length; i++) {
      if (stepRanges[i] === stepRanges[i + 1]) {
        stepRanges.splice(i, 1);
        stepPrices.splice(i, 1);
        i--;
      }
    }
  }
  if (stepRanges.length === 0 || stepPrices.length === 0 || stepRanges.length !== stepPrices.length) {
    throw new CreationError("Invalid step data. Please double check the step data");
  } else if (stepData === void 0 && creatorAllocation === 0 && stepPrices.some((price) => price === 0n)) {
    throw new CreationError(
      "Your parameters may be too extreme to generate a valid curve. Please change parameters, such as stepCount."
    );
  } else if (creatorAllocation > 0) {
    const weiAllocation = wei$1(creatorAllocation, tokenType === "ERC20" ? 18 : 0);
    if (stepRanges[0] !== weiAllocation) {
      throw new CreationError("Creator allocation does not match the first step range. Try different parameters");
    }
  }
  const tokenParams = {
    name,
    symbol,
    agentHash
  };
  const bondParams = {
    mintRoyalty: buyRoyalty * 100,
    burnRoyalty: sellRoyalty * 100,
    reserveToken: reserveToken.address,
    maxSupply: stepRanges[stepRanges.length - 1],
    stepRanges,
    stepPrices
  };
  return { tokenParams, bondParams };
}

class ApiError {
  status;
  message;
  constructor({ status, message }) {
    this.status = status;
    this.message = message || "An unexpected error occurred";
  }
}
const baseFetcher = ky.extend({
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        const data = await response.json();
        const { ok, status } = response;
        if (ok) {
          return data;
        }
        const { message = "An error occurred while fetching the data." } = data;
        throw new ApiError({ status, message });
      }
    ]
  }
});
const api = baseFetcher.extend({
  prefixUrl: "https://mint.club/api",
  timeout: 6e4
  // 1 min timeout
});

const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";
class Airdrop {
  chainId;
  version;
  constructor(chainId, version) {
    this.chainId = chainId;
    this.version = version;
  }
  getTotalAirdropCount() {
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "distributionCount"
    });
  }
  async getAirdropById(airdropId) {
    const [
      token,
      isERC20,
      walletCount,
      claimCount,
      amountPerClaim,
      startTime,
      endTime,
      owner,
      refundedAt,
      merkleRoot,
      title,
      ipfsCID
    ] = await airdropContract.network(this.chainId, this.version).read({
      functionName: "distributions",
      args: [BigInt(airdropId)]
    });
    return {
      token,
      isERC20,
      walletCount,
      claimCount,
      amountPerClaim,
      startTime,
      endTime,
      owner,
      refundedAt,
      merkleRoot,
      title,
      ipfsCID
    };
  }
  getAmountClaimed(airdropId) {
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "getAmountClaimed",
      args: [BigInt(airdropId)]
    });
  }
  getAmountLeft(airdropId) {
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "getAmountLeft",
      args: [BigInt(airdropId)]
    });
  }
  getAirdropIdsByOwner(params) {
    const { owner, start = 0, end = 1e3 } = params;
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "getDistributionIdsByOwner",
      args: [owner, BigInt(start), BigInt(end)]
    });
  }
  getAirdropIdsByToken(params) {
    const { token, start = 0, end = 1e3 } = params;
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "getDistributionIdsByToken",
      args: [token, BigInt(start), BigInt(end)]
    });
  }
  getIsClaimed(airdropId, account) {
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "isClaimed",
      args: [BigInt(airdropId), account]
    });
  }
  getIsWhitelistOnly(airdropId) {
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "isWhitelistOnly",
      args: [BigInt(airdropId)]
    });
  }
  async getMerkleProof(airdropId) {
    const { ipfsCID } = await this.getAirdropById(airdropId);
    const merkleProof = await api.get(`ipfs/whitelist?cid=${ipfsCID}`).json().catch(() => {
      return baseFetcher.get(`https://ipfs.io/ipfs/${ipfsCID}`).json();
    });
    return merkleProof;
  }
  async getIsWhitelisted(airdropId, account) {
    const { merkleRoot } = await this.getAirdropById(airdropId);
    if (merkleRoot === EMPTY_ROOT) return Promise.resolve(true);
    return airdropContract.network(this.chainId, this.version).read({
      functionName: "isWhitelisted",
      args: [BigInt(airdropId), account, await this.getMerkleProof(airdropId)]
    });
  }
  async claimAirdrop(params) {
    const { airdropId } = params;
    return airdropContract.network(this.chainId, this.version).write({
      ...params,
      functionName: "claim",
      args: [BigInt(airdropId), await this.getMerkleProof(airdropId)]
    });
  }
  createAirdrop(params) {
    const { token, isERC20, amountPerClaim, walletCount, startTime, endTime, merkleRoot, title, ipfsCID } = params;
    return airdropContract.network(this.chainId, this.version).write({
      ...params,
      functionName: "createDistribution",
      args: [token, isERC20, amountPerClaim, walletCount, startTime, endTime, merkleRoot, title, ipfsCID]
    });
  }
  cancelAirdrop(params) {
    const { airdropId } = params;
    return airdropContract.network(this.chainId, this.version).write({
      ...params,
      functionName: "refund",
      args: [BigInt(airdropId)]
    });
  }
}

class Ipfs {
  async add(apiKey, blob) {
    if (!apiKey) throw new PinataKeyNeededErrror();
    const client = new PinataSDK({ pinataJwt: apiKey, pinataGateway: "" });
    switch (blob.type) {
      case "image/png":
        const fileUploadResponse = await client.upload.file(new File([blob], Date.now().toString()));
        return fileUploadResponse.IpfsHash;
      case "application/json":
        const jsonUploadResponse = await client.upload.json(blob.json());
        return jsonUploadResponse.IpfsHash;
      default:
        return "";
    }
  }
  isIpfsUrl(url) {
    return url.toLowerCase().startsWith("ipfs://");
  }
  isHttpUrl(url) {
    return url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://");
  }
  validateHttpUrl(url) {
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      throw new InvalidImageProvidedError();
    }
    const valid = urlObj.protocol === "http:" || urlObj.protocol === "https:";
    if (!valid) {
      throw new InvalidImageProvidedError();
    }
    return valid;
  }
  hashToGatewayUrl(hash, gateway = "https://ipfs.io/ipfs/") {
    if (hash.includes("ipfs://")) {
      hash = hash.replace("ipfs://", "");
    }
    return `${gateway}${hash}`;
  }
  gatewayUrlToHash(url) {
    return "ipfs://" + url.split("ipfs/").pop();
  }
  validateIpfsHash(ipfsUrl) {
    const hash = ipfsUrl.replace(/^ipfs:\/\//, "");
    const cidv0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    const cidv1Pattern = /^b[1-9A-Za-z]{49,}$/;
    const matched = cidv0Pattern.test(hash) || cidv1Pattern.test(hash);
    if (!matched) {
      throw new InvalidImageProvidedError();
    }
    return matched;
  }
  async upload(params) {
    const { pinataApiKey, media } = params;
    const hash = await this.add(pinataApiKey, media);
    return `ipfs://${hash}`;
  }
  async uploadMetadata(data) {
    const { pinataApiKey, name, image, video, description, external_url, attributes } = data;
    const defaultExternalLink = `https://mint.club`;
    const defaultDescription = [
      `A Bonding Curved ERC-1155 token powered by mint.club bonding curve protocol.`,
      defaultExternalLink
    ].join("\n\n");
    const finalMetadata = {
      name,
      description: defaultDescription,
      image,
      external_url: defaultExternalLink,
      attributes: []
    };
    if (video) {
      finalMetadata.animation_url = video;
    }
    if (description) finalMetadata.description = description;
    if (external_url) finalMetadata.external_url = external_url;
    if (attributes) finalMetadata.attributes = attributes;
    const metadata = JSON.stringify(finalMetadata);
    const metadataBuffer = new Blob([metadata], { type: "application/json" });
    const jsonHash = await this.add(pinataApiKey, metadataBuffer);
    return `ipfs://${jsonHash}`;
  }
}

const STABLE_COINS = {
  [mainnet.id]: {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    symbol: "USDT",
    decimals: 6n
  },
  // USDT
  [optimism.id]: {
    address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    symbol: "USDT",
    decimals: 6n
  },
  // USDT
  [optimismSepolia.id]: {
    address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    symbol: "USDT",
    decimals: 6n
  },
  // USDT
  [arbitrum.id]: {
    address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    symbol: "USDT",
    decimals: 6n
  },
  // USDT
  [avalanche.id]: {
    address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
    symbol: "USDT",
    decimals: 6n
  },
  // USDT
  [polygon.id]: {
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    symbol: "USDT",
    decimals: 6n
  },
  // USDT
  [bsc.id]: {
    address: "0x55d398326f99059ff775485246999027b3197955",
    symbol: "USDT",
    decimals: 18n
  },
  // USDT
  // TODO
  [bscTestnet.id]: {
    address: "0x55d398326f99059ff775485246999027b3197955",
    symbol: "USDT",
    decimals: 18n
  },
  // USDT
  [base.id]: {
    address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca",
    symbol: "USDBC",
    decimals: 6n
  },
  // USDBC
  [baseSepolia.id]: { address: "0x", symbol: "", decimals: 0n },
  [sepolia.id]: { address: "0x", symbol: "", decimals: 0n },
  [blast.id]: { address: "0x", symbol: "", decimals: 0n },
  [blastSepolia.id]: { address: "0x", symbol: "", decimals: 0n },
  [avalancheFuji.id]: { address: "0x", symbol: "", decimals: 0n },
  [degen.id]: { address: "0x", symbol: "", decimals: 0n },
  [cyber.id]: { address: "0x", symbol: "", decimals: 0n },
  [cyberTestnet.id]: { address: "0x", symbol: "", decimals: 0n },
  [kaia.id]: { address: "0x", symbol: "", decimals: 0n },
  [ham.id]: { address: "0x", symbol: "", decimals: 0n }
};
class OneInch {
  chainId;
  version;
  constructor(chainId, version) {
    this.chainId = chainId;
    this.version = version;
  }
  async getUsdRate({ tokenAddress, tokenDecimals }) {
    if (!isAddress(STABLE_COINS[this.chainId].address) || STABLE_COINS[this.chainId].address === "0x") {
      return null;
    }
    const isSameToken = isAddress(tokenAddress) && getAddress(tokenAddress) === getAddress(STABLE_COINS[this.chainId].address);
    if (isSameToken) return { rate: 1, stableCoin: STABLE_COINS[this.chainId] };
    const rate = await oneInchContract.network(this.chainId, this.version).read({
      functionName: "getRate",
      args: [tokenAddress, STABLE_COINS[this.chainId].address, false]
    });
    const stableCoinDecimals = STABLE_COINS[this.chainId].decimals;
    const rateToNumber = toNumber(rate, Number(18n + stableCoinDecimals) - tokenDecimals);
    return { rate: rateToNumber, stableCoin: STABLE_COINS[this.chainId] };
  }
}

function isFalse(value) {
  return typeof value === "undefined" || value === void 0 || value === null;
}

class Token {
  tokenAddress;
  clientHelper;
  airdropHelper;
  oneinch;
  ipfsHelper;
  symbol;
  tokenType;
  chain;
  version;
  chainId;
  constructor(params) {
    const { symbolOrAddress, chainId, tokenType, version } = params;
    if (isAddress(symbolOrAddress)) {
      this.tokenAddress = symbolOrAddress;
    } else {
      this.tokenAddress = computeCreate2Address(chainId, tokenType, symbolOrAddress, version);
      this.symbol = symbolOrAddress;
    }
    this.chain = getChain(chainId);
    this.chainId = chainId;
    this.version = version;
    this.tokenType = tokenType;
    this.clientHelper = new Client();
    this.ipfsHelper = new Ipfs();
    this.oneinch = new OneInch(chainId === bscTestnet.id ? bsc.id : chainId, version);
    this.airdropHelper = new Airdrop(this.chainId, version);
  }
  async getConnectedWalletAddress() {
    const connectedAddress = await this.clientHelper.account();
    if (!connectedAddress) throw new WalletNotConnectedError();
    return connectedAddress;
  }
  async tokenToApprove(tradeType) {
    return tradeType === "buy" ? await this.getReserveTokenAddress() : this.getTokenAddress();
  }
  async bondContractApproved(params) {
    const { tradeType, walletAddress, isZap } = params;
    const tokenToApprove = await this.tokenToApprove(tradeType);
    if (this.tokenType === "ERC1155" && tradeType === "sell") {
      return erc1155Contract.network(this.chainId, this.version).read({
        tokenAddress: this.tokenAddress,
        functionName: "isApprovedForAll",
        args: [walletAddress, getMintClubContractAddress(isZap ? "ZAP" : "BOND", this.chainId, this.version)]
      });
    }
    let amountToSpend = maxUint256;
    if ("amountToSpend" in params && params?.amountToSpend !== void 0) {
      amountToSpend = params.amountToSpend;
    }
    const allowance = await erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: tokenToApprove,
      functionName: "allowance",
      args: [walletAddress, getMintClubContractAddress(isZap ? "ZAP" : "BOND", this.chainId, this.version)]
    });
    return allowance >= amountToSpend;
  }
  async contractIsApproved(params, contract) {
    const connectedAddress = await this.getConnectedWalletAddress();
    if (this.tokenType === "ERC1155") {
      return erc1155Contract.network(this.chainId, this.version).read({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: "isApprovedForAll",
        args: [connectedAddress, getMintClubContractAddress(contract, this.chainId, this.version)]
      });
    } else {
      let amountToSpend = maxUint256;
      if ("allowanceAmount" in params && params?.allowanceAmount !== void 0) {
        amountToSpend = params.allowanceAmount;
      }
      const allowance = await erc20Contract.network(this.chainId, this.version).read({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: "allowance",
        args: [connectedAddress, getMintClubContractAddress(contract, this.chainId, this.version)]
      });
      return allowance >= amountToSpend;
    }
  }
  approveContract(params, contract) {
    if (this.tokenType === "ERC1155") {
      return erc1155Contract.network(this.chainId, this.version).write({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: "setApprovalForAll",
        args: [getMintClubContractAddress(contract, this.chainId, this.version), true]
      });
    } else {
      let amountToSpend = maxUint256;
      if ("allowanceAmount" in params && params?.allowanceAmount !== void 0) {
        amountToSpend = params.allowanceAmount;
      }
      return erc20Contract.network(this.chainId, this.version).write({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: "approve",
        args: [getMintClubContractAddress(contract, this.chainId, this.version), amountToSpend]
      });
    }
  }
  async approveBond(params) {
    const { isZap, tradeType, onAllowanceSignatureRequest, onAllowanceSigned, onAllowanceSuccess } = params;
    const tokenToCheck = await this.tokenToApprove(tradeType);
    if (this.tokenType === "ERC1155" && tradeType === "sell") {
      return erc1155Contract.network(this.chainId, this.version).write({
        ...params,
        onSignatureRequest: onAllowanceSignatureRequest,
        onSigned: onAllowanceSigned,
        onSuccess: onAllowanceSuccess,
        tokenAddress: this.tokenAddress,
        functionName: "setApprovalForAll",
        args: [getMintClubContractAddress(isZap ? "ZAP" : "BOND", this.chainId, this.version), true]
      });
    } else {
      let amountToSpend = maxUint256;
      if ("allowanceAmount" in params && params?.allowanceAmount !== void 0) {
        amountToSpend = params.allowanceAmount;
      }
      return erc20Contract.network(this.chainId, this.version).write({
        ...params,
        onSignatureRequest: onAllowanceSignatureRequest,
        onSigned: onAllowanceSigned,
        onSuccess: onAllowanceSuccess,
        tokenAddress: tokenToCheck,
        functionName: "approve",
        args: [getMintClubContractAddress(isZap ? "ZAP" : "BOND", this.chainId, this.version), amountToSpend]
      });
    }
  }
  getCreationFee() {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "creationFee"
    });
  }
  async zapAvailable() {
    const { reserveToken } = await this.getTokenBond();
    const reserveIsWrapped = WRAPPED_NATIVE_TOKENS[this.chainId].tokenAddress === reserveToken;
    return reserveIsWrapped;
  }
  exists() {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "exists",
      args: [this.tokenAddress]
    });
  }
  async getReserveToken() {
    const { reserveToken } = await this.getTokenBond();
    const [name, symbol, decimals] = await Promise.all([
      erc20Contract.network(this.chainId, this.version).read({ tokenAddress: reserveToken, functionName: "name" }),
      erc20Contract.network(this.chainId, this.version).read({ tokenAddress: reserveToken, functionName: "symbol" }),
      erc20Contract.network(this.chainId, this.version).read({ tokenAddress: reserveToken, functionName: "decimals" })
    ]);
    return {
      address: reserveToken,
      name,
      symbol,
      decimals
    };
  }
  async getReserveTokenAddress() {
    const { reserveToken } = await this.getTokenBond();
    return reserveToken;
  }
  getTokenAddress() {
    return this.tokenAddress;
  }
  async getUsdRate(amount = 1) {
    const rateData = await this.oneinch.getUsdRate({
      tokenAddress: this.tokenAddress,
      tokenDecimals: this.tokenType === "ERC20" ? 18 : 0
    });
    if (isFalse(rateData)) return { usdRate: null, stableCoin: null };
    const { rate, stableCoin } = rateData;
    return { usdRate: rate * amount, stableCoin };
  }
  getDetail() {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "getDetail",
      args: [this.tokenAddress]
    });
  }
  async getTokenBond() {
    const [creator, mintRoyalty, burnRoyalty, createdAt, reserveToken, reserveBalance] = await bondContract.network(this.chainId, this.version).read({
      functionName: "tokenBond",
      args: [this.tokenAddress]
    });
    return {
      creator,
      mintRoyalty,
      burnRoyalty,
      createdAt,
      reserveToken,
      reserveBalance
    };
  }
  getSteps() {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "getSteps",
      args: [this.tokenAddress]
    });
  }
  getMaxSupply() {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "maxSupply",
      args: [this.tokenAddress]
    });
  }
  getPriceForNextMint() {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "priceForNextMint",
      args: [this.tokenAddress]
    });
  }
  getSellEstimation(amount) {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "getRefundForTokens",
      args: [this.tokenAddress, amount]
    });
  }
  getBuyEstimation(amount) {
    return bondContract.network(this.chainId, this.version).read({
      functionName: "getReserveForToken",
      args: [this.tokenAddress, amount]
    });
  }
  async checkAndPrepareCreateArgs(params) {
    if (!this.symbol) {
      throw new SymbolNotDefinedError();
    }
    const exists = await this.exists();
    if (exists) {
      throw new TokenAlreadyExistsError();
    }
    const args = generateCreateArgs({ ...params, tokenType: this.tokenType, symbol: this.symbol });
    const fee = await this.getCreationFee();
    return { args, fee };
  }
  async buy(params) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();
      const [estimatedOutcome] = await this.getBuyEstimation(amount);
      const maxReserveAmount = estimatedOutcome + estimatedOutcome * BigInt(slippage * 100) / 10000n;
      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: maxReserveAmount,
        tradeType: "buy"
      });
      if (!bondApproved) {
        return this.approveBond({
          ...params,
          tradeType: "buy",
          amountToSpend: maxReserveAmount
        });
      }
      return bondContract.network(this.chainId, this.version).write({
        ...params,
        functionName: "mint",
        args: [this.tokenAddress, amount, maxReserveAmount, recipient || connectedAddress]
      });
    } catch (e) {
      onError?.(e);
    }
  }
  async sell(params) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();
      const [estimatedOutcome] = await this.getSellEstimation(amount);
      const minReserveAmount = estimatedOutcome - estimatedOutcome * BigInt(slippage * 100) / 10000n;
      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: params?.allowanceAmount ?? amount,
        tradeType: "sell"
      });
      if (!bondApproved) {
        return this.approveBond({
          ...params,
          tradeType: "sell",
          amountToSpend: amount
        });
      }
      return bondContract.network(this.chainId, this.version).write({
        ...params,
        functionName: "burn",
        args: [this.tokenAddress, amount, minReserveAmount, recipient || connectedAddress]
      });
    } catch (e) {
      onError?.(e);
    }
  }
  async buyWithZap(params) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();
      const [estimatedOutcome] = await this.getBuyEstimation(amount);
      const maxReserveAmount = estimatedOutcome + estimatedOutcome * BigInt(slippage * 100) / 10000n;
      return zapContract.network(this.chainId, this.version).write({
        ...params,
        functionName: "mintWithEth",
        args: [this.tokenAddress, amount, recipient || connectedAddress],
        value: maxReserveAmount
      });
    } catch (e) {
      onError?.(e);
    }
  }
  async sellWithZap(params) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();
      const [estimatedOutcome] = await this.getBuyEstimation(amount);
      const minReserveAmount = estimatedOutcome - estimatedOutcome * BigInt(slippage * 100) / 10000n;
      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: params?.allowanceAmount ?? amount,
        tradeType: "sell",
        isZap: true
      });
      if (!bondApproved) {
        return this.approveBond({
          ...params,
          tradeType: "sell",
          amountToSpend: amount,
          isZap: true
        });
      }
      return zapContract.network(this.chainId, this.version).write({
        ...params,
        functionName: "burnToEth",
        args: [this.tokenAddress, amount, minReserveAmount, recipient || connectedAddress]
      });
    } catch (e) {
      onError?.(e);
    }
  }
  async transfer(params) {
    const { amount, recipient, onError } = params;
    try {
      if (this.tokenType === "ERC20") {
        return erc20Contract.network(this.chainId, this.version).write({
          ...params,
          tokenAddress: this.getTokenAddress(),
          functionName: "transfer",
          args: [recipient, amount]
        });
      } else {
        const connectedAddress = await this.getConnectedWalletAddress();
        return erc1155Contract.network(this.chainId, this.version).write({
          ...params,
          tokenAddress: this.getTokenAddress(),
          functionName: "safeTransferFrom",
          args: [connectedAddress, recipient, 0n, amount, "0x"]
        });
      }
    } catch (e) {
      onError?.(e);
    }
  }
  async createAirdrop(params) {
    const { title, filebaseApiKey, wallets, amountPerClaim: _amountPerClaim, startTime, endTime } = params;
    if (wallets.some((address) => !isAddress(address))) {
      throw new AirdropContainsInvalidWalletError();
    }
    const isERC20 = this.tokenType === "ERC20";
    const walletCount = wallets.length;
    let decimals = 0;
    if (this.tokenType === "ERC20") {
      decimals = await erc20Contract.network(this.chainId, this.version).read({
        tokenAddress: this.getTokenAddress(),
        functionName: "decimals"
      });
    }
    const amountPerClaim = wei(_amountPerClaim, decimals);
    const totalAmount = BigInt(amountPerClaim) * BigInt(walletCount);
    const approved = await this.contractIsApproved(
      {
        allowanceAmount: totalAmount,
        amountToSpend: totalAmount
      },
      "MERKLE"
    );
    if (!approved) {
      return this.approveContract(
        {
          ...params,
          allowanceAmount: totalAmount,
          amountToSpend: totalAmount
        },
        "MERKLE"
      );
    }
    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true
    });
    const merkleRoot = `0x${tree.getRoot().toString("hex")}`;
    const json = JSON.stringify(wallets, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const ipfsCID = await this.ipfsHelper.add(filebaseApiKey, blob);
    return this.airdropHelper.createAirdrop({
      token: this.tokenAddress,
      isERC20,
      amountPerClaim,
      walletCount,
      startTime: startTime ? Math.floor(startTime.getTime() / 1e3) : 0,
      endTime: Math.floor(endTime.getTime() / 1e3),
      merkleRoot,
      title,
      ipfsCID
    });
  }
}

class ERC1155 extends Token {
  constructor(params) {
    super({
      ...params,
      tokenType: "ERC1155"
    });
  }
  getBalanceOf(walletAddress) {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "balanceOf",
      args: [walletAddress, 0n]
    });
  }
  getBalanceOfBatch(walletAddresses) {
    const ids = Array(walletAddresses.length).fill(0n);
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "balanceOfBatch",
      args: [walletAddresses, ids]
    });
  }
  getBondAddress() {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "bond"
    });
  }
  getContractURI() {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "contractURI"
    });
  }
  getDecimals() {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "decimals"
    });
  }
  getIsApprovedForAll(params) {
    const { owner, spender } = params;
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "isApprovedForAll",
      args: [owner, spender]
    });
  }
  getName() {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "name"
    });
  }
  getSupportsInterface(interfaceId) {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "supportsInterface",
      args: [interfaceId]
    });
  }
  getSymbol() {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "symbol"
    });
  }
  getTotalSupply() {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "totalSupply"
    });
  }
  getMetadataUri() {
    return erc1155Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "uri",
      args: [0n]
    });
  }
  async getImageUri() {
    const jsonHash = await this.getMetadataUri();
    const metadataIpfsUrl = this.ipfsHelper.hashToGatewayUrl(jsonHash);
    const { image } = await fetch(metadataIpfsUrl).then((res) => res.json());
    return image;
  }
  async create(params) {
    const { onError, metadataUrl } = params;
    try {
      const { args, fee } = await this.checkAndPrepareCreateArgs(params);
      if (metadataUrl.startsWith("ipfs://")) {
        this.ipfsHelper.validateIpfsHash(metadataUrl);
      }
      return bondContract.network(this.chainId, this.version).write({
        ...params,
        functionName: "createMultiToken",
        args: [Object.assign(args.tokenParams, { uri: metadataUrl }), args.bondParams],
        value: fee
      });
    } catch (e) {
      console.error(e);
      onError?.(e);
    }
  }
  async approve(params) {
    const { spender, approved } = params;
    return erc1155Contract.network(this.chainId, this.version).write({
      ...params,
      tokenAddress: this.getTokenAddress(),
      functionName: "setApprovalForAll",
      args: [spender, approved]
    });
  }
}

class ERC20 extends Token {
  constructor(params) {
    super({
      ...params,
      tokenType: "ERC20"
    });
  }
  getAllowance(params) {
    const { owner, spender } = params;
    return erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "allowance",
      args: [owner, spender]
    });
  }
  getBalanceOf(walletAddress) {
    return erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "balanceOf",
      args: [walletAddress]
    });
  }
  getBondAddress() {
    return erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "bond"
    });
  }
  getDecimals() {
    return erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "decimals"
    });
  }
  getName() {
    return erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "name"
    });
  }
  getSymbol() {
    return erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "symbol"
    });
  }
  getTotalSupply() {
    return erc20Contract.network(this.chainId, this.version).read({
      tokenAddress: this.getTokenAddress(),
      functionName: "totalSupply"
    });
  }
  async approve(params) {
    const { spender, amount } = params;
    return erc20Contract.network(this.chainId, this.version).write({
      ...params,
      tokenAddress: this.getTokenAddress(),
      functionName: "approve",
      args: [spender, amount]
    });
  }
  async create(params) {
    try {
      const { args, fee } = await this.checkAndPrepareCreateArgs(params);
      return bondContract.network(this.chainId, this.version).write({
        ...params,
        functionName: "createToken",
        args: [args.tokenParams, args.bondParams],
        value: fee
      });
    } catch (e) {
      params.onError?.(e);
    }
  }
}

class Lockup {
  chainId;
  version;
  constructor(chainId, version) {
    this.chainId = chainId;
    this.version = version;
  }
  getTotalLockUpCount() {
    return lockupContract.network(this.chainId, this.version).read({
      functionName: "lockUpCount"
    });
  }
  getLockUpIdsByReceiver(params) {
    const { receiver, start = 0, end = 1e3 } = params;
    return lockupContract.network(this.chainId, this.version).read({
      functionName: "getLockUpIdsByReceiver",
      args: [receiver, BigInt(start), BigInt(end)]
    });
  }
  getLockUpIdsByToken(params) {
    const { token, start = 0, end = 1e3 } = params;
    return lockupContract.network(this.chainId, this.version).read({
      functionName: "getLockUpIdsByToken",
      args: [token, BigInt(start), BigInt(end)]
    });
  }
  async getLockUpById(lockUpId) {
    const [token, isERC20, unlockTime, unlocked, amount, receiver, title] = await lockupContract.network(this.chainId, this.version).read({
      functionName: "lockUps",
      args: [BigInt(lockUpId)]
    });
    return {
      token,
      isERC20,
      unlockTime,
      unlocked,
      amount,
      receiver,
      title
    };
  }
  createLockUp(params) {
    const { token, isERC20, amount, unlockTime, receiver, title } = params;
    return lockupContract.network(this.chainId, this.version).write({
      ...params,
      functionName: "createLockUp",
      args: [token, isERC20, amount, unlockTime, receiver, title]
    });
  }
  unlock(params) {
    const { lockUpId } = params;
    return lockupContract.network(this.chainId, this.version).write({
      ...params,
      functionName: "unlock",
      args: [BigInt(lockUpId)]
    });
  }
}

class Utils {
  generateMerkleRoot(wallets) {
    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true
    });
    const merkleRoot = `0x${tree.getRoot().toString("hex")}`;
    return merkleRoot;
  }
}

class MintClubSDK {
  // chain agnostic
  wallet = new Client();
  ipfs = new Ipfs();
  utils = new Utils();
  network(id, version = "0.1.0") {
    let chainId;
    if (typeof id === "string") {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }
    return this.withClientHelper(this.wallet, chainId, version);
  }
  withClientHelper(clientHelper, chainId, version) {
    return Object.assign(clientHelper, {
      getPublicClient() {
        return clientHelper._getPublicClient(chainId);
      },
      token: (symbolOrAddress) => {
        return new ERC20({
          symbolOrAddress,
          chainId,
          version
        });
      },
      nft: (symbolOrAddress) => {
        return new ERC1155({
          symbolOrAddress,
          chainId,
          version
        });
      },
      airdrop: new Airdrop(chainId, version),
      lockup: new Lockup(chainId, version),
      bond: new Bond(chainId, version)
    });
  }
  withPublicClient(publicClient) {
    const chainId = publicClient.chain?.id;
    if (chainId === void 0) throw new InvalidClientError();
    this.wallet = this.wallet.withPublicClient(publicClient);
    return this;
  }
  withWalletClient(walletClient) {
    const chainId = walletClient.chain?.id;
    if (chainId === void 0) throw new InvalidClientError();
    if (walletClient.chain?.id === void 0) throw new InvalidClientError();
    this.wallet = this.wallet.withWalletClient(walletClient);
    return this;
  }
}

function calculateRoyalty(amount, rate) {
  return amount * BigInt(rate) / 10000n;
}
function getCurrentStepIndex(currentSupply, bondSteps) {
  const stepIndex = bondSteps.findIndex((step) => currentSupply < step.rangeTo);
  return stepIndex === -1 ? bondSteps.length - 1 : stepIndex;
}
function calculateAdjustments(tokens, bondSteps, currentSupply, multiFactor, royaltyRate, slippage, isMinting) {
  let totalAmount = 0n;
  let tokensProcessed = tokens;
  let stepIndex = getCurrentStepIndex(currentSupply, bondSteps);
  let tempCurrentSupply = currentSupply;
  while (tokensProcessed > 0n && stepIndex < bondSteps.length && stepIndex >= 0) {
    const step = bondSteps[stepIndex];
    const supplyDelta = isMinting ? step.rangeTo - tempCurrentSupply : tempCurrentSupply - (stepIndex > 0 ? bondSteps[stepIndex - 1].rangeTo : 0n);
    const tokensToProcess = tokensProcessed > supplyDelta ? supplyDelta : tokensProcessed;
    const factor = isMinting ? multiFactor - 1n : 0n;
    totalAmount += (tokensToProcess * step.price + factor) / multiFactor;
    tokensProcessed -= tokensToProcess;
    tempCurrentSupply += isMinting ? tokensToProcess : -tokensToProcess;
    stepIndex += isMinting ? 1 : -1;
  }
  const royalty = calculateRoyalty(totalAmount, royaltyRate);
  let adjustedAmount = totalAmount + (isMinting ? royalty : -royalty);
  const slippageAmount = calculateRoyalty(adjustedAmount, slippage);
  adjustedAmount += isMinting ? slippageAmount : -slippageAmount;
  return { adjustedAmount, royalty };
}
function binarySearch(params) {
  const { reserveAmount, bondSteps, currentSupply, maxSupply, multiFactor, royaltyRate, slippage, isMinting } = params;
  let low = 0n;
  let high = isMinting ? maxSupply - currentSupply : currentSupply;
  let mid = 0n;
  let lastClosest = 0n;
  const MAX_ITERATIONS = 1e3;
  let iterations = 0;
  while (low <= high && iterations++ < MAX_ITERATIONS) {
    mid = (high + low) / 2n;
    const { adjustedAmount } = calculateAdjustments(
      mid,
      bondSteps,
      currentSupply,
      multiFactor,
      royaltyRate,
      slippage,
      isMinting
    );
    if (adjustedAmount === reserveAmount) return mid;
    else if (adjustedAmount < reserveAmount) {
      low = mid + 1n;
      lastClosest = mid;
    } else high = mid - 1n;
  }
  return lastClosest;
}
function binaryReverseMint(params) {
  return binarySearch({
    ...params,
    royaltyRate: params.mintRoyalty,
    isMinting: true
  });
}
function binaryReverseBurn(params) {
  return binarySearch({
    ...params,
    maxSupply: params.currentSupply,
    royaltyRate: params.burnRoyalty,
    isMinting: false
  });
}

const abis = {
  BOND: BOND_ABI,
  ERC20: ERC20_ABI,
  ERC1155: ERC1155_ABI,
  LOCKER: LOCKER_ABI,
  MERKLE: MERKLE_ABI,
  ONEINCH: ONEINCH_ABI,
  ZAP: ZAP_ABI
};
const whitelistedTokens = TOKENS;
const errorMessages = CONTRACT_ERROR_MESSAGES;
const supportedChains = [
  "ethereum",
  "sepolia",
  "bnbchain",
  "polygon",
  "arbitrum",
  "optimism",
  "avalanche",
  "base",
  "basesepolia",
  "kaia",
  "degen",
  "ham",
  "cyber",
  "cybertestnet"
];
const supportedChainsMap = {
  ethereum: mainnet.id,
  sepolia: sepolia.id,
  basesepolia: baseSepolia.id,
  bnbchain: bsc.id,
  bnbchaintestnet: bscTestnet.id,
  polygon: polygon.id,
  arbitrum: arbitrum.id,
  kaia: kaia.id,
  degen: degen.id,
  optimism: optimism.id,
  optimismsepolia: optimismSepolia.id,
  avalanche: avalanche.id,
  base: base.id,
  blast: blast.id,
  blastsepolia: blastSepolia.id,
  avalanchefuji: avalancheFuji.id,
  cyber: cyber.id,
  ham: ham.id,
  cybertestnet: cyberTestnet.id
};
const mintclub = new MintClubSDK();

export { BOND_ABI, BOND_ERROR_MESSAGES, CHAINS, CHAIN_MAP, CHAIN_NAME_ID_MAP, COINGECKO_NETWORK_IDS, CONTRACT_ERROR_MESSAGES, CurveEnum, DEFAULT_RANK_OPTIONS, ERC1155_ABI, ERC1155_ERROR_MESSAGES, ERC20_ABI, ERC20_ERROR_MESSAGES, LOCKER_ABI, LOCKER_ERROR_MESSAGES, MERKLE_ABI, MERKLE_ERROR_MESSAGES, ONEINCH_ABI, RPCS, TOKENS, WRAPPED_NATIVE_TOKENS, ZAP_ABI, ZAP_ERROR_MESSAGES, abis, airdropContract, applyDecimals, binaryReverseBurn, binaryReverseMint, bondContract, calculateArea, calculateRoyalty, chainIdToString, chainIdToViemChain, chainRPCFallbacks, chainStringToId, commify, computeCreate2Address, countDecimals, countLeadingZeros, createRandomAddress, erc1155Contract, erc20Contract, errorMessages, formatGraphPoint, generateCreateArgs, generateSteps, generateTableData, getChain, getMintClubContractAddress, getSubscriptCharacter, getSubscriptNumber, getValueAfterLeadingZeros, graphTypes, handleScientificNotation, lockupContract, mintclub, oneInchContract, precisionRound, shortenNumber, supportedChains, supportedChainsMap, toFixed, toNumber, truncateString, uncommify, wei$1 as wei, whitelistedTokens, zapContract };
