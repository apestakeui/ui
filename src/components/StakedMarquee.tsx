import { formatEther } from "ethers/lib/utils";
import Marquee from "react-fast-marquee";

import { useWeb3Provider } from "components/Web3Context";
import { poolStrings } from "types/pools";

export function StakedMarquee() {
  /// General bookkeeping
  const { pools } = useWeb3Provider();
  const text = pools
    ?.map((x) => {
      // {/* This still needs parsing logic because we don't handle it in the provider yet
      return ` ${poolStrings[x.poolId]} Pool Staked: ${parseFloat(
        formatEther(x.stakedAmount)
      ).toFixed(3)}`;
    })
    .join(" || ");
  return (
    <Marquee pauseOnHover gradient={false}>
      {text}
    </Marquee>
  );
}

export default StakedMarquee;
