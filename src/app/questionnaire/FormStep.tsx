import { VStack, HStack, Button, Input, Wrap } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface Field {
  key: string;
  label: string;
  type: "text" | "radio" | "checkbox" | "number" | "boolean";
  options?: string[];
}

interface Question {
  type: "text" | "number" | "radio" | "checkbox" | "boolean" | "multi-field";
  text: string;
  fields?: Field[];
  options?: string[];
  key: string;
  next: Record<string, string | undefined>;
}

interface FormStepProps {
  question: Question;
  onNext: (value: Record<string, string | string[]> | string | string[]) => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
}

export default function FormStep({
  question,
  onNext,
  onPrevious,
  isFirstQuestion,
}: FormStepProps) {
  const [value, setValue] = useState<
    Record<string, string | string[]> | string | string[]
  >(
    question.type === "multi-field"
      ? {}
      : question.type === "checkbox"
      ? []
      : question.type === "boolean"
      ? ""
      : ""
  );

  useEffect(() => {
    if (question.type === "multi-field") {
      const initialValues: Record<string, string | string[]> = {};
      question.fields?.forEach((field) => {
        initialValues[field.key] = field.type === "checkbox" ? [] : "";
      });
      setValue(initialValues);
    } else if (question.type === "checkbox") {
      setValue([]);
    } else if (question.type === "boolean") {
      setValue(""); // Default to empty for boolean
    } else {
      setValue("");
    }
  }, [question]);

  const handleFieldChange = (key: string, fieldValue: string | string[]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      setValue({ ...value, [key]: fieldValue });
    }
  };

  const handleCheckboxChange = (key: string, option: string) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      const current = (value[key] as string[]) || [];
      if (current.includes(option)) {
        setValue({
          ...value,
          [key]: current.filter((item) => item !== option),
        });
      } else {
        setValue({
          ...value,
          [key]: [...current, option],
        });
      }
    }
  };

  const handleNext = () => {
    onNext(value);
  };

  const isTwoOptions = question.options?.length === 2;
  const isHorizontalQuestion = !isTwoOptions && (question.options?.length ?? 0) > 2;

  return (
    <VStack spacing={6} align="stretch">
      {/* Multi-field Question */}
      {question.type === "multi-field" &&
        question.fields?.map((field) => (
          <VStack key={field.key} align="start" spacing={3}>
            <label>{field.label}</label>
            {field.type === "text" && (
              <Input
                placeholder={field.label}
                value={
                  typeof value === "object" &&
                  !Array.isArray(value) &&
                  field.key in value
                    ? (value[field.key] as string)
                    : ""
                }
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              />
            )}
            {field.type === "radio" && (
              <Wrap spacing={4} justify="flex-start">
                {field.options?.map((option) => (
                  <Button
                    key={option}
                    variant={
                      typeof value === "object" &&
                      !Array.isArray(value) &&
                      value[field.key] === option
                        ? "solid"
                        : "outline"
                    }
                    colorScheme="blue"
                    onClick={() => handleFieldChange(field.key, option)}
                  >
                    {option}
                  </Button>
                ))}
              </Wrap>
            )}
            {field.type === "checkbox" && (
              <Wrap spacing={4} justify="flex-start">
                {field.options?.map((option) => (
                  <Button
                    key={option}
                    variant={
                      typeof value === "object" &&
                      !Array.isArray(value) &&
                      Array.isArray(value[field.key]) &&
                      value[field.key].includes(option)
                        ? "solid"
                        : "outline"
                    }
                    colorScheme="blue"
                    onClick={() => handleCheckboxChange(field.key, option)}
                  >
                    {option}
                  </Button>
                ))}
              </Wrap>
            )}
          </VStack>
        ))}

      {/* Boolean Question */}
      {question.type === "boolean" && (
        <Wrap spacing={4} justify="center">
          <Button
            variant={value === "Oui" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setValue("Oui")}
          >
            Oui
          </Button>
          <Button
            variant={value === "Non" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setValue("Non")}
          >
            Non
          </Button>
        </Wrap>
      )}

      {/* Radio Question */}
      {question.type === "radio" && (
        <Wrap spacing={4} justify={isHorizontalQuestion ? "flex-start" : "center"}>
          {question.options?.map((option) => (
            <Button
              key={option}
              variant={value === option ? "solid" : "outline"}
              colorScheme="blue"
              width={isTwoOptions ? "100%" : "auto"}
              onClick={() => setValue(option)}
            >
              {option}
            </Button>
          ))}
        </Wrap>
      )}

      {/* Checkbox Question */}
      {question.type === "checkbox" && (
        <Wrap spacing={4} justify="flex-start">
          {question.options?.map((option) => (
            <Button
              key={option}
              variant={
                Array.isArray(value) && value.includes(option)
                  ? "solid"
                  : "outline"
              }
              colorScheme="blue"
              onClick={() => handleCheckboxChange("", option)}
            >
              {option}
            </Button>
          ))}
        </Wrap>
      )}

      {/* Text Question */}
      {question.type === "text" && (
        <Input
          placeholder={question.text}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {/* Number Question */}
      {question.type === "number" && (
        <Input
          type="number"
          placeholder={question.text}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {/* Navigation Buttons */}
      <HStack spacing={4} justify="center">
        <Button
          width="120px"
          variant="outline"
          colorScheme="gray"
          onClick={onPrevious}
          isDisabled={isFirstQuestion}
          opacity={isFirstQuestion ? 0.5 : 1}
        >
          Retour
        </Button>
        <Button
          width="120px"
          colorScheme="blue"
          onClick={handleNext}
          isDisabled={
            question.type === "checkbox"
              ? (value as string[]).length === 0
              : question.type === "multi-field"
              ? Object.values(value as Record<string, string | string[]>).some(
                  (v) => !v || (Array.isArray(v) && v.length === 0)
                )
              : !value
          }
        >
          Suivant
        </Button>
      </HStack>
    </VStack>
  );
}