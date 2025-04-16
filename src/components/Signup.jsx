import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Signup = () => {
  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="blackAlpha.900"
      color="white"
    >
      <VStack spacing="4" w="md" p="8" borderWidth="1px" borderRadius="md">
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input type="text" placeholder="Enter full name" />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter email" />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter password" />
        </FormControl>
        <FormControl id="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" placeholder="Confirm password" />
        </FormControl>
        <Button colorScheme="teal" w="full">
          Sign Up
        </Button>
        <Text>
          Already have an account?{" "}
          <Link as={RouterLink} to="/login" color="teal.300">
            Login
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Signup;