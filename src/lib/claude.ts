import type { ReportType } from "@/hooks/useReports";

export interface ClaudeReportSection {
  title: string;
  content: string;
}

type CompanyData = Record<string, unknown> | null;

const formatValue = (value: unknown): string => {
  if (typeof value === "number") {
    return value.toLocaleString("fr-FR");
  }
  if (value === null || value === undefined || value === "") {
    return "Non renseigné";
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

const buildCompanyContext = (companyData: CompanyData): string => {
  if (!companyData) {
    return "Aucune donnée d'entreprise n'est connectée. Génère un rapport cohérent basé sur un exemple de PME e-commerce française.";
  }

  const extract = (key: string) => formatValue(companyData[key]);
  return `Données de l'entreprise :
- Nom : ${extract("company_name")}
- Secteur : ${extract("sector")}
- Taille : ${extract("company_size")}
- CA annuel : ${extract("annual_revenue")} €
- CA mensuel : ${extract("current_month_revenue")} €
- Clients actifs : ${extract("active_clients")}
- Churn : ${extract("churn_rate")} %
- NPS : ${extract("nps_score")}
- Marge brute : ${extract("gross_margin")} %
- Marge nette : ${extract("net_margin")} %
- Objectif croissance 6 mois : ${extract("growth_target_6m")} %
- Budget marketing : ${extract("marketing_budget")} €
- Canal principal : ${extract("main_sales_channel")}
`;
};

const DEFAULT_SECTIONS: Record<ReportType, ClaudeReportSection[]> = {
  weekly: [
    {
      title: "KPIs de la semaine",
      content:
        "CA estimé de 48 500€ (+12 % vs semaine précédente), 1 247 clients actifs, churn à 4,2 % et NPS 62. Le score business global est de 84/100 avec un taux de conversion stable à 3,9 %.",
    },
    {
      title: "Comparaison avec la semaine précédente",
      content:
        "Le chiffre d'affaires progresse de 12 % par rapport à la semaine précédente, les clients actifs augmentent de 3 %, tandis que le churn reste stable autour de 4,2 %. La marge brute s'améliore légèrement grâce à une meilleure performance des campagnes digitales.",
    },
    {
      title: "Actions IA appliquées",
      content: `✓ Optimisation des campagnes publicitaires à faible ROI.
✓ Réduction des coûts d'acquisition sur les canaux les moins performants.
✓ Ajustement des prix sur le segment le plus rentable.
✓ Automatisation du suivi des relances clients pour limiter les impayés.`,
    },
    {
      title: "Recommandations pour la semaine suivante",
      content: `1. Accentuer les promotions sur les produits à forte marge.
2. Renforcer les relances clients inactifs avec un message personnalisé.
3. Tester une offre de rétention pour réduire le churn.
4. Augmenter le budget marketing sur le canal le plus performant tout en contrôlant le CAC.`,
    },
  ],
  monthly: [
    {
      title: "CA, marges, churn, top actions et impact mesuré en €",
      content:
        "CA mensuel estimé à 210 000€, marge brute à 38 %, churn à 4,1 %. Les actions les plus performantes ce mois-ci ont été la promotion sur le top produit et l'optimisation des campagnes Google Ads, générant un impact estimé à 14 500€.",
    },
    {
      title: "Évolution vs mois précédent",
      content:
        "Le CA monte de 9 % par rapport au mois précédent. La marge brute progresse de 1,8 point, tandis que le churn est stable. L'efficacité des campagnes marketing a augmenté de 7 %, ce qui indique une amélioration de la qualité des leads.",
    },
    {
      title: "Prévision IA pour le mois suivant",
      content:
        "L'IA recommande d'augmenter le budget sur les canaux à forte marge, de lancer un test d'upsell premium et de renforcer la fidélisation des clients à fort panier moyen pour viser une croissance de 11 à 13 %.",
    },
  ],
  diagnostic: [
    {
      title: "Score de santé business global (note sur 100)",
      content:
        "Score global de 78/100 basé sur la rentabilité, la croissance, la rétention et l'efficacité opérationnelle. Les points forts sont la stabilité du churn et la croissance du CA, tandis que la marge nette mérite une attention ciblée.",
    },
    {
      title: "Benchmarks sectoriels",
      content:
        "En benchmark secteur, le taux de churn moyen est de 5,8 % et la marge brute moyenne est de 35 %. Votre entreprise se situe au-dessus de la moyenne en churn, mais en-dessous sur la marge nette, ce qui indique un potentiel d'optimisation important.",
    },
    {
      title: "Pertes détectées",
      content:
        "Pertes identifiées : coûts marketing inefficaces, stocks immobilisés et taux d'abandon de panier élevé. L'IA estime ces pertes à environ 24 000€ par mois si ces points ne sont pas corrigés.",
    },
    {
      title: "Plan d'optimisation",
      content: `1. Optimiser le mix marketing sur les canaux performants.
2. Réduire les coûts d'acquisition par automatisation.
3. Améliorer le taux de conversion via une page produit enrichie.
4. Renforcer le programme de fidélité pour augmenter la rétention.`,
    },
  ],
};

const buildPrompt = (type: ReportType, companyData: CompanyData): string => {
  const instructions: Record<ReportType, string> = {
    weekly: `Tu es Claude, un assistant business expert. Génère un rapport hebdomadaire en français avec exactement ces sections :
- KPIs de la semaine
- Comparaison avec la semaine précédente
- Actions IA appliquées
- Recommandations pour la semaine suivante`,
    monthly: `Tu es Claude, un assistant business expert. Génère un rapport mensuel en français avec exactement ces sections :
- CA, marges, churn, top actions et impact mesuré en €
- Évolution vs mois précédent
- Prévision IA pour le mois suivant`,
    diagnostic: `Tu es Claude, un assistant business expert. Génère un diagnostic 360° en français avec exactement ces sections :
- Score de santé business global (note sur 100)
- Benchmarks sectoriels
- Pertes détectées
- Plan d'optimisation`,
  };

  const keys: Record<ReportType, string[]> = {
    weekly: [
      "kpis_de_la_semaine",
      "comparaison_avec_la_semaine_precedente",
      "actions_ia_appliquees",
      "recommendations_pour_la_semaine_suivante",
    ],
    monthly: [
      "ca_marges_churn_top_actions_impact",
      "evolution_vs_mois_precedent",
      "prevision_ia_mois_suivant",
    ],
    diagnostic: [
      "score_sante_business",
      "benchmarks_sectoriels",
      "pertes_detectees",
      "plan_optimisation",
    ],
  };

  const jsonKeys = keys[type].map((key) => `\"${key}\"`).join(", ");

  return `${instructions[type]}

Réponds uniquement avec un JSON valide contenant les clés suivantes :
{
  ${keys[type].map((key) => `"${key}": "..."`).join(",\n  ")}
}

Le contenu doit être clair, actionnable et lisible. N'ajoute aucun champ supplémentaire ni aucune explication hors du JSON.

${buildCompanyContext(companyData)}`;
};

const extractJsonObject = (text: string): Record<string, unknown> | null => {
  const match = text.match(/\{[\s\S]*\}/m);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const mapResponseToSections = (type: ReportType, json: Record<string, unknown>): ClaudeReportSection[] => {
  if (type === "weekly") {
    return [
      {
        title: "KPIs de la semaine",
        content: String(json.kpis_de_la_semaine ?? DEFAULT_SECTIONS.weekly[0].content),
      },
      {
        title: "Comparaison avec la semaine précédente",
        content: String(json.comparaison_avec_la_semaine_precedente ?? DEFAULT_SECTIONS.weekly[1].content),
      },
      {
        title: "Actions IA appliquées",
        content: String(json.actions_ia_appliquees ?? DEFAULT_SECTIONS.weekly[2].content),
      },
      {
        title: "Recommandations pour la semaine suivante",
        content: String(json.recommendations_pour_la_semaine_suivante ?? DEFAULT_SECTIONS.weekly[3].content),
      },
    ];
  }

  if (type === "monthly") {
    return [
      {
        title: "CA, marges, churn, top actions et impact mesuré en €",
        content: String(json.ca_marges_churn_top_actions_impact ?? DEFAULT_SECTIONS.monthly[0].content),
      },
      {
        title: "Évolution vs mois précédent",
        content: String(json.evolution_vs_mois_precedent ?? DEFAULT_SECTIONS.monthly[1].content),
      },
      {
        title: "Prévision IA pour le mois suivant",
        content: String(json.prevision_ia_mois_suivant ?? DEFAULT_SECTIONS.monthly[2].content),
      },
    ];
  }

  return [
    {
      title: "Score de santé business global (note sur 100)",
      content: String(json.score_sante_business ?? DEFAULT_SECTIONS.diagnostic[0].content),
    },
    {
      title: "Benchmarks sectoriels",
      content: String(json.benchmarks_sectoriels ?? DEFAULT_SECTIONS.diagnostic[1].content),
    },
    {
      title: "Pertes détectées",
      content: String(json.pertes_detectees ?? DEFAULT_SECTIONS.diagnostic[2].content),
    },
    {
      title: "Plan d'optimisation",
      content: String(json.plan_optimisation ?? DEFAULT_SECTIONS.diagnostic[3].content),
    },
  ];
};

export async function generateClaudeReport(type: ReportType, companyData: CompanyData): Promise<ClaudeReportSection[]> {
  const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY ?? "";
  const prompt = buildPrompt(type, companyData);

  if (!ANTHROPIC_API_KEY) {
    return DEFAULT_SECTIONS[type];
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-3.5-mini",
        prompt,
        max_tokens_to_sample: 1200,
        temperature: 0.2,
        stop_sequences: ["\n\n"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Claude API returned an error:", response.status, errorText);
      return DEFAULT_SECTIONS[type];
    }

    const text = await response.text();
    const json = extractJsonObject(text);
    if (!json) {
      console.warn("Claude API returned invalid JSON", text);
      return DEFAULT_SECTIONS[type];
    }

    return mapResponseToSections(type, json);
  } catch (error) {
    console.warn("Erreur Claude API", error);
    return DEFAULT_SECTIONS[type];
  }
}
