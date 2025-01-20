"use client";

import { useState } from "react";
import { Box, Button, Input, VStack, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  
function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      setCookie("authenticated", "true", { maxAge: 60 * 60 }); // Valide pour 1 heure
      router.push("/questionnaire");
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