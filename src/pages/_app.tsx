import "styles/globals.css";

import { DAppProvider, Goerli, Mainnet } from "@usedapp/core";
import type { Config } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";

import defaultSEOConfig from "../../next-seo.config";
import Chakra from "components/Chakra";

/* eslint-disable react/jsx-props-no-spreading */
import { Web3Provider } from "components/Web3Context";
import Layout from "layout";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const config: Config = {
    readOnlyChainId: Mainnet.chainId,
    // RPC: Replace with custom RPCs for performance and rate limit improvements
    readOnlyUrls: {
      [Mainnet.chainId]: "https://rpc.ankr.com/eth",
      [Goerli.chainId]: "https://rpc.ankr.com/eth_goerli",
    },
    refresh: "everyBlock",
  };

  return (
    <Chakra>
      <DAppProvider config={config}>
        <Web3Provider>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
            />
          </Head>
          <DefaultSeo {...defaultSEOConfig} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Web3Provider>
      </DAppProvider>
    </Chakra>
  );
};

export default MyApp;
// nAS16e8Y.uB3xxBX1G73KE6D6vHjE9NF3yZ3dNExA
