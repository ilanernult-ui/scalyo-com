import { AlertTriangle, TrendingUp, Lightbulb, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ReportPreview = () => {
  const navigate = useNavigate();
  return (
    <section id="report" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Aperçu du Rapport IA</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Découvrez Ce Que l'IA Révèle Sur Votre Business
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Voici un exemple des insights que notre IA génère automatiquement pour votre entreprise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-background shadow-elevated overflow-hidden">
          {/* Score header */}
          <div className="gradient-primary p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-wider">Score de Santé Business</p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-6xl font-extrabold text-primary-foreground">74</span>
                <span className="text-2xl font-medium text-primary-foreground/50 mb-2">/100</span>
              </div>
              <p className="text-primary-foreground/80 text-sm mt-2">Bon potentiel — des axes d'amélioration identifiés</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4 text-center min-w-[90px]">
                <p className="text-2xl font-bold text-primary-foreground">3</p>
                <p className="text-xs text-primary-foreground/70">Problèmes</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4 text-center min-w-[90px]">
                <p className="text-2xl font-bold text-primary-foreground">5</p>
                <p className="text-xs text-primary-foreground/70">Opportunités</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4 text-center min-w-[90px]">
                <p className="text-2xl font-bold text-primary-foreground">+47K€</p>
                <p className="text-xs text-primary-foreground/70">Potentiel</p>
              </div>
            </div>
          </div>

          {/* Issues & Recommendations */}
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-bold text-foreground">Problèmes Principaux</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Taux de conversion faible (2,1% vs 4,5% benchmark)",
                  "Dépenses marketing inefficaces — 38% de gaspillage",
                  "Processus manuels qui ralentissent la croissance",
                ].map((issue) => (
                  <li key={issue} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-destructive shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-foreground">Recommandations IA</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Optimiser les landing pages (+67% de conversion potentiel)",
                  "Améliorer le ciblage publicitaire — économiser 12K€/an",
                  "Automatiser la qualification des leads — gagner 15h/semaine",
                ].map((rec) => (
                  <li key={rec} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Potentiel de revenus supplémentaires : <span className="text-gradient font-extrabold">+47 000€/an</span>
              </p>
            </div>
            <Button variant="hero" size="sm" onClick={() => navigate("/dashboard")}>
              Obtenir Mon Rapport <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportPreview;
