import { AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";

const ReportPreview = () => {
  return (
    <section id="report" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Aperçu du Rapport IA</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Découvrez Votre Rapport en Avant-Première
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Voici un exemple des insights que notre IA génère pour votre entreprise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card shadow-card-hover overflow-hidden">
          <div className="gradient-primary p-6 flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Score de Santé Business</p>
              <p className="text-5xl font-extrabold text-primary-foreground">72<span className="text-2xl font-medium text-primary-foreground/70">/100</span></p>
            </div>
            <div className="h-20 w-20 rounded-full border-4 border-primary-foreground/30 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B+</span>
            </div>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-bold text-foreground">Problèmes Principaux Détectés</h3>
              </div>
              <ul className="space-y-3">
                {["Taux de conversion faible (2,1% vs 4,5% benchmark)", "Dépenses marketing inefficaces — 38% de gaspillage", "Processus manuels qui ralentissent la croissance"].map((issue) => (
                  <li key={issue} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-destructive shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-foreground">Recommandations IA</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Améliorer la conversion de la landing page (+67% potentiel)",
                  "Optimiser le ciblage publicitaire pour économiser 12K€/an",
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

          <div className="border-t border-border p-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Potentiel d'augmentation du chiffre d'affaires : <span className="text-gradient font-bold">+47 000€/an</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportPreview;
