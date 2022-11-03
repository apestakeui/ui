import { getDefaultProvider } from "ethers";
import ApeCoinStakingJson from "./ApeCoinStakingAbi.json";

export const supportedChains = ["1", "5"];

export interface ChainInfo {
  provider: string;
  stakingContractAddress: string;
  coinContractAddress: string;
  baycContractAddress: string;
  maycContractAddress: string;
  bakcContractAddress: string;
}
export interface ChainMap {
  [key: string]: ChainInfo;
}

const chainData: ChainMap = {
  "1": {
    // RPC: Replace with custom RPCs for performance and rate limit improvements
    provider: "https://rpc.ankr.com/eth",
    // TODO: get Mainnet addresses for staking contract
    stakingContractAddress: "0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce",
    coinContractAddress: "0x4d224452801aced8b2f0aebe155379bb5d594381",
    baycContractAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    maycContractAddress: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
    bakcContractAddress: "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623",
  },
  "5": {
    provider: "https://rpc.ankr.com/eth_goerli",
    stakingContractAddress: "0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce",
    coinContractAddress: "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
    baycContractAddress: "0xF40299b626ef6E197F5d9DE9315076CAB788B6Ef",
    maycContractAddress: "0x3f228cBceC3aD130c45D21664f2C7f5b23130d23",
    bakcContractAddress: "0xd60d682764Ee04e54707Bee7B564DC65b31884D0",
  },
};

export function resolveData(chainId: number): ChainInfo {
  return chainData[chainId];
}

// ABIs
export const stakingContractAbi = ApeCoinStakingJson.abi;
export const coinContractAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",
  // Write Functions
  "function approve(address spender, uint256 amount) nonpayable returns (bool)",
];
export const nftContractAbi = [
  // Read-Only Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function baseURI() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
];
