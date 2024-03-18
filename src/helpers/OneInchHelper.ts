import { getAddress, isAddress } from 'viem';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  blast,
  blastSepolia,
  bsc,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'viem/chains';
import { oneInchContract } from '../contracts';
import { SdkSupportedChainIds, toNumber } from '../exports';

export type USDValueOptions = {
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
};

export const STABLE_COINS: Record<SdkSupportedChainIds, { address: `0x${string}`; decimals: bigint }> = {
  [mainnet.id]: {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6n,
  }, // USDT
  [optimism.id]: {
    address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    decimals: 6n,
  }, // USDT
  [arbitrum.id]: {
    address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    decimals: 6n,
  }, // USDT
  [avalanche.id]: {
    address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
    decimals: 6n,
  }, // USDT
  [polygon.id]: {
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    decimals: 6n,
  }, // USDT
  [bsc.id]: {
    address: '0x55d398326f99059ff775485246999027b3197955',
    decimals: 18n,
  }, // USDT
  [base.id]: {
    address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    decimals: 6n,
  }, // USDBC
  [sepolia.id]: { address: '0x', decimals: 0n },
  [blast.id]: { address: '0x', decimals: 0n },
  [blastSepolia.id]: { address: '0x', decimals: 0n },
  [avalancheFuji.id]: { address: '0x', decimals: 0n },
};

export class OneInch {
  private chainId: SdkSupportedChainIds;

  constructor(chainId: SdkSupportedChainIds) {
    this.chainId = chainId;
  }

  public async getUsdRate({ tokenAddress, tokenDecimals }: USDValueOptions) {
    if (!isAddress(STABLE_COINS[this.chainId].address) || STABLE_COINS[this.chainId].address === '0x') {
      return null;
    }

    const isSameToken =
      isAddress(tokenAddress) && getAddress(tokenAddress) === getAddress(STABLE_COINS[this.chainId].address);

    if (isSameToken) return 1;

    const rate = await oneInchContract.network(this.chainId).read({
      functionName: 'getRate',
      args: [tokenAddress, STABLE_COINS[this.chainId].address, false],
    });

    const stableCoinDecimals = STABLE_COINS[this.chainId].decimals;
    const rateToNumber = toNumber(rate, Number(18n + stableCoinDecimals) - tokenDecimals);
    return rateToNumber;
  }
}