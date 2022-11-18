import '@fontsource/roboto-mono'; 
import { ChakraProvider } from "@chakra-ui/react";

import customTheme from "styles/theme";

interface ChakraProps {
  children: React.ReactNode;
}

const Chakra = ({ children }: ChakraProps) => {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
};

export default Chakra;
