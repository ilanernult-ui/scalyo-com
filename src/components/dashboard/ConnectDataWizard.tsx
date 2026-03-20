import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2, Check, Building2, BarChart3, ShoppingCart, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PlanType } from "@/contexts/AuthContext";

interface ConnectDataWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanType;
  userId: string;
  onComplete: () => void;
}

const stepsMeta = [
  { id: "general", label: "Infos générales", icon: Building2 },
  { id: "financial", label: "Données financières", icon: BarChart3 },
  { id: "commercial", label: "Données commerciales", icon: ShoppingCart },
  { id: "clients", label: "Données clients", icon: Users },
  { id: "recap", label: "Récapitulatif", icon: Check },
];

const getSteps = (plan: PlanType) => {
  const base = [stepsMeta[0], stepsMeta[1]];
  if (plan === "growthpilot" || plan === "loyaltyloop") base.push(stepsMeta[2]);
  if (plan === "loyaltyloop") base.push(stepsMeta[3]);
  base.push(stepsMeta[4]);
  return base;
};

const sectors = ["Retail", "E-commerce", "SaaS", "Restauration", "BTP", "Santé", "Services", "Industrie", "Autre"];
const sizes = ["TPE (1-10)", "PME (11-250)", "ETI (250+)"];
const channels = ["En ligne", "Boutique physique", "Marketplace", "B2B direct", "Mixte", "Autre"];
const churnReasons = ["Prix", "Concurrent", "Qualité", "Service client", "Autre"];

const Field = ({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm">
      {label} {optional && <span className="text-muted-foreground font-normal">(optionnel)</span>}
    </Label>
    {children}
  </div>
);

const NumberInput = ({ value, onChange, placeholder }: { value: number | undefined; onChange: (v: number | undefined) => void; placeholder?: string }) => (
  <Input
    type="number"
    placeholder={placeholder}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
  />
);

const MultiMonthFields = ({ label, count, values, onChange }: { label: string; count: number; values: number[]; onChange: (v: number[]) => void }) => (
  <div className="space-y-1.5">
    <Label className="text-sm">{label}</Label>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Input
          key={i}
          type="number"
          placeholder={i === 0 ? "Ce mois" : `Mois -${i}`}
          value={values[i] ?? ""}
          onChange={(e) => {
            const next = [...values];
            next[i] = e.target.value ? Number(e.target.value) : 0;
            onChange(next);
          }}
        />
      ))}
    </div>
  </div>
);

export default function ConnectDataWizard({ open, onOpenChange, plan, userId, onComplete }: ConnectDataWizardProps) {
  const steps = getSteps(plan);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [employees, setEmployees] = useState<number | undefined>();
  const [annualRevenue, setAnnualRevenue] = useState<number | undefined>();
  const [competitors, setCompetitors] = useState("");

  // Step 2
  const [currentRevenue, setCurrentRevenue] = useState<number | undefined>();
  const [revenueHistory, setRevenueHistory] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [fixedCosts, setFixedCosts] = useState<number | undefined>();
  const [variableCosts, setVariableCosts] = useState<number | undefined>();
  const [cashAvailable, setCashAvailable] = useState<number | undefined>();
  const [grossMargin, setGrossMargin] = useState<number | undefined>();
  const [netMargin, setNetMargin] = useState<number | undefined>();
  const [netIncome, setNetIncome] = useState<number | undefined>();
  const [unpaidInvoices, setUnpaidInvoices] = useState<number | undefined>();
  const [unpaidAmount, setUnpaidAmount] = useState<number | undefined>();
  const [avgClientDays, setAvgClientDays] = useState<number | undefined>();
  const [avgSupplierDays, setAvgSupplierDays] = useState<number | undefined>();

  // Step 3
  const [activeClients, setActiveClients] = useState<number | undefined>();
  const [newClientsHistory, setNewClientsHistory] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [conversionRates, setConversionRates] = useState<number[]>([0, 0, 0]);
  const [avgBasket, setAvgBasket] = useState<number | undefined>();
  const [monthlyTransactions, setMonthlyTransactions] = useState<number | undefined>();
  const [mainChannel, setMainChannel] = useState("");
  const [marketingBudget, setMarketingBudget] = useState<number | undefined>();
  const [cac, setCac] = useState<number | undefined>();
  const [ltv, setLtv] = useState<number | undefined>();
  const [upsellRate, setUpsellRate] = useState<number | undefined>();
  const [growthTarget6m, setGrowthTarget6m] = useState<number | undefined>();
  const [growthTarget12m, setGrowthTarget12m] = useState<number | undefined>();

  // Step 4
  const [totalClients, setTotalClients] = useState<number | undefined>();
  const [activeClients30d, setActiveClients30d] = useState<number | undefined>();
  const [inactive60d, setInactive60d] = useState<number | undefined>();
  const [inactive90d, setInactive90d] = useState<number | undefined>();
  const [churnHistory, setChurnHistory] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [avgRelMonths, setAvgRelMonths] = useState<number | undefined>();
  const [npsScore, setNpsScore] = useState<number | undefined>();
  const [complaintsCurrent, setComplaintsCurrent] = useState<number | undefined>();
  const [complaintsPrevious, setComplaintsPrevious] = useState<number | undefined>();
  const [renewalRate, setRenewalRate] = useState<number | undefined>();
  const [retentionRate, setRetentionRate] = useState<number | undefined>();
  const [clientLtv, setClientLtv] = useState<number | undefined>();
  const [vipClients, setVipClients] = useState<number | undefined>();
  const [vipRevenue, setVipRevenue] = useState<number | undefined>();
  const [mainChurnReason, setMainChurnReason] = useState("");

  const currentStepId = steps[step]?.id;

  const buildPayload = () => ({
    user_id: userId,
    company_name: companyName, sector, company_size: companySize, employees, annual_revenue: annualRevenue, competitors,
    current_month_revenue: currentRevenue, revenue_history: revenueHistory, fixed_costs: fixedCosts, variable_costs: variableCosts,
    cash_available: cashAvailable, gross_margin: grossMargin, net_margin: netMargin, net_income: netIncome,
    unpaid_invoices: unpaidInvoices, unpaid_amount: unpaidAmount, avg_client_payment_days: avgClientDays, avg_supplier_payment_days: avgSupplierDays,
    active_clients: activeClients, new_clients_history: newClientsHistory, conversion_rates: conversionRates,
    avg_basket: avgBasket, monthly_transactions: monthlyTransactions, main_sales_channel: mainChannel,
    marketing_budget: marketingBudget, cac, ltv, upsell_rate: upsellRate, growth_target_6m: growthTarget6m, growth_target_12m: growthTarget12m,
    total_clients: totalClients, active_clients_30d: activeClients30d, inactive_60d: inactive60d, inactive_90d: inactive90d,
    churn_history: churnHistory, avg_relationship_months: avgRelMonths, nps_score: npsScore,
    complaints_current: complaintsCurrent, complaints_previous: complaintsPrevious,
    renewal_rate: renewalRate, retention_rate: retentionRate, client_ltv: clientLtv,
    vip_clients: vipClients, vip_revenue: vipRevenue, main_churn_reason: mainChurnReason,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = buildPayload();

      // Save company data
      const { error: saveError } = await supabase.from("company_data").upsert(payload, { onConflict: "user_id" });
      if (saveError) throw saveError;

      // Call edge functions based on plan
      const services: string[] = ["datadiag"];
      if (plan === "growthpilot" || plan === "loyaltyloop") services.push("growthpilot");
      if (plan === "loyaltyloop") services.push("loyaltyloop");

      for (const service of services) {
        let body: Record<string, unknown> = {};
        if (service === "datadiag") {
          body = {
            donnees_financieres: {
              ca_mensuel: currentRevenue, historique_ca: revenueHistory,
              charges_fixes: fixedCosts, charges_variables: variableCosts,
              tresorerie: cashAvailable, marge_brute: grossMargin, marge_nette: netMargin,
              resultat_net: netIncome, factures_impayees: unpaidInvoices, montant_impayes: unpaidAmount,
              delai_paiement_clients: avgClientDays, delai_paiement_fournisseurs: avgSupplierDays,
              entreprise: companyName, secteur: sector, taille: companySize, ca_annuel: annualRevenue,
            },
          };
        } else if (service === "growthpilot") {
          body = {
            profil_entreprise: { nom: companyName, secteur: sector, taille: companySize, salaries: employees, ca_annuel: annualRevenue },
            donnees_ventes: {
              clients_actifs: activeClients, nouveaux_clients: newClientsHistory, taux_conversion: conversionRates,
              panier_moyen: avgBasket, transactions_mensuelles: monthlyTransactions, canal_principal: mainChannel,
              budget_marketing: marketingBudget, cac, ltv, taux_upsell: upsellRate,
              objectif_6m: growthTarget6m, objectif_12m: growthTarget12m,
            },
          };
        } else if (service === "loyaltyloop") {
          body = {
            donnees_clients: {
              total_clients: totalClients, actifs_30j: activeClients30d, inactifs_60j: inactive60d, inactifs_90j: inactive90d,
              historique_churn: churnHistory, duree_moyenne_relation: avgRelMonths, nps: npsScore,
              reclamations_mois: complaintsCurrent, reclamations_precedent: complaintsPrevious,
              taux_renouvellement: renewalRate, taux_retention: retentionRate, ltv: clientLtv,
              clients_vip: vipClients, ca_vip: vipRevenue, motif_depart: mainChurnReason,
            },
          };
        }

        const { data, error } = await supabase.functions.invoke(service, { body });
        if (error) {
          console.error(`Edge function ${service} error:`, error);
          continue;
        }

        // Save AI results
        await supabase.from("ai_results").upsert(
          { user_id: userId, service, results: data },
          { onConflict: "user_id,service" }
        );
      }

      toast({ title: "Analyse lancée !", description: "Vos données ont été analysées avec succès." });
      onComplete();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Une erreur est survenue", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderRecap = () => {
    const blocks = [
      {
        title: "Infos générales",
        items: [
          ["Entreprise", companyName], ["Secteur", sector], ["Taille", companySize],
          ["Salariés", employees], ["CA annuel", annualRevenue ? `${annualRevenue} €` : ""],
        ],
      },
      {
        title: "Données financières",
        items: [
          ["CA mensuel", currentRevenue ? `${currentRevenue} €` : ""], ["Charges fixes", fixedCosts ? `${fixedCosts} €` : ""],
          ["Trésorerie", cashAvailable ? `${cashAvailable} €` : ""], ["Marge brute", grossMargin ? `${grossMargin}%` : ""],
          ["Factures impayées", unpaidInvoices],
        ],
      },
    ];

    if (plan === "growthpilot" || plan === "loyaltyloop") {
      blocks.push({
        title: "Données commerciales",
        items: [
          ["Clients actifs", activeClients], ["Panier moyen", avgBasket ? `${avgBasket} €` : ""],
          ["Transactions/mois", monthlyTransactions], ["CAC", cac ? `${cac} €` : ""], ["LTV", ltv ? `${ltv} €` : ""],
        ],
      });
    }

    if (plan === "loyaltyloop") {
      blocks.push({
        title: "Données clients",
        items: [
          ["Total clients", totalClients], ["Actifs 30j", activeClients30d],
          ["Taux rétention", retentionRate ? `${retentionRate}%` : ""], ["Clients VIP", vipClients],
          ["NPS", npsScore],
        ],
      });
    }

    return (
      <div className="space-y-4">
        {blocks.map((b) => (
          <div key={b.title} className="rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">{b.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {b.items.map(([label, val]) => (
                <div key={String(label)}>
                  <p className="text-[11px] text-muted-foreground">{String(label)}</p>
                  <p className="text-sm font-medium text-foreground">{val || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Progress bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isDone ? "bg-primary text-primary-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {isDone ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm font-semibold text-foreground">{steps[step]?.label}</p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Step 1: General */}
          {currentStepId === "general" && (
            <>
              <Field label="Nom de l'entreprise"><Input placeholder="Ex: Ma Société SAS" value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></Field>
              <Field label="Secteur d'activité">
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                  <SelectContent>{sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Taille de l'entreprise">
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                  <SelectContent>{sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre de salariés"><NumberInput value={employees} onChange={setEmployees} placeholder="Ex: 25" /></Field>
                <Field label="CA annuel estimé (€)"><NumberInput value={annualRevenue} onChange={setAnnualRevenue} placeholder="Ex: 500000" /></Field>
              </div>
              <Field label="Concurrents principaux" optional><Input placeholder="Ex: Société A, Société B" value={competitors} onChange={(e) => setCompetitors(e.target.value)} /></Field>
            </>
          )}

          {/* Step 2: Financial */}
          {currentStepId === "financial" && (
            <>
              <Field label="CA du mois en cours (€)"><NumberInput value={currentRevenue} onChange={setCurrentRevenue} placeholder="Ex: 42000" /></Field>
              <MultiMonthFields label="CA des 6 derniers mois (€)" count={6} values={revenueHistory} onChange={setRevenueHistory} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Charges fixes mensuelles (€)"><NumberInput value={fixedCosts} onChange={setFixedCosts} placeholder="Ex: 15000" /></Field>
                <Field label="Charges variables mensuelles (€)"><NumberInput value={variableCosts} onChange={setVariableCosts} placeholder="Ex: 8000" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Trésorerie actuelle (€)"><NumberInput value={cashAvailable} onChange={setCashAvailable} placeholder="Ex: 85000" /></Field>
                <Field label="Marge brute (%)"><NumberInput value={grossMargin} onChange={setGrossMargin} placeholder="Ex: 28.5" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Marge nette (%)"><NumberInput value={netMargin} onChange={setNetMargin} placeholder="Ex: 12" /></Field>
                <Field label="Résultat net dernier exercice (€)"><NumberInput value={netIncome} onChange={setNetIncome} placeholder="Ex: 60000" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Factures impayées (nombre)"><NumberInput value={unpaidInvoices} onChange={setUnpaidInvoices} placeholder="Ex: 5" /></Field>
                <Field label="Montant total impayés (€)"><NumberInput value={unpaidAmount} onChange={setUnpaidAmount} placeholder="Ex: 12000" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Délai moyen paiement clients (jours)"><NumberInput value={avgClientDays} onChange={setAvgClientDays} placeholder="Ex: 45" /></Field>
                <Field label="Délai moyen paiement fournisseurs (jours)"><NumberInput value={avgSupplierDays} onChange={setAvgSupplierDays} placeholder="Ex: 30" /></Field>
              </div>
            </>
          )}

          {/* Step 3: Commercial */}
          {currentStepId === "commercial" && (
            <>
              <Field label="Nombre de clients actifs"><NumberInput value={activeClients} onChange={setActiveClients} placeholder="Ex: 340" /></Field>
              <MultiMonthFields label="Nouveaux clients (ce mois + 5 derniers)" count={6} values={newClientsHistory} onChange={setNewClientsHistory} />
              <MultiMonthFields label="Taux de conversion (%) — 3 mois" count={3} values={conversionRates} onChange={setConversionRates} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Panier moyen (€)"><NumberInput value={avgBasket} onChange={setAvgBasket} placeholder="Ex: 2400" /></Field>
                <Field label="Transactions ce mois"><NumberInput value={monthlyTransactions} onChange={setMonthlyTransactions} placeholder="Ex: 120" /></Field>
              </div>
              <Field label="Canal de vente principal">
                <Select value={mainChannel} onValueChange={setMainChannel}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                  <SelectContent>{channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Budget marketing mensuel (€)"><NumberInput value={marketingBudget} onChange={setMarketingBudget} placeholder="Ex: 5000" /></Field>
                <Field label="CAC — Coût acquisition client (€)"><NumberInput value={cac} onChange={setCac} placeholder="Ex: 120" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="LTV — Valeur vie client (€)"><NumberInput value={ltv} onChange={setLtv} placeholder="Ex: 18000" /></Field>
                <Field label="Taux upsell/cross-sell (%)"><NumberInput value={upsellRate} onChange={setUpsellRate} placeholder="Ex: 15" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Objectif croissance 6 mois (%)"><NumberInput value={growthTarget6m} onChange={setGrowthTarget6m} placeholder="Ex: 10" /></Field>
                <Field label="Objectif croissance 12 mois (%)"><NumberInput value={growthTarget12m} onChange={setGrowthTarget12m} placeholder="Ex: 25" /></Field>
              </div>
            </>
          )}

          {/* Step 4: Clients */}
          {currentStepId === "clients" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre total clients"><NumberInput value={totalClients} onChange={setTotalClients} placeholder="Ex: 500" /></Field>
                <Field label="Clients actifs 30 derniers jours"><NumberInput value={activeClients30d} onChange={setActiveClients30d} placeholder="Ex: 340" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Clients inactifs +60 jours"><NumberInput value={inactive60d} onChange={setInactive60d} placeholder="Ex: 45" /></Field>
                <Field label="Clients inactifs +90 jours"><NumberInput value={inactive90d} onChange={setInactive90d} placeholder="Ex: 28" /></Field>
              </div>
              <MultiMonthFields label="Taux de churn (%) — 6 mois" count={6} values={churnHistory} onChange={setChurnHistory} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Durée moyenne relation client (mois)"><NumberInput value={avgRelMonths} onChange={setAvgRelMonths} placeholder="Ex: 18" /></Field>
                <Field label="Score NPS" optional><NumberInput value={npsScore} onChange={setNpsScore} placeholder="Ex: 42" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Réclamations ce mois"><NumberInput value={complaintsCurrent} onChange={setComplaintsCurrent} placeholder="Ex: 8" /></Field>
                <Field label="Réclamations mois précédent"><NumberInput value={complaintsPrevious} onChange={setComplaintsPrevious} placeholder="Ex: 12" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Taux de renouvellement (%)"><NumberInput value={renewalRate} onChange={setRenewalRate} placeholder="Ex: 85" /></Field>
                <Field label="Taux de rétention (%)"><NumberInput value={retentionRate} onChange={setRetentionRate} placeholder="Ex: 78" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="LTV (€)"><NumberInput value={clientLtv} onChange={setClientLtv} placeholder="Ex: 18000" /></Field>
                <Field label="Nombre clients VIP"><NumberInput value={vipClients} onChange={setVipClients} placeholder="Ex: 15" /></Field>
              </div>
              <Field label="CA clients VIP (€)"><NumberInput value={vipRevenue} onChange={setVipRevenue} placeholder="Ex: 250000" /></Field>
              <Field label="Motif de départ principal">
                <Select value={mainChurnReason} onValueChange={setMainChurnReason}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                  <SelectContent>{churnReasons.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </>
          )}

          {/* Recap */}
          {currentStepId === "recap" && renderRecap()}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4" /> Retour
          </Button>

          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Suivant <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Lancer l'analyse
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
