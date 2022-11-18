import { Button, HStack, Link, Text } from "@chakra-ui/react";
import {
  Mainnet,
  shortenAddress,
  useEthers,
} from "@usedapp/core";

import ThemeToggle from "./ThemeToggle";
import { useWeb3Provider } from "components/Web3Context";

const Header = () => {
  const { account } = useEthers();
  const {
    activateWallet,
    deactivateWallet,
    switchChain,
  } = useWeb3Provider();

  const connect = async () => {
    activateWallet();
    // switchChain(Mainnet.chainId);
  };

  const deactivate = async () => {
    deactivateWallet();
  };

  function visitApeCoin() {
    window.open("https://apecoin.com/");
  }

  function visitGithub() {
    window.open("https://github.com/apestakeui/ui");
  }

  return (
    <HStack as="header" width="full" justify="space-around" align="center">
      <Button onClick={visitApeCoin}>
        Visit ApeCoin
      </Button>
      <Button onClick={visitGithub}>
        Contribute on GitHub
      </Button>
      <HStack>
        {account ? (
          <Button onClick={deactivate}>Disconnect {shortenAddress(account)}</Button>
        ) : (
          <Button onClick={connect}>Connect Wallet</Button>
        )}
        <ThemeToggle />
      </HStack>
    </HStack>
  );
};

export default Header;
