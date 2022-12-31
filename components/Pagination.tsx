import React, { useCallback } from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";

import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
export const Pagination = (props: any) => {
  const { numPages, currentPage, onPageChange } = props;

  const handlePrevClick = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextClick = useCallback(() => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, onPageChange, numPages]);

  return (
    <Flex justify="center">
      <Icon
        as={BiSkipPrevious}
        onClick={handlePrevClick}
        w="6"
        h="6"
        cursor="pointer"
      />
      <Text as="span">{currentPage}</Text>
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
