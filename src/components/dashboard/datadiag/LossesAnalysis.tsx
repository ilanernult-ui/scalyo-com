import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LossSource {
  label: string;
  monthly: number;
  color: string;
  explanation: string;
  why: string;
}

// No fake data — populated only when real losses are detected from user data.
const LOSS_SOURCES: LossSource[] = [];

const LossesAnalysis = () => {
  const { toast } = useToast();
  const [planOpen, setPlanOpen] = useState(false);
  const [planText, setPlanText] = useState("");
  const [planLoading, setPlanLoading] = useState(false);

  const totalMonthly = LOSS_SOURCES.reduce((s, l) => s + l.monthly, 0);

  const handleGeneratePlan = async () => {
    if (LOSS_SOURCES.length === 0) {
      toast({
        title: "Aucune donnée disponible",
        description: "Connectez vos sources pour générer un plan de récupération.",
      });
      return;
    }
    setPlanOpen(true);
    setPlanText("");
    setPlanLoading(true);

    try {
      const sourcesSummary = LOSS_SOURCES
        .map((l) => `- ${l.label} : ${l.monthly.toLocaleString("fr-FR")} €/mois — ${l.explanation}`)
        .join("\n");

      const prompt = `Voici l'analyse des pertes mensuelles d'une PME française :

${sourcesSummary}

Total des pertes actuelles : ${totalMonthly.toLocaleString("fr-FR")} €/mois.

Génère un plan de récupération priorisé sur 90 jours.`;

      const { data, error } = await supabase.functions.invoke("scalyo-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          activeTab: "datadiag",
        },
      });

      if (error) throw error;
      const text = (data as { text?: string })?.text;
      if (!text) throw new Error("Réponse IA vide");
      setPlanText(text);
    } catch (err) {
      console.error("[LossesAnalysis] generate plan error:", err);
      toast({
        title: "Génération impossible",
        description: err instanceof Error ? err.message : "Réessayez dans un instant.",
        variant: "destructive",
      });
      setPlanOpen(false);
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl border p-5 mt-6 space-y-6"
      style={{
        backgroundColor: "var(--color-background-primary)",
        borderColor: "var(--color-border-tertiary)",
      }}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-1">
            Analyse approfondie des pertes
          </h3>
          <p className="text-sm text-muted-foreground">
            Sources, historique et projection si aucune action n'est prise.
          </p>
        </div>
        <Button onClick={handleGeneratePlan} disabled={planLoading || LOSS_SOURCES.length === 0} className="gap-2">
          {planLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Générer un plan de récupération
        </Button>
      </div>

      {LOSS_SOURCES.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-8 text-center">
          <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
          <p className="text-xs text-muted-foreground mt-1">
            Connectez vos données financières pour détecter automatiquement vos sources de pertes.
          </p>
        </div>
      ) : null}

      <Dialog open={planOpen} onOpenChange={(o) => !o && setPlanOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Plan de récupération IA — 90 jours
            </DialogTitle>
            <DialogDescription>
              Plan priorisé généré par l'IA Scalyo à partir de vos pertes détectées.
            </DialogDescription>
          </DialogHeader>
          {planLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Génération du plan en cours…
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{planText}</ReactMarkdown>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LossesAnalysis;
