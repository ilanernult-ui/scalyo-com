import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

const ReportPreview = () => {
  return (
    <section style={{ padding: "120px 0" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="apple-label mb-3">Aperçu</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)" }} className="text-foreground mb-4">
            Un rapport IA clair et actionnable
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto apple-card"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="apple-label mb-1">Score de performance</p>
              <p className="text-5xl font-bold tracking-tight text-foreground">74<span className="text-2xl text-muted-foreground">/100</span></p>
            </div>
            <div className="text-right">
              <p className="apple-label mb-1">Potentiel de gain</p>
              <p className="text-2xl font-bold text-success tracking-tight">+23% revenus</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Problèmes détectés
            </h4>
            {["Taux de conversion faible (1.2% vs 3% secteur)", "Budget marketing mal réparti (60% sur canal peu performant)", "Processus de qualification leads trop lent (7 jours)"].map((issue, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground surface rounded-xl p-3">
                <span className="text-warning mt-0.5">•</span>
                {issue}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" /> Recommandations IA
            </h4>
            {[
              { action: "Optimiser les landing pages", impact: "Impact élevé" },
              { action: "Améliorer le ciblage publicitaire", impact: "Impact moyen" },
              { action: "Automatiser la qualification des leads", impact: "Impact élevé" },
            ].map((rec, i) => (
              <div key={i} className="flex items-center justify-between surface rounded-xl p-3">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
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
