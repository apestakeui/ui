import Web3 from "web3";

export interface ChainInfo {
  /**
   * Plaintext, human-readable chain name
   */
  chainName: string;
  /**
   * Plaintext, human-readable chain currency name
   */
  currencyName: string;
  /**
   * Number of decimals in the coin
   */
  currencyDecimals: number;
  /**
   * Symbol of the chain's coin
   */
  tokenSymbol: string;
  /**
   * RPC endpoint for the chain
   */
  rpc: string;
}
export interface ChainMap {
  [key: string]: ChainInfo;
}

const map: ChainMap = {
  "1": {
    chainName: "Ethereum",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "ETH",
    rpc: "https://rpc.ankr.com/eth",
  },
  "5": {
    chainName: "Goerli",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "gETH",
    rpc: "https://rpc.ankr.com/eth_goerli",
  },
};

const reverseChainNameMapping = (obj: ChainMap) => {
  const reversed: Map<string, string> = new Map();
  Object.keys(obj).forEach((key) => {
    reversed.set(obj[key].chainName, key);
  });
  return reversed;
};

export const chains = Object.fromEntries(
  Object.entries(map).map(([chainId, chainInfo]) => [
    chainId,
    {
      ...chainInfo,
      web3: new Web3(new Web3.providers.HttpProvider(chainInfo.rpc)),
    },
  ])
);

export const numChains = Object.entries(map).length;
export const supportedChainIds = Object.keys(map);
export const networkIds: Map<string, string> = reverseChainNameMapping(map);

export function getName(chainId: string): string {
  return map[chainId].chainName;
}