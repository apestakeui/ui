import { chains } from "../constants/chains";
import { useCallback } from "react";

const useSwitchChain = () => {
  const switchToChain = useCallback(async (chainId: string) => {
    const chain = chains[chainId];

    const switchToChain = () =>
      window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${parseInt(chainId, 10).toString(16)}` }],
      });

    try {
      await switchToChain();
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${parseInt(chainId, 10).toString(16)}`, // A 0x-prefixed hexadecimal string
                chainName: chain.chainName,
                nativeCurrency: {
                  name: chain.currencyName,
                  symbol: chain.tokenSymbol, // 2-6 characters long
                  decimals: chain.currencyDecimals,
                },
                rpcUrls: [chain.rpc],
              },
            ],
          });
          switchToChain();
        } catch (addError: any) {
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  return { switchToChain };
};

export { useSwitchChain };