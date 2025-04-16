import { HStack, Image, Text } from "@chakra-ui/react";
import React from "react";

const StockCard = ({
  id,
  name,
  img,
  symbol = "",
  price,
  currencySymbol = "$",
}) => (
  <HStack
    w="100%"
    p="2"
    spacing="4"
    alignItems="center"
    borderWidth="1px"
    borderColor="gray.200"
    borderRadius="md"
    _hover={{ bg: "gray.100", transform: "scale(1.02)" }}
    transition="all 0.3s"
    m="1"
  >
    <Image
      src={img}
      boxSize="6"
      objectFit="contain"
      alt="Stock Logo"
    />
    <Text fontWeight="bold" fontSize="sm" w="40px">
      {symbol?.toUpperCase()}
    </Text>
    <Text fontSize="sm" flex="1" noOfLines={1}>
      {name}
    </Text>
    <Text fontSize="sm">
      {price ? `${currencySymbol}${price}` : "NA"}
    </Text>
  </HStack>
);

export default StockCard;