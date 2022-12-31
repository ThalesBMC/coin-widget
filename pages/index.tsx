import { Inter } from "@next/font/google";
import React, { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Icon,
  Text,
  useColorMode,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import { AssetsTable } from "../components/AssetsTable";
import { Wallet } from "../components/Wallet";
import { AiFillHome } from "react-icons/ai";
import { IoMdWallet } from "react-icons/io";
import { RiSunFill } from "react-icons/ri";

interface AssetsType {
  name: string;
  symbol: string;
  last_price: number;
  maker_fee: number;
  taker_fee: number;
  address: string;
}

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const color = useColorModeValue("gray.800", "whiteAlpha.900");
  const [assets, setAssets] = useState<AssetsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ascending, setAscending] = useState(true);

  const orderAssetsByPriceAscending = useCallback(() => {
    setAssets(
      assets.sort((a, b) =>
        a.last_price > b.last_price ? -1 : a.last_price < b.last_price ? 1 : 0
      )
    );
    setAscending(true);
  }, [assets]);

  const orderAssetsByPriceDescending = useCallback(() => {
    setAssets(
      assets.sort((a, b) =>
        a.last_price < b.last_price ? -1 : a.last_price > b.last_price ? 1 : 0
      )
    );
    setAscending(false);
  }, [assets]);

  const fetchAssetsData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.energiswap.exchange/v1/assets");
      if (response) {
        const data = await response.json();

        // Convert the data object into an array of AssetsType objects

        const assetsData: AssetsType[] = Object.keys(data).map((key) => ({
          ...data[key],
          address: key,
        }));

        return assetsData;
      } else {
        return [];
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch the assets data when the component mounts
    async function getAssetsData() {
      const assets = await fetchAssetsData();
      setIsLoading(false);
      if (assets) {
        setAssets(assets);
        orderAssetsByPriceAscending();
      }
    }
    getAssetsData();
  }, [orderAssetsByPriceAscending]);

  return (
    <Flex height="100%" direction="column" mt="6">
      <Flex>
        <Tabs align="center" variant="unstyled" w="100%" ml="12">
          <TabList border="none">
            <Flex justifyContent="center">
              <Tab
                gap="4"
                borderBottom="3px solid"
                borderBottomColor="transparent"
                color="gray.400"
                _selected={{
                  color: color,

                  borderBottomColor: "#00E676",
                }}
              >
                <Icon as={AiFillHome} />
                <Text>Home</Text>
              </Tab>

              <Tab
                color="gray.400"
                gap="4"
                borderBottom="3px solid"
                borderBottomColor="transparent"
                _selected={{
                  color: color,
                  borderBottomColor: "#00E676",
                }}
              >
                <Icon as={IoMdWallet} />
                <Text>Wallet</Text>
              </Tab>
            </Flex>
          </TabList>

          <TabPanels>
            <TabPanel>
              {!isLoading ? (
                <AssetsTable
                  assets={assets}
                  orderAscending={orderAssetsByPriceAscending}
                  orderDescending={orderAssetsByPriceDescending}
                  ascending={ascending}
                />
              ) : (
                <Spinner mt="12" size="xl" />
              )}
            </TabPanel>
            <TabPanel>
              <Wallet assets={assets} isLoading={isLoading} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex mt="3" mr="6">
          <Icon
            cursor="pointer"
            onClick={toggleColorMode}
            as={RiSunFill}
            w="6"
            h="6"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
