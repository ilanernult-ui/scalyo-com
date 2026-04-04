// ─── Company Profile ──────────────────────────────────────────────
export interface CompanyProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  website: string | null;
  siret: string | null;
  address: string | null;
  phone: string | null;
  sector: string | null;
  company_size: "TPE" | "PME" | "ETI" | null;
  plan: "datadiag" | "growthpilot" | "loyaltyloop";
  plan_status: string;
  plan_expires_at: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Contacts ─────────────────────────────────────────────────────
export interface CompanyContact {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  is_main: boolean;
  created_at: string;
}

// ─── Objectives ───────────────────────────────────────────────────
export type ObjectiveStatus = "active" | "achieved" | "paused";

export interface BusinessObjective {
  id: string;
  user_id: string;
  title: string;
  kpi_target: string | null;
  deadline: string | null;
  status: ObjectiveStatus;
  created_at: string;
}

// ─── Notes ────────────────────────────────────────────────────────
export interface CompanyNote {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// ─── Health Score ─────────────────────────────────────────────────
export interface HealthScoreDetail {
  score: number;           // 0-100
  label: string;
  color: "green" | "lime" | "orange" | "red";
  financialScore: number;
  commercialScore: number;
  clientScore: number;
  factors: { label: string; value: string; ok: boolean }[];
}
