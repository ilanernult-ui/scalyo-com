import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Globe, Phone, MapPin, FileText, Users, Target,
  StickyNote, CreditCard, Plus, Trash2, Pencil, CheckCircle2,
  PauseCircle, Circle, Loader2, TrendingUp, BarChart3, Heart,
  X, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/contexts/AuthContext";
import { computeHealthScore, scoreColor, scoreBg } from "@/lib/healthScore";
import { STRIPE_PLANS } from "@/lib/stripe-plans";
import type { ObjectiveStatus } from "@/types/company";

// ─── Health Score Card ─────────────────────────────────────────────
const HealthScoreCard = ({ companyData }: { companyData: Record<string, unknown> | null }) => {
  const hs = computeHealthScore(companyData);
  const textColor = scoreColor(hs.color);
  const bgColor = scoreBg(hs.color);

  return (
    <div className={`rounded-2xl border p-5 ${bgColor}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Score de santé business</h3>
        <span className={`text-2xl font-bold ${textColor}`}>{hs.score}/100</span>
      </div>

      {/* Global gauge */}
      <div className="mb-4">
        <div className="h-2 rounded-full bg-black/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${hs.score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${hs.color === "green" ? "bg-emerald-500" : hs.color === "lime" ? "bg-lime-500" : hs.color === "orange" ? "bg-orange-500" : "bg-red-500"}`}
          />
        </div>
        <p className={`text-xs font-medium mt-1 ${textColor}`}>{hs.label}</p>
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Financier", score: hs.financialScore, icon: BarChart3 },
          { label: "Commercial", score: hs.commercialScore, icon: TrendingUp },
          { label: "Clients", score: hs.clientScore, icon: Heart },
        ].map((s) => (
          <div key={s.label} className="text-center bg-white/50 rounded-xl p-2">
            <s.icon className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-sm font-bold text-foreground">{s.score}%</p>
          </div>
        ))}
      </div>

      {/* Factors */}
      {hs.factors.length > 0 && (
        <div className="space-y-1">
          {hs.factors.slice(0, 4).map((f) => (
            <div key={f.label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{f.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">{f.value}</span>
                {f.ok ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-orange-400" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {hs.factors.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Connectez vos données pour calculer votre score.
        </p>
      )}
    </div>
  );
};

// ─── Subscription Card ────────────────────────────────────────────
const SubscriptionCard = () => {
  const { plan, planStatus, subscriptionEnd } = useAuth();
  const config = STRIPE_PLANS[plan];
  const formattedEnd = subscriptionEnd
    ? new Date(subscriptionEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Abonnement</h3>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base font-bold text-foreground">{config.name}</span>
        <Badge variant={planStatus === "active" ? "default" : "destructive"} className="text-[10px]">
          {planStatus === "active" ? "Actif" : planStatus === "cancelled" ? "Résilié" : "Impayé"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{config.monthly}€/mois · {config.tagline}</p>
      {formattedEnd && (
        <p className="text-xs text-muted-foreground">
          {planStatus === "cancelled" ? "Accès jusqu'au" : "Renouvellement le"} {formattedEnd}
        </p>
      )}
    </div>
  );
};

// ─── Edit Company Info Dialog ──────────────────────────────────────
type CompanyInfoForm = {
  company_name: string;
  website: string;
  siret: string;
  address: string;
  phone: string;
  sector: string;
  company_size: string;
};

interface EditInfoDialogProps {
  open: boolean;
  onClose: () => void;
  initial: CompanyInfoForm;
  onSave: (v: CompanyInfoForm) => Promise<void>;
}

const SECTORS = ["Tech / SaaS", "E-commerce", "Retail", "Services B2B", "Conseil", "Industrie", "Restauration / Food", "Santé", "Immobilier", "Autre"];

const EditInfoDialog = ({ open, onClose, initial, onSave }: EditInfoDialogProps) => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier les informations</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom de l'entreprise</label>
              <Input value={form.company_name} onChange={(e) => set("company_name")(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Secteur</label>
              <Select value={form.sector} onValueChange={set("sector")}>
                <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Taille</label>
              <Select value={form.company_size} onValueChange={set("company_size")}>
                <SelectTrigger><SelectValue placeholder="Taille…" /></SelectTrigger>
                <SelectContent>
                  {["TPE", "PME", "ETI"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Site web</label>
              <Input value={form.website} onChange={(e) => set("website")(e.target.value)} placeholder="https://…" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
              <Input value={form.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="+33…" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">SIRET</label>
              <Input value={form.siret} onChange={(e) => set("siret")(e.target.value)} placeholder="12345678900000" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Adresse</label>
              <Input value={form.address} onChange={(e) => set("address")(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Contacts Card ─────────────────────────────────────────────────
const ContactsCard = ({ contacts, onAdd, onDelete }: {
  contacts: ReturnType<typeof useCompanyProfile>["contacts"];
  onAdd: ReturnType<typeof useCompanyProfile>["addContact"];
  onDelete: ReturnType<typeof useCompanyProfile>["deleteContact"];
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "", is_main: false });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await onAdd(form);
    setSaving(false);
    setForm({ name: "", role: "", email: "", phone: "", is_main: false });
    setOpen(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Contacts clés</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setOpen(true)}>
          <Plus className="h-3 w-3" /> Ajouter
        </Button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Aucun contact enregistré.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-start justify-between p-3 rounded-xl bg-secondary/50">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  {c.is_main && <Badge className="text-[10px] h-4">Principal</Badge>}
                </div>
                {c.role && <p className="text-xs text-muted-foreground">{c.role}</p>}
                {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" onClick={() => onDelete(c.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Ajouter un contact</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Input placeholder="Nom *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Rôle (ex : CEO, DAF)" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_main} onChange={(e) => setForm((f) => ({ ...f, is_main: e.target.checked }))} />
              Contact principal
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={handleAdd} disabled={saving || !form.name.trim()}>
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Objectives Card ───────────────────────────────────────────────
const statusIcon = (s: ObjectiveStatus) => ({
  active: <Circle className="h-3.5 w-3.5 text-blue-500" />,
  achieved: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  paused: <PauseCircle className="h-3.5 w-3.5 text-orange-400" />,
}[s]);

const statusLabel = (s: ObjectiveStatus) => ({ active: "En cours", achieved: "Atteint", paused: "En pause" }[s]);

const ObjectivesCard = ({ objectives, onAdd, onUpdate, onDelete }: {
  objectives: ReturnType<typeof useCompanyProfile>["objectives"];
  onAdd: ReturnType<typeof useCompanyProfile>["addObjective"];
  onUpdate: ReturnType<typeof useCompanyProfile>["updateObjective"];
  onDelete: ReturnType<typeof useCompanyProfile>["deleteObjective"];
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", kpi_target: "", deadline: "", status: "active" as ObjectiveStatus });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onAdd({ ...form, deadline: form.deadline || null, kpi_target: form.kpi_target || null });
    setSaving(false);
    setForm({ title: "", kpi_target: "", deadline: "", status: "active" });
    setOpen(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Objectifs business</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setOpen(true)}>
          <Plus className="h-3 w-3" /> Ajouter
        </Button>
      </div>

      {objectives.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Aucun objectif défini.</p>
      ) : (
        <div className="space-y-2">
          {objectives.map((o) => (
            <div key={o.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
              <button
                onClick={() => {
                  const next: ObjectiveStatus = o.status === "active" ? "achieved" : o.status === "achieved" ? "paused" : "active";
                  onUpdate(o.id, { status: next });
                }}
                className="mt-0.5 flex-shrink-0"
                title={`Statut : ${statusLabel(o.status)}`}
              >
                {statusIcon(o.status)}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${o.status === "achieved" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {o.title}
                </p>
                {o.kpi_target && <p className="text-xs text-muted-foreground">KPI : {o.kpi_target}</p>}
                {o.deadline && <p className="text-xs text-muted-foreground">Échéance : {new Date(o.deadline).toLocaleDateString("fr-FR")}</p>}
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => onDelete(o.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nouvel objectif</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Input placeholder="Objectif *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Input placeholder="KPI cible (ex : MRR +20%)" value={form.kpi_target} onChange={(e) => setForm((f) => ({ ...f, kpi_target: e.target.value }))} />
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Échéance</label>
              <Input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={handleAdd} disabled={saving || !form.title.trim()}>
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Notes Card ────────────────────────────────────────────────────
const NotesCard = ({ notes, onAdd, onDelete }: {
  notes: ReturnType<typeof useCompanyProfile>["notes"];
  onAdd: ReturnType<typeof useCompanyProfile>["addNote"];
  onDelete: ReturnType<typeof useCompanyProfile>["deleteNote"];
}) => {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await onAdd(content.trim());
    setSaving(false);
    setContent("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Notes internes</h3>
      </div>

      <div className="flex gap-2 mb-3">
        <Textarea
          placeholder="Ajouter une observation…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="text-sm resize-none"
        />
        <Button size="sm" onClick={handleAdd} disabled={saving || !content.trim()} className="self-end">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-2">Aucune note enregistrée.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notes.map((n) => (
            <div key={n.id} className="flex items-start gap-2 p-3 rounded-xl bg-secondary/50">
              <p className="flex-1 text-sm text-foreground whitespace-pre-wrap">{n.content}</p>
              <div className="flex-shrink-0 flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString("fr-FR")}</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive" onClick={() => onDelete(n.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── History Card ──────────────────────────────────────────────────
const HistoryCard = ({ aiResults }: { aiResults: Record<string, unknown> }) => {
  const services = [
    { key: "datadiag", label: "DataDiag", icon: BarChart3 },
    { key: "growthpilot", label: "GrowthPilot", icon: TrendingUp },
    { key: "loyaltyloop", label: "LoyaltyLoop", icon: Heart },
  ].filter((s) => aiResults[s.key]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Historique des analyses</h3>
      </div>

      {services.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          Aucune analyse générée. Lancez votre premier diagnostic depuis le tableau de bord.
        </p>
      ) : (
        <div className="space-y-2">
          {services.map((s) => {
            const result = aiResults[s.key] as Record<string, unknown> | null;
            const generatedAt = result?.generated_at as string | undefined;
            return (
              <div key={s.key} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <s.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {generatedAt ? `Dernière analyse le ${new Date(generatedAt).toLocaleDateString("fr-FR")}` : "Analyse disponible"}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px]">Disponible</Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────
interface CompanyProfileTabProps {
  companyData: Record<string, unknown> | null;
  aiResults: Record<string, unknown>;
}

const CompanyProfileTab = ({ companyData, aiResults }: CompanyProfileTabProps) => {
  const { user } = useAuth();
  const {
    profile, contacts, objectives, notes, loading,
    updateProfile, addContact, deleteContact,
    addObjective, updateObjective, deleteObjective,
    addNote, deleteNote,
  } = useCompanyProfile(user?.id);

  const [editOpen, setEditOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const infoInitial = {
    company_name: profile?.company_name ?? "",
    website: profile?.website ?? "",
    siret: profile?.siret ?? "",
    address: profile?.address ?? "",
    phone: profile?.phone ?? "",
    sector: profile?.sector ?? companyData?.sector as string ?? "",
    company_size: profile?.company_size ?? companyData?.company_size as string ?? "",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {profile?.company_name ?? "Mon entreprise"}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              {String(profile?.sector ?? companyData?.sector ?? "") && (
                <span className="text-xs text-muted-foreground">{String(profile?.sector ?? companyData?.sector ?? "")}</span>
              )}
              {String(profile?.company_size ?? companyData?.company_size ?? "") && (
                <Badge variant="secondary" className="text-[10px]">{String(profile?.company_size ?? companyData?.company_size ?? "")}</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {(profile?.website) && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <Globe className="h-3 w-3" /> {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {(profile?.phone) && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {profile.phone}
                </span>
              )}
              {(profile?.address) && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {profile.address}
                </span>
              )}
              {(profile?.siret) && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" /> SIRET {profile.siret}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" onClick={() => setEditOpen(true)}>
          <Pencil className="h-3.5 w-3.5" /> Modifier
        </Button>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-4">
          <ContactsCard contacts={contacts} onAdd={addContact} onDelete={deleteContact} />
          <ObjectivesCard objectives={objectives} onAdd={addObjective} onUpdate={updateObjective} onDelete={deleteObjective} />
          <NotesCard notes={notes} onAdd={addNote} onDelete={deleteNote} />
          <HistoryCard aiResults={aiResults} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <HealthScoreCard companyData={companyData} />
          <SubscriptionCard />
        </div>
      </div>

      <EditInfoDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={infoInitial}
        onSave={async (v) => {
          await updateProfile({
            company_name: v.company_name || null,
            website: v.website || null,
            siret: v.siret || null,
            address: v.address || null,
            phone: v.phone || null,
            sector: v.sector || null,
            company_size: v.company_size as "TPE" | "PME" | "ETI" | null,
          });
        }}
      />
    </div>
  );
};

export default CompanyProfileTab;
