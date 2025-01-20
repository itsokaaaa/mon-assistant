// Type pour une question du questionnaire
export interface Question {
    id: string; // Add this if it's required
    key: string;
    text: string;
    type: "text" | "number" | "radio" | "checkbox";
    options?: string[];
    multiple?: boolean;
    next: Record<string, string | undefined>;
  }
  
  // Type pour les réponses utilisateur
  export type AnswerValue = string | string[];
  
  // Type pour les props du composant FormStep
  export interface FormStepProps {
    question: Question; // Question affichée dans cette étape
    answer: AnswerValue; // Réponse actuelle pour cette question
    onNext: (value: AnswerValue) => void; // Callback pour passer à la prochaine question
    onPrevious?: () => void; // Callback pour revenir à la question précédente
  }
  
  // Type pour les props du composant QuestionnaireEnd
  export interface QuestionnaireEndProps {
    answers: Record<string, AnswerValue>; // Toutes les réponses collectées
    onRestart: () => void; // Callback pour recommencer le questionnaire
  }