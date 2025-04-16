
import { HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const CoinCard = ({
  id,
  name,
  img,
  symbol = "",
  price,
  currencySymbol = "₹",
}) => (
  <Link to={`/coin/${id}`}>
    <HStack
      w="100%"                 // stretches to full width of its container
      p="2"                    // slim vertical padding
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
        boxSize="6"            // smaller logo size
        objectFit="contain"
        alt="Coin Logo"
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
  </Link>
);

export default CoinCard;