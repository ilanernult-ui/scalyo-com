import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, Euro, Sparkles, Loader2, PlayCircle, CheckCircle2 } from "lucide-react";
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

type Difficulty = "Facile" | "Moyen";

interface QuickWin {
  id: string;
  title: string;
  description: string;
  gainEur: number;
  timeLabel: string;
  difficulty: Difficulty;
  category: string;
}

const QUICK_WINS: QuickWin[] = [
  {
    id: "qw-relance-impayes",
    title: "Relancer les 5 plus gros impayés",
    description: "Email + appel structurés sur les factures > 30j pour récupérer du cash immédiat.",
    gainEur: 4200,
    timeLabel: "2h",
    difficulty: "Facile",
    category: "Cash flow",
  },
  {
    id: "qw-upsell-vip",
    title: "Proposer un upsell aux 10 clients VIP",
    description: "Offre personnalisée sur l'historique d'achats — taux d'acceptation moyen ~35%.",
    gainEur: 2800,
    timeLabel: "3h",
    difficulty: "Moyen",
    category: "Revenue",
  },
  {
    id: "qw-pause-linkedin",
    title: "Mettre en pause la campagne LinkedIn la moins rentable",
    description: "Coupe immédiate du CPA × 3 vs SEO. Réallocation possible vers SEO et Email.",
    gainEur: 1136,
    timeLabel: "30min",
    difficulty: "Facile",
    category: "Budget paid",
  },
  {
    id: "qw-email-panier",
    title: "Activer la séquence email panier abandonné",
    description: "Template prêt + automation : ~15% de récupération sur paniers abandonnés.",
    gainEur: 1850,
    timeLabel: "1h30",
    difficulty: "Facile",
    category: "E-commerce",
  },
  {
    id: "qw-cta-landing",
    title: "Optimiser le CTA principal de la landing page",
    description: "Test A/B couleur + libellé orienté bénéfice. Uplift conversion attendu : +12%.",
    gainEur: 1620,
    timeLabel: "1h",
    difficulty: "Moyen",
    category: "Conversion",
  },
];

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Facile: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30",
  Moyen: "bg-orange-500/10 text-orange-700 ring-orange-500/30",
};

const QuickWinsSection = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<QuickWin | null>(null);
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<string>("");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const totalGain = QUICK_WINS.reduce((sum, q) => sum + q.gainEur, 0);

  const openGuide = async (qw: QuickWin) => {
    setActive(qw);
    setOpen(true);
    setGuide("");
    setLoading(true);

    const prompt = `Quick Win à exécuter : "${qw.title}".
Contexte : ${qw.description}
Gain estimé : ${qw.gainEur.toLocaleString("fr-FR")} € · Temps prévu : ${qw.timeLabel} · Difficulté : ${qw.difficulty}.

Génère un guide pas-à-pas opérationnel pour exécuter cette action MAINTENANT, en 5 à 7 étapes claires.
Pour chaque étape : titre court (en gras), 1 à 2 phrases d'instructions concrètes, et si pertinent l'outil ou template à utiliser.
Termine par une checklist "Critères de succès" en 3 points mesurables.
Réponds en Markdown clair et concis (titres ##, listes numérotées, **gras** pour les actions clés).`;

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
      console.error("[QuickWins] guide error:", err);
      toast.error("Impossible de générer le guide IA. Réessayez dans un instant.");
      setGuide(
        `## ${qw.title}\n\n1. **Préparer** — rassemblez les données nécessaires.\n2. **Exécuter** — suivez le plan listé ci-dessus.\n3. **Mesurer** — comparez avant/après sur 7 jours.`
      );
    } finally {
      setLoading(false);
    }
  };

  const markDone = (id: string) => {
    setDone((d) => ({ ...d, [id]: true }));
    toast.success("Quick Win marqué comme fait — bravo 🚀");
    setOpen(false);
  };

  return (
    <>
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Quick Wins · à fort ROI</h3>
              <p className="text-[11px] text-muted-foreground">
                Actions rapides générées par l'IA — gain potentiel cumulé{" "}
                <span className="font-semibold text-emerald-700">
                  +{totalGain.toLocaleString("fr-FR")} €
                </span>
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            <Sparkles className="h-2.5 w-2.5 mr-1" /> {QUICK_WINS.length} actions prêtes
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_WINS.map((qw, i) => {
            const isDone = done[qw.id];
            return (
              <motion.div
                key={qw.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className={`rounded-xl border bg-card p-3.5 flex flex-col gap-2.5 transition-all ${
                  isDone ? "border-emerald-500/40 bg-emerald-500/5" : "border-border hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                    {qw.category}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${DIFFICULTY_STYLES[qw.difficulty]}`}>
                    {qw.difficulty}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-foreground leading-snug">
                  {qw.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {qw.description}
                </p>

                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <Euro className="h-3 w-3" /> +{qw.gainEur.toLocaleString("fr-FR")} €
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {qw.timeLabel}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isDone ? "outline" : "default"}
                  className="w-full h-8 text-xs gap-1.5 mt-1"
                  onClick={() => openGuide(qw)}
                  disabled={isDone}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3.5 w-3.5" /> Faire maintenant
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Guide pas-à-pas — {active?.title}
            </DialogTitle>
            <DialogDescription>
              Gain estimé +{active?.gainEur.toLocaleString("fr-FR")} € · {active?.timeLabel} · {active?.difficulty}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">L'IA prépare votre guide opérationnel…</p>
            </div>
          )}

          {!loading && guide && (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80">
              <ReactMarkdown>{guide}</ReactMarkdown>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            {active && (
              <Button onClick={() => markDone(active.id)} className="gap-1.5" disabled={loading}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Marquer comme fait
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickWinsSection;
