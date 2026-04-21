import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plug2, Activity, KanbanSquare, ArrowRight, X, Check } from "lucide-react";

const STORAGE_KEY = "scalyo-onboarding-done";

type Step = {
  icon: typeof Plug2;
  title: string;
  description: string;
  cta: string;
  targetTab: string;
  accent: string;
};

const STEPS: Step[] = [
  {
    icon: Plug2,
    title: "Connectez vos données",
    description:
      "Renseignez les infos clés de votre entreprise (CA, clients, marges...) pour que l'IA puisse analyser votre business avec précision.",
    cta: "Connecter mes données",
    targetTab: "connectors",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Activity,
    title: "Lancez votre diagnostic",
    description:
      "L'IA détecte vos pertes cachées, identifie vos forces et calcule votre score business 360° en moins de 48h.",
    cta: "Lancer le diagnostic",
    targetTab: "datadiag",
    accent: "from-purple-500 to-pink-500",
  },
  {
    icon: KanbanSquare,
    title: "Suivez vos actions",
    description:
      "Pilotez votre plan d'action IA via un Kanban interactif et mesurez l'impact de chaque optimisation en temps réel.",
    cta: "Voir mon plan d'action",
    targetTab: "actionplan",
    accent: "from-emerald-500 to-teal-500",
  },
];

interface Props {
  onNavigate: (tab: string) => void;
}

const OnboardingTour = ({ onNavigate }: Props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = window.localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  const goToStep = () => {
    const target = STEPS[step].targetTab;
    close();
    onNavigate(target);
  };

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden relative"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className={`h-32 bg-gradient-to-br ${current.accent} flex items-center justify-center`}>
              <motion.div
                key={step}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Étape {step + 1} / {STEPS.length}
                </span>
                <div className="flex gap-1.5 flex-1 justify-end">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === step ? "w-8 bg-primary" : i < step ? "w-1.5 bg-primary/40" : "w-1.5 bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                key={`content-${step}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">{current.title}</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{current.description}</p>
              </motion.div>

              <div className="flex items-center justify-between pt-4 gap-3">
                <button
                  onClick={close}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Passer
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={next}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    {step === STEPS.length - 1 ? (
                      <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Terminer</span>
                    ) : (
                      "Suivant"
                    )}
                  </button>
                  <button
                    onClick={goToStep}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                  >
                    {current.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
