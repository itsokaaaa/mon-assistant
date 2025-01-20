"use client";

import {Flex, Heading } from "@chakra-ui/react";

export default function Header() {
  return (
    <Flex
      as="header"
      bg="blue.500"
      color="white"
      p={4}
      justifyContent="center"
      alignItems="center"
      boxShadow="md"
    >
      <Heading as="h1" size="md">
        Mon Assistant Rapport
      </Heading>
    </Flex>
  );
}