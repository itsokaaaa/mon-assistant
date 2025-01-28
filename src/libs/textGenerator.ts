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

  function getAssureDetails(
    type: "texte" | "nom" | "status" | "proprietaire"
  ): string {
    const assureDetails = answers["assure_details"] as Record<string, string>;

    const nom = assureDetails["nom_assure"] || "Non fourni";
    const genre =
      assureDetails.genre_assure === "société"
        ? "la société"
        : assureDetails.genre_assure || "non spécifié";

    // Préparer les variables pour le propriétaire si l'assuré est locataire
    let proprietaireNom = "non spécifié";
    let proprietaireGenre = "non spécifié";

    if (answers["status_assure"] === "locataire") {
      const proprietaireDetails = answers["propietaire_si_locataire"] as Record<
        string,
        string
      >;

      proprietaireNom =
        proprietaireDetails["nom_proprietaire"] || "non spécifié";
      proprietaireGenre =
        proprietaireDetails.genre_proprietaire === "société"
          ? "la société"
          : proprietaireDetails.genre_proprietaire || "non spécifié";
    }

    if (type === "texte") {
      if (answers["status_assure"] === "locataire") {
        // si locataire
        return `${proprietaireGenre} ${proprietaireNom}, occupé par ${genre} ${nom}, locataire au ${getEtage(
          "etage_assure"
        )}.`;
      }
      // si propriétaire
      return `${genre} ${nom}, propriétaire occupant au ${getEtage(
        "etage_assure"
      )}.`;
    } else if (type === "nom") {
      return `${genre} ${nom}`;
    } else if (type === "status") {
      return "";
    } else if (type === "proprietaire") {
      return `${proprietaireGenre} ${proprietaireNom}`;
    }

    return "Détails non disponibles.";
  }

  //reponsable details
  function getResponsableDetails(type: "texte" | "nom"): string {
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
  function getLeseDetails(type: "texte" | "nom"): string {
    //assuré est lésé
    if (answers["origineSinistre"] === "Appartement tiers") {
      return getAssureDetails("status");
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

  function getSyndicName(type: "texte" | "nom"): string {
    const syndicName =
      typeof answers["nomSyndic"] === "string" &&
      answers["nomSyndic"].trim() !== ""
        ? answers["nomSyndic"]
        : "Non communiqué";

    if (type === "nom") {
      return syndicName;
    } else if (type === "texte") {
      if (answers["isSyndicConnu"] === "Oui") {
        return `L'immeuble est administré par le cabinet ${syndicName}.`;
      } else {
        return "Le nom du cabinet de syndic n'a pas été communiqué.";
      }
    }

    // Return default case (TypeScript requires all cases to return)
    return "Type inconnu.";
  }

  const getAgeImmeuble = () =>
    `Le bâtiment est âgé de ${answers["ageImmeuble"] || "non spécifié"}.`;

  const getRepairStatus = () => {
    if (answers["is_cause_repaired"] === "Oui") {
      const repairedBy = answers["who_repaired"];
      if (repairedBy === "le syndic") {
        return `La réparation de l'origine sinistre a été effectuée à la diligence du syndic (${getSyndicName(
          "nom"
        )}).`;
      } else {
        return `La réparation de l'origine sinistre a été effectuée à la diligence de ${repairedBy}.`;
      }
    }
    return "A ce jour, la réparation de l'origine sinistre n'a pas encore été effectuée.";
  };
  const getHumidityRate = () =>
    `Lors de notre passage sur les lieux, le taux d'humidité des supports de l'appartement ${getAssureDetails(
      "nom"
    )} était de ${answers["humidity_rate"] || "non spécifié"}%.`;

  const getBailText = () => {
    if (answers["status_assure"] === "locataire") {
      return `Le bail conclu entre ${getAssureDetails(
        "proprietaire"
      )} et ${getAssureDetails("nom")} est un bail de type ${
        answers["bail_status"]
      }.`;
    }
    return "";
  };

  const getPerteImmaterielle = () => {
    if (answers["is_perte_materielle"] === "Oui") {
      return `Le sinistre a occasionné une perte immaterielle dans l'appartement de ${getAssureDetails(
        "nom"
      )}.`;
    }
    return "";
  };

  function getInfiltrationText() {
    const infiltrationDetails = answers["infiltration"] as Record<
      string,
      string
    >;

    const infiltrationDamages = Array.isArray(
      infiltrationDetails.damageInfiltration
    )
      ? infiltrationDetails.damageInfiltration.join(" et ")
      : infiltrationDetails.damageInfiltration || "non spécifiés";

    let text = `Infiltration d'eau pluviale au travers ${infiltrationDetails.infiltrationLocation}`;

    if (infiltrationDetails.infiltrationLocation === "de la toiture terrasse") {
      text += ` de l'immeuble suite à la rupture accidentelle de l'étanchéité qui a occasionné des dommages `;
    } else if (
      infiltrationDetails.infiltrationLocation === "de la couverture tuile"
    ) {
      text += ` de l'immeuble suite à la rupture accidentelle de l'une d'entre elles qui a occasionné des dommages `;
    } else if (infiltrationDetails.infiltrationLocation === "de la façade") {
      text += ` de l'immeuble suite au faiençage de cette dernière qui des occassionné des dommages `;
    }

    text += `${infiltrationDamages} localisé dans l'appartement de `;

    text += `${getResponsableDetails("texte")} `;
    text += `${getRepairStatus()} `;
    text += `${getHumidityRate()} `;

    text += `${getLeseDetails("texte")}`;

    text += `${getBailText()} `;
    text += `${getAgeImmeuble()} `;
    text += `${getSyndicName("texte")} `;
    text += `${getPerteImmaterielle()} `;

    return text;
  }

  // Assemble the Report

  reportText += `${getInfiltrationText()}\n`;

  return reportText.trim();
};

export default generateReportText;
