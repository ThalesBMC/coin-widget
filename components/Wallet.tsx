import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Flex,
  Icon,
  Text,
  Image,
  useColorModeValue,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useAccount, useConnect, useBalance } from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";
import { GoPrimitiveDot } from "react-icons/go";
import { MdContentCopy, MdOpenInNew } from "react-icons/Md";

import AssetsType from "../types/AssetsType";

type AssetsProps = {
  assets: AssetsType[];
};

export const Wallet = ({ assets }: AssetsProps) => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] =
    useState<boolean>(false);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<string | undefined>("");

  const { address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const bg = useColorModeValue("whiteAlpha.900", "gray.900");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const { data } = useBalance({
    address: address,
    token: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  });

  useEffect(() => {
    if ((window as any).ethereum) {
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
    }
  }, []);

  const copyTextToClipboard = useCallback(async () => {
    if (!address) return null;

    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(address);
    } else {
      return document.execCommand("copy", true, address);
    }
  }, [address]);

  const getUsdPrice = useMemo(() => {
    if (!assets || !data) {
      return 0;
    }

    if (data?.symbol === "NRG") {
      const filteredToken = assets.find((e) => e.symbol === "WNRG");

      if (!filteredToken) {
        return 0;
      }
      const value = filteredToken.last_price * parseFloat(data.formatted);

      return value.toString().slice(0, 6);
    } else {
      const filteredToken = assets.find((e) => e.symbol === data.symbol);

      if (!filteredToken) {
        return 0;
      }

      const value = filteredToken.last_price * parseFloat(data.formatted);

      return value.toString().slice(0, 6);
    }
  }, [assets, data]);

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

  return (
    <>
      {!formattedAddress ? (
        //Used formatAddress to verify if the user is connect to deal with dehydration problem, but it`s not a elegant solution.
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
              <Image src={`assets/icons/WNRG.svg`} alt="WNRG" w="6" h="6" />
              <Text ml="2" fontWeight="bold">
                Energi Network
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
                  window.open(
                    `https://explorer.energi.network/address/${address}/transactions`,
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
              {data?.formatted ? (
                <>
                  <Flex align="center" gap="4">
                    <Image
                      src={`assets/icons/WNRG.svg`}
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
                      $ {getUsdPrice}
                    </Text>
                  </Flex>
                </>
              ) : (
                <>Loading</>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};
