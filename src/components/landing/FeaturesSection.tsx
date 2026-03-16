import { BarChart3, TrendingUp, Cog } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "AI Business Audit",
    description: "Get a full diagnostic of your business performance — sales, marketing, traffic, and operations — with a clear score and actionable insights.",
    highlights: ["Performance Score", "Problem Detection", "Growth Opportunities"],
  },
  {
    icon: TrendingUp,
    title: "Sales Optimization",
    description: "AI analyzes your sales pipeline, conversion rates, and lead quality to boost revenue with data-driven recommendations.",
    highlights: ["Conversion Boost", "Lead Prioritization", "Funnel Optimization"],
  },
  {
    icon: Cog,
    title: "Cost & Process Optimization",
    description: "Identify inefficiencies, cut unnecessary costs, and discover automation opportunities to scale operations faster.",
    highlights: ["Cost Reduction", "Automation", "Productivity Gains"],
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Core Services</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three Pillars of Business Growth
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our AI platform delivers actionable intelligence across the areas that matter most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-background p-8 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="gradient-primary rounded-xl p-3 w-fit mb-6">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((h) => (
                  <span key={h} className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
