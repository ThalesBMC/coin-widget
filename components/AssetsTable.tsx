import React, { useState } from "react";
import {
  Box,
  Flex,
  Icon,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";

import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { Pagination } from "./Pagination";
import AssetsType from "../types/AssetsType";

type TableProps = {
  assets: AssetsType[];
  orderAscending: () => void;
  orderDescending: () => void;
  ascending: Boolean;
};

export const AssetsTable = ({
  assets,
  orderAscending,
  orderDescending,
  ascending,
}: TableProps) => {
  const color = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.100", "gray.800");

  const rowsPerPage = 10;
  const numPages = Math.ceil(assets.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const rowsToRender = assets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  return (
    <Box p={4}>
      <Table
        w="50%"
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
      >
        <Thead>
          <Tr>
            <Th>
              <Text fontWeight="bold" color={color}>
                #
              </Text>
            </Th>
            <Th>
              <Text fontWeight="bold" color={color}>
                Coin
              </Text>
            </Th>
            <Th>
              <Text fontWeight="bold" color={color}>
                Symbol
              </Text>
            </Th>
            <Th>
              <Stack isInline align="center">
                <Icon
                  as={ascending ? GoTriangleUp : GoTriangleDown}
                  onClick={ascending ? orderDescending : orderAscending}
                  w="4"
                  h="4"
                  cursor="pointer"
                />

                <Text fontWeight="bold" color={color}>
                  Price (USD)
                </Text>
              </Stack>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rowsToRender.map((token, index) => (
            <Tr key={token.symbol}>
              <Td width="20%">
                <Flex align="center">
                  <Text fontWeight="bold">
                    {index + 1 + 10 * (currentPage - 1)}
                  </Text>
                </Flex>
              </Td>
              <Td w="40%">
                <Stack isInline align="center">
                  <Image src={token.image} w="6" h="6" alt={token.symbol} />
                  <Text fontSize="sm" color={color}>
                    {token.name}
                  </Text>
                </Stack>
              </Td>
              <Td width="20%">{token.symbol}</Td>

              <Td width="20%">
                <Text>${token.last_price.toLocaleString("en-US")}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        numPages={numPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};
