import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import theme from "../styles/theme";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig client={client}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </WagmiConfig>
    </>
  );
}
