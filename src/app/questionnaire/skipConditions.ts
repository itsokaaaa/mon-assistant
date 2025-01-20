export function shouldSkipQuestion(nextKey: string, answers: Record<string, string | string[]>): boolean {
    switch (nextKey) {
      // Skip based on age
      case "owns_car":
        return typeof answers["user_age"] === "string" && parseInt(answers["user_age"]) < 18;
  
      // Skip based on car ownership
      case "car_brand":
        return answers["owns_car"] === "Non";
  
      // Skip sports-related questions if no sports are selected
      case "favorite_sport":
        return answers["user_sport"] === "Non";
  
      // Skip pet questions if user has no pets
      case "pet_type":
        return answers["has_pet"] === "Non";
  
      // Skip food question if user doesn't like food (just for testing!)
      case "favorite_food":
        return answers["has_food"] === "Non";
  
      // Skip travel question if user is under 16
      case "likes_travel":
        return typeof answers["user_age"] === "string" && parseInt(answers["user_age"]) < 16;
  
      // Default: do not skip
      default:
        return false;
    }
  }