import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "€49",
    description: "For small businesses getting started with AI insights.",
    features: ["AI Business Audit", "Performance score", "Monthly optimization report", "Email support"],
    popular: false,
  },
  {
    name: "Growth",
    price: "€99",
    description: "For growing companies that want deeper AI analysis.",
    features: ["Everything in Starter", "Sales optimization insights", "Detailed recommendations", "Weekly reports", "Priority email support"],
    popular: true,
  },
  {
    name: "Scale",
    price: "€199",
    description: "For companies ready to fully optimize with AI.",
    features: ["Everything in Growth", "Cost optimization", "Automation suggestions", "Advanced AI reports", "Priority processing", "Dedicated account manager"],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 animate-fade-in ${
                plan.popular
                  ? "border-primary shadow-primary bg-background scale-105"
                  : "border-border bg-card shadow-card"
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <Button
                variant={plan.popular ? "hero" : "hero-outline"}
                className="w-full mb-6"
              >
                Start Free Trial
              </Button>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
