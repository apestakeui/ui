import { HStack, Text, VStack } from "@chakra-ui/react";

// Pools and UI strings
export enum Pools {
  "coin" = 0,
  "bayc" = 1,
  "mayc" = 2,
  "bakc" = 3,
}
export const poolStrings = [
  "ApeCoin",
  "Bored Ape Yacht Club",
  "Mutant Ape Yacht Club",
  "Bored Ape Kennel Club",
  // Overflow
  "Unknown",
];

export const poolTickers = [
  "$APE",
  "BAYC",
  "MAYC",
  "BAKC",
  // Overflow
  "UNKWN",
];

// Actions and UI strings
export enum Actions {
  "stake" = 0,
  "claim" = 1,
  "withdraw" = 2,
}
export const actionStrings = [
  "Stake Assets",
  "Claim Rewards",
  "Unstake",
  // Overflow
  "Unknown",
];

export interface Asset {
  mainTokenId?: number;
  mainTypePoolId?: Pools;
  image?: any;
  imageURL?: string;
}

export interface Packet {
  // Basics
  poolId: Pools;
  action?: Actions;
  tokenId: number;
  imageUrl?: string;
  pair: Asset;
  // Amounts
  deposited: number;
  unclaimed: number;
  // If withdrawing the full deposited amount
  // Used to prevent BAKC withdrawal front-running
  uncommit: boolean;
}

export const defaultPacket: Packet = {
  poolId: Pools.coin,
  action: Actions.stake,
  tokenId: 0,
  deposited: 0,
  unclaimed: 0,
  pair: { mainTokenId: 0, mainTypePoolId: 0 },
  uncommit: true,
};

export const packetUi = (input: Packet) => {
  return (
    <VStack align="center">
      <Text as="b">Summary</Text>
      <Text>{`Pool: ${poolStrings[input.poolId]}`}</Text>
      <Text>{`Action: ${
        actionStrings[input.action ?? actionStrings.length - 1]
      }`}</Text>
      {input.deposited !== 0 && <Text>{`Amount: ${input.deposited}`}</Text>}
      <Text>Assets:</Text>
      <HStack spacing="5rem">
        <Text>{`Pool: ${input.poolId} | ID: ${input.tokenId}`}</Text>
        {input.pair && input.poolId === Pools.bakc && (
          <Text>{`Pool: ${input.pair.mainTypePoolId} | ID: ${input.pair.mainTokenId}`}</Text>
        )}
      </HStack>
    </VStack>
  );
};
