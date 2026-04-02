import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const integrations = [
  { name: "Salesforce", connected: true, lastSync: "il y a 4 min", icon: "☁️" },
  { name: "HubSpot", connected: true, lastSync: "il y a 12 min", icon: "🟠" },
  { name: "Pipedrive", connected: false, lastSync: null, icon: "🔵" },
  { name: "Notion", connected: false, lastSync: null, icon: "◾" },
];

const IntegrationsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
      <h2 className="text-sm font-semibold text-white/60">Intégrations CRM</h2>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {integrations.map((int, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-xl border border-[#f0c040]/[0.06] bg-white/[0.02] p-4 text-center hover:border-[#f0c040]/15 transition-all"
        >
          <span className="text-2xl">{int.icon}</span>
          <p className="text-sm font-medium text-white/80 mt-2">{int.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1.5 mb-3">
            <div className={`w-1.5 h-1.5 rounded-full ${int.connected ? "bg-[#10b981]" : "bg-white/20"}`} />
            <span className={`text-[10px] ${int.connected ? "text-[#10b981]" : "text-white/30"}`}>
              {int.connected ? "Connecté" : "Non connecté"}
            </span>
          </div>
          {int.lastSync && <p className="text-[9px] text-white/20 mb-2">Sync: {int.lastSync}</p>}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] h-7 border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] bg-transparent"
          >
            {int.connected ? "Configurer" : "Connecter"}
          </Button>
        </motion.div>
      ))}
    </div>
  </div>
);

export default IntegrationsPanel;
