export function shouldSkipQuestion(
  nextKey: string,

  answers: Record<
    string,
    string | string[] | Record<string, string | string[]> | File[]
  >
): boolean {
  // Skip 'isSyndicConnu' if 'structure_type' is 'Immeuble'
  if (nextKey === "isSyndicConnu" && answers["structure_type"] === "Immeuble") {
    return true;
  }

  return false;
}
