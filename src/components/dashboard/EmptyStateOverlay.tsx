import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateOverlayProps {
  icon: LucideIcon;
  serviceName: string;
  description: string;
  accentColor: string;
  onConnect?: () => void;
  buttonLabel?: string;
  children: React.ReactNode;
}

const EmptyStateOverlay = ({ icon: Icon, serviceName, description, accentColor, onConnect, buttonLabel, children }: EmptyStateOverlayProps) => (
  <div className="relative">
    <div className="blur-[6px] opacity-40 pointer-events-none select-none" aria-hidden>
      {children}
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center z-10"
    >
      <div className="bg-background/90 backdrop-blur-xl border border-border rounded-2xl p-10 max-w-md text-center shadow-[var(--shadow-lg)]">
        <div
          className="mx-auto mb-5 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}12` }}
        >
          <Icon className="h-7 w-7" style={{ color: accentColor }} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight mb-2">
          Connectez vos données pour activer {serviceName}
        </h2>
        <p className="text-sm text-muted-foreground mb-6 text-wrap-pretty leading-relaxed">
          {description}
        </p>
        <Button className="w-full" size="lg" onClick={onConnect}>
          {buttonLabel || "Connecter mes données"}
        </Button>
        <p className="text-[11px] text-muted-foreground mt-3">
          Importez vos fichiers CSV, Excel ou connectez votre logiciel.
        </p>
      </div>
    </motion.div>
  </div>
);

export default EmptyStateOverlay;
