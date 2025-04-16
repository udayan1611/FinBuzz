// import React from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Link,
//   Text,
//   VStack,
// } from "@chakra-ui/react";
// import { Link as RouterLink } from "react-router-dom";

// const Login = () => {
//   return (
//     <Box
//       minH="80vh"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       bg="blackAlpha.900"
//       color="white"
//     >
//       <VStack spacing="4" w="md" p="8" borderWidth="1px" borderRadius="md">
//         <FormControl id="username">
//           <FormLabel>Username</FormLabel>
//           <Input type="text" placeholder="Enter username" />
//         </FormControl>
//         <FormControl id="password">
//           <FormLabel>Password</FormLabel>
//           <Input type="password" placeholder="Enter password" />
//         </FormControl>
//         <Button colorScheme="teal" w="full">
//           Login
//         </Button>
//         <Text>
//           Not registered?{" "}
//           <Link as={RouterLink} to="/signup" color="teal.300">
//             Sign Up
//           </Link>
//         </Text>
//       </VStack>
//     </Box>
//   );
// };

// export default Login;