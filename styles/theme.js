import { extendTheme } from "@chakra-ui/react";
import { Inter } from "@next/font/google";

const inter = Inter();

const breakpoints = {
  xs: "375px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

const styles = {
  global: {
    html: {
      padding: 0,
      margin: 0,
      scrollBehavior: "smooth",
    },
    body: {
      padding: 0,
      margin: 0,
      minW: "320px",
      color: "black",
      bg: "white",
      fontSize: { base: "sm", md: "md" },
      ...inter.style,
    },
    canvas: {
      position: "absolute",
      width: "full",
      height: "full",
    },
  },
};

const customTheme = extendTheme({
  breakpoints,
  styles,
  components: {
    Container: {
      baseStyle: {
        w: "full",
        maxW: "4xl",
        px: { base: "6", md: "4" },
        py: { base: "6", md: "8" },
      },
    },
    Heading: {
      baseStyle: {
        letterSpacing: "tighter",
        fontWeight: 800,
        ...inter.style,
      },
    },
    Link: {
      baseStyle: {
        color: "blue.600",
        borderBottom: { base: "1px dotted", lg: "2px dotted" },
        _hover: {
          textDecoration: "none",
          color: "blue.500",
        },
      },
    },
    Text: {
      baseStyle: {
        color: "gray.700",
        lineHeight: "tall",
      },
    },
  },
});

export default customTheme;
