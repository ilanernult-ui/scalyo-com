import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, Linkedin } from "lucide-react";
import { toast } from "sonner";

const subjects = ["Demande de démo", "Partenariat", "Support", "Autre"];
const sizes = ["1-10", "11-50", "51-200", "200+"];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Votre demande a bien été envoyée !");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">Contact</h1>
            <p className="text-lg text-muted-foreground">Une question ? Une demande de démo ? Parlons-en.</p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              {submitted ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Message envoyé !</h2>
                  <p className="text-muted-foreground">Notre équipe vous répondra sous 24 heures ouvrées.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Prénom *</label>
                      <input required className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nom *</label>
                      <input required className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email professionnel *</label>
                    <input type="email" required className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nom de l'entreprise *</label>
                      <input required className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Taille de l'entreprise</label>
                      <select className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Sélectionner</option>
                        {sizes.map((s) => <option key={s} value={s}>{s} employés</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Objet</label>
                    <select className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Sélectionner</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                    <textarea required rows={4} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                  </div>
                  <Button type="submit" size="lg" className="w-full gradient-primary text-primary-foreground font-semibold shimmer">
                    Envoyer ma demande
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-2xl p-6">
                <MapPin className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">Adresse</h3>
                <p className="text-sm text-muted-foreground">42 rue de la Innovation<br />75008 Paris, France</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <Mail className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">contact@optimai.fr</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <Linkedin className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">LinkedIn</h3>
                <p className="text-sm text-muted-foreground">linkedin.com/company/optimai</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
