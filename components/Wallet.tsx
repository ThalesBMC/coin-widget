import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Flex,
  Icon,
  Text,
  Image,
  useColorModeValue,
  Heading,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useAccount, useConnect, useBalance, useNetwork } from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";
import { GoPrimitiveDot } from "react-icons/go";
import { MdContentCopy, MdOpenInNew } from "react-icons/md";

import AssetsType from "../types/AssetsType";

type AssetsProps = {
  assets: AssetsType[];
  isLoading: Boolean;
};

export const Wallet = ({ assets, isLoading }: AssetsProps) => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] =
    useState<boolean>(false);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<string | undefined>("");
  const [usdPrice, setUsdPrice] = useState("");

  const { address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const bg = useColorModeValue("whiteAlpha.900", "gray.900");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const { chain } = useNetwork();
  const { data } = useBalance({
    address: address,
    chainId: chain?.id,
  });

  useEffect(() => {
    const verifyMetamaskAndNetwork = async () => {
      // Check if Metamask is installed and `window` is available
      if (typeof window !== "undefined" && window.ethereum) {
        setIsMetamaskInstalled(true);

        // Check if the network is correct
        if (window.ethereum.networkVersion !== 39797) {
          try {
            // Attempt to switch to the correct network
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x9B75" }],
            });
          } catch (err: any) {
            console.log("Error switching networks:", err);
            // If the error is code 4902, add the correct network
            if (err.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainName: "Energi Mainnet",
                    chainId: "0x9B75",
                    nativeCurrency: {
                      name: "Energi",
                      decimals: 18,
                      symbol: "NRG",
                    },
                    rpcUrls: ["https://nodeapi.energi.network"],
                    blockExplorerUrls: ["https://explorer.energi.network/"],
                  },
                ],
              });
            }
          }
        }
      }
    };
    verifyMetamaskAndNetwork();
  }, []);

  const copyTextToClipboard = useCallback(async () => {
    if (!address) return null;

    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(address);
    } else {
      return document.execCommand("copy", true, address);
    }
  }, [address]);

  const formatAddress = useCallback(() => {
    if (!address) return "";
    return `${address?.slice(0, 6)}...${address?.slice(
      address.length - 4,
      address.length
    )}`;
  }, [address]);

  useEffect(() => {
    setFormattedAddress(formatAddress());
  }, [address, formatAddress]);

  useEffect(() => {
    setTokenBalance(data?.formatted.slice(0, 6));
  }, [tokenBalance, data?.formatted]);

  useEffect(() => {
    const getUsdPrice = async () => {
      if (!data) {
        return 0;
      }
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );

      if (response) {
        const priceData = await response.json();
        console.log(
          parseFloat(data.formatted),
          parseFloat(priceData.ethereum.usd)
        );
        const value =
          parseFloat(data.formatted) * parseFloat(priceData.ethereum.usd);

        setUsdPrice(value.toString().slice(0, 6));
      }
    };
    getUsdPrice();
  }, [data]);

  const getNetworkName = useMemo(() => {
    const chainId = chain?.id;
    switch (chainId) {
      case 1:
        return "Main Ethereum network";
      case 39797:
        return "Energi Network";
    }
  }, [chain?.id]);

  return (
    <>
      {!formattedAddress ? (
        <>
          <Flex justifyContent="center">
            {isMetamaskInstalled ? (
              <Flex flexDirection="column" gap="4">
                <Image
                  src="/assets/metamask.svg"
                  w="56"
                  h="56"
                  alt="metamask"
                />
                <Heading>Metamask</Heading>
                <Button bg="#00E676" color="white" onClick={() => connect()}>
                  Connect Wallet
                </Button>
              </Flex>
            ) : (
              <p>Install Your Metamask wallet</p>
            )}
          </Flex>
        </>
      ) : (
        <Flex
          bg={bg}
          borderRadius="md"
          height="xl"
          w="4xl"
          flexDirection="column"
          align="center"
        >
          <Flex
            justifyContent="space-between"
            w="95%"
            align="center"
            pt="4"
            pb="2"
            borderBottom="1px solid"
            borderColor={borderColor}
            height="min-content"
          >
            <Flex>
              <Image
                src={
                  data?.symbol === "NRG"
                    ? `assets/icons/WNRG.svg`
                    : `assets/icons/${data?.symbol.toUpperCase()}.svg`
                }
                alt="WNRG"
                w="6"
                h="6"
              />
              <Text ml="2" fontWeight="bold">
                {getNetworkName}
              </Text>
            </Flex>
            <Flex align="center" gap="1">
              <Icon as={GoPrimitiveDot} color="#32CD32" />
              <Text color="#32CD32">Connected</Text>
            </Flex>
          </Flex>
          <Flex
            justifyContent="space-between"
            w="95%"
            align="center"
            pt="4"
            pb="2"
            height="min-content"
          >
            <Flex>
              <Image src="assets/metamask.svg" alt="Metamask" w="6" h="6" />
              <Text ml="2">{formattedAddress}</Text>
            </Flex>
            <Flex align="center" gap="4">
              <Icon
                as={MdContentCopy}
                w="6"
                h="6"
                cursor="pointer"
                onClick={copyTextToClipboard}
              />
              <Icon
                as={MdOpenInNew}
                w="6"
                h="6"
                cursor="pointer"
                onClick={() =>
                  chain?.id === 39797
                    ? window.open(
                        `https://explorer.energi.network/address/${address}`,
                        "_blank"
                      )
                    : window.open(
                        `https://etherscan.io/address/${address}`,
                        "_blank"
                      )
                }
              />
            </Flex>
          </Flex>
          <Flex>
            <Flex
              flexDirection="column"
              justify="center"
              align="center"
              gap="6"
            >
              <Text color="gray.500">Total Balance</Text>
              {!isLoading ? (
                <>
                  <Flex align="center" gap="4">
                    <Image
                      src={
                        data?.symbol === "NRG"
                          ? `assets/icons/WNRG.svg`
                          : `assets/icons/${data?.symbol.toUpperCase()}.svg`
                      }
                      w="16"
                      h="16"
                      alt="nrg"
                    />
                    <Text fontWeight="bold" fontSize="32">
                      {tokenBalance}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Text fontSize="48" fontWeight="bold">
                      $ {usdPrice}
                    </Text>
                  </Flex>
                </>
              ) : (
                <Spinner mt="12" size="xl" />
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};
