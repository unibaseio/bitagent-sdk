export const BOND_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenImplementation',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'multiTokenImplementation',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'protocolBeneficiary_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'creationFee_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxSteps',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'uniswapV3Factory_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'positionManager_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'rewardManager_',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ERC1167FailedCreateClone',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_BOND__InvalidPaginationParameters',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__CreationFeeTransactionFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__ExceedMaxSupply',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__ExceedTotalSupply',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'MCV2_Bond__InvalidConstructorParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__InvalidCreationFee',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__InvalidCreatorAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__InvalidCurrentSupply',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'MCV2_Bond__InvalidGraduateReserveAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'MCV2_Bond__InvalidReserveToken',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'MCV2_Bond__InvalidStepParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__InvalidTokenAmount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'MCV2_Bond__InvalidTokenCreationParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__PermissionDenied',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__SlippageLimitExceeded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__SqrtPriceX96CalculationInvalidInput',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__SqrtPriceX96CalculationOverflow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__TokenNotFound',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Bond__TokenSymbolAlreadyExists',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Royalty__InvalidParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MCV2_Royalty__NothingToClaim',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'bits',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'SafeCastOverflowedUintDowncast',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'BondCreatorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountBurned',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256',
      },
    ],
    name: 'Burn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'CreationFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountMinted',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserveAmount',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
    ],
    name: 'MultiTokenCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'protocolBeneficiary',
        type: 'address',
      },
    ],
    name: 'ProtocolBeneficiaryUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RoyaltyClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ratio',
        type: 'uint256',
      },
    ],
    name: 'RoyaltyRangeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'agenthash',
        type: 'bytes32',
      },
    ],
    name: 'TokenCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserveTokenAmount',
        type: 'uint256',
      },
    ],
    name: 'TokenGraduated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BURN_ADDRESS',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokensToBurn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minRefund',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'burn',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
    ],
    name: 'burnRoyalties',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveTokenBalance',
        type: 'uint256',
      },
    ],
    name: 'calculateSqrtPriceX96',
    outputs: [
      {
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
    ],
    name: 'claimRoyalties',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
        ],
        internalType: 'struct MCV2_Bond.MultiTokenParams',
        name: 'tp',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'mintRoyalty',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'burnRoyalty',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'reserveToken',
            type: 'address',
          },
          {
            internalType: 'uint128',
            name: 'maxSupply',
            type: 'uint128',
          },
          {
            internalType: 'uint128[]',
            name: 'stepRanges',
            type: 'uint128[]',
          },
          {
            internalType: 'uint128[]',
            name: 'stepPrices',
            type: 'uint128[]',
          },
        ],
        internalType: 'struct MCV2_Bond.BondParams',
        name: 'bp',
        type: 'tuple',
      },
    ],
    name: 'createMultiToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'bytes32',
            name: 'agentHash',
            type: 'bytes32',
          },
        ],
        internalType: 'struct MCV2_Bond.TokenParams',
        name: 'tp',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'mintRoyalty',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'burnRoyalty',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'reserveToken',
            type: 'address',
          },
          {
            internalType: 'uint128',
            name: 'maxSupply',
            type: 'uint128',
          },
          {
            internalType: 'uint128[]',
            name: 'stepRanges',
            type: 'uint128[]',
          },
          {
            internalType: 'uint128[]',
            name: 'stepPrices',
            type: 'uint128[]',
          },
        ],
        internalType: 'struct MCV2_Bond.BondParams',
        name: 'bp',
        type: 'tuple',
      },
    ],
    name: 'createToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'creationFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'exists',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getDetail',
    outputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'mintRoyalty',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'burnRoyalty',
            type: 'uint16',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'creator',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint8',
                name: 'decimals',
                type: 'uint8',
              },
              {
                internalType: 'string',
                name: 'symbol',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'uint40',
                name: 'createdAt',
                type: 'uint40',
              },
              {
                internalType: 'uint128',
                name: 'currentSupply',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'maxSupply',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'priceForNextMint',
                type: 'uint128',
              },
              {
                internalType: 'address',
                name: 'reserveToken',
                type: 'address',
              },
              {
                internalType: 'uint8',
                name: 'reserveDecimals',
                type: 'uint8',
              },
              {
                internalType: 'string',
                name: 'reserveSymbol',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'reserveName',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'reserveBalance',
                type: 'uint256',
              },
            ],
            internalType: 'struct MCV2_Bond.BondInfo',
            name: 'info',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint128',
                name: 'rangeTo',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'price',
                type: 'uint128',
              },
            ],
            internalType: 'struct MCV2_Bond.BondStep[]',
            name: 'steps',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct MCV2_Bond.BondDetail',
        name: 'detail',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stop',
        type: 'uint256',
      },
    ],
    name: 'getList',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'uint40',
            name: 'createdAt',
            type: 'uint40',
          },
          {
            internalType: 'uint128',
            name: 'currentSupply',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'maxSupply',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'priceForNextMint',
            type: 'uint128',
          },
          {
            internalType: 'address',
            name: 'reserveToken',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'reserveDecimals',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'reserveSymbol',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'reserveName',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'reserveBalance',
            type: 'uint256',
          },
        ],
        internalType: 'struct MCV2_Bond.BondInfo[]',
        name: 'info',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokensToBurn',
        type: 'uint256',
      },
    ],
    name: 'getRefundForTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'royalty',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokensToMint',
        type: 'uint256',
      },
    ],
    name: 'getReserveForToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'reserveAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'royalty',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
    ],
    name: 'getRoyaltyInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getSteps',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'rangeTo',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'price',
            type: 'uint128',
          },
        ],
        internalType: 'struct MCV2_Bond.BondStep[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stop',
        type: 'uint256',
      },
    ],
    name: 'getTokensByCreator',
    outputs: [
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stop',
        type: 'uint256',
      },
    ],
    name: 'getTokensByReserveToken',
    outputs: [
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxRoyaltyRange',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'maxSupply',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokensToMint',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxReserveAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'positionManager',
    outputs: [
      {
        internalType: 'contract INonfungiblePositionManager',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'priceForNextMint',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'protocolBeneficiary',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'tokenBond',
    outputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'mintRoyalty',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'burnRoyalty',
        type: 'uint16',
      },
      {
        internalType: 'uint40',
        name: 'createdAt',
        type: 'uint40',
      },
      {
        internalType: 'address',
        name: 'reserveToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'reserveBalance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tokens',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uniswapV3Factory',
    outputs: [
      {
        internalType: 'contract IUniswapV3Factory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'updateBondCreator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'updateCreationFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'maxSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'graduateMcap',
            type: 'uint256',
          },
          {
            internalType: 'int24',
            name: 'poolTickSpacing',
            type: 'int24',
          },
          {
            internalType: 'uint24',
            name: 'poolFee',
            type: 'uint24',
          },
        ],
        internalType: 'struct MCV2_Bond.GraduationSettings',
        name: 'newSettings_',
        type: 'tuple',
      },
    ],
    name: 'updateGraduationSettings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'ratio',
        type: 'uint256',
      },
    ],
    name: 'updateMaxRoyaltyRange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'protocolBeneficiary_',
        type: 'address',
      },
    ],
    name: 'updateProtocolBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newManager',
        type: 'address',
      },
    ],
    name: 'updateRewardManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userTokenRoyaltyBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userTokenRoyaltyClaimed',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
] as const;
