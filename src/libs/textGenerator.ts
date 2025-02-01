export const generateReportText = (
  answers: Record<string, string | string[] | Record<string, string | string[]>>
): string => {
  let reportText = "";

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

  // structure details

  const getStructureDetails = (preposition: "de" | "dans") => {
    const structureType = answers["structure_type"] || "non spécifié";

    if (preposition === "de") {
      if (structureType === "Immeuble" || structureType === "Appartement") {
        return `de l'${structureType.toLowerCase()}`;
      } else if (structureType === "Maison") {
        return `de la villa`;
      } else if (structureType === "Local commercial") {
        return `du local commercial`;
      }
    } else if (preposition === "dans") {
      if (structureType === "Immeuble" || structureType === "Appartement") {
        return `dans l'${structureType.toLowerCase()}`;
      } else if (structureType === "Maison") {
        return `dans la villa`;
      } else if (structureType === "Local commercial") {
        return `dans le local commercial`;
      }
    }

    return structureType; // Fallback au cas où
  };

  // More Utility Functions

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
    `Le bâtiment est âgé de ${answers["ageImmeuble"] || ""}.`;

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
    `Lors de notre passage sur les lieux, le taux d'humidité des supports ${getStructureDetails(
      "de"
    )} ${getAssureDetails("nom")} était de ${
      answers["humidity_rate"] || "non spécifié"
    }%.`;

  const getBailText = (): string => {
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
      return `Le sinistre a occasionné une perte immaterielle ${getStructureDetails(
        "de"
      )} de ${getAssureDetails("nom")}.`;
    }
    return "";
  };

  const getTRI = () => {
    if (answers["is_tri"] === "Oui") {
      return `\n\n\nL'assuré beneficiant de la garanti TRI, nous laissons le soin à la compagnie de statuer sur l'application de cette garantie. `;
    }
    return ``;
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

    //text += `${getLeseDetails("texte")}`;

    text += `${getBailText()} `;
    text += `${getAgeImmeuble()} `;
    text += `${getSyndicName("texte")} `;
    text += `${getPerteImmaterielle()} `;
    text += `${getTRI()} `;

    return text;
  }

  function getFuiteText(): string {
    const fuiteDetails = answers["fuite"] as Record<string, string | string[]>;

    const fuiteKind = fuiteDetails["fuiteKind"] || "non spécifié"; // Canalisation or Robinetterie
    const fuiteAccess = fuiteDetails["fuiteAccess"] || "non spécifiée"; // Accessible or Non accessible
    const fuiteStatus = fuiteDetails["fuiteStatus"] || "non spécifiée"; // Privative or Collective
    //const fuiteType = fuiteDetails["fuiteType"] || "non spécifié"; // Eau chaude or Eau froide

    const fuiteDamages = Array.isArray(answers["damageFuite"])
      ? answers["damageFuite"].join(" et ")
      : "non spécifiés";

    let text =
      fuiteKind === "Robineterie"
        ? `Fuite des joints de robinetterie accessible`
        : `Fuite sur canalisation ${fuiteAccess} ${fuiteStatus}`;

    text += ` dans l'appartement de ${getResponsableDetails("texte")}`;

    //chez lui et degats chez toi
    if (answers["origineSinistre"] === "Appartement tiers") {
      text += ` Ce qui a occasionné des dommages par infiltration ${fuiteDamages} de l'appartement de ${getAssureDetails(
        "texte"
      )} `;
    }

    //si chez toi et degats chez toi
    if (answers["origineSinistre"] === "Appartement assuré") {
      text += ` Ce qui a occasionné des dommages par remontées capillaires ${fuiteDamages} dudit appartement.`;
    }

    //si chez toi et degats chez lui
    if (answers["origineSinistre"] === "Appartement assuré") {
      if (answers["is_tiers_endommage"] === "Oui") {
        text += ` Ce qui a également occasionné des dommages par infiltration ${fuiteDamages} de l'appartement de ${getLeseDetails(
          "texte"
        )} `;
      }
    }

    text += `${getRepairStatus()} `;
    text += `${getHumidityRate()} `;
    text += `${getBailText()}`;
    text += `${getAgeImmeuble()} `;
    text += `${getSyndicName("texte")} `;
    text += `${getPerteImmaterielle()} `;
    text += `${getTRI()} `;

    return text.trim(); // Ensure no trailing spaces
  }

  function getJointsText(): string {
    const jointsDetails = answers["joints"] as Record<
      string,
      string | string[]
    >;

    const jointsKind = jointsDetails["jointsOuCarrelage"] || "non spécifié"; // Joints or Carrelage
    const jointsText = jointsDetails["jointsChoice"] || "non spécifié"; // Specific text
    const jointsDamage = Array.isArray(jointsDetails["damageJoints"])
      ? jointsDetails["damageJoints"].join(" et ")
      : jointsDetails["damageJoints"] || "non spécifiés";

    let text =
      jointsKind === "carrelage"
        ? `Infiltration d'eau d'abblution au travers du carrelage de la ${jointsText} `
        : `Infiltration d'eau d'abblution au travers du joint périmétrique de la ${jointsText} `;

    text += `dans l'appartement de ${getAssureDetails("texte")}.`;

    //si chez toi et degats chez toi
    if (answers["origineSinistre"] === "Appartement assuré") {
      text += ` Ce qui a occasionné des dommages par remontées capillaires ${jointsDamage} dudit appartement.`;
    }

    //si chez toi et degats chez lui
    if (answers["origineSinistre"] === "Appartement assuré") {
      if (answers["is_tiers_endommage"] === "Oui") {
        text += ` Ce qui a également occasionné des dommages par infiltration ${jointsDamage} de l'appartement de ${getLeseDetails(
          "texte"
        )} `;
      }
    }

    text += `${getRepairStatus()} `;
    text += `${getHumidityRate()} `;
    text += `${getBailText()}`;
    text += `${getAgeImmeuble()} `;
    text += `${getSyndicName("texte")} `;
    text += `${getPerteImmaterielle()} `;
    text += `${getTRI()} `;

    return text.trim(); // Ensure no trailing spaces
  }

  function getDebordementText(): string {
    const debordementDetails = answers["debordement"] as Record<
      string,
      string | string[]
    >;

    const debordementObjet =
      debordementDetails["debordementObjet"] || "non spécifié"; // Object causing overflow
    const debordementOrigine = Array.isArray(
      debordementDetails["debordementOrigineDamage"]
    )
      ? debordementDetails["debordementOrigineDamage"].join(" et ")
      : "non spécifié"; // Origin of overflow
    const debordementDamage = Array.isArray(
      debordementDetails["damageDebordement"]
    )
      ? debordementDetails["damageDebordement"].join(" et ")
      : debordementDetails["damageDebordement"] || "non spécifiés";

    let text = `Débordement accidentel d'un appareil à effet d'eau (${debordementObjet}) `;

    text += `dans l'appartement de ${getResponsableDetails("texte")}.`;

    // Case: Origin in a third-party apartment and damage in the insured's apartment
    if (answers["origineSinistre"] === "Appartement tiers") {
      text += ` Ce qui a occasionné des dommages par infiltration (${debordementDamage}) de l'appartement de ${getAssureDetails(
        "texte"
      )}. `;
    }

    // Case: Origin in the insured's apartment and damage in the insured's apartment
    if (answers["origineSinistre"] === "Appartement assuré") {
      text += ` Ce qui a occasionné des dommages ${debordementDetails} (${debordementDamage}) dudit appartement. `;
    }

    // Case: Origin in the insured's apartment and damage in a third-party apartment
    if (
      answers["origineSinistre"] === "Appartement assuré" &&
      answers["is_tiers_endommage"] === "Oui"
    ) {
      text += ` Ce qui a également occasionné des dommages par infiltration (${debordementDamage}) de l'appartement de ${getLeseDetails(
        "texte"
      )}. `;
    }

    return text.trim(); // Ensure no trailing spaces
  }
  // Assemble the Report

  if (answers["detailed_damage_type"] === "Infiltration") {
    reportText += `${getInfiltrationText()}\n`;
  } else if (answers["detailed_damage_type"] === "Fuite") {
    reportText += `${getFuiteText()}\n`;
  } else if (answers["detailed_damage_type"] === "Joints") {
    reportText += `${getJointsText()}\n`;
  } else if (answers["detailed_damage_type"] === "Débordement") {
    reportText += `${getDebordementText()}\n`;
  } else {
    reportText += `C'est pas encore fait !`;
  }

  console.log(answers);
  console.log("origine : " + answers["origineSinistre"]);
  console.log("assuré : " + getAssureDetails("texte"));
  console.log("responsable : " + getResponsableDetails("texte"));
  console.log("lésé : " + getLeseDetails("texte"));

  return reportText.trim();
};

export default generateReportText;

//TOADD
// - TRI
// - cas IRSI
// - parties communes
// - debordement
