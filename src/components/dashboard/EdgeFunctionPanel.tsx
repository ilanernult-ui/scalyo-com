import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, Play, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EdgeFunctionPanelProps {
  functionName: "datadiag" | "growthpilot" | "loyaltyloop";
  title: string;
  description: string;
  samplePayload: Record<string, unknown>;
  responseKeys: string[];
}

const EdgeFunctionPanel = ({ functionName, title, description, samplePayload, responseKeys }: EdgeFunctionPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(functionName, {
        body: samplePayload,
      });

      if (fnError) {
        setError(fnError.message || "Erreur lors de l'appel à la fonction");
        return;
      }

      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="apple-card !p-6">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-5">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sample data */}
          <div className="flex-1 rounded-xl bg-secondary/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Données de test</p>
            <pre className="text-xs text-foreground overflow-auto max-h-48 whitespace-pre-wrap break-words">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>

          {/* Action */}
          <div className="flex flex-col items-center justify-center gap-3 sm:w-48">
            <Button
              onClick={handleTest}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse en cours…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Lancer le test
                </>
              )}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              Appelle la fonction <code className="text-primary">{functionName}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="apple-card !p-5 border-destructive/30"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Erreur</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="apple-card !p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold text-foreground">Résultat de l'analyse</h3>
          </div>

          {/* Render known keys as cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {responseKeys.map((key) => {
              const value = result[key] ?? result?.raw;
              if (!value) return null;
              return (
                <div key={key} className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{key.replace(/_/g, " ")}</p>
                  <pre className="text-xs text-foreground overflow-auto max-h-40 whitespace-pre-wrap break-words">
                    {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              );
            })}
          </div>

          {/* Raw fallback */}
          {result.raw && (
            <div className="mt-4 rounded-xl bg-secondary/50 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Réponse brute</p>
              <pre className="text-xs text-foreground overflow-auto max-h-60 whitespace-pre-wrap break-words">
                {typeof result.raw === "string" ? result.raw : JSON.stringify(result.raw, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EdgeFunctionPanel;
