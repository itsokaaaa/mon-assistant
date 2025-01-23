"use client";

import { useEffect, useState } from "react";
import { Box, Heading, VStack, Text } from "@chakra-ui/react";
import { getReportCounts } from "@/libs/reportTracker";

export default function AdminDashboard() {
  const [userReports, setUserReports] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch the report counts
    setUserReports(getReportCounts());
  }, []);

  return (
    <Box p={8} maxWidth="800px" mx="auto" mt="10%">
      <Heading mb={6}>Admin Dashboard</Heading>
      <VStack spacing={4} align="stretch">
        {Object.entries(userReports).map(([user, count]) => (
          <Text key={user}>
            {user}: {count} rapports générés
          </Text>
        ))}
      </VStack> 
    </Box>
  );
}