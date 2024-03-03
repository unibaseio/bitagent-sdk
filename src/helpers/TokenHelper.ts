import { isAddress, maxUint256 } from 'viem';
import { SdkSupportedChainIds, TokenType, getMintClubContractAddress } from '../constants/contracts';
import { bondContract, erc1155Contract, erc20Contract } from '../contracts';
import {
  BondInsufficientAllowanceError,
  SymbolNotDefinedError,
  TokenAlreadyExistsError,
  WalletNotConnectedError,
} from '../errors/sdk.errors';
import { WRAPPED_NATIVE_TOKENS } from '../exports';
import {
  ApproveBondParams,
  BondApprovedParams,
  BuySellCommonParams,
  CreateERC1155TokenParams,
  CreateERC20TokenParams,
  TransferCommonParams,
} from '../types/bond.types';
import { TokenHelperConstructorParams } from '../types/token.types';
import { CommonWriteParams, TradeType } from '../types/transactions.types';
import { computeCreate2Address } from '../utils/addresses';
import { generateCreateArgs } from '../utils/bond';
import { ClientHelper } from './ClientHelper';

export class TokenHelper<T extends TokenType> {
  private tokenAddress: `0x${string}`;
  protected clientHelper: ClientHelper;
  protected symbol?: string;
  protected tokenType: T;
  protected chainId: SdkSupportedChainIds;

  constructor(params: TokenHelperConstructorParams) {
    const { symbolOrAddress, chainId, tokenType } = params;

    if (isAddress(symbolOrAddress)) {
      this.tokenAddress = symbolOrAddress;
    } else {
      this.tokenAddress = computeCreate2Address(chainId, tokenType, symbolOrAddress);
      this.symbol = symbolOrAddress;
    }

    this.chainId = chainId;
    this.tokenType = tokenType as T;
    this.clientHelper = new ClientHelper();
  }

  protected async getConnectedWalletAddress() {
    const connectedAddress = await this.clientHelper.getConnectedAddress();
    if (!connectedAddress) throw new WalletNotConnectedError();
    return connectedAddress;
  }

  protected async tokenToApprove(tradeType: TradeType) {
    return tradeType === 'buy' ? await this.getReserveTokenAddress() : this.getTokenAddress();
  }

  protected async bondContractApproved(params: BondApprovedParams<T>) {
    const { tradeType, walletAddress } = params;
    const tokenToApprove = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155') {
      return erc1155Contract.network(this.chainId).read({
        tokenAddress: tokenToApprove,
        functionName: 'isApprovedForAll',
        args: [walletAddress, getMintClubContractAddress('BOND', this.chainId)],
      });
    }

    let amountToSpend = maxUint256;
    if ('amountToSpend' in params && params?.amountToSpend !== undefined) {
      amountToSpend = params.amountToSpend;
    }

    const allowance = await erc20Contract.network(this.chainId).read({
      tokenAddress: tokenToApprove,
      functionName: 'allowance',
      args: [walletAddress, getMintClubContractAddress('BOND', this.chainId)],
    });

    return allowance >= amountToSpend;
  }

  public async approve(params: ApproveBondParams<T>) {
    const { tradeType } = params;
    const tokenToCheck = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155') {
      return erc1155Contract.network(this.chainId).write({
        ...params,
        tokenAddress: tokenToCheck,
        functionName: 'setApprovalForAll',
        args: [getMintClubContractAddress('BOND', this.chainId), true],
      });
    } else {
      let amountToSpend = maxUint256;

      if ('amountToSpend' in params && params?.amountToSpend !== undefined) {
        amountToSpend = params.amountToSpend;
      }

      return erc20Contract.network(this.chainId).write({
        ...params,
        tokenAddress: tokenToCheck,
        functionName: 'approve',
        args: [getMintClubContractAddress('BOND', this.chainId), amountToSpend],
      });
    }
  }

  protected getCreationFee() {
    return bondContract.network(this.chainId).read({
      functionName: 'creationFee',
    });
  }

  protected async zapAvailable() {
    const { reserveToken } = await this.getTokenBond();
    const reserveIsWrapped = WRAPPED_NATIVE_TOKENS[this.chainId].tokenAddress === reserveToken;
    return reserveIsWrapped;
  }

  public exists() {
    return bondContract.network(this.chainId).read({
      functionName: 'exists',
      args: [this.tokenAddress],
    });
  }

  public async getReserveTokenAddress() {
    const { reserveToken } = await this.getTokenBond();
    return reserveToken;
  }

  public getTokenAddress() {
    return this.tokenAddress;
  }

  public getDetail() {
    return bondContract.network(this.chainId).read({
      functionName: 'getDetail',
      args: [this.tokenAddress],
    });
  }

  public async getTokenBond() {
    const [creator, mintRoyalty, burnRoyalty, createdAt, reserveToken, reserveBalance] = await bondContract
      .network(this.chainId)
      .read({
        functionName: 'tokenBond',
        args: [this.tokenAddress],
      });

    return {
      creator,
      mintRoyalty,
      burnRoyalty,
      createdAt,
      reserveToken,
      reserveBalance,
    };
  }

  public getSteps() {
    return bondContract.network(this.chainId).read({
      functionName: 'getSteps',
      args: [this.tokenAddress],
    });
  }

  public getMaxSupply() {
    return bondContract.network(this.chainId).read({
      functionName: 'maxSupply',
      args: [this.tokenAddress],
    });
  }

  public getPriceForNextMint() {
    return bondContract.network(this.chainId).read({
      functionName: 'priceForNextMint',
      args: [this.tokenAddress],
    });
  }

  public getSellEstimation(amount: bigint) {
    return bondContract.network(this.chainId).read({
      functionName: 'getRefundForTokens',
      args: [this.tokenAddress, amount],
    });
  }

  public getBuyEstimation(amount: bigint) {
    return bondContract.network(this.chainId).read({
      functionName: 'getReserveForToken',
      args: [this.tokenAddress, amount],
    });
  }

  protected async checkAndPrepareCreateArgs(
    params: (CreateERC20TokenParams | CreateERC1155TokenParams) & Omit<CommonWriteParams, 'value'>,
  ) {
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

  public async buy(params: BuySellCommonParams) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();

      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: amount,
        tradeType: 'buy',
      });

      if (!bondApproved) {
        throw new BondInsufficientAllowanceError();
      }

      const [estimatedOutcome] = await this.getBuyEstimation(amount);
      const maxReserveAmount = estimatedOutcome + (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

      return bondContract.network(this.chainId).write({
        ...params,
        functionName: 'mint',
        args: [this.tokenAddress, amount, maxReserveAmount, recipient || connectedAddress],
      });
    } catch (e) {
      onError?.(e);
    }
  }

  public async sell(params: BuySellCommonParams) {
    const { amount, slippage = 0, recipient } = params;

    const connectedAddress = await this.getConnectedWalletAddress();

    const bondApproved = await this.bondContractApproved({
      walletAddress: connectedAddress,
      amountToSpend: amount,
      tradeType: 'sell',
    } as BondApprovedParams<T>);

    if (!bondApproved) {
      throw new BondInsufficientAllowanceError();
    }

    const [estimatedOutcome] = await this.getSellEstimation(amount);
    const maxReserveAmount = estimatedOutcome - (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

    return bondContract.network(this.chainId).write({
      ...params,
      functionName: 'burn',
      args: [this.tokenAddress, amount, maxReserveAmount, recipient || connectedAddress],
    });
  }

  public async transfer(params: TransferCommonParams) {
    const { amount, recipient } = params;

    if (this.tokenType === 'ERC20') {
      return erc20Contract.network(this.chainId).write({
        ...params,
        tokenAddress: this.getTokenAddress(),
        functionName: 'transfer',
        args: [recipient, amount],
      });
    } else {
      const connectedAddress = await this.getConnectedWalletAddress();
      return erc1155Contract.network(this.chainId).write({
        ...params,
        tokenAddress: this.getTokenAddress(),
        functionName: 'safeTransferFrom',
        args: [connectedAddress, recipient, 0n, amount, '0x'],
      });
    }
  }
}
