import React from "react";
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
  useColorModeValue,
  Image,
} from "@chakra-ui/react";

import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
export const Pagination = (props: any) => {
  const { numPages, currentPage, onPageChange } = props;

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Flex justify="center">
      <Icon
        as={BiSkipPrevious}
        onClick={handlePrevClick}
        w="6"
        h="6"
        cursor="pointer"
      />
      <span>{currentPage}</span>
      <Icon
        as={BiSkipNext}
        onClick={handleNextClick}
        w="6"
        h="6"
        cursor="pointer"
      />
    </Flex>
  );
};
