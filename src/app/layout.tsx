"use client";

import { ReactNode } from "react";
import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import theme from "@/styles/theme";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, height: "100vh", overflow: "hidden" }}>
        <ChakraProvider theme={theme}>
          <Flex direction="column" height="100vh">
            {/* Header always at the top */}
            <Header />
            {/* Main content area */}
            <Box as="main" flex="1" p={6} overflowY="hidden">
              {children}
            </Box>
            {/* Footer always visible at the bottom */}
            <Footer />
          </Flex>
        </ChakraProvider>
      </body>
    </html>
  );
}