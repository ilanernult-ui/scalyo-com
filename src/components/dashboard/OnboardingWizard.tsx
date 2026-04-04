import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Target, Plug2, Sparkles, CheckCircle2,
  ChevronRight, ChevronLeft, Loader2, X, Zap,
  TrendingUp, DollarSign, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useOnboarding, ONBOARDING_TOTAL_STEPS } from "@/hooks/useOnboarding";

// ─── Types ────────────────────────────────────────────────────────
interface OnboardingWizardProps {
  userId: string;
  onComplete: () => void;
  onDismiss: () => void;
}

interface ProfileForm {
  company_name: string;
  sector: string;
  company_size: string;
}

const SECTORS = ["Tech / SaaS", "E-commerce", "Retail", "Services B2B", "Conseil", "Santé", "BTP", "Industrie", "Autre"];
const SIZES = ["TPE (1-10 salariés)", "PME (11-50 salariés)", "PME (51-250 salariés)", "ETI (250+ salariés)"];

const OBJECTIVE_OPTIONS = [
  { id: "revenue", label: "Augmenter mon CA", icon: DollarSign },
  { id: "efficiency", label: "Réduire mes coûts", icon: TrendingUp },
  { id: "retention", label: "Fidéliser mes clients", icon: CheckCircle2 },
  { id: "time", label: "Gagner du temps", icon: Timer },
  { id: "acquisition", label: "Acquérir de nouveaux clients", icon: Zap },
  { id: "growth", label: "Accélérer la croissance", icon: TrendingUp },
];

const CONNECTOR_OPTIONS = [
  { id: "csv_upload", label: "Import CSV / Excel", logo: "📄", desc: "Importez n'importe quel fichier" },
  { id: "stripe", label: "Stripe", logo: "💳", desc: "Revenus et abonnements" },
  { id: "google_analytics", label: "Google Analytics", logo: "📊", desc: "Trafic et conversions" },
];

// ─── Step indicator ───────────────────────────────────────────────
const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current ? "bg-primary w-6" : i === current ? "bg-primary w-4" : "bg-secondary w-2.5"
        }`}
      />
    ))}
  </div>
);

// ─── Step 1 — Profil entreprise ───────────────────────────────────
const Step1Profile = ({ form, onChange }: {
  form: ProfileForm;
  onChange: (f: Partial<ProfileForm>) => void;
}) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Votre entreprise</h2>
      <p className="text-sm text-muted-foreground mt-1">Ces informations personnalisent vos analyses et rapports.</p>
    </div>
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm">Nom de l'entreprise</Label>
        <Input
          placeholder="Acme SAS"
          value={form.company_name}
          onChange={(e) => onChange({ company_name: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm">Secteur d'activité</Label>
        <Select value={form.sector} onValueChange={(v) => onChange({ sector: v })}>
          <SelectTrigger><SelectValue placeholder="Choisissez votre secteur" /></SelectTrigger>
          <SelectContent>
            {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm">Taille de l'entreprise</Label>
        <Select value={form.company_size} onValueChange={(v) => onChange({ company_size: v })}>
          <SelectTrigger><SelectValue placeholder="Choisissez la taille" /></SelectTrigger>
          <SelectContent>
            {SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

// ─── Step 2 — Objectifs ───────────────────────────────────────────
const Step2Objectives = ({ selected, onToggle }: {
  selected: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Vos objectifs prioritaires</h2>
      <p className="text-sm text-muted-foreground mt-1">Sélectionnez jusqu'à 3 objectifs. Scalyo adapte ses analyses en conséquence.</p>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {OBJECTIVE_OPTIONS.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/40"
            }`}
          >
            <opt.icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-xs font-medium">{opt.label}</span>
            {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Step 3 — Données ─────────────────────────────────────────────
const Step3Data = ({ selected, onToggle }: {
  selected: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Connectez vos données</h2>
      <p className="text-sm text-muted-foreground mt-1">Sélectionnez au moins une source pour activer vos analyses IA.</p>
    </div>
    <div className="space-y-2">
      {CONNECTOR_OPTIONS.map((c) => {
        const isSelected = selected.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <span className="text-2xl">{c.logo}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
            {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
          </button>
        );
      })}
    </div>
    <p className="text-xs text-muted-foreground">
      Vous pourrez connecter d'autres sources plus tard depuis l'onglet "Mes données".
    </p>
  </div>
);

// ─── Step 4 — Diagnostic ──────────────────────────────────────────
const Step4Diagnostic = ({ running, done }: { running: boolean; done: boolean }) => {
  const steps = [
    "Analyse des données financières…",
    "Calcul du score business 360°…",
    "Comparaison avec les benchmarks sectoriels…",
    "Détection des problèmes et opportunités…",
    "Génération des recommandations IA…",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Diagnostic IA en cours</h2>
        <p className="text-sm text-muted-foreground mt-1">Scalyo analyse votre business pour générer votre diagnostic personnalisé.</p>
      </div>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
            {done || (!running && i === 0) ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : running ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-border shrink-0" />
            )}
            <p className={`text-sm ${done ? "text-emerald-700 font-medium" : "text-muted-foreground"}`}>{s}</p>
          </div>
        ))}
      </div>
      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center"
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-emerald-800">Diagnostic terminé !</p>
          <p className="text-xs text-emerald-600 mt-0.5">Score business : 74/100</p>
        </motion.div>
      )}
    </div>
  );
};

// ─── Step 5 — Plan d'action ───────────────────────────────────────
const Step5ActionPlan = () => {
  const recos = [
    { title: "Relancer 3 factures impayées > 60 jours", gain: "~4 200€ récupérés", priority: "P0" },
    { title: "Supprimer 2 abonnements SaaS inutilisés", gain: "89€/mois économisés", priority: "P0" },
    { title: "Automatiser les relances clients", gain: "6h/semaine gagnées", priority: "P1" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Votre plan d'action</h2>
        <p className="text-sm text-muted-foreground mt-1">Les 3 premières actions à fort impact générées par l'IA pour votre business.</p>
      </div>
      <div className="space-y-2">
        {recos.map((r, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.priority === "P0" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{r.priority}</span>
              </div>
              <p className="text-xs text-emerald-600 font-medium">{r.gain}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
        <Sparkles className="h-5 w-5 text-primary mx-auto mb-1.5" />
        <p className="text-sm font-semibold text-foreground">Scalyo est prêt !</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Retrouvez toutes vos recommandations dans l'onglet "Recommandations IA".
        </p>
      </div>
    </div>
  );
};

// ─── Main Wizard ──────────────────────────────────────────────────
const STEP_META = [
  { label: "Profil", icon: Building2 },
  { label: "Objectifs", icon: Target },
  { label: "Données", icon: Plug2 },
  { label: "Diagnostic", icon: Sparkles },
  { label: "Plan", icon: CheckCircle2 },
];

const OnboardingWizard = ({ userId, onComplete, onDismiss }: OnboardingWizardProps) => {
  const { step: savedStep, setStep: saveStep, complete: markDone } = useOnboarding(userId);
  const [currentStep, setCurrentStep] = useState(Math.max(0, (savedStep ?? 1) - 1));
  const [profileForm, setProfileForm] = useState<ProfileForm>({ company_name: "", sector: "", company_size: "" });
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>([]);
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagDone, setDiagDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const canProceed = () => {
    if (currentStep === 0) return profileForm.company_name.trim().length > 0 && profileForm.sector.length > 0;
    if (currentStep === 1) return selectedObjectives.length > 0;
    if (currentStep === 2) return selectedConnectors.length > 0;
    if (currentStep === 3) return diagDone;
    return true;
  };

  const toggleObjective = (id: string) => {
    setSelectedObjectives((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const toggleConnector = (id: string) => {
    setSelectedConnectors((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const runDiagnostic = async () => {
    setDiagRunning(true);
    await new Promise((r) => setTimeout(r, 2500));
    setDiagRunning(false);
    setDiagDone(true);
  };

  const handleNext = async () => {
    setSaving(true);

    // Save profile on step 0 → 1
    if (currentStep === 0 && profileForm.company_name) {
      await supabase
        .from("profiles")
        .update({
          company_name: profileForm.company_name,
          sector: profileForm.sector,
          company_size: profileForm.company_size,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }

    // Trigger diagnostic on step 3
    if (currentStep === 2 && !diagDone) {
      setSaving(false);
      const next = currentStep + 1;
      setCurrentStep(next);
      await saveStep(next + 1);
      runDiagnostic();
      return;
    }

    if (currentStep < ONBOARDING_TOTAL_STEPS - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      await saveStep(next + 1);
    } else {
      await markDone();
      onComplete();
    }
    setSaving(false);
  };

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Configuration Scalyo</span>
            </div>
            <button
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step dots + labels */}
          <div className="flex items-center justify-between mb-3">
            {STEP_META.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  i < currentStep ? "bg-primary text-primary-foreground"
                    : i === currentStep ? "bg-primary/15 text-primary border-2 border-primary"
                      : "bg-secondary text-muted-foreground"
                }`}>
                  {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                </div>
                <span className={`text-[9px] font-medium ${i === currentStep ? "text-primary" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <StepIndicator current={currentStep} total={ONBOARDING_TOTAL_STEPS} />
        </div>

        {/* Content */}
        <div className="px-6 py-5 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <Step1Profile form={profileForm} onChange={(f) => setProfileForm((p) => ({ ...p, ...f }))} />
              )}
              {currentStep === 1 && (
                <Step2Objectives selected={selectedObjectives} onToggle={toggleObjective} />
              )}
              {currentStep === 2 && (
                <Step3Data selected={selectedConnectors} onToggle={toggleConnector} />
              )}
              {currentStep === 3 && (
                <Step4Diagnostic running={diagRunning} done={diagDone} />
              )}
              {currentStep === 4 && <Step5ActionPlan />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost" size="sm"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Retour
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{currentStep + 1}/{ONBOARDING_TOTAL_STEPS}</span>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || saving || diagRunning}
              className="gap-1.5"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {currentStep === ONBOARDING_TOTAL_STEPS - 1 ? "Terminer" : "Suivant"}
              {currentStep < ONBOARDING_TOTAL_STEPS - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;
