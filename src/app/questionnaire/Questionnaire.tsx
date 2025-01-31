"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import questionsData from "@/data/questions.json";
import FormStep from "./FormStep";
import QuestionnaireEnd from "./QuestionnaireEnd";
import { shouldSkipQuestion } from "./skipConditions"; // Import skip logic
import { incrementReportCount } from "@/libs/reportTracker"; // Import the report tracker

interface Field {
  key: string;
  label: string;
  type: "text" | "radio";
  options?: string[];
}

export interface Question {
  key: string;
  text: string;
  type: "text" | "number" | "radio" | "checkbox" | "multi-field" | "files";
  options?: string[];
  fields?: Field[];
  next: Record<string, string | undefined>;
}

export default function Questionnaire() {
  const [history, setHistory] = useState<string[]>(["assure_details"]);
  const [answers, setAnswers] = useState<
    Record<string, string | string[] | Record<string, string | string[]> | File[]>
  >({});
  const questions: Question[] = questionsData as Question[];

  const currentQuestionKey = history[history.length - 1];
  const currentQuestion = questions.find((q) => q.key === currentQuestionKey);

  const historyRef = useRef<HTMLDivElement>(null);

  function handleRestart() {
    setHistory(["assure_details"]);
    setAnswers({});
  }

  function handleNext(answer: string | string[] | Record<string, string | string[]> | File[]) {
    setAnswers((prev) => ({ ...prev, [currentQuestionKey]: answer }));

    if (!currentQuestion) return;

    let nextKey =
      typeof answer === "string"
        ? currentQuestion.next?.[answer] || currentQuestion.next?.default
        : currentQuestion.next?.default;

    // Skip logic: find the next question that should not be skipped
    while (nextKey && shouldSkipQuestion(nextKey, answers)) {
      const nextQuestion = questions.find((q) => q.key === nextKey);
      nextKey = nextQuestion?.next?.default;
    }

    if (nextKey) {
      setHistory((prev) => [...prev, nextKey]);
    } else {
      setHistory((prev) => [...prev, "END"]);
    }
  }

  function handlePrevious() {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  }

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [answers]);

  useEffect(() => {
    if (currentQuestionKey === "END") {
      const user = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authenticated="))
        ?.split("=")[1];

      if (user) {
        incrementReportCount(user); // Increment the report count for the user
      }
    }
  }, [currentQuestionKey]);

  if (!currentQuestion || currentQuestionKey === "END") {
    return (
      <Flex align="center" justify="center" minH="50vh" bgGradient="white" p={6}>
        <Box
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="lg"
          width={{ base: "90%", md: "800px" }}
        >
          <QuestionnaireEnd
            answers={answers as Record<string, string | string[] | Record<string, string | string[]>>}
            onRestart={handleRestart}
            questions={questions}
          />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} justify="center" align="flex-start" minH="100vh" p={6} gap={6}>
      {/* Question Card */}
      <Box bg="white" p={8} borderRadius="md" boxShadow="lg" width={{ base: "100%", md: "50%" }}>
        <Heading size="lg" mb={6}>
          {currentQuestion.text}
        </Heading>
        <FormStep
          question={currentQuestion}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirstQuestion={history.length === 1}
        />
      </Box>

      {/* Answer History */}
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        width={{ base: "100%", md: "50%" }}
        maxH="500px"
        overflowY="auto"
        ref={historyRef}
      >
        <Heading size="md" mb={4}>
          Historique des réponses
        </Heading>
        <VStack spacing={3} align="start">
          {Object.entries(answers).map(([key, value]) => {
            const question = questions.find((q) => q.key === key);

            if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
              // Render the number of files uploaded for file-type questions
              return (
                <Box key={key} textAlign="left" w="100%">
                  <strong>{question?.text || key}:</strong> {value.length} fichier(s) téléchargé(s)
                </Box>
              );
            }

            if (question?.type === "multi-field" && typeof value === "object" && !Array.isArray(value)) {
              // Render each field in multi-field as a separate entry
              return Object.entries(value).map(([fieldKey, fieldValue]) => (
                <Box key={fieldKey} textAlign="left" w="100%">
                  <strong>{fieldKey}:</strong> {fieldValue || "Non répondu"}
                </Box>
              ));
            }

            return (
              <Box key={key} textAlign="left" w="100%">
                <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : value || "Non répondu"}
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Flex>
  );
}