import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plug, RefreshCw, Trash2, CheckCircle2, AlertCircle,
  Clock, Loader2, Upload, Lock, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataConnectors } from "@/hooks/useDataConnectors";
import { useAuth } from "@/contexts/AuthContext";
import { analytics } from "@/lib/analytics";
import {
  CONNECTOR_DEFINITIONS, CATEGORY_LABELS,
  type ConnectorDefinition, type ConnectorKey, type SyncFrequency
} from "@/types/connectors";
import type { DataConnector } from "@/types/connectors";

const planHierarchy: Record<string, number> = { datadiag: 0, growthpilot: 1, loyaltyloop: 2 };

// ─── Status Badge ─────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: DataConnector["status"] }) => {
  const map = {
    connected: { label: "Connecté", icon: CheckCircle2, cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    pending: { label: "En attente", icon: Clock, cls: "text-orange-500 bg-orange-50 border-orange-200" },
    error: { label: "Erreur", icon: AlertCircle, cls: "text-red-500 bg-red-50 border-red-200" },
    disconnected: { label: "Déconnecté", icon: Plug, cls: "text-muted-foreground bg-secondary border-border" },
  } as const;
  const { label, icon: Icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      <Icon className="h-2.5 w-2.5" /> {label}
    </span>
  );
};

// ─── Connect Dialog ───────────────────────────────────────────────
const ConnectDialog = ({ def, onConnect, onClose }: {
  def: ConnectorDefinition;
  onConnect: (config: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) => {
  const [connecting, setConnecting] = useState(false);

  const initiateGoogleOAuth = (connectorId: string) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('❌ VITE_GOOGLE_CLIENT_ID n’est pas défini');
      alert('Google OAuth client ID non défini. Vérifiez votre configuration d’environnement.');
      return;
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', 'https://scalyo-com.vercel.app/auth/google/callback');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/analytics.readonly');
    authUrl.searchParams.set('access_type', 'offline');

    console.log('🔄 Début initiation OAuth Google pour:', connectorId);
    console.log('🔗 URL OAuth générée:', authUrl.toString());

    try {
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('❌ Erreur lors de la redirection:', error);
      alert('Erreur lors de la redirection vers Google. Vérifiez la console pour plus de détails.');
    }
  };

  const handleConnect = async () => {
    console.log('🎯 handleConnect appelé pour:', def.id, 'authType:', def.authType);
    setConnecting(true);

    if (def.authType === "oauth" && def.id === "google_analytics") {
      console.log('🔐 Condition OAuth Google remplie, appel initiateGoogleOAuth');
      // OAuth Google Analytics 4
      initiateGoogleOAuth(def.id);
      // Important: ne pas continuer l'exécution après la redirection
      return;
    }

    console.log('📝 Fallback: simulation pour autres connecteurs');
    // Simulation pour les autres connecteurs (temporaire)
    await new Promise((r) => setTimeout(r, 1200));
    await onConnect({});
    setConnecting(false);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{def.logo}</span>
            Connecter {def.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">{def.description}</p>

          <div className="rounded-xl bg-secondary/50 p-3 space-y-1.5 text-xs">
            <p className="font-medium text-foreground">Ce connecteur va :</p>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>Importer vos données automatiquement</li>
              <li>Les synchroniser selon la fréquence choisie</li>
              <li>Les rendre disponibles pour vos analyses IA</li>
            </ul>
          </div>

          {def.authType === "oauth" && (
            <p className="text-xs text-muted-foreground">
              Vous serez redirigé vers {def.name} pour autoriser l'accès.
              Aucun mot de passe n'est stocké.
            </p>
          )}
          {def.authType === "apikey" && (
            <p className="text-xs text-muted-foreground">
              Une clé API en lecture seule suffit. Vous pouvez la révoquer à tout moment.
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button className="flex-1" onClick={handleConnect} disabled={connecting}>
              {connecting
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Connexion…</>
                : def.authType === "upload"
                  ? <><Upload className="h-3.5 w-3.5 mr-1.5" /> Importer</>
                  : <><Plug className="h-3.5 w-3.5 mr-1.5" /> Autoriser</>
              }
            </Button>
          </div>

          {/* Debug button - temporaire */}
          {def.id === "google_analytics" && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs"
              onClick={() => {
                console.log('🧪 Test OAuth variables:');
                console.log('- Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
                console.log('- Client Secret:', import.meta.env.VITE_GOOGLE_CLIENT_SECRET);
                console.log('- Origin:', window.location.origin);
                alert('Vérifiez la console pour les variables OAuth');
              }}
            >
              🔍 Debug OAuth
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Connector Card ───────────────────────────────────────────────
const ConnectorCard = ({ def, connector, onConnect, onDisconnect, onSync, onFrequencyChange, locked }: {
  def: ConnectorDefinition;
  connector: DataConnector | undefined;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onFrequencyChange: (f: SyncFrequency) => void;
  locked: boolean;
}) => {
  const isConnected = connector?.status === "connected";
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await onSync();
    setSyncing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-card p-4 flex flex-col gap-3 ${locked ? "opacity-60" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{def.logo}</span>
          <div>
            <p className="text-sm font-semibold text-foreground">{def.name}</p>
            <p className="text-xs text-muted-foreground">{def.description}</p>
          </div>
        </div>
        {locked
          ? <Badge variant="secondary" className="text-[10px] flex-shrink-0 gap-1"><Lock className="h-2.5 w-2.5" /> {def.minPlan}</Badge>
          : connector && <StatusBadge status={connector.status} />
        }
      </div>

      {/* Last sync info */}
      {isConnected && connector?.last_sync_at && (
        <p className="text-[11px] text-muted-foreground">
          Dernière sync : {new Date(connector.last_sync_at).toLocaleString("fr-FR")}
        </p>
      )}

      {connector?.sync_error && (
        <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-2 py-1">{connector.sync_error}</p>
      )}

      {/* Frequency selector */}
      {isConnected && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground flex-shrink-0">Fréquence :</p>
          <Select
            value={connector?.frequency ?? "daily"}
            onValueChange={(v) => onFrequencyChange(v as SyncFrequency)}
          >
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Temps réel</SelectItem>
              <SelectItem value="daily">Quotidien</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Actions */}
      {!locked && (
        <div className="flex gap-2 pt-1">
          {isConnected ? (
            <>
              <Button
                variant="outline" size="sm" className="flex-1 gap-1.5 text-xs h-8"
                onClick={handleSync} disabled={syncing}
              >
                {syncing
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <RefreshCw className="h-3 w-3" />
                }
                Synchroniser
              </Button>
              <Button
                variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={onDisconnect}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button size="sm" className="flex-1 gap-1.5 text-xs h-8" onClick={onConnect}>
              <Plug className="h-3 w-3" />
              {connector?.status === "disconnected" ? "Reconnecter" : "Connecter"}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Tab ─────────────────────────────────────────────────────
const DataConnectorsTab = () => {
  const { user, plan } = useAuth();
  const { connectors, loading, addConnector, disconnectConnector, setFrequency, simulateSync } = useDataConnectors(user?.id);
  const [connecting, setConnecting] = useState<ConnectorDefinition | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const userPlanLevel = planHierarchy[plan] ?? 0;
  const connectedCount = connectors.filter((c) => c.status === "connected").length;

  const maxConnectors: Record<string, number> = { datadiag: 1, growthpilot: 5, loyaltyloop: Infinity };
  const maxAllowed = maxConnectors[plan] ?? 1;
  const atLimit = connectedCount >= maxAllowed;

  const categories = ["all", ...Array.from(new Set(CONNECTOR_DEFINITIONS.map((d) => d.category)))];

  const filtered = selectedCategory === "all"
    ? CONNECTOR_DEFINITIONS
    : CONNECTOR_DEFINITIONS.filter((d) => d.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Mes données</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {connectedCount}/{maxAllowed === Infinity ? "∞" : maxAllowed} connecteurs actifs sur votre plan {plan}
          </p>
        </div>
        {atLimit && maxAllowed !== Infinity && (
          <Badge variant="outline" className="text-xs gap-1 text-orange-600 border-orange-300 bg-orange-50">
            <Lock className="h-3 w-3" /> Limite atteinte — passez au plan supérieur
          </Badge>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat === "all" ? "Tous" : CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}
          </button>
        ))}
      </div>

      {/* Connected summary */}
      {connectedCount > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-800">{connectedCount} source{connectedCount > 1 ? "s" : ""} connectée{connectedCount > 1 ? "s" : ""}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {connectors.filter((c) => c.status === "connected").map((c) => {
              const def = CONNECTOR_DEFINITIONS.find((d) => d.id === c.connector_id);
              return def ? (
                <span key={c.id} className="inline-flex items-center gap-1 text-xs bg-white rounded-full px-2 py-0.5 border border-emerald-200">
                  {def.logo} {def.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((def) => {
          const connector = connectors.find((c) => c.connector_id === def.id);
          const defPlanLevel = planHierarchy[def.minPlan] ?? 0;
          const locked = defPlanLevel > userPlanLevel || (atLimit && !connector);

          return (
            <ConnectorCard
              key={def.id}
              def={def}
              connector={connector}
              locked={locked}
              onConnect={() => {
                if (locked) return;
                setConnecting(def);
              }}
              onDisconnect={() => disconnectConnector(def.id as ConnectorKey)}
              onSync={() => simulateSync(def.id as ConnectorKey)}
              onFrequencyChange={(f) => setFrequency(def.id as ConnectorKey, f)}
            />
          );
        })}
      </div>

      {/* Connect dialog */}
      {connecting && (
        <ConnectDialog
          def={connecting}
          onConnect={async (config) => {
            await addConnector(connecting.id as ConnectorKey, config);
            analytics.track("connector_added", { connector: connecting.id, plan });
          }}
          onClose={() => setConnecting(null)}
        />
      )}

      {/* Empty state */}
      {connectedCount === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Connectez au moins une source pour enrichir vos analyses IA.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataConnectorsTab;
