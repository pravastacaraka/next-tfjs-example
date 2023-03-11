import { Link as ChakraLink, IconButton } from "@app-providers/chakra-ui";
import NextLink from "next/link";

const NextChakraLink = ({ href, as, replace, scroll, shallow, prefetch, isExternal = false, ...chakraProps }) => {
  return (
    <ChakraLink
      as={NextLink}
      href={href}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      {...chakraProps}
    />
  );
};

const NextChakraLinkIconButton = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  isExternal = false,
  ...chakraProps
}) => {
  return (
    <IconButton
      as={NextLink}
      href={href}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      variant="ghost"
      transition="transform .3s cubic-bezier(.175,.885,.32,1.275), border-color .2s cubic-bezier(.39,.575,.565,1), background-color .2s cubic-bezier(.39,.575,.565,1)"
      _hover={{
        transform: "scale(1.05)",
      }}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      {...chakraProps}
    />
  );
};

export { NextChakraLink, NextChakraLinkIconButton };
