import { motion } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";
import { useCountUp } from "./datadiag/useCountUp";

interface Props {
  thisMonth: number;
  total: number;
}

const SavingsWidget = ({ thisMonth, total }: Props) => {
  const monthVal = useCountUp(Math.round(thisMonth), 1400, 100);
  const totalVal = useCountUp(Math.round(total), 1600, 200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 shadow-[var(--shadow-sm)]"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Économies réalisées</p>
            <p className="text-[11px] text-muted-foreground/80">Grâce à Scalyo</p>
          </div>
        </div>

        <div className="flex items-end gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Ce mois</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary tracking-tight tabular-nums">
              {monthVal.toLocaleString("fr-FR")} €
            </p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Cumulé
            </p>
            <p className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight tabular-nums">
              {totalVal.toLocaleString("fr-FR")} €
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SavingsWidget;
