import type { HealthScoreDetail } from "@/types/company";

type CompanyData = Record<string, unknown>;

function num(v: unknown): number | null {
  const n = Number(v);
  return isNaN(n) || v === null || v === undefined || v === "" ? null : n;
}

export function computeHealthScore(data: CompanyData | null): HealthScoreDetail {
  if (!data) {
    return { score: 0, label: "Données manquantes", color: "red", financialScore: 0, commercialScore: 0, clientScore: 0, factors: [] };
  }

  const factors: { label: string; value: string; ok: boolean }[] = [];
  let fin = 0, com = 0, cli = 0;

  // ── Financial (35 pts) ─────────────────────────────────────────
  const margin = num(data.gross_margin);
  if (margin !== null) {
    const pts = margin >= 50 ? 12 : margin >= 30 ? 8 : margin >= 15 ? 4 : 0;
    fin += pts;
    factors.push({ label: "Marge brute", value: `${margin}%`, ok: margin >= 30 });
  }

  const cash = num(data.cash_available);
  const fixed = num(data.fixed_costs);
  if (cash !== null && fixed !== null && fixed > 0) {
    const months = cash / fixed;
    const pts = months >= 6 ? 12 : months >= 3 ? 7 : months >= 1 ? 3 : 0;
    fin += pts;
    factors.push({ label: "Trésorerie", value: `${months.toFixed(1)} mois de charges`, ok: months >= 3 });
  }

  const netMargin = num(data.net_margin);
  if (netMargin !== null) {
    const pts = netMargin >= 20 ? 11 : netMargin >= 10 ? 7 : netMargin >= 0 ? 3 : 0;
    fin += pts;
    factors.push({ label: "Marge nette", value: `${netMargin}%`, ok: netMargin >= 10 });
  }

  // ── Commercial (35 pts) ────────────────────────────────────────
  const ltv = num(data.ltv);
  const cac = num(data.cac);
  if (ltv !== null && cac !== null && cac > 0) {
    const ratio = ltv / cac;
    const pts = ratio >= 4 ? 14 : ratio >= 3 ? 10 : ratio >= 2 ? 6 : ratio >= 1 ? 2 : 0;
    com += pts;
    factors.push({ label: "LTV / CAC", value: `×${ratio.toFixed(1)}`, ok: ratio >= 3 });
  }

  const upsell = num(data.upsell_rate);
  if (upsell !== null) {
    const pts = upsell >= 20 ? 11 : upsell >= 10 ? 7 : upsell >= 5 ? 3 : 0;
    com += pts;
    factors.push({ label: "Taux upsell", value: `${upsell}%`, ok: upsell >= 10 });
  }

  const mktBudget = num(data.marketing_budget);
  const revenue = num(data.current_month_revenue);
  if (mktBudget !== null && revenue !== null && revenue > 0) {
    const ratio = (mktBudget / revenue) * 100;
    const pts = ratio <= 20 ? 10 : ratio <= 35 ? 6 : ratio <= 50 ? 3 : 0;
    com += pts;
    factors.push({ label: "Budget mktg / CA", value: `${ratio.toFixed(0)}%`, ok: ratio <= 30 });
  }

  // ── Client (30 pts) ───────────────────────────────────────────
  const retention = num(data.retention_rate);
  if (retention !== null) {
    const pts = retention >= 90 ? 15 : retention >= 75 ? 10 : retention >= 60 ? 5 : 0;
    cli += pts;
    factors.push({ label: "Taux de rétention", value: `${retention}%`, ok: retention >= 75 });
  }

  const nps = num(data.nps_score);
  if (nps !== null) {
    const pts = nps >= 50 ? 15 : nps >= 20 ? 10 : nps >= 0 ? 5 : 0;
    cli += pts;
    factors.push({ label: "NPS", value: String(nps), ok: nps >= 30 });
  }

  // Normalise to 100 if we have data
  const maxFin = 35, maxCom = 35, maxCli = 30;
  const totalMax = (margin !== null ? 12 : 0) + (cash !== null && fixed !== null ? 12 : 0) + (netMargin !== null ? 11 : 0)
    + (ltv !== null && cac !== null ? 14 : 0) + (upsell !== null ? 11 : 0) + (mktBudget !== null && revenue !== null ? 10 : 0)
    + (retention !== null ? 15 : 0) + (nps !== null ? 15 : 0);

  if (totalMax === 0) {
    return { score: 0, label: "Données manquantes", color: "red", financialScore: 0, commercialScore: 0, clientScore: 0, factors };
  }

  const raw = ((fin + com + cli) / totalMax) * 100;
  const score = Math.round(Math.max(0, Math.min(100, raw)));

  const financialScore = Math.round((fin / maxFin) * 100);
  const commercialScore = Math.round((com / maxCom) * 100);
  const clientScore = Math.round((cli / maxCli) * 100);

  const label = score >= 80 ? "Excellent" : score >= 60 ? "Bon" : score >= 40 ? "Moyen" : score >= 20 ? "Attention" : "Critique";
  const color = score >= 80 ? "green" : score >= 60 ? "lime" : score >= 40 ? "orange" : "red";

  return { score, label, color, financialScore, commercialScore, clientScore, factors };
}

export function scoreColor(color: HealthScoreDetail["color"]): string {
  return {
    green: "text-emerald-600",
    lime: "text-lime-600",
    orange: "text-orange-500",
    red: "text-red-500",
  }[color];
}

export function scoreBg(color: HealthScoreDetail["color"]): string {
  return {
    green: "bg-emerald-50 border-emerald-200",
    lime: "bg-lime-50 border-lime-200",
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200",
  }[color];
}
