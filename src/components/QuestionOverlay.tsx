import {
    Box,
    Button,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Text,
    useColorMode,
    VStack,
  } from "@chakra-ui/react";
  
  import { IoMdHelpCircle } from "react-icons/io";

  
  export function QuestionOverlay() {
    // Colors
    const { colorMode } = useColorMode();

    // Render the UI!
    return (
      <Box position="fixed" left="35px" bottom="35px" zIndex="999">
        <Menu>
          {/* Question button */}
          <MenuButton
            as={Button}
            variant="navStyle"
            opacity="90%"
            _active={{ opacity: "100%" }}
          >
            <HStack justify="center">
              <Icon as={IoMdHelpCircle} color="brand.white" h="30px" w="30px" />
              <Text variant="subtitle" color="brand.white">
                Questions?
              </Text>
            </HStack>
          </MenuButton>
          <MenuList bg={colorMode === "light" ? "gray.100" : "gray.700"} border="none" p="2rem" opacity="60%">
            {/* Include hidden menu to prevent autofocus */}
            <MenuItem hidden />
            <VStack align="start" w="1400px">
              {/* Helper text */}
              <Text color="brand.white" fontWeight="bold">
                 STAKING AND UNCLAIMED REWARDS
              </Text>
              <ul color="brand.white">
                <li>Unclaimed rewards can be claimed at any time without the need to also claim
                    staked APE and without affecting the commitment status of an NFT</li>
                <li>All accrued APE generated from a stake is claimed at once, when initiating a claim. </li>
                <li>Staked APE is still valid to be used to vote in the ApeCoin DAO.</li>
                <li>Staked APE and accrued rewards attach to the committed NFT. The same NFT 
                    needs to be present in the wallet to claim accrued rewards, as well as 
                    the original staked amount when the NFT is uncommitted.</li>
                <li>$APE REWARDS ACCRUE TO THE COMMITTED BAYC / MAYC / BAKC IN THE NFT POOLS.
                    IF YOU SELL OR TRANSFER YOUR NFT, THE NEW WALLET WILL BE ABLE TO CLAIM
                    YOUR ORIGINAL STAKED AMOUNT + ANY ACCRUED REWARDS</li>
              </ul>
            </VStack>
            <Spacer h="1rem" />
            <VStack align="start" w="1400px">
              {/* Helper text */}
              <Text color="brand.white" fontWeight="bold">
                 CLAIMING AND ALLOCATIONS
              </Text>
              <Text>Staking minimum is 1 $APE </Text>
              <ul color="brand.white">
                 <li>APE ONLY: No NFTs required. The total staking allocation for this pool is 30,000,000 $APE in Year 1.
                    Staked APE and accrued rewards can be claimed directly by the original staking wallet. </li>
                 <li>BAYC + APE: Up to 10,094 $APE can be staked per BAYC owned. The total staking allocation for this 
                    pool is 47,105,000 $APE in Year 1. 
                    Staked APE and rewards can be redeemed by the wallet holding the committed BAYC. 
                    </li>
                 <li>MAYC + APE: Up to 2,042 $APE can be staked per MAYC owned. The total staking allocation for this pool
                     is 19,060,000 $APE in Year 1. 
                     Staked APE and rewards can be redeemed by the wallet holding the committed MAYC.</li>
                 <li>BAKC + BAYC/MAYC + APE: Up to 856 $APE can be staked per BAKC owned. A BAKC cannot be staked alone, and must be paired with a BAYC or MAYC. 
                    Paired BAYC or MAYC can still be committed to other pools. Once a BAYC or MAYC is paired with a BAKC, the BAYC or MAYC cannot be paired with 
                    another BAKC, unless the original BAKC that was paired is uncommitted to the pool. The total staking pool for a BAKC pairing is 3,835,000 
                    $APE for Year 1.
                    If a BAKC is transferred or sold when paired and committed in this pool, 
                    the owner of the BAYC or MAYC is entitled to the staked amount, whereas the owner of the BAKC is 
                    entitled to any unclaimed rewards associated with the staking position.</li>
              </ul>
            </VStack>
            {/* Docs button */}
            <MenuItem
              as={Button}
              variant="questions"
              _hover={{ color: "black" }}
              onClick={() => {
                window.open("https://docs.apestake.io/#/");
              }}
            >
              FULL DOCUMENTATION
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  }