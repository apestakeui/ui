import { Button, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useWeb3Provider } from "components/Web3Context";
import type { Packet } from "types/pools";
import { Pools, poolStrings } from "types/pools";

function generateAssetString(
  pool: Pools | undefined,
  token: number | undefined
) {
  return <Text>{`${poolStrings[Number(pool)] ?? "ERROR"} ${token ?? "ERROR"}`}</Text>;
}

function generateURL(ifps: string): string {
  return ifps.replace("ipfs://", "https://ipfs.io/ipfs/");
}

interface PositionCardProps {
  position: Packet;
  // Name and onClick for buttons
  actions: [string, (newVal: Packet) => void][];
}

const PositionCard = (props: PositionCardProps) => {
  const { position, actions } = props;
  const { poolId, tokenId, deposited, unclaimed, pair } = position;
  const { baycUri, maycUri, bakcUri } = useWeb3Provider();
  const [imgUrl, setImgUrl] = useState(
    "/images/ApeCoin.png"
  );
  let poolUri = "";
  if (poolId === Pools.bayc) {
    poolUri = generateURL(baycUri);
  }
  if (poolId === Pools.mayc) {
    poolUri = generateURL(maycUri.substring(0, maycUri.length - 1));
  }
  if (poolId === Pools.bakc) {
    poolUri = generateURL(bakcUri.substring(0, bakcUri.length - 1));
  }

  useEffect(() => {
    if (poolId !== Pools.coin) {
      fetch(poolUri + tokenId)
        .then((res) => res.json())
        .then((data) => {
          setImgUrl(generateURL(data.image));
        });
    }
  }, [poolUri, tokenId, poolId]);

  return (
    <VStack
      w="full"
      h="full"
      padding="1rem"
      borderRadius="lg"
      boxShadow="0px 1px 12px rgba(0, 0, 0, 0.5)"
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      {/* Format Token position card */}
      {poolId === Pools.coin && (
        <Image src={"/images/ApeCoin.png"} width="100px" height="100px" />
      )}
      {poolId === Pools.coin && (
        <Text>ApeCoin</Text>
      )}
      {/* Format NFT position cards */}
      {poolId !== Pools.coin && (
        <Image src={imgUrl} width="100px" height="100px" />
      )}
      {poolId !== Pools.coin && generateAssetString(poolId, tokenId)}
      {poolId === Pools.bakc && pair.mainTypePoolId !== Pools.coin &&
        generateAssetString(pair.mainTypePoolId, pair.mainTokenId)}
      {deposited > 0 && (
          <Text>{`Staked Coin: ${deposited.toFixed(3)}`}</Text>
      )}
      {unclaimed > 0 && (
          <Text>{`Pending Reward: ${unclaimed.toFixed(3)}`}</Text>
      )}
      {actions.map((x) => {
        // 0: label
        // 1: onClick callback
        return (
          <Button
            key={x.toString()}
            onClick={() => {
              x[1](position);
            }}
          >
            {x[0]}
          </Button>
        );
      })}
    </VStack>
  );
};

export default PositionCard;
