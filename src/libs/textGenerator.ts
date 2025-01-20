export const generateReportText = (answers: Record<string, string | string[]>): string => {
  let reportText = "";

  // Utility Functions
  const getAgeImmeuble = () =>
    `Le bâtiment est âgé de ${answers["age_immeuble"] || "non spécifié"}.`;

  const getRepairStatus = () => {
    if (answers["is_cause_repaired"] === "Oui") {
      const repairedBy = answers["who_repaired"];
      return `La réparation de l'origine du sinistre a été effectuée par ${
        repairedBy || "un intervenant non spécifié"
      }.`;
    } else {
      return "À ce jour, l'origine du sinistre n'a pas été réparée.";
    }
  };

  const getHumidityRate = () =>
    `Le taux d'humidité relevé est de ${
      answers["humidity_rate"] || "non spécifié"
    }%.`;

  const getTiersLeseDetails = () => {
    if (answers["is_tiers_endommage"] === "Oui") {
      const tiersName = answers["nom_tiers_lese"] || "un tiers non spécifié";
      const tiersQuality = answers["qualite_tiers_lese"] || "non précisée";
      const tiersEtage = answers["tiers_lese_etage"] || "un étage inconnu";
      const damages = Array.isArray(answers["tiers_lese_dommages"])
        ? answers["tiers_lese_dommages"].join(", ")
        : answers["tiers_lese_dommages"] || "non spécifiés";

      return `Des dommages ont été causés chez ${tiersName}, ${tiersQuality}, à l'étage ${tiersEtage}, incluant ${damages}.`;
    }
    return "";
  };

  const getConventionDetails = () => {
    const convention = answers["convention"] || "NEANT";
    return convention === "NEANT"
      ? "Le sinistre relève des règles du droit commun."
      : `Le sinistre relève de la convention ${convention}.`;
  };

  const getDamageTypeDetails = () => {
    if (answers["damage_type"] === "Degats des Eaux") {
      const detailedType = answers["detailed_damage_type"];
      return `Le sinistre est de type dégâts des eaux (${
        detailedType || "type non spécifié"
      }).`;
    }
    if (answers["damage_type"] === "Incendie") {
      const fireCause = answers["fire_cause"] || "non spécifiée";
      return `Le sinistre est de type incendie. Cause: ${fireCause}.`;
    }
    return "";
  };

  const getResponsable = () => {
    const origine = answers["origine_sinistre"];
    const etage = answers["numero_etage"];
    if (origine === "Appartement tiers") {
      const tiersName = answers["nom_tiers_responsable"] || "un tiers non spécifié";
      const quality = answers["qualite_tiers_responsable"] || "non spécifiée";
      return `L'origine du sinistre est localisée dans l'appartement de ${tiersName}, ${quality}, au ${etage || "un étage inconnu"}.`;
    } else {
      const assureName = `${answers["genre_assure"] || ""} ${answers["nom_assure"] || "un assuré non spécifié"}`;
      const quality = answers["status_assure"] || "non spécifiée";
      return `L'origine du sinistre est localisée dans l'appartement de ${assureName}, ${quality}, au ${etage || "un étage inconnu"}.`;
    }
  };

  // Assemble the Report
  reportText += `${getAgeImmeuble()}\n`;
  reportText += `${getRepairStatus()}\n`;
  reportText += `${getHumidityRate()}\n`;
  reportText += `${getTiersLeseDetails()}\n`;
  reportText += `${getConventionDetails()}\n`;
  reportText += `${getDamageTypeDetails()}\n`;
  reportText += `${getResponsable()}`;

  return reportText.trim();
};

export default generateReportText;