import { motion } from "framer-motion";
import scalyoLogo from "@/assets/scalyo-logo.png";

interface Props {
  /** Optional message under the logo */
  message?: string;
  /** Use full viewport (default true). Set false to fit in a parent */
  fullScreen?: boolean;
}

const ScalyoLoadingScreen = ({ message = "Chargement…", fullScreen = true }: Props) => {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-[100]" : "w-full h-full"
      } flex flex-col items-center justify-center bg-background`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing aura */}
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-primary/15"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-24 w-24 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Logo */}
        <motion.img
          src={scalyoLogo}
          alt="Scalyo"
          className="relative h-16 w-16 object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.06, 1], opacity: 1 }}
          transition={{
            scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.4 },
          }}
        />
      </div>

      {/* Wordmark */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-6 text-lg font-semibold tracking-tight text-foreground"
      >
        Scalyo
      </motion.p>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-1.5 text-sm text-muted-foreground"
      >
        {message}
      </motion.p>

      {/* Indeterminate progress bar */}
      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full w-1/3 rounded-full bg-primary"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ScalyoLoadingScreen;
