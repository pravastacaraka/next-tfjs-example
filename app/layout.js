import Footer from "@app-components/footer";
import { ChakraWrapper } from "@app-providers/chakra-ui";
import { Analytics } from "@app-providers/vercel";

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraWrapper>
          {children}
          <Footer />
          <Analytics />
        </ChakraWrapper>
      </body>
    </html>
  );
}

export default RootLayout;
