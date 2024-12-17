import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  kaia,
  bsc,
  bscTestnet,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
  cyber,
  cyberTestnet,
  ham,
  degen,
} from 'viem/chains';

const SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: '',
    [optimism.id]: '',
    [optimismSepolia.id]: '0x82E05B67B8766b78e8351717C956c151eBa5c72C',
    [arbitrum.id]: '',
    [avalanche.id]: '',
    [polygon.id]: '',
    [bsc.id]: '',
    [base.id]: '',
    [baseSepolia.id]: '',
    [sepolia.id]: '',
    [blast.id]: '',
    [blastSepolia.id]: '',
    [avalancheFuji.id]: '',
    [degen.id]: '',
    [cyberTestnet.id]: '',
    [kaia.id]: '',
    [cyber.id]: '',
    [ham.id]: '',
  },

  ERC1155: {
    [mainnet.id]: '',
    [optimism.id]: '',
    [optimismSepolia.id]: '0xAe50aa513586204FB78BFef1dFcbF1ac14BF43Ed',
    [arbitrum.id]: '',
    [avalanche.id]: '',
    [polygon.id]: '',
    [bsc.id]: '',
    [base.id]: '',
    [baseSepolia.id]: '',
    [sepolia.id]: '',
    [blast.id]: '',
    [blastSepolia.id]: '',
    [avalancheFuji.id]: '',
    [degen.id]: '',
    [cyberTestnet.id]: '',
    [kaia.id]: '',
    [cyber.id]: '',
    [ham.id]: '',
  },

  BOND: {
    [mainnet.id]: '',
    [optimism.id]: '',
    [optimismSepolia.id]: '0xd1c6508301B0567e3b8aFC45808704F5c0ea7FEf',
    [arbitrum.id]: '',
    [avalanche.id]: '',
    [polygon.id]: '',
    [bsc.id]: '',
    [base.id]: '',
    [baseSepolia.id]: '',
    [sepolia.id]: '',
    [blast.id]: '',
    [blastSepolia.id]: '',
    [avalancheFuji.id]: '',
    [degen.id]: '',
    [cyberTestnet.id]: '',
    [kaia.id]: '',
    [cyber.id]: '',
    [ham.id]: '',
  },

  ZAP: {
    [mainnet.id]: '',
    [optimism.id]: '',
    [optimismSepolia.id]: '0x1e92B115C7195e798Fd4b071305853cE9f324a64',
    [arbitrum.id]: '',
    [avalanche.id]: '',
    [polygon.id]: '',
    [bsc.id]: '',
    [base.id]: '',
    [baseSepolia.id]: '',
    [sepolia.id]: '',
    [blast.id]: '',
    [blastSepolia.id]: '',
    [avalancheFuji.id]: '',
    [degen.id]: '',
    [cyberTestnet.id]: '',
    [kaia.id]: '',
    [cyber.id]: '',
    [ham.id]: '',
  },

  LOCKER: {
    [mainnet.id]: '',
    [optimism.id]: '',
    [optimismSepolia.id]: '0x27d16F8373EB8932C558793ccaBd05B2e8D52f5A',
    [arbitrum.id]: '',
    [avalanche.id]: '',
    [polygon.id]: '',
    [bsc.id]: '',
    [base.id]: '',
    [baseSepolia.id]: '',
    [sepolia.id]: '',
    [blast.id]: '',
    [blastSepolia.id]: '',
    [avalancheFuji.id]: '',
    [degen.id]: '',
    [cyberTestnet.id]: '',
    [kaia.id]: '',
    [cyber.id]: '',
    [ham.id]: '',
  },

  MERKLE: {
    [mainnet.id]: '',
    [optimism.id]: '',
    [optimismSepolia.id]: '0x66586554f80cad4aCa263044996DbaD860f47267',
    [arbitrum.id]: '',
    [avalanche.id]: '',
    [polygon.id]: '',
    [bsc.id]: '',
    [base.id]: '',
    [baseSepolia.id]: '',
    [sepolia.id]: '',
    [blast.id]: '',
    [blastSepolia.id]: '',
    [avalancheFuji.id]: '',
    [degen.id]: '',
    [cyberTestnet.id]: '',
    [kaia.id]: '',
    [cyber.id]: '',
    [ham.id]: '',
  },

  ONEINCH: {
    [mainnet.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [optimism.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [optimismSepolia.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [arbitrum.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [avalanche.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [polygon.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [bsc.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [base.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [kaia.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [sepolia.id]: '0x',
    [baseSepolia.id]: '0x',
    [blast.id]: '0x',
    [blastSepolia.id]: '0x',
    [avalancheFuji.id]: '0x',
    [degen.id]: '0x',
    [cyberTestnet.id]: '0x',
    [cyber.id]: '0x',
    [ham.id]: '0x',
  },
} as const;

export function getMintClubContractAddress(contractName: ContractNames, chainId: SdkSupportedChainIds) {
  let contractAddress = SDK_CONTRACT_ADDRESSES[contractName][chainId];

  if (process.env.NODE_ENV === 'hardhat') {
    contractAddress = global.mcv2Hardhat?.[contractName]?.[chainId] as any;
  }

  if (!contractAddress) {
    throw new Error(`Contract address for ${contractName} on chain ${chainId} not found`);
  }
  return contractAddress;
}

type ExcludeValue<T, V> = T extends V ? never : T;
type ExtractChainIds<T> = T extends { [key: string]: infer U }
  ? U extends { [key: number]: any }
    ? keyof U
    : never
  : never;

export type ContractNames = keyof typeof SDK_CONTRACT_ADDRESSES;
export type SdkSupportedChainIds = ExtractChainIds<typeof SDK_CONTRACT_ADDRESSES>;
export type TokenType = 'ERC20' | 'ERC1155';
export type MainnetChain = ExcludeValue<
  SdkSupportedChainIds,
  typeof sepolia.id | typeof blastSepolia.id | typeof avalancheFuji.id | typeof cyberTestnet.id
>;
