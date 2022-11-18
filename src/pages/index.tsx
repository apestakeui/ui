/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import {
  Button,
  Flex,
  Heading,
  HStack,
  useColorMode,
  Text,
  VStack,
  Portal,
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  Alert,
  AlertDescription,
  Divider,
  Center,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import produce from "immer";
import { NextSeo } from "next-seo";
import { useRef, useState } from "react";
import { FiAperture, FiLayers, FiLock, FiSettings } from "react-icons/fi";

import { QuestionOverlay } from "../components/QuestionOverlay";
import { StakedMarquee } from "components/StakedMarquee";
import { useWeb3Provider } from "components/Web3Context";
import Parameters from "components/wizard/Parameters";
import PositionCard from "components/wizard/PositionCard";
import type { Packet } from "types/pools";
import {
  defaultPacket,
  poolStrings,
  Pools,
  actionStrings,
  Actions,
  packetUi,
} from "types/pools";

const Home = () => {
  /// General bookkeeping
  const {
    userAllowance,
    staked,
    unstaked,
    executePacket,
    increaseAllowance,
    // userBalance,
    // userNfts,
    // allData,
  } = useWeb3Provider();
  // Colors
  const { colorMode } = useColorMode();
  // Scrolling
  const dashboardRef = useRef(null);
  const actionsRef = useRef(null);
  // A small hack; otherwise the compiler complains.
  // We set the ref below so there is no null risk
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Object is possibly 'null'.
  const scrollToDashboard = () => dashboardRef.current.scrollIntoView();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Object is possibly 'null'.
  const scrollToActions = () => actionsRef.current.scrollIntoView();
  // Cookies

  /// State management
  // Wizard
  const { nextStep, prevStep, reset, setStep, activeStep } = useSteps({
    initialStep: 0,
  });
  let buttonText = "Next";
  if (activeStep === 3) {
    buttonText = "Execute";
  }
  if (activeStep === 4) {
    buttonText = "Reset";
  }

  const [wizardPacket, setWizardPacket] = useState<Packet>(defaultPacket);

  const jumpToParameters = () => {
    setStep(2);
    scrollToActions();
  };

  const allowanceDiff = wizardPacket.deposited - userAllowance;

  return (
    <Flex
      direction="column"
      alignItems="center"
      minHeight="80vh"
      gap={4}
      mb={8}
      w="full"
    >
      {/* Front Matter */}
      <NextSeo title="ApeStake" />
      <Heading as="h1" size="lg">
        Welcome to ApeCoin Staking
      </Heading>
      <Text>
        Staking Smart Contract:{" "}
        <Text
          as="a"
          href="https://etherscan.io/address/0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce"
          target="_blank"
          rel="noreferrer"
          fontWeight="bold"
        >
          0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce
        </Text>
        <br></br>
        Verify address at {" "}
        <Text
          as="a"
          href="https://docs.apestake.io/#/"
          target="_blank"
          rel="noreferrer"
          fontWeight="bold"
        >
          https://docs.apestake.io/#/
        </Text>
      </Text>
      {/* Debugging Tool - uncomment for development purposes only  */}
      {/* <Button
        onClick={() => {
          console.log("All: ", allData);
          console.log("Pools: ", pools);
          console.log("User Balance: ", userBalance);
          console.log("Allowance: ", userAllowance);
          console.log("Owned NFTs: ", userNfts);
          console.log("Staked Positions: ", staked);
          console.log("Unstaked Positions: ", unstaked);
          console.log("Diff: ", allowanceDiff);
        }}
      >
        Log Global Data to Console
      </Button> */}

      {/* Scroll Actions */}
      <HStack>
        <Button
          backgroundColor={colorMode === "light" ? "gray.300" : "teal.500"}
          size="sm"
          onClick={scrollToDashboard}
        >
          Scroll to Dashboard
        </Button>
        <Button
          backgroundColor={colorMode === "light" ? "gray.300" : "teal.500"}
          size="sm"
          onClick={scrollToActions}
        >
          Scroll to Actions
        </Button>
      </HStack>
      <Divider />
      {/* Pool info */}
      <Flex w="90%">
        <StakedMarquee />
      </Flex>
      <Divider />
      {/* Dashboard */}
      <HStack
        ref={dashboardRef}
        minWidth="80%"
        h="full"
        pt="3rem"
        align="top"
        spacing="2rem"
      >
        {/* Staked grid */}
        <VStack w="full" h="full">
          <Text as="b">Staked</Text>
          <SimpleGrid minChildWidth="200px" spacing="50px" w="full" p="2rem">
            {staked.map((packet) => {
              return (
                <PositionCard
                  key={packet.poolId.toString() + packet.tokenId.toString()}
                  position={packet}
                  actions={[
                    [
                      actionStrings[Actions.claim],
                      (newVal: Packet) => {
                        setWizardPacket({ ...newVal, action: Actions.claim });
                        jumpToParameters();
                      },
                    ],
                    [
                      actionStrings[Actions.withdraw],
                      (newVal: Packet) => {
                        setWizardPacket({
                          ...newVal,
                          action: Actions.withdraw,
                        });
                        jumpToParameters();
                      },
                    ],
                  ]}
                  staked={true}
                />
              );
            })}
          </SimpleGrid>
        </VStack>
        {/* Unstaked grid */}
        <VStack w="full" h="full">
          <Text as="b">Unstaked</Text>
          <SimpleGrid minChildWidth="200px" spacing="50px" w="full" p="2rem">
            {unstaked.map((packet) => {
              return (
                <PositionCard
                  key={packet.poolId.toString() + packet.tokenId.toString()}
                  position={packet}
                  actions={[
                    [
                      actionStrings[Actions.stake],
                      (newVal: Packet) => {
                        setWizardPacket({
                          ...newVal,
                          action: Actions.stake,
                        });
                        jumpToParameters();
                      },
                    ],
                  ]}
                  staked={false}
                />
              );
            })}
          </SimpleGrid>
        </VStack>
      </HStack>
      <Divider />
      {/* Actions Wizard */}
      <Flex ref={actionsRef} direction="column" maxWidth="80%" gap={4} mb={8}>
        <Steps activeStep={activeStep} pb="1rem">
          {/* Pool selection */}
          <Step
            label="Staking Pool"
            key={0}
            description="Choose the desired pool"
            icon={FiAperture}
          >
            <Tabs
              variant="soft-rounded"
              isFitted
              index={wizardPacket.poolId}
              onChange={(index) => {
                // Clear packet when starting a new custom action
                setWizardPacket(defaultPacket);
                setWizardPacket(
                  produce((draft) => {
                    draft.poolId = index;
                  })
                );
              }}
            >
              <TabList>
                {Object.values(Pools)
                  .filter((pool) => {
                    return !Number.isNaN(Number(pool));
                  })
                  .map((pool) => {
                    return (
                      <Tab key={Number(pool)}>{poolStrings[Number(pool)]}</Tab>
                    );
                  })}
              </TabList>
            </Tabs>
          </Step>
          {/* Action selection */}
          <Step
            label="Action"
            key={1}
            description="Choose what to do"
            icon={FiLayers}
          >
            <Tabs
              variant="soft-rounded"
              isFitted
              index={wizardPacket.action}
              onChange={(index) => {
                setWizardPacket(
                  produce((draft) => {
                    draft.action = index;
                  })
                );
              }}
            >
              <TabList>
                {Object.values(Actions)
                  .filter((action) => {
                    return !Number.isNaN(Number(action));
                  })
                  .map((action) => {
                    return (
                      <Tab key={Number(action)}>
                        {actionStrings[Number(action)]}
                      </Tab>
                    );
                  })}
              </TabList>
            </Tabs>
          </Step>
          {/* Parameter selection */}
          <Step
            label="Parameters"
            key={2}
            description="Set amounts and IDs"
            icon={FiSettings}
          >
            <Center>
              <Parameters packet={wizardPacket} setPacket={setWizardPacket} />
            </Center>
          </Step>
          {/* Review selections */}
          <Step
            label="Verify and Execute"
            key={3}
            description="Confirm and contact blockchain"
            icon={FiLock}
            state="loading"
          >
            {wizardPacket.action === Actions.stake && allowanceDiff > 0 && (
              <Alert status="error" justifyContent="center">
                <AlertDescription>
                  <VStack align="center">
                    <Text>{`Whoops! Looks like you don't have enough allowance (approved: ${userAllowance}, requesting: ${wizardPacket.deposited}).`}</Text>
                    <Text>
                      Staking transactions will fail; Please approve additional
                      allowance buffer funds.
                    </Text>
                    <Button
                      onClick={() => {
                        increaseAllowance(wizardPacket.deposited * 1.1);
                      }}
                    >{`Approve additional ${
                      wizardPacket.deposited * 1.1 - userAllowance
                    } coins`}</Button>
                    <Text>
                      Note: this banner will automatically disappear when the
                      approval is complete.
                    </Text>
                  </VStack>
                </AlertDescription>
              </Alert>
            )}
            {packetUi(wizardPacket)}
          </Step>
        </Steps>
      </Flex>
      {/* Wizard progression buttons */}
      <Flex width="80%" justify="flex-end">
        <Button
          isDisabled={activeStep === 0}
          mr={4}
          onClick={prevStep}
          size="sm"
          variant="ghost"
        >
          Prev
        </Button>
        <Button
          size="sm"
          disabled={
            activeStep === 3 &&
            wizardPacket.action !== Actions.withdraw &&
            allowanceDiff > 0
          }
          onClick={() => {
            nextStep();
            if (activeStep === 3) {
              // Execute
              executePacket(wizardPacket);
            }
            if (activeStep === 4) {
              // Reset
              setWizardPacket(defaultPacket);
              reset();
            }
          }}
        >
          {buttonText}
        </Button>
      </Flex>
      <Divider />
      {/* Overlays */}
      <Portal>
        <QuestionOverlay />
      </Portal>
    </Flex>
  );
};

export default Home;
