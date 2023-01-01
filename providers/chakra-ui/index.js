"use client";

import customTheme from "@app-styles/theme";
import { ChakraProvider } from "@chakra-ui/react";

function ChakraWrapper({ children }) {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
}

export * from "@chakra-ui/react";
export { ChakraWrapper };
