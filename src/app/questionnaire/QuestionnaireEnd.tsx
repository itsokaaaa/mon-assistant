"use client";

import { Box, Button, Heading, Textarea, HStack, VStack } from "@chakra-ui/react";
import generateReportText from "@/libs/textGenerator";
import { useState } from "react";
import { Question } from "./Questionnaire";

interface QuestionnaireEndProps {
    answers: Record<string, string | string[] | Record<string, string | string[]>>;
    onRestart: () => void;
    questions: Question[];
  }

export default function QuestionnaireEnd({
  answers,
  onRestart,
}: QuestionnaireEndProps) {
  const [reportText, setReportText] = useState(generateReportText(answers));

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReportText(e.target.value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      alert("Le texte a été copié dans le presse-papiers !");
    } catch (err) {
      console.error("Échec de la copie dans le presse-papiers", err);
    }
  };

  return (
    <Box textAlign="center" p={6}>
      <VStack spacing={6}>
        <Heading size="lg">Résumé du questionnaire</Heading>
        <Textarea
          value={reportText}
          onChange={handleTextChange}
          rows={15}
          resize="vertical"
          whiteSpace="pre-wrap" // Ensures `\n` is respected
          fontFamily="monospace"
        />
        <HStack spacing={4} justify="center">
          <Button colorScheme="blue" onClick={handleCopy}>
            Copier le texte
          </Button>
          <Button colorScheme="gray" variant="outline" onClick={onRestart}>
            Recommencer
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}