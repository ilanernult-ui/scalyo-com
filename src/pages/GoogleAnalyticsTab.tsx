import { useEffect, useState, useCallback, forwardRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, BarChart3, Users, MousePointerClick, Eye } from "lucide-react";
import { getValidGoogleTokens } from "@/lib/googleOAuth";

const db = supabase as any;

const GOOGLE_BLUE = "#4285F4";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41 35.4 44 30.1 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

interface KPIs {
  sessions: number | null;
  activeUsers: number | null;
  bounceRate: number | null;
  pageViews: number | null;
}

const formatNum = (n: number | null) => (n === null || n === undefined || isNaN(n) ? "--" : n.toLocaleString("fr-FR"));
const formatPct = (n: number | null) => (n === null || n === undefined || isNaN(n) ? "--" : `${(n * 100).toFixed(1)}%`);

const GOOGLE_CLIENT_ID = "584640345239-hd1t9vdd55m0omt8iol4evonc85dcvp0.apps.googleusercontent.com";

const initiateOAuth = () => {
  const clientId = GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const state = encodeURIComponent(JSON.stringify({ connectorId: "google_analytics" }));
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);
  window.location.href = authUrl.toString();
};

const KPICard = forwardRef<HTMLDivElement, { icon: any; label: string; value: string }>(
  ({ icon: Icon, label, value }, ref) => (
    <Card ref={ref}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
);
KPICard.displayName = "KPICard";

const GoogleAnalyticsTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState<string | null>(null);
  const [kpis, setKpis] = useState<KPIs>({ sessions: null, activeUsers: null, bounceRate: null, pageViews: null });
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await db
      .from("data_connectors")
      .select("status, config")
      .eq("user_id", user.id)
      .eq("connector_id", "google_analytics")
      .maybeSingle();
    setConnected(!!data && data.status === "connected" && !!(data.config as any)?.access_token);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { checkConnection(); }, [checkConnection]);

  const fetchData = useCallback(async () => {
    if (!user?.id || !connected) return;
    setFetchingData(true);
    setError(null);
    try {
      const tokens = await getValidGoogleTokens(user.id, "google_analytics");
      if (!tokens) throw new Error("Tokens Google indisponibles. Veuillez vous reconnecter.");

      // 1. Discover first GA4 property
      const accRes = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (!accRes.ok) throw new Error(`Erreur Admin API (${accRes.status})`);
      const accJson = await accRes.json();
      const firstProp = accJson.accountSummaries?.flatMap((a: any) => a.propertySummaries || [])?.[0];
      if (!firstProp) {
        setError("Aucune propriété Google Analytics 4 trouvée sur ce compte.");
        return;
      }
      const propId = firstProp.property?.replace("properties/", "");
      setPropertyId(propId);
      setPropertyName(firstProp.displayName || null);

      // 2. Run report (last 30 days)
      const reportRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propId}:runReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [
              { name: "sessions" },
              { name: "activeUsers" },
              { name: "bounceRate" },
              { name: "screenPageViews" },
            ],
          }),
        }
      );
      if (!reportRes.ok) throw new Error(`Erreur Data API (${reportRes.status})`);
      const reportJson = await reportRes.json();
      const row = reportJson.rows?.[0]?.metricValues;
      if (!row) {
        setKpis({ sessions: null, activeUsers: null, bounceRate: null, pageViews: null });
        return;
      }
      setKpis({
        sessions: Number(row[0]?.value ?? NaN),
        activeUsers: Number(row[1]?.value ?? NaN),
        bounceRate: Number(row[2]?.value ?? NaN),
        pageViews: Number(row[3]?.value ?? NaN),
      });
    } catch (e: any) {
      setError(e.message || "Erreur lors de la récupération des données.");
    } finally {
      setFetchingData(false);
    }
  }, [user?.id, connected]);

  useEffect(() => { if (connected) fetchData(); }, [connected, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Google Analytics</h1>
          <p className="text-muted-foreground mt-1">
            {connected
              ? propertyName
                ? `Propriété : ${propertyName}`
                : "Données des 30 derniers jours"
              : "Connectez votre compte pour visualiser vos données de trafic."}
          </p>
        </div>
        {connected && (
          <Button variant="outline" onClick={fetchData} disabled={fetchingData} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${fetchingData ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        )}
      </div>

      {!connected ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center text-center gap-5">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
              <GoogleIcon className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-md">
              <h2 className="text-lg font-semibold">Aucun compte connecté</h2>
              <p className="text-sm text-muted-foreground">
                Connectez votre compte Google Analytics pour voir vos données ici.
              </p>
            </div>
            <Button
              onClick={initiateOAuth}
              size="lg"
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: GOOGLE_BLUE }}
            >
              <GoogleIcon className="h-4 w-4 bg-white rounded-sm p-0.5" />
              Connecter Google Analytics
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {error && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-destructive">{error}</p>
                {(error.toLowerCase().includes("token") || error.toLowerCase().includes("reconnect")) && (
                  <Button
                    onClick={initiateOAuth}
                    size="sm"
                    className="gap-2 text-white hover:opacity-90 shrink-0"
                    style={{ backgroundColor: GOOGLE_BLUE }}
                  >
                    <GoogleIcon className="h-4 w-4 bg-white rounded-sm p-0.5" />
                    Se reconnecter à Google
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard icon={BarChart3} label="Sessions du mois" value={fetchingData ? "--" : formatNum(kpis.sessions)} />
            <KPICard icon={Users} label="Utilisateurs actifs" value={fetchingData ? "--" : formatNum(kpis.activeUsers)} />
            <KPICard icon={MousePointerClick} label="Taux de rebond" value={fetchingData ? "--" : formatPct(kpis.bounceRate)} />
            <KPICard icon={Eye} label="Pages vues" value={fetchingData ? "--" : formatNum(kpis.pageViews)} />
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleAnalyticsTab;
