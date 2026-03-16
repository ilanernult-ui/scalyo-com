import { AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";

const ReportPreview = () => {
  return (
    <section id="report" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">AI Report Preview</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See What Your Report Looks Like
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Here's a sample of the insights our AI generates for your business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card shadow-card-hover overflow-hidden">
          {/* Header */}
          <div className="gradient-primary p-6 flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Business Health Score</p>
              <p className="text-5xl font-extrabold text-primary-foreground">72<span className="text-2xl font-medium text-primary-foreground/70">/100</span></p>
            </div>
            <div className="h-20 w-20 rounded-full border-4 border-primary-foreground/30 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B+</span>
            </div>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            {/* Issues */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-bold text-foreground">Main Issues Detected</h3>
              </div>
              <ul className="space-y-3">
                {["Low conversion rate (2.1% vs 4.5% benchmark)", "Inefficient marketing spend — 38% waste", "Manual processes slowing growth"].map((issue) => (
                  <li key={issue} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-destructive shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-foreground">AI Recommendations</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Improve landing page conversion (+67% potential)",
                  "Optimize ad targeting to reduce waste by €12K/yr",
                  "Automate lead qualification — save 15hrs/week",
                ].map((rec) => (
                  <li key={rec} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Opportunities bar */}
          <div className="border-t border-border p-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Revenue uplift potential: <span className="text-gradient font-bold">+€47,000/year</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportPreview;
