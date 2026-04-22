import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Clock,
  Euro,
  Sparkles,
  Loader2,
  BookOpen,
  Mail,
  Target,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Workflow,
  Settings2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Complexity = "Simple" | "Intermédiaire" | "Avancé";

interface Automation {
  id: string;
  title: string;
  description: string;
  category: string;
  hoursPerWeek: number;
  gainEurMonthly: number;
  complexity: Complexity;
  tools: string[];
  icon: typeof Bot;
}

const AUTOMATIONS: Automation[] = [
  {
    id: "auto-relance-email",
    title: "Relance email automatique des paniers abandonnés",
    description:
      "Séquence email déclenchée automatiquement 1h, 24h et 72h après abandon, avec offre personnalisée à J+3.",
    category: "Acquisition",
    hoursPerWeek: 6,
    gainEurMonthly: 3200,
    complexity: "Simple",
    tools: ["Brevo", "Klaviyo", "Mailchimp"],
    icon: Mail,
  },
  {
    id: "auto-scoring-leads",
    title: "Scoring automatique des leads entrants",
    description:
      "Attribue un score 0-100 à chaque lead selon source, comportement et profil pour prioriser les commerciaux.",
    category: "Sales",
    hoursPerWeek: 8,
    gainEurMonthly: 4500,
    complexity: "Intermédiaire",
    tools: ["HubSpot", "Pipedrive", "Make"],
    icon: Target,
  },
  {
    id: "auto-relance-impayes",
    title: "Relance automatique des impayés",
    description:
      "Workflow d'emails graduels J+3, J+10, J+21 sur factures impayées avec escalade vers appel commercial.",
    category: "Cash flow",
    hoursPerWeek: 4,
    gainEurMonthly: 5800,
    complexity: "Simple",
    tools: ["Pennylane", "Qonto", "Zapier"],
    icon: RefreshCw,
  },
  {
    id: "auto-onboarding",
    title: "Onboarding client automatisé",
    description:
      "Séquence de 7 emails + tutoriels vidéo + checklist déclenchés à l'inscription pour accélérer l'activation.",
    category: "Activation",
    hoursPerWeek: 5,
    gainEurMonthly: 2400,
    complexity: "Intermédiaire",
    tools: ["Customer.io", "Intercom", "Loops"],
    icon: Workflow,
  },
  {
    id: "auto-nps",
    title: "Enquête NPS et alertes détracteurs",
    description:
      "Envoi automatique du NPS à J+30 et J+90, alerte Slack en cas de note ≤ 6 pour intervention immédiate.",
    category: "Rétention",
    hoursPerWeek: 3,
    gainEurMonthly: 1800,
    complexity: "Simple",
    tools: ["Typeform", "Slack", "Make"],
    icon: MessageSquare,
  },
  {
    id: "auto-reporting",
    title: "Reporting hebdo automatique pour la direction",
    description:
      "Agrégation automatique des KPIs (CA, leads, churn) envoyée chaque lundi matin par email + dashboard.",
    category: "Pilotage",
    hoursPerWeek: 4,
    gainEurMonthly: 1500,
    complexity: "Intermédiaire",
    tools: ["Google Sheets", "Make", "Looker Studio"],
    icon: TrendingUp,
  },
  {
    id: "auto-segmentation",
    title: "Segmentation dynamique de la base clients",
    description:
      "Met à jour automatiquement les segments (VIP, dormants, à risque) selon comportement temps réel.",
    category: "CRM",
    hoursPerWeek: 5,
    gainEurMonthly: 2900,
    complexity: "Avancé",
    tools: ["Segment", "HubSpot", "Klaviyo"],
    icon: Settings2,
  },
  {
    id: "auto-rdv",
    title: "Prise de RDV automatisée + rappels",
    description:
      "Auto-booking commercial avec rappels SMS J-1 et J-1h pour réduire de 40% les no-shows.",
    category: "Sales",
    hoursPerWeek: 3,
    gainEurMonthly: 2100,
    complexity: "Simple",
    tools: ["Calendly", "Cal.com", "Twilio"],
    icon: Bot,
  },
];

const COMPLEXITY_STYLES: Record<Complexity, string> = {
  Simple: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30",
  Intermédiaire: "bg-amber-500/10 text-amber-700 ring-amber-500/30",
  Avancé: "bg-rose-500/10 text-rose-700 ring-rose-500/30",
};

const HOURLY_RATE = 35; // €/h pour estimer la valeur du temps gagné

const AutomationsSection = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Complexity>("all");

  const filtered = useMemo(
    () => (filter === "all" ? AUTOMATIONS : AUTOMATIONS.filter((a) => a.complexity === filter)),
    [filter]
  );

  const totals = useMemo(() => {
    const hours = AUTOMATIONS.reduce((s, a) => s + a.hoursPerWeek, 0);
    const gain = AUTOMATIONS.reduce((s, a) => s + a.gainEurMonthly, 0);
    const valueOfTime = hours * 4 * HOURLY_RATE;
    return { hours, gain: gain + valueOfTime };
  }, []);

  const openGuide = async (a: Automation) => {
    setActive(a);
    setOpen(true);
    setGuide(null);
    setLoading(true);

    const prompt = `Automatisation à mettre en place : "${a.title}". Contexte : ${a.description}.
Catégorie : ${a.category}. Complexité : ${a.complexity}. Outils suggérés : ${a.tools.join(", ")}.
Gain attendu : ${a.gainEurMonthly.toLocaleString("fr-FR")} €/mois et ${a.hoursPerWeek}h/semaine économisées.

Génère un guide IA opérationnel "Comment faire" pour mettre en place cette automatisation.
Structure ta réponse en Markdown avec :
1. ## Pré-requis (3 points)
2. ## Architecture du workflow (schéma textuel + déclencheurs / actions)
3. ## Mise en place pas-à-pas (6 à 8 étapes numérotées avec **titre en gras**, instructions concrètes, et l'outil à utiliser)
4. ## Templates clés (1 exemple de message email/SMS si pertinent)
5. ## Mesure du succès (3 KPIs à suivre avec valeurs cibles)
6. ## Pièges à éviter (3 points)

Sois concret, opérationnel et chiffré. N'invente pas d'outils exotiques, reste sur les outils suggérés.`;

    try {
      const { data, error } = await supabase.functions.invoke("scalyo-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          activeTab: "growthpilot",
        },
      });
      if (error) throw error;
      const text = (data as { text?: string })?.text;
      if (!text) throw new Error("Réponse IA vide");
      setGuide(text);
    } catch (err) {
      console.error("[Automations] guide error:", err);
      toast.error("Impossible de générer le guide IA. Réessayez dans un instant.");
      setGuide(
        `## ${a.title}\n\n**Pré-requis** : compte sur ${a.tools[0]}, accès admin, base clients à jour.\n\n**Étapes principales** :\n1. **Connecter** ${a.tools[0]} à votre CRM\n2. **Définir** les déclencheurs\n3. **Créer** les modèles de message\n4. **Tester** sur 10 contacts\n5. **Déployer** et suivre les KPIs hebdomadaires`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header / KPI */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Automatisations recommandées
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Workflows métier identifiés par l'IA pour libérer du temps et générer du revenu récurrent.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            <Sparkles className="h-2.5 w-2.5 mr-1" /> {AUTOMATIONS.length} automatisations
          </Badge>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="h-3.5 w-3.5" /> Temps gagné / semaine
            </div>
            <p className="text-xl font-bold text-foreground">
              {totals.hours}h
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Euro className="h-3.5 w-3.5" /> Gain potentiel / mois
            </div>
            <p className="text-xl font-bold text-emerald-700">
              +{totals.gain.toLocaleString("fr-FR")} €
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Workflow className="h-3.5 w-3.5" /> ROI moyen
            </div>
            <p className="text-xl font-bold text-foreground">x 4,2</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "Simple", "Intermédiaire", "Avancé"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f === "all" ? "Toutes" : f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {a.category}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground leading-snug">
                      {a.title}
                    </h4>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 shrink-0 ${COMPLEXITY_STYLES[a.complexity]}`}
                >
                  {a.complexity}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {a.description}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5">
                    <Clock className="h-3 w-3" /> Temps gagné
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {a.hoursPerWeek}h <span className="text-[10px] font-normal text-muted-foreground">/ sem.</span>
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5">
                    <Euro className="h-3 w-3" /> Gain estimé
                  </div>
                  <p className="text-sm font-bold text-emerald-700">
                    +{a.gainEurMonthly.toLocaleString("fr-FR")} € <span className="text-[10px] font-normal text-muted-foreground">/ mois</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {a.tools.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <Button
                size="sm"
                className="w-full h-8 text-xs gap-1.5 mt-1"
                onClick={() => openGuide(a)}
              >
                <BookOpen className="h-3.5 w-3.5" /> Voir comment faire
              </Button>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Guide IA — {active?.title}
            </DialogTitle>
            <DialogDescription>
              {active && (
                <>
                  Gain {active.gainEurMonthly.toLocaleString("fr-FR")} €/mois ·{" "}
                  {active.hoursPerWeek}h/sem. économisées · Complexité {active.complexity}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                L'IA prépare votre guide de mise en place…
              </p>
            </div>
          )}

          {!loading && guide && (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80">
              <ReactMarkdown>{guide}</ReactMarkdown>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationsSection;
