import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm" color="gray.500">
        {new Date().getFullYear()} -{" "}
        <Link
          href="https://boredapeyachtclub.com/#/"
          isExternal
          rel="noopener noreferrer"
        >
          Built for the Ape Community
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
