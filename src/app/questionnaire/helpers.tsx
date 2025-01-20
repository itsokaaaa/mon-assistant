export function validateAnswer(answer: string) {
    // Vérifie que la réponse n'est pas vide ou ne contient que des espaces
    return answer.trim() !== "";
  }
  
  export function isValidOption(answer: string, options: string[] = []) {
    // Vérifie que la réponse fait partie des options disponibles
    return options.includes(answer);
  }