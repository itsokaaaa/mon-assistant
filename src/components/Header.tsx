"use client";

import { Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const [sessionName, setSessionName] = useState<string | null>(null);

  useEffect(() => {
    // Debugging cookie fetching
    console.log("Fetching role from cookies...");
    const sessionRole = getCookie("role") as string | undefined;
    console.log("Fetched role:", sessionRole);

    if (sessionRole === "admin") {
      setSessionName("Admin");
    } else if (sessionRole === "user") {
      setSessionName("User");
    } else {
      setSessionName(null); // Clear session name if no valid role
    }
  }, [pathname]); // Update session name if the route changes

  const handleLogout = () => {
    console.log("Logging out...");
    deleteCookie("authenticated");
    deleteCookie("role");
    setSessionName(null); // Clear the session name
    router.push("/login");
  };

  return (
    <Flex
      as="header"
      justifyContent="space-between"
      alignItems="center"
      p={4}
      bg="blue.500"
      color="white"
    >
      {/* Display the session name if it exists */}
      <Heading size="md">{sessionName ? sessionName : ""}</Heading>

      {/* Show logout button only if sessionName exists and not on login page */}
      {pathname !== "/login" && sessionName && (
        <Button
          size="sm"
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.400" }}
          onClick={handleLogout}
        >
          LOGOUT
        </Button>
      )}
    </Flex>
  );
}