"use client";

import {Text, Flex } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      as="footer"
      bg="blue.500"
      color="white"
      p={4}
      justifyContent="center"
      alignItems="center"
      boxShadow="md"
      mt="auto"
    >
      <Text fontSize="sm">© {new Date().getFullYear()} Mon Assistant Rapport</Text>
    </Flex>
  );
}