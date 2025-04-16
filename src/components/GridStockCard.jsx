import { Heading, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";

const GridStockCard = ({
  id,
  name,
  img,
  symbol,
  price,
  currencySymbol = "$",
}) => (
  <VStack
    w="52"
    shadow="lg"
    p="8"
    borderRadius="lg"
    transition="all 0.3s"
    m="4"
    _hover={{ transform: "scale(1.1)" }}
  >
    <Image
      src={img}
      w="10"
      h="10"
      objectFit="contain"
      alt="Stock Logo"
    />
    <Heading size="md" noOfLines={1}>
      {symbol}
    </Heading>
    <Text noOfLines={1}>{name}</Text>
    <Text noOfLines={1}>
      {price ? `${currencySymbol}${price}` : "NA"}
    </Text>
  </VStack>
);

export default GridStockCard;