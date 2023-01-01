import { NextChakraLink, NextChakraLinkIconButton } from "@app-components/link";
import { ButtonGroup, Container, Stack, Text } from "@app-providers/chakra-ui";
import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const footerSocials = [
  {
    name: "Email",
    href: "mailto:hello@pravastacaraka.my.id",
    icon: FaEnvelope,
  },
  {
    name: "Github",
    href: "https://github.com/pravastacaraka",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/pravastacaraka",
    icon: FaLinkedinIn,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/pravastacaraka",
    icon: FaFacebook,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/pravastacaraka",
    icon: FaTwitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/pravastacaraka",
    icon: FaInstagram,
  },
];

function Footer() {
  const date = new Date().getFullYear();
  return (
    <Container as="footer">
      <Stack align="center" textAlign="center">
        <ButtonGroup>
          {footerSocials.map((social) => (
            <NextChakraLinkIconButton
              key={social.name}
              href={social.href}
              aria-label={social.name}
              icon={<social.icon />}
              isExternal={true}
            />
          ))}
        </ButtonGroup>
        <Stack spacing={0}>
          <Text>
            Made using&nbsp;
            <NextChakraLink href="https://nextjs.org/" isExternal={true}>
              Next.js
            </NextChakraLink>
            ,&nbsp;
            <NextChakraLink href="https://chakra-ui.com/" isExternal={true}>
              Chakra UI
            </NextChakraLink>
            ,&nbsp;
            <NextChakraLink href="https://github.com/ultralytics/yolov5" isExternal={true}>
              YOLOv5
            </NextChakraLink>
            , and&nbsp;
            <NextChakraLink href="https://js.tensorflow.org/" isExternal={true}>
              Tensorflow.js
            </NextChakraLink>
            . Hosted in&nbsp;
            <NextChakraLink href="https://vercel.com/" isExternal={true}>
              Vercel
            </NextChakraLink>
          </Text>
          <Text>MIT License © {date} Pravasta Caraka Bramastagiri</Text>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Footer;
