import { motion } from "framer-motion";
import {
  TrendingUp, Users, DollarSign, Zap, AlertTriangle, Info,
  CheckCircle, Circle, Clock, ChevronRight
} from "lucide-react";

const kpis = [
  { label: "Score de performance", value: "74/100", change: "+3 pts", icon: TrendingUp },
  { label: "Taux de churn", value: "4.2%", change: "-0.8%", icon: Users },
  { label: "Revenus estimés", value: "342K€", change: "+12%", icon: DollarSign },
  { label: "Recommandations actives", value: "8", change: "+2", icon: Zap },
];

const alerts = [
  { icon: AlertTriangle, color: "text-destructive", title: "Churn critique détecté", description: "3 clients majeurs à risque de départ dans les 30 jours." },
  { icon: AlertTriangle, color: "text-warning", title: "Pipeline commercial en baisse", description: "Le nombre de leads qualifiés a chuté de 20% cette semaine." },
  { icon: Info, color: "text-primary", title: "Nouvelle opportunité", description: "Le segment « PME Tech » montre un potentiel de croissance de +15%." },
];

const recommendations = [
  { action: "Relancer les clients à risque avec une offre personnalisée", status: "À faire", impact: "Élevé" },
  { action: "Optimiser les landing pages (taux de conversion 1.2%)", status: "En cours", impact: "Élevé" },
  { action: "Automatiser la qualification des leads entrants", status: "En cours", impact: "Moyen" },
  { action: "Revoir la répartition du budget marketing", status: "À faire", impact: "Moyen" },
  { action: "Mettre en place un NPS trimestriel", status: "Terminé", impact: "Faible" },
];

const statusColors: Record<string, string> = {
  "À faire": "text-muted-foreground",
  "En cours": "text-primary",
  "Terminé": "text-success",
};

const statusIcons: Record<string, typeof Circle> = {
  "À faire": Circle,
  "En cours": Clock,
  "Terminé": CheckCircle,
};

const chartData = [
  { month: "Sep", score: 58 },
  { month: "Oct", score: 62 },
  { month: "Nov", score: 65 },
  { month: "Déc", score: 68 },
  { month: "Jan", score: 70 },
  { month: "Fév", score: 74 },
];

const DashboardOverview = () => (
  <div className="space-y-8">
    {/* KPIs */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="apple-card !p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
          <p className="text-xs font-medium mt-1 text-success">{kpi.change} ce mois</p>
        </motion.div>
      ))}
    </div>

    {/* Chart */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="apple-card !p-6">
      <h2 className="text-sm font-semibold text-foreground mb-6">Évolution du score de performance</h2>
      <div className="flex items-end gap-4 h-48">
        {chartData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-foreground">{d.score}</span>
            <div className="w-full bg-primary rounded-t-lg transition-all duration-200" style={{ height: `${(d.score / 100) * 160}px` }} />
            <span className="text-xs text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
    </motion.div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="apple-card !p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Alertes</h2>
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 surface rounded-xl p-3">
              <alert.icon className={`h-4 w-4 mt-0.5 shrink-0 ${alert.color}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plan d'action */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="apple-card !p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Plan d'action</h2>
        <div className="space-y-3">
          {recommendations.map((rec, i) => {
            const StatusIcon = statusIcons[rec.status];
            return (
              <div key={i} className="flex items-center justify-between surface rounded-xl p-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <StatusIcon className={`h-4 w-4 shrink-0 ${statusColors[rec.status]}`} />
                  <span className="text-sm text-foreground truncate">{rec.action}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs font-medium text-primary">{rec.impact}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  </div>
);

export default DashboardOverview;
