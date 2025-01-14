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
    [mainnet.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [optimism.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [optimismSepolia.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [arbitrum.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [avalanche.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [polygon.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [bsc.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [bscTestnet.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [base.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [baseSepolia.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [sepolia.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [blast.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [blastSepolia.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [avalancheFuji.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [degen.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [cyberTestnet.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [kaia.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [cyber.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
    [ham.id]: '0xDEF22E6C358f10690D433CC82a0Ca9d98D3a8ebB',
  },

  ERC1155: {
    [mainnet.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [optimism.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [optimismSepolia.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [arbitrum.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [avalanche.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [polygon.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [bsc.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [bscTestnet.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [base.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [baseSepolia.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [sepolia.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [blast.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [blastSepolia.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [avalancheFuji.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [degen.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [cyberTestnet.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [kaia.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [cyber.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
    [ham.id]: '0x187E536C5404dD472476B9e4C716878d359a506A',
  },

  BOND: {
    [mainnet.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [optimism.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [optimismSepolia.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [arbitrum.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [avalanche.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [polygon.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [bsc.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [bscTestnet.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [base.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [baseSepolia.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [sepolia.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [blast.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [blastSepolia.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [avalancheFuji.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [degen.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [cyberTestnet.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [kaia.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [cyber.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
    [ham.id]: '0x912e3153a021b092ab85EA79B2a5d07b04B0073B',
  },

  ZAP: {
    [mainnet.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [optimism.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [optimismSepolia.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [arbitrum.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [avalanche.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [polygon.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [bsc.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [bscTestnet.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [base.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [baseSepolia.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [sepolia.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [blast.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [blastSepolia.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [avalancheFuji.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [degen.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [cyberTestnet.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [kaia.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [cyber.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
    [ham.id]: '0xe4287a55a5512aE2cAb53bb1eFA4991ac7E2c537',
  },

  LOCKER: {
    [mainnet.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [optimism.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [optimismSepolia.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [arbitrum.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [avalanche.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [polygon.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [bsc.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [bscTestnet.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [base.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [baseSepolia.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [sepolia.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [blast.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [blastSepolia.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [avalancheFuji.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [degen.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [cyberTestnet.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [kaia.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [cyber.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
    [ham.id]: '0xBF2eb2b419d1871446509B7Ac233bd32Be7B8867',
  },

  MERKLE: {
    [mainnet.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [optimism.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [optimismSepolia.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [arbitrum.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [avalanche.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [polygon.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [bsc.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [bscTestnet.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [base.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [baseSepolia.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [sepolia.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [blast.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [blastSepolia.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [avalancheFuji.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [degen.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [cyberTestnet.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [kaia.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [cyber.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
    [ham.id]: '0xDF407862072B4de05aae94c1A2f0bE5EF8C72225',
  },

  ONEINCH: {
    [mainnet.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [optimism.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [optimismSepolia.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [arbitrum.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [avalanche.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [polygon.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [bsc.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [bscTestnet.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [base.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [kaia.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [sepolia.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x',
    [baseSepolia.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [blast.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [blastSepolia.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [avalancheFuji.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8x',
    [degen.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [cyberTestnet.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [cyber.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [ham.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
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
