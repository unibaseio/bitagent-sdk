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
    [optimismSepolia.id]: '0x3522D5ed493a727B5955c399743b9AE0D4eAb474',
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
    [optimismSepolia.id]: '0x3E2483aC6E4cB478105140c3Dd2599EFa7093BD8',
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
    [optimismSepolia.id]: '0xf6589c66e25e42d405e364277228D6D82f031a00',
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
    [optimismSepolia.id]: '0xd7Ae80FA42A73B728e661D1D3762468Af34f730F',
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
    [optimismSepolia.id]: '0x3C87543995e5942425BDDd446e2d2c34793E1D51',
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
    [optimismSepolia.id]: '0x91ea5Ad4E3928BF998B461A12c61D0CF9fFFF65f',
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
