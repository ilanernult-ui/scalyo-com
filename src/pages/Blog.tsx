import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

const categories = ["Tous", "Performance", "IA & Data", "Stratégie", "Témoignages"];

const articles = [
  { slug: "comment-ia-transforme-pme", title: "Comment l'IA transforme la gestion des PME en 2025", category: "IA & Data", date: "12 mars 2025", excerpt: "L'intelligence artificielle n'est plus réservée aux géants de la tech. Découvrez comment les PME l'adoptent pour gagner en efficacité." },
  { slug: "5-kpis-croissance", title: "5 KPIs essentiels pour piloter votre croissance", category: "Performance", date: "8 mars 2025", excerpt: "Arrêtez de suivre des dizaines de métriques. Voici les 5 indicateurs qui comptent vraiment pour votre entreprise." },
  { slug: "reduire-churn-saas", title: "Réduire le churn de 30% : le guide complet", category: "Stratégie", date: "2 mars 2025", excerpt: "Le churn est le plus grand frein à la croissance des entreprises SaaS. Voici une méthodologie éprouvée pour le réduire." },
  { slug: "temoignage-novatech", title: "NovaTech : +27% de ventes grâce à OptimAI", category: "Témoignages", date: "25 fév 2025", excerpt: "Sophie Martin, DG de NovaTech, raconte comment OptimAI a transformé leur approche commerciale." },
  { slug: "automatisation-processus", title: "Automatiser sans tout casser : le bon rythme", category: "Stratégie", date: "18 fév 2025", excerpt: "L'automatisation peut être un levier puissant ou un chaos total. Voici comment l'aborder méthodiquement." },
  { slug: "data-driven-decision", title: "La prise de décision data-driven en pratique", category: "IA & Data", date: "10 fév 2025", excerpt: "Beaucoup en parlent, peu le font vraiment. Guide pratique pour ancrer la data dans votre culture d'entreprise." },
];

const Blog = () => {
  const [filter, setFilter] = useState("Tous");
  const filtered = filter === "Tous" ? articles : articles.filter((a) => a.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section style={{ paddingTop: "clamp(100px, 12vh, 140px)", paddingBottom: "80px" }}>
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)" }} className="text-foreground mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">Insights, stratégies et retours d'expérience pour optimiser votre entreprise.</p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-sm font-medium px-4 py-2 rounded-pill apple-easing ${
                  filter === cat ? "bg-primary text-primary-foreground" : "surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {filtered.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="apple-card !p-0 overflow-hidden group"
              >
                <div className="h-40 surface flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary/20">{article.title.charAt(0)}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 rounded-pill px-2.5 py-0.5">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary apple-easing tracking-tight">{article.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-xl mx-auto apple-card text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">Recevez nos insights chaque semaine</h3>
            <p className="text-sm text-muted-foreground mb-6">Stratégies, analyses et retours d'expérience directement dans votre boîte mail.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 h-10 rounded-pill border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <Button type="submit">S'abonner</Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
