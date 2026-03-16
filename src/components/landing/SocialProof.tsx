import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, GrowthLab",
    quote: "Axon identified €30K in wasted ad spend we had no idea about. ROI was immediate.",
    rating: 5,
  },
  {
    name: "Marcus Weber",
    role: "COO, ScaleOps",
    quote: "The automation recommendations alone saved our team 20 hours per week. Game changer.",
    rating: 5,
  },
  {
    name: "Léa Martin",
    role: "Founder, NovaTech",
    quote: "We went from 2% to 5.4% conversion rate in 8 weeks using Axon's sales insights.",
    rating: 5,
  },
];

const stats = [
  { value: "2,400+", label: "Businesses analyzed" },
  { value: "€12M+", label: "Savings identified" },
  { value: "3.2x", label: "Avg. ROI" },
  { value: "94%", label: "Satisfaction rate" },
];

const SocialProof = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-gradient">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-background p-6 shadow-card animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-4 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
