"use client";

import { Button as ChakraButton } from "@app-providers/chakra-ui";

function Button({ children, variant, ...restProps }) {
  switch (variant) {
    case "solid":
      return (
        <ChakraButton
          fontSize={{ base: "sm", md: "md" }}
          transform="auto-gpu"
          transition={`
            transform .3s cubic-bezier(.175,.885,.32,1.275), 
            border - color .2s cubic - bezier(.39, .575, .565, 1),
            background - color .2s cubic - bezier(.39, .575, .565, 1)
          `}
          _hover={{
            transform: "scale(1.05)",
          }}
          {...restProps}
        >
          {children}
        </ChakraButton>
      );
    case "outline":
      return (
        <ChakraButton
          variant={variant}
          fontSize={{ base: "sm", md: "md" }}
          transform="auto-gpu"
          transition={`
            transform .3s cubic-bezier(.175,.885,.32,1.275), 
            border - color .2s cubic - bezier(.39, .575, .565, 1),
            background - color .2s cubic - bezier(.39, .575, .565, 1)
          `}
          _hover={{
            transform: "scale(1.05)",
          }}
          {...restProps}
        >
          {children}
        </ChakraButton>
      );
    case "ghost":
      return (
        <ChakraButton
          variant={variant}
          fontSize={{ base: "sm", md: "md" }}
          transform="auto-gpu"
          transition={`
            transform .3s cubic-bezier(.175,.885,.32,1.275)
          `}
          _hover={{
            transform: "scale(1.05)",
          }}
          {...restProps}
        >
          {children}
        </ChakraButton>
      );
  }
}

export { Button };
