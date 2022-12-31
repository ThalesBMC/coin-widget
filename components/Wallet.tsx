import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Link,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Button,
  Th,
  Td,
  Text,
  useColorMode,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import {
  useAccount,
  useConnect,
  useSwitchNetwork,
  useNetwork,
  useBalance,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { GoPrimitiveDot } from "react-icons/go";
import { MdContentCopy, MdOpenInNew } from "react-icons/Md";
import { IoLogoUsd } from "react-icons/io";

interface AssetsType {
  name: string;
  symbol: string;
  last_price: number;
  maker_fee: number;
  taker_fee: number;
  address: string;
}
type AssetsProps = {
  assets: AssetsType[];
};

export const Wallet = ({ assets }: AssetsProps) => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] =
    useState<boolean>(false);
  const [formatedAddress, setFormatedAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<string | undefined>("");

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const bg = useColorModeValue("whiteAlpha.900", "gray.900");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const { data, isLoading } = useBalance({
    address: address,
    token: "0x1416946162b1c2c871a73b07e932d2fb6c932069",
  });

  useEffect(() => {
    if ((window as any).ethereum) {
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
    }
  }, []);

  async function copyTextToClipboard() {
    if (!address) return null;

    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(address);
    } else {
      return document.execCommand("copy", true, address);
    }
  }

  const getUsdPrice = () => {
    if (!assets || !data) {
      return null;
    }

    if (data?.symbol === "NRG") {
      const filteredToken = assets.find((e) => e.symbol === "WNRG");

      if (!filteredToken) {
        return null;
      }
      const value = filteredToken.last_price * parseFloat(data.formatted);

      return value.toString().slice(0, 6);
    } else {
      const filteredToken = assets.find((e) => e.symbol === data.symbol);

      if (!filteredToken) {
        return null;
      }

      const value = filteredToken.last_price * parseFloat(data.formatted);

      return value.toString().slice(0, 6);
    }
  };
  const formatAddress = useCallback(() => {
    return `${address?.slice(0, 6)}...${address?.slice(
      address.length - 4,
      address.length
    )}`;
  }, [address]);

  useEffect(() => {
    setFormatedAddress(formatAddress());
  }, [address, formatAddress]);

  useEffect(() => {
    setTokenBalance(data?.formatted.slice(0, 6));
  }, [tokenBalance, data?.formatted]);

  return (
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
          <Text ml="2">{formatedAddress}</Text>
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
        <Flex flexDirection="column" justify="center" align="center" gap="6">
          <Text color="gray.500">Total Balance</Text>
          <Flex align="center" gap="4">
            <Image src={`assets/icons/WNRG.svg`} w="16" h="16" alt="nrg" />
            <Text fontWeight="bold" fontSize="32">
              {tokenBalance}
            </Text>
          </Flex>
          <Flex align="center">
            <Text fontSize="48" fontWeight="bold">
              ${getUsdPrice()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};