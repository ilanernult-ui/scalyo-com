import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { NotificationItem } from "@/hooks/useDashboardEnrichment";

interface Props {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAllRead: () => void;
}

const typeColor: Record<NotificationItem["type"], string> = {
  info: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  critical: "bg-red-500/10 text-red-600",
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const NotificationsBell = ({ notifications, unreadCount, onMarkAllRead }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 w-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-[var(--shadow-lg,0_10px_30px_-10px_rgba(0,0,0,0.2))] z-40 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="h-3 w-3" /> Tout marquer lu
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Aucune notification pour l'instant</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-border/50 last:border-0 hover:bg-secondary/50 transition-colors ${
                        !n.read ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`h-6 px-2 rounded-full text-[10px] font-semibold flex items-center ${typeColor[n.type]}`}>
                          {n.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          {n.message && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>}
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{formatTime(n.created_at)}</p>
                        </div>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsBell;
