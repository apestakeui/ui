/* eslint-disable no-param-reassign */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable complexity */
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";

import { useWeb3Provider } from "components/Web3Context";
import type { Packet } from "types/pools";
import { Actions, Pools, poolStrings } from "types/pools";
import { DRAFT_STATE } from "immer/dist/internal";

interface ParameterProps {
  packet: Packet;
  setPacket: (newVal: Packet) => void;
}

const Parameters = (props: ParameterProps) => {
  const { packet, setPacket } = props;
  const { userNfts, userBalance } = useWeb3Provider();
  const [groundTruth] = useState<Packet>(packet);

  // Amount content
  let amountLabel = "";
  let amountError = "";
  let amountLimit = 0;
  let amountPredicate = false;
  let amountInputShow = true;

  if (groundTruth.action! === Actions.stake) {
    amountLabel = "Staking Amount:";
    amountLimit = userBalance;
    amountError = `Entry must be less than ${amountLimit}`;
    amountPredicate = packet.deposited <= amountLimit;
  }
  if (groundTruth.action! === Actions.withdraw) {
    amountLabel = "Withdrawal Amount:";
    amountLimit = groundTruth.deposited;
    amountError = `Entry must be less than ${amountLimit}`;
    amountPredicate = packet.deposited <= amountLimit;
  }
  if (groundTruth.action! === Actions.claim) {
    amountLabel = "No amount input required.";
    amountPredicate = true;
    amountInputShow = false;
  }

  const amountContent = (
    <FormControl>
      <FormLabel pt="1rem">{amountLabel}</FormLabel>
      <Input
        hidden={!amountInputShow}
        isInvalid={!amountPredicate}
        value={packet.deposited}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPacket(
            produce(packet, (draft) => {
              draft.deposited = parseInt(e.target.value, 10);
              draft.uncommit = draft.deposited >= amountLimit;
            })
          );
        }}
        placeholder="Enter amount"
        size="sm"
      />
      <FormHelperText hidden={amountPredicate}>{amountError}</FormHelperText>
    </FormControl>
  );

  // Primary NFT content
  const primaryLabel = `${poolStrings[packet.poolId]} ID:`;
  const primaryLimit = userNfts
    .filter((x) => {
      return x.mainTypePoolId === groundTruth.poolId;
    })
    .map((x) => {
      return x.mainTokenId;
    });
  const primaryError = `Must be of id: ${primaryLimit.join()}`;
  const primaryPredicate = primaryLimit.some((x) => {
    return x === packet.tokenId;
  });

  const primaryContent = (
    <FormControl>
      <Text pt="2rem">{primaryLabel}</Text>
      <Input
        isInvalid={!primaryPredicate}
        value={packet.tokenId}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPacket(
            produce(packet, (draft) => {
              draft.tokenId = parseInt(e.target.value, 10);
            })
          );
        }}
        placeholder="Enter NFT ID"
        size="sm"
      />
      <FormHelperText hidden={primaryPredicate}>{primaryError}</FormHelperText>
    </FormControl>
  );

  // Secondary NFT content
  const [selector, setSelector] = useState<Pools>(
    groundTruth.pair.mainTypePoolId ?? Pools.bayc
  );
  const secondaryLabel = `${poolStrings[packet.pair?.mainTypePoolId ?? 4]} ID:`;
  const secondaryLimit = userNfts
    .filter((x) => {
      return x.mainTypePoolId === selector;
    })
    .map((x) => {
      return x.mainTokenId;
    });
  const secondaryError = packet.pair.mainTypePoolId === Pools.coin ?
    `Select a pair pool`: `Must be of id: ${secondaryLimit.join()}`;
  const secondaryPredicate = secondaryLimit.some((x) => {
    return (packet.pair.mainTypePoolId !== Pools.coin && x === packet.pair.mainTokenId) ?? 0;
  });
  let secondaryContent = (<Text>No pair input required.</Text>);

  // When withdrawing/claiming, the paired NFT can't be set by the user
  // unless they are using the action flow directly
  if (groundTruth.action! === Actions.stake ||
      (packet.pair.mainTokenId === 0 ||
       packet.pair.mainTokenId === undefined)) {
    secondaryContent = (
      <FormControl>
        <Tabs
          pt="2rem"
          variant="soft-rounded"
          index={selector}
          onChange={(index) => {
            setPacket(
              produce(packet, (draft) => {
                draft.pair = {
                  mainTypePoolId: index,
                };
              })
            );
            setSelector(index);
          }}
        >
          <TabList>
            {/* Lining up the indexes */}
            <Tab hidden />
            <Tab key={Pools.bayc}>{poolStrings[Pools.bayc]}</Tab>
            <Tab key={Pools.mayc}>{poolStrings[Pools.mayc]}</Tab>
          </TabList>
        </Tabs>
        {packet.pair.mainTypePoolId !== Pools.coin && (
        <Text>{secondaryLabel}</Text>
        )}
        <Input
          isInvalid={!secondaryPredicate}
          value={packet.pair?.mainTokenId ?? 0}
          type="number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPacket(
              produce(packet, (draft) => {
                draft.pair.mainTokenId = parseInt(e.target.value, 10);
              })
            );
          }}
          placeholder="Enter ID"
          size="sm"
        />
        <FormHelperText hidden={secondaryPredicate}>
          {secondaryError}
        </FormHelperText>
      </FormControl>
    );
  }

  return (
    <VStack spacing="1rem" w="30%">
      {amountContent}
      {/* All non-coin options */}
      {packet.poolId !== Pools.coin && primaryContent}
      {/* Pair pool */}
      {packet.poolId === Pools.bakc && secondaryContent}
    </VStack>
  );
};

export default Parameters;
