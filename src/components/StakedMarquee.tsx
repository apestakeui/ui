import { formatEther } from "ethers/lib/utils";
import Marquee from "react-fast-marquee";
import {Text} from "@chakra-ui/react";

import { useWeb3Provider } from "components/Web3Context";
import { poolTickers } from "types/pools";

export function StakedMarquee() {
  /// General bookkeeping
  const { pools } = useWeb3Provider();
  const text = pools
    ?.map((x) => {
      // This still needs parsing logic because we don't handle it in the provider yet
      return <Text>{poolTickers[x.poolId]} Pool Staked: ${parseFloat(
        formatEther(x.stakedAmount)
      ).toFixed(3)} &emsp; &emsp; &emsp; </Text> ;
    });
  return (
    <Marquee pauseOnHover gradient={false}>
      {text}
    </Marquee>
  );
}

export default StakedMarquee;
