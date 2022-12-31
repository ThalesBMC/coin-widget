import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultProvider } from "ethers";
import theme from "../styles/theme";

import { Chain } from "wagmi";

const energi: Chain = {
  id: 39797,
  name: "Energi Mainnet",
  network: "energi",
  nativeCurrency: {
    decimals: 18,
    name: "Energi",
    symbol: "NRG",
  },
  rpcUrls: {
    default: { http: ["https://nodeapi.energi.network"] },
  },
  blockExplorers: {
    default: {
      name: "Energi Explorer",
      url: "https://explorer.energi.network/",
    },
  },
};

const { provider, webSocketProvider } = configureChains(
  [mainnet, energi],
  [publicProvider()]
);
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
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
