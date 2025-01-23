"use client";

import { useState } from "react";
import { Box, Button, Input, VStack, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { users } from "@/libs/users"; // This parses the NEXT_PUBLIC_USERS environment variable

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleLogin() {
    if (users[password]) {
      // Save the user role and information in cookies
      setCookie("authenticated", password, { maxAge: 60 * 60 }); // Valid for 1 hour
      setCookie("role", users[password], { maxAge: 60 * 60 }); // Save role in cookies
      if (users[password] === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/user-dashboard");
      }
    } else {
      setError(true);
    }
  }

  return (
    <Box p={8} maxWidth="400px" mx="auto" mt="10%">
      <Heading mb={6}>Connexion</Heading>
      <VStack spacing={4}>
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Box color="red.500">Mot de passe incorrect.</Box>}
        <Button colorScheme="blue" onClick={handleLogin}>
          Connexion
        </Button>
      </VStack>
    </Box>
  );
}