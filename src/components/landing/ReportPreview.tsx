import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

const ReportPreview = () => {
  return (
    <section className="py-24 border-t border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Aperçu</p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">
            Un rapport IA clair et actionnable
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Score de performance</p>
              <p className="text-5xl font-heading font-extrabold gradient-text">74<span className="text-2xl text-muted-foreground">/100</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Potentiel de gain</p>
              <p className="text-2xl font-heading font-bold text-accent">+23% revenus</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Problèmes détectés
            </h4>
            {["Taux de conversion faible (1.2% vs 3% secteur)", "Budget marketing mal réparti (60% sur canal peu performant)", "Processus de qualification leads trop lent (7 jours)"].map((issue, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">
                <span className="text-warning mt-0.5">•</span>
                {issue}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" /> Recommandations IA
            </h4>
            {[
              { action: "Optimiser les landing pages", impact: "Impact élevé" },
              { action: "Améliorer le ciblage publicitaire", impact: "Impact moyen" },
              { action: "Automatiser la qualification des leads", impact: "Impact élevé" },
            ].map((rec, i) => (
              <div key={i} className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  {rec.action}
                </span>
                <span className="text-xs font-medium text-primary">{rec.impact}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReportPreview;
