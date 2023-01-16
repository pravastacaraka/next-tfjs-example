import Footer from "@app-components/footer";
import { ChakraWrapper, Container } from "@app-providers/chakra-ui";
import { Analytics } from "@app-providers/vercel";

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraWrapper>
          <Container as="main" display="grid" px={4} py={{ base: 4, md: 8 }}>
            {children}
            <Analytics />
          </Container>
          <Footer />
        </ChakraWrapper>
      </body>
    </html>
  );
}

export default RootLayout;
