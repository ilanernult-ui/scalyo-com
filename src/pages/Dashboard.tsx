import {
  Zap, BarChart3, AlertTriangle, Lightbulb, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, Target, DollarSign, CheckCircle, Circle, Bell, Calendar, ChevronRight,
  Shield, LineChart, ListChecks, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const metrics = [
  { label: "Croissance du CA", value: "+12,4%", trend: "up" as const, icon: DollarSign, detail: "vs mois dernier" },
  { label: "Taux de Conversion", value: "3,2%", trend: "up" as const, icon: Target, detail: "+0,8% ce mois" },
  { label: "Temps de Réponse Moy.", value: "2,4h", trend: "down" as const, icon: Clock, detail: "objectif: 2h" },
  { label: "Efficacité des Coûts", value: "68%", trend: "up" as const, icon: BarChart3, detail: "+5% ce trimestre" },
];

const problems = [
  { severity: "high" as const, text: "Taux d'abandon de panier à 72% — au-dessus de la moyenne du secteur", category: "E-commerce" },
  { severity: "high" as const, text: "Taux d'ouverture des emails en baisse de 18% ce mois-ci", category: "Marketing" },
  { severity: "medium" as const, text: "Temps de réponse du support client supérieur au SLA de 4h", category: "Opérations" },
  { severity: "low" as const, text: "Trafic du blog en déclin — le contenu doit être rafraîchi", category: "Contenu" },
];

const recommendations = [
  { impact: "Élevé" as const, text: "Ajouter un popup d'intention de sortie avec 10% de réduction", est: "+8 200€/mois", category: "Ventes" },
  { impact: "Élevé" as const, text: "A/B tester les objets d'emails", est: "+23% taux d'ouverture", category: "Marketing" },
  { impact: "Moyen" as const, text: "Automatiser le support niveau 1 avec un chatbot", est: "Économiser 12h/sem", category: "Opérations" },
  { impact: "Moyen" as const, text: "Mettre en place des annonces de retargeting", est: "+15% conversions", category: "Ventes" },
];

const optimizationTasks = [
  { id: 1, text: "Optimiser les pages de destination pour mobile", done: true, impact: "Élevé" },
  { id: 2, text: "Configurer les séquences email automatisées", done: true, impact: "Élevé" },
  { id: 3, text: "Améliorer la vitesse de chargement du site", done: false, impact: "Élevé" },
  { id: 4, text: "Mettre en place le suivi UTM sur toutes les campagnes", done: false, impact: "Moyen" },
  { id: 5, text: "Créer un programme de fidélité client", done: false, impact: "Moyen" },
  { id: 6, text: "Automatiser les relances de panier abandonné", done: false, impact: "Élevé" },
];

const weeklyInsights = [
  { date: "Cette semaine", text: "Votre taux de conversion a augmenté de 0,3% — continuez sur cette lancée.", type: "positive" as const },
  { date: "Cette semaine", text: "Nouvelle opportunité détectée : le segment 25-34 ans génère 40% plus de revenus.", type: "opportunity" as const },
  { date: "Semaine dernière", text: "Alerte : le coût d'acquisition client a augmenté de 12%.", type: "alert" as const },
];

const notifications = [
  { text: "Nouveau rapport mensuel disponible", time: "Il y a 2h", read: false },
  { text: "Score de santé amélioré : 72 → 74", time: "Il y a 1 jour", read: false },
  { text: "3 nouvelles recommandations IA", time: "Il y a 2 jours", read: true },
];

const performanceHistory = [
  { month: "Oct", score: 58 },
  { month: "Nov", score: 62 },
  { month: "Déc", score: 65 },
  { month: "Jan", score: 68 },
  { month: "Fév", score: 70 },
  { month: "Mars", score: 74 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const healthScore = 74;
  const [tasks, setTasks] = useState(optimizationTasks);
  const [showNotifications, setShowNotifications] = useState(false);

  const completedTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-card/90">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="gradient-primary rounded-xl p-2">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold text-foreground tracking-tight">Axon</span>
          <span className="text-xs font-bold bg-primary/10 text-primary rounded-full px-3 py-1">Tableau de Bord</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="relative p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-card" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-elevated p-4 z-50">
                <h4 className="font-bold text-foreground text-sm mb-3">Notifications</h4>
                <ul className="space-y-3">
                  {notifications.map((n, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.read ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
                      <div>
                        <p className={`text-sm ${n.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{n.text}</p>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button variant="hero" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Nouvelle Analyse
          </Button>
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">A</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Health Score Hero */}
        <div className="rounded-2xl gradient-primary p-8 mb-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-wider mb-1">Score de Santé Business</p>
            <div className="flex items-end gap-2">
              <span className="text-7xl font-extrabold text-primary-foreground">{healthScore}</span>
              <span className="text-2xl font-medium text-primary-foreground/50 mb-3">/100</span>
            </div>
            <p className="text-primary-foreground/80 text-sm mt-2 max-w-md">
              Votre entreprise est sur la bonne voie. Suivez les recommandations IA pour améliorer votre score.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-semibold text-primary-foreground">+4 points ce mois-ci</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-5 text-center min-w-[110px]">
              <AlertTriangle className="h-5 w-5 text-primary-foreground/70 mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary-foreground">4</p>
              <p className="text-xs text-primary-foreground/70">Problèmes</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-5 text-center min-w-[110px]">
              <Lightbulb className="h-5 w-5 text-primary-foreground/70 mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary-foreground">8</p>
              <p className="text-xs text-primary-foreground/70">Opportunités</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-5 text-center min-w-[110px]">
              <TrendingUp className="h-5 w-5 text-primary-foreground/70 mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary-foreground">+47K€</p>
              <p className="text-xs text-primary-foreground/70">Potentiel</p>
            </div>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="rounded-lg bg-muted p-2">
                  <m.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                {m.trend === "up" ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-accent">
                    <ArrowUpRight className="h-3.5 w-3.5" /> En hausse
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
                    <ArrowDownRight className="h-3.5 w-3.5" /> En baisse
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">{m.detail}</p>
            </div>
          ))}
        </div>

        {/* Performance Tracking */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-foreground">Évolution du Score de Santé</h2>
            </div>
            <span className="text-xs font-semibold text-accent flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +16 points en 6 mois
            </span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {performanceHistory.map((p) => (
              <div key={p.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-foreground">{p.score}</span>
                <div className="w-full rounded-t-lg gradient-primary transition-all duration-500" style={{ height: `${(p.score / 100) * 120}px`, opacity: 0.6 + (p.score / 100) * 0.4 }} />
                <span className="text-xs text-muted-foreground">{p.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="h-5 w-5 text-secondary" />
            <h2 className="font-bold text-foreground">Insights IA Hebdomadaires</h2>
          </div>
          <div className="space-y-3">
            {weeklyInsights.map((insight, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg p-3 ${
                insight.type === 'positive' ? 'bg-accent/5 border border-accent/10' :
                insight.type === 'opportunity' ? 'bg-primary/5 border border-primary/10' :
                'bg-destructive/5 border border-destructive/10'
              }`}>
                <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  insight.type === 'positive' ? 'bg-accent' :
                  insight.type === 'opportunity' ? 'bg-primary' :
                  'bg-destructive'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{insight.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Problems */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="font-bold text-foreground">Problèmes Détectés</h2>
              <span className="ml-auto text-xs font-semibold bg-destructive/10 text-destructive rounded-full px-2.5 py-0.5">{problems.length} actifs</span>
            </div>
            <ul className="space-y-4">
              {problems.map((p) => (
                <li key={p.text} className="flex items-start gap-3 group cursor-pointer">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                    p.severity === "high" ? "bg-destructive" : p.severity === "medium" ? "bg-primary" : "bg-muted-foreground"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground group-hover:text-primary transition-colors">{p.text}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs font-semibold ${
                        p.severity === "high" ? "text-destructive" : p.severity === "medium" ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {p.severity === "high" ? "Priorité haute" : p.severity === "medium" ? "Priorité moyenne" : "Priorité basse"}
                      </span>
                      <span className="text-xs text-muted-foreground">• {p.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-foreground">Recommandations IA</h2>
              <span className="ml-auto text-xs font-semibold bg-accent/10 text-accent rounded-full px-2.5 py-0.5">{recommendations.length} nouvelles</span>
            </div>
            <ul className="space-y-4">
              {recommendations.map((r) => (
                <li key={r.text} className="flex items-start gap-3 group cursor-pointer">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                    r.impact === "Élevé" ? "bg-accent" : "bg-primary"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground group-hover:text-accent transition-colors">{r.text}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs font-semibold text-accent">Impact {r.impact}</span>
                      <span className="text-xs text-muted-foreground">• {r.category}</span>
                      <span className="text-xs font-semibold text-foreground/70">→ {r.est}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Optimization Tasks */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-foreground">Tâches d'Optimisation</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{completedTasks}/{totalTasks} complétées</span>
            </div>
          </div>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => toggleTask(task.id)}
              >
                {task.done ? (
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                )}
                <span className={`text-sm flex-1 ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.text}
                </span>
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                  task.impact === "Élevé" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                }`}>
                  {task.impact}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security Badge */}
        <div className="rounded-xl gradient-trust border border-accent/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-accent" />
            <div>
              <p className="font-bold text-foreground text-sm">Vos données sont protégées</p>
              <p className="text-xs text-muted-foreground">Chiffrement AES-256 • Conforme RGPD • Données hébergées en Europe</p>
            </div>
          </div>
          <a href="#" className="text-xs font-semibold text-accent hover:underline">En savoir plus sur notre sécurité →</a>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
