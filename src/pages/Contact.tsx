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

  const inputClasses = "w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary apple-easing";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section style={{ paddingTop: "clamp(100px, 12vh, 140px)", paddingBottom: "80px" }}>
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)" }} className="text-foreground mb-4">Contact</h1>
            <p className="text-lg text-muted-foreground">Une question ? Une demande de démo ? Parlons-en.</p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              {submitted ? (
                <div className="apple-card text-center !p-12">
                  <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-6 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Message envoyé !</h2>
                  <p className="text-muted-foreground">Notre équipe vous répondra sous 24 heures ouvrées.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="apple-card space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Prénom *</label>
                      <input required className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nom *</label>
                      <input required className={inputClasses} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email professionnel *</label>
                    <input type="email" required className={inputClasses} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nom de l'entreprise *</label>
                      <input required className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Taille de l'entreprise</label>
                      <select className={inputClasses}>
                        <option value="">Sélectionner</option>
                        {sizes.map((s) => <option key={s} value={s}>{s} employés</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Objet</label>
                    <select className={inputClasses}>
                      <option value="">Sélectionner</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                    <textarea required rows={4} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none apple-easing" />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Envoyer ma demande
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="apple-card">
                <MapPin className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">Adresse</h3>
                <p className="text-sm text-muted-foreground">42 rue de la Innovation<br />75008 Paris, France</p>
              </div>
              <div className="apple-card">
                <Mail className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">contact@optimai.fr</p>
              </div>
              <div className="apple-card">
                <Linkedin className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">LinkedIn</h3>
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
