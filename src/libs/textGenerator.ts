export const generateReportText = (
  answers: Record<string, string | string[] | Record<string, string | string[]>>
): string => {
  let reportText = "";

  console.log(answers);

  // Utility Functions

  const getEtage = (etageKey: string) => {
    const etage = answers[etageKey];

    if (etage === "0") {
      return "au rez-de-chaussée";
    }

    const suffixe = etage === "1" ? "er" : "ème";

    return `${etage}${suffixe} étage`;
  };

  // assure details

  function getAssureDetails(type: "texte" | "nom"): string {
    const assureDetails = answers["assure_details"] as Record<string, string>;

    const nom = assureDetails["nom_assure"] || "Non fourni";
    const genre =
      assureDetails.genre_assure === "société"
        ? "la société"
        : assureDetails.genre_assure || "non spécifié";

    if (type === "texte") {
      if (answers["status_assure"] === "locataire") {
        const proprietaireDetails = answers[
          "propietaire_si_locataire"
        ] as Record<string, string>;
        const proprietaireNom =
          proprietaireDetails["nom_proprietaire"] || "non spécifié";
        const proprietaireGenre =
          proprietaireDetails.genre_proprietaire === "société"
            ? "la société"
            : proprietaireDetails.genre_proprietaire || "non spécifié";
        //si locataire
        return `${proprietaireGenre} ${proprietaireNom}, occupé par ${genre} ${nom}, locataire au ${getEtage(
          "etage_assure"
        )}.`;
      }
      //si proprietaire
      return `${genre} ${nom}, propriétaire occupant au ${getEtage(
        "etage_assure"
      )}.`;
    } else if (type === "nom") {
      return `${genre} ${nom}`;
    }

    return "Détails non disponibles.";
  }

  //reponsable details
  function getTiersResponsableDetails(type: "texte" | "nom"): string {
    //assuré est responsable
    if (answers["origineSinistre"] === "Appartement assuré") {
      return getAssureDetails("texte");
      //tiers est responsable
    } else {
      const tiersReponsableDetails = answers[
        "tiers_responsable_details"
      ] as Record<string, string>;

      const nom =
        tiersReponsableDetails["nom_tiers_repsonsable"] || "Non fourni";
      const genre =
        tiersReponsableDetails.genre_tiers_responsable === "société"
          ? "la société"
          : tiersReponsableDetails.genre_tiers_responsable || "non spécifié";

      if (type === "texte") {
        if (answers["status_tiers_responsable"] === "locataire") {
          const proprietaireDetails = answers[
            "propietaire_si_locataire_tiers_responsable"
          ] as Record<string, string>;
          const proprietaireNom =
            proprietaireDetails["nom_proprietaire_tiers_responsable"] ||
            "non spécifié";
          const proprietaireGenre =
            proprietaireDetails.genre_proprietaire_tiers_responsable ===
            "société"
              ? "la société"
              : proprietaireDetails.genre_proprietaire_tiers_responsable ||
                "non spécifié";
          //si locataire
          console.log(`prioprietaire genre : ${proprietaireGenre}`);
          console.log(`prioprietaire nom : ${proprietaireNom}`);

          console.log(`genre : ${genre}`);
          console.log(`nom : ${nom}`);

          return `${proprietaireGenre} ${proprietaireNom}, occupé par ${genre} ${nom}, locataire au ${getEtage(
            "etage_tiers_responsable"
          )}.`;
        }
        //si proprietaire
        return `${genre} ${nom}, propriétaire occupant au ${getEtage(
          "etage_tiers_responsable"
        )}.`;
      } else if (type === "nom") {
        return `${genre} ${nom}`;
      }

      return "Détails non disponibles.";
    }
  }

  //lésé details
  function getTiersLeseDetails(type: "texte" | "nom"): string {
    //assuré est lésé
    if (answers["origineSinistre"] === "Appartement tiers") {
      return getAssureDetails("texte");
      //tiers est lésé
    } else {
      const tiersLeseDetails = answers["tiers_lese_details"] as Record<
        string,
        string
      >;

      if (tiersLeseDetails) {
        const nom = tiersLeseDetails["nom_tiers_lese"] || "Non fourni";
        const genre =
          tiersLeseDetails["genre_tiers_lese"] === "société"
            ? "la société"
            : tiersLeseDetails["genre_tiers_lese"] || "non spécifié";

        if (type === "texte") {
          if (answers["status_tiers_lese"] === "locataire") {
            const proprietaireDetails = answers[
              "propietaire_si_locataire_tiers_lese"
            ] as Record<string, string>;
            const proprietaireNom =
              proprietaireDetails["nom_proprietaire_tiers_lese"] ||
              "non spécifié";
            const proprietaireGenre =
              proprietaireDetails.genre_proprietaire_tiers_lese === "société"
                ? "la société"
                : proprietaireDetails.genre_proprietaire_tiers_lese ||
                  "non spécifié";
            const damages = Array.isArray(answers["tiers_lese_dommages"])
              ? answers["tiers_lese_dommages"].join(", ")
              : answers["tiers_lese_dommages"] || "non spécifiés";
            //si locataire
            console.log(`prioprietaire genre : ${proprietaireGenre}`);
            console.log(`prioprietaire nom : ${proprietaireNom}`);

            console.log(`genre : ${genre}`);
            console.log(`nom : ${nom}`);

            return `${proprietaireGenre} ${proprietaireNom}, occupé par ${genre} ${nom}, locataire au ${getEtage(
              "etage_tiers_lese"
            )}. ya des degats : ${damages}`;
          }
          //si proprietaire
          return `${genre} ${nom}, propriétaire occupant au ${getEtage(
            "etage_tiers_lese"
          )}.`;
        } else if (type === "nom") {
          return `texte : ${genre} ${nom}`;
        }

        return "Détails non disponibles.";
      }
      return "";
    }
  }

  const texteComplet = getAssureDetails("texte");
  reportText += texteComplet + "\n";
  reportText += getTiersResponsableDetails("texte") + "\n";
  reportText += getTiersLeseDetails("texte") + "\n";

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

  // Assemble the Report
  reportText += `${getAgeImmeuble()}\n`;
  reportText += `${getRepairStatus()}\n`;
  reportText += `${getHumidityRate()}\n`;
  reportText += `${getConventionDetails()}\n`;
  reportText += `${getDamageTypeDetails()}\n`;

  return reportText.trim();
};

export default generateReportText;
