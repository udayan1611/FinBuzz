import { Box, Button, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Box bg="blackAlpha.900" boxShadow="md" px="8" py="4">
      <HStack justify="space-between" align="center">
        {/* Brand Logo / Name */}
        <Text fontSize="2xl" color="white" fontWeight="bold">
          FinBuzz
        </Text>
        {/* Navigation Buttons */}
        <HStack spacing="6">
          <Button variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
            <Link to="/exchanges">Exchanges</Link>
          </Button>
          <Button variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
            <Link to="/coins">Coins</Link>
          </Button>
          <Button variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
            <Link to="/compare">Compare Crypto</Link>
          </Button>
          <Button variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
            <Link to="/stocks">Stocks</Link>
          </Button>
          <Button variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
            <Link to="/Comparestocks">Crypto vs Stock</Link>
          </Button>

          {/* <Button variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
            <Link to="/Signup">Signup</Link>
          </Button> */}
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;