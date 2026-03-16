import { Zap, BarChart3, AlertTriangle, Lightbulb, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Target, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const scoreColor = (score: number) => {
  if (score >= 80) return "text-accent";
  if (score >= 60) return "text-primary";
  return "text-destructive";
};

const metrics = [
  { label: "Revenue Growth", value: "+12.4%", trend: "up", icon: DollarSign },
  { label: "Conversion Rate", value: "3.2%", trend: "up", icon: Target },
  { label: "Avg. Response Time", value: "2.4h", trend: "down", icon: Clock },
  { label: "Cost Efficiency", value: "68%", trend: "up", icon: BarChart3 },
];

const problems = [
  { severity: "high", text: "Cart abandonment rate at 72% — above industry average" },
  { severity: "high", text: "Email open rate dropped 18% this month" },
  { severity: "medium", text: "Customer support response time exceeds 4h SLA" },
  { severity: "low", text: "Blog traffic declining — content needs refresh" },
];

const recommendations = [
  { impact: "High", text: "Add exit-intent popup with 10% discount — est. +€8,200/mo", category: "Sales" },
  { impact: "High", text: "A/B test email subject lines — est. +23% open rate", category: "Marketing" },
  { impact: "Medium", text: "Automate tier-1 support with chatbot — save 12h/week", category: "Operations" },
  { impact: "Medium", text: "Implement retargeting ads for cart abandoners", category: "Sales" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const healthScore = 72;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar-like top bar */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="gradient-primary rounded-lg p-1.5">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Axon</span>
          <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="hero" size="sm">New Analysis</Button>
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">A</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Health Score */}
        <div className="rounded-2xl gradient-primary p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-primary-foreground/70 text-sm font-medium mb-1">Business Health Score</p>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-extrabold text-primary-foreground">{healthScore}</span>
              <span className="text-2xl font-medium text-primary-foreground/60 mb-2">/100</span>
            </div>
            <p className="text-primary-foreground/80 text-sm mt-2">Your business is performing well, but there's room for improvement.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-primary-foreground">5</p>
              <p className="text-xs text-primary-foreground/70">Issues</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-primary-foreground">8</p>
              <p className="text-xs text-primary-foreground/70">Opportunities</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-primary-foreground">+€47K</p>
              <p className="text-xs text-primary-foreground/70">Potential</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <m.icon className="h-5 w-5 text-muted-foreground" />
                {m.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-accent" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problems */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="font-bold text-foreground">Problems Detected</h2>
            </div>
            <ul className="space-y-4">
              {problems.map((p) => (
                <li key={p.text} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                    p.severity === "high" ? "bg-destructive" : p.severity === "medium" ? "bg-primary" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{p.text}</p>
                    <span className={`text-xs font-medium capitalize ${
                      p.severity === "high" ? "text-destructive" : p.severity === "medium" ? "text-primary" : "text-muted-foreground"
                    }`}>{p.severity} priority</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-foreground">AI Recommendations</h2>
            </div>
            <ul className="space-y-4">
              {recommendations.map((r) => (
                <li key={r.text} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                    r.impact === "High" ? "bg-accent" : "bg-primary"
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{r.text}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs font-medium text-accent">{r.impact} Impact</span>
                      <span className="text-xs text-muted-foreground">• {r.category}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
