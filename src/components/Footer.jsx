import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

// const avatarSrc = "../assets/myphoto.png";

const Footer = () => {
  return (
    <Box
      bgColor={"blackAlpha.900"}
      color={"whiteAlpha.700"}
      minH={"48"}
      px={"16"}
      py={["16", "8"]}
    >
      <Stack direction={["column", "row"]} h={"full"} alignItems={"center"}>
        <VStack w={"full"} alignItems={["center", "flex-start"]}>
          <Text fontWeight={"bold"}>About Us</Text>
          <Text
            fontSize={"sm"}
            letterSpacing={"widest"}
            textAlign={["center", "left"]}
          >
            Made with ❤️ by the U&T
          </Text>
        </VStack>

        {/* <VStack>
          <Avatar boxSize={"28"} mt={["4", "0"]} src={avatarSrc} />
          <Text>Our Founders</Text>
        </VStack> */}
      </Stack>
    </Box>
  );
};

export default Footer;