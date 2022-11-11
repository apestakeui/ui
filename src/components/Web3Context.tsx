/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCall, useEthers, useNetwork } from "@usedapp/core";
import { ethers, providers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import React, { useContext, useEffect, useMemo, useState } from "react";

import {
  nftContractAbi,
  coinContractAbi,
  stakingContractAbi,
  supportedChains,
  resolveData,
} from "../constants";
import type { Asset, Packet } from "types/pools";
import { Actions, Pools } from "types/pools";

function useContractFunctionCallFull(
  contract: ethers.Contract,
  method: string,
  args: any[]
): any {
  const { value, error } = useCall({ contract, method, args }) ?? {};
  if (error) {
    return undefined;
  }
  return value;
}

function useContractFunctionCall(
  contract: ethers.Contract,
  method: string,
  args: any[]
): any {
  return useContractFunctionCallFull(contract, method, args)?.[0];
}

interface Web3ContextProps {
  // Base data
  account: string | undefined;
  chainId: number | undefined;

  // Convenience flags
  onSupportedChain: boolean;
  actionsEnabled: boolean;
  web3Enabled: boolean;

  // Wallet
  activateWallet: () => void;
  deactivateWallet: () => void;
  // switchChain: (chainId: number) => void;

  // Contracts
  stakingContract: ethers.Contract;
  apeCoinContract: ethers.Contract;
  baycContract: ethers.Contract;
  maycContract: ethers.Contract;
  bakcContract: ethers.Contract;
  baycUri: string;
  maycUri: string;
  bakcUri: string;

  // User Data
  allData: Packet[];
  pools: any[];
  userBalance: number;
  userAllowance: number;
  staked: Packet[];
  unstaked: Packet[];
  userNfts: Asset[];
  executePacket: (input: Packet) => void;
  increaseAllowance: (input: number) => void;
}

// Initialize an empty context
const Web3Context = React.createContext<Web3ContextProps>(undefined!);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // Primary variables
  const { activateBrowserWallet, deactivate, error } = useEthers();
  const account = useNetwork().network.accounts[0];
  const { chainId } = useNetwork().network;
  // const { switchToChain } = useSwitchChain();

  // Interaction variables
  const [web3Enabled, setWeb3Enabled] = useState(false);
  const [onSupportedChain, setOnSupportedChain] = useState(false);

  let currentChainId = 1; // Default to ETH
  if (chainId !== undefined) {
    currentChainId = chainId;
  }
  const [provider, setProvider] = useState<ethers.providers.Provider>(
    new ethers.providers.JsonRpcProvider(resolveData(currentChainId).provider)
  );
  // // Caching so we don't need to hit the chain. replace with a useMemo
  // const [baycBaseUri, setBaycBaseUri] = useState<string>("");
  // const [maycBaseUri, setMaycBaseUri] = useState<string>("");
  // const [bakcBaseUri, setBakcBaseUri] = useState<string>("");

  // Contract variables
  const [stakingContract, setStakingContract] = useState<ethers.Contract>(
    new ethers.Contract(
      resolveData(currentChainId).stakingContractAddress,
      stakingContractAbi,
      provider
    )
  );
  const [apeCoinContract, setApeCoinContract] = useState<ethers.Contract>(
    new ethers.Contract(
      resolveData(currentChainId).coinContractAddress,
      coinContractAbi,
      provider
    )
  );
  const [baycContract, setBaycContract] = useState<ethers.Contract>(
    new ethers.Contract(
      resolveData(currentChainId).baycContractAddress,
      nftContractAbi,
      provider
    )
  );
  const [maycContract, setMaycContract] = useState<ethers.Contract>(
    new ethers.Contract(
      resolveData(currentChainId).maycContractAddress,
      nftContractAbi,
      provider
    )
  );
  const [bakcContract, setBakcContract] = useState<ethers.Contract>(
    new ethers.Contract(
      resolveData(currentChainId).bakcContractAddress,
      nftContractAbi,
      provider
    )
  );

  /// Cascading updates on core data changes
  // Web3Enabled update mechanism
  useEffect(() => {
    setWeb3Enabled(
      chainId !== undefined && account !== undefined && account !== null
    );
  }, [account, chainId, error]);

  // onSupportedChain update mechanism
  useEffect(() => {
    if (chainId !== undefined) {
      setOnSupportedChain(
        web3Enabled && supportedChains.includes(chainId.toString())
      );
    }
  }, [web3Enabled, chainId]);

  // Provider update mechanism
  useEffect(() => {
    if (chainId && onSupportedChain) {
      setProvider(
        new ethers.providers.JsonRpcProvider(resolveData(chainId).provider)
      );
    }
  }, [chainId]);

  // Contract update mechanism
  useEffect(() => {
    if (!chainId) {
      return;
    }
    const curr = resolveData(chainId);
    setStakingContract(
      new ethers.Contract(
        curr.stakingContractAddress,
        stakingContractAbi,
        provider
      )
    );
    setApeCoinContract(
      new ethers.Contract(curr.coinContractAddress, coinContractAbi, provider)
    );
    setBaycContract(
      new ethers.Contract(curr.baycContractAddress, nftContractAbi, provider)
    );
    setMaycContract(
      new ethers.Contract(curr.maycContractAddress, nftContractAbi, provider)
    );
    setBakcContract(
      new ethers.Contract(curr.bakcContractAddress, nftContractAbi, provider)
    );
  }, [provider, chainId]);

  const baycUri = useContractFunctionCall(baycContract, "baseURI", []) ?? "";
  const maycUri = useContractFunctionCall(maycContract, "tokenURI", [0]) ?? "";
  const bakcUri = useContractFunctionCall(bakcContract, "tokenURI", [0]) ?? "";

  const userBalance = parseFloat(
    formatEther(
      useContractFunctionCall(apeCoinContract, "balanceOf", [account]) ?? 0
    )
  );

  const userAllowance = parseFloat(
    formatEther(
      useContractFunctionCall(apeCoinContract, "allowance", [
        account,
        resolveData(chainId ?? 1).stakingContractAddress,
      ]) ?? 0
    )
  );

  const allData =
    useContractFunctionCall(stakingContract, "getAllStakes", [account]) ?? [];
  const poolsUI = useContractFunctionCallFull(
    stakingContract,
    "getPoolsUI",
    []
  );

  const convertTypes = (x: any): Packet => {
    return {
      poolId: x.poolId.toNumber(),
      tokenId: x.tokenId.toNumber(),
      pair: {
        mainTokenId: x.pair.mainTokenId.toNumber(),
        mainTypePoolId: x.pair.mainTypePoolId.toNumber(),
      },
      deposited: parseFloat(formatEther(x.deposited)),
      unclaimed: parseFloat(formatEther(x.unclaimed)),
    };
  };

  const staked: Packet[] =
    allData
      .filter((x: Packet) => {
        return x.deposited > 1e-6;
      })
      .map(convertTypes) ?? [];

  const unstaked =
    allData
      .filter((x: any) => {
        return x.deposited < 1e-6;
      })
      .map(convertTypes) ?? [];

  // TODO: build another worker to pull images with Pool+ID query
  const userNfts: Asset[] =
    allData?.map((x: any) => {
      return {
        mainTypePoolId: x.poolId.toNumber(),
        mainTokenId: x.tokenId.toNumber(),
      };
    }) ?? [];

  const executePacket = (input: Packet) => {
    // TODO: use better signer method via DApp provider
    const realProvider = new providers.Web3Provider(window.ethereum, "any");
    const realStake = stakingContract.connect(realProvider.getSigner());

    const { action } = input;
    const pool = input.poolId;
    const deposited = parseEther(input.deposited.toString());
    // Here comes some combinatorial explosion, shrug
    if (action === Actions.stake) {
      if (pool === Pools.coin) {
        realStake.depositSelfApeCoin(deposited);
      }
      if (pool === Pools.bayc) {
        const position = { tokenId: input.tokenId, amount: deposited };
        realStake.depositBAYC([position]);
      }
      if (pool === Pools.mayc) {
        const position = { tokenId: input.tokenId, amount: deposited };
        realStake.depositMAYC([position]);
      }
      if (pool === Pools.bakc) {
        const pairPool = input.pair!.mainTypePoolId;
        const position = {
          mainTokenId: input.pair!.mainTokenId,
          bakcTokenId: input.tokenId,
          amount: deposited,
        };
        // Seemingly, ordering of the two arrays denotes primaryPool, ugh
        if (pairPool === Pools.bayc) {
          realStake.depositBAKC([position], []);
        }
        if (pairPool === Pools.mayc) {
          realStake.depositBAKC([], [position]);
        }
      }
    }
    if (action === Actions.claim) {
      if (pool === Pools.coin) {
        realStake.claimSelfApeCoin();
      }
      if (pool === Pools.bayc) {
        realStake.claimSelfBAYC([input.tokenId]);
      }
      if (pool === Pools.mayc) {
        realStake.claimSelfMAYC([input.tokenId]);
      }
      if (pool === Pools.bakc) {
        const pairPool = input.pair!.mainTypePoolId;
        const position = {
          mainTokenId: input.pair!.mainTokenId,
          bakcTokenId: input.tokenId,
        };
        if (pairPool === Pools.bayc) {
          realStake.claimSelfBAKC([position], []);
        }
        if (pairPool === Pools.mayc) {
          realStake.claimSelfBAKC([], [position]);
        }
      }
    }
    if (action === Actions.withdraw) {
      if (pool === Pools.coin) {
        realStake.withdrawSelfApeCoin(deposited);
      }
      if (pool === Pools.bayc) {
        const position = { tokenId: input.tokenId, amount: deposited };
        realStake.withdrawSelfBAYC([position]);
      }
      if (pool === Pools.mayc) {
        const position = { tokenId: input.tokenId, amount: deposited };
        realStake.withdrawSelfMAYC([position]);
      }
      if (pool === Pools.bakc) {
        const pairPool = input.pair!.mainTypePoolId;
        const position = {
          mainTokenId: input.pair!.mainTokenId,
          bakcTokenId: input.tokenId,
          amount: deposited,
        };
        if (pairPool === Pools.bayc) {
          realStake.withdrawBAKC([position], []);
        }
        if (pairPool === Pools.mayc) {
          realStake.withdrawBAKC([], [position]);
        }
      }
    }
  };

  const increaseAllowance = (input: number) => {
    // TODO: use better signer method via DApp provider
    const allowance = parseEther(input.toString());
    const realProvider = new providers.Web3Provider(window.ethereum, "any");
    const realCoin = apeCoinContract.connect(realProvider.getSigner());
    realCoin.approve(
      resolveData(chainId ?? 5).stakingContractAddress,
      allowance
    );
  };

  // Extracting into useMemo to make TS happy
  const returnData = useMemo(() => {
    return {
      // Base data
      account,
      chainId,
      // Convenience flags
      onSupportedChain,
      actionsEnabled: onSupportedChain,
      web3Enabled,

      // Wallet
      activateWallet: activateBrowserWallet,
      deactivateWallet: deactivate,
      // switchChain,

      // Contracts
      stakingContract,
      apeCoinContract,
      baycContract,
      maycContract,
      bakcContract,
      baycUri,
      maycUri,
      bakcUri,
      allData,
      pools: poolsUI,
      userBalance,
      userAllowance,
      userNfts,
      staked,
      unstaked,
      executePacket,
      increaseAllowance,
    };
  }, [
    account,
    chainId,
    onSupportedChain,
    web3Enabled,
    activateBrowserWallet,
    deactivate,
    stakingContract,
    apeCoinContract,
    baycContract,
    maycContract,
    bakcContract,
    baycUri,
    maycUri,
    bakcUri,
    allData,
    poolsUI,
    userBalance,
    userAllowance,
    userNfts,
    staked,
    unstaked,
    executePacket,
    increaseAllowance,
  ]);

  return (
    <Web3Context.Provider value={returnData}>{children}</Web3Context.Provider>
  );
}

// Convenience export for consuming the context
export function useWeb3Provider() {
  return useContext(Web3Context);
}
