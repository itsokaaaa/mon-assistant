"use client";

import { Box, Button, Heading, Textarea, HStack} from "@chakra-ui/react";
import generateReportText from "@/libs/textGenerator";
import { useState } from "react";
import { Question } from "./Questionnaire";

interface QuestionnaireEndProps {
  answers: Record<string, string | string[] | Record<string, string | string[]> | File[]>;
  onRestart: () => void;
  questions: Question[];
}

export default function QuestionnaireEnd({
  answers,
  onRestart,
}: QuestionnaireEndProps) {
  // Filter out File[] from answers to pass only valid types to generateReportText
  const sanitizedAnswers = Object.fromEntries(
    Object.entries(answers).filter(
      ([, value]) => !(Array.isArray(value) && value.length > 0 && value[0] instanceof File)
    )
  ) as Record<string, string | string[] | Record<string, string | string[]>>;

  const [reportText, setReportText] = useState(generateReportText(sanitizedAnswers));

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
      <Heading mb={4}>Résumé</Heading>
      <Textarea
        value={reportText}
        onChange={handleTextChange}
        rows={10}
        resize="vertical"
        border="1px solid gray"
        mb={4}
      />
      <HStack spacing={4} justify="center" mb={6}>
        <Button colorScheme="blue" onClick={handleCopy}>
          Copier
        </Button>
        <Button colorScheme="red" onClick={onRestart}>
          Recommencer
        </Button>
      </HStack>
    </Box>
  );
}