import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GoogleAnalyticsReport {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  rowCount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { userId, connectorId } = await req.json();

    if (!userId || !connectorId) {
      throw new Error("userId et connectorId sont requis");
    }

    // Récupérer la configuration du connecteur
    const { data: connector, error: connectorError } = await supabaseClient
      .from("data_connectors")
      .select("config")
      .eq("user_id", userId)
      .eq("connector_id", connectorId)
      .single();

    if (connectorError || !connector?.config) {
      throw new Error("Connecteur non trouvé ou non configuré");
    }

    const tokens = connector.config as any;

    // Vérifier si le token est expiré et le rafraîchir si nécessaire
    let accessToken = tokens.access_token;
    const now = new Date();
    const expiresAt = new Date(tokens.expires_at);

    if (now >= expiresAt) {
      // Rafraîchir le token
      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
          client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
          refresh_token: tokens.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error("Échec du refresh du token Google");
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;

      // Mettre à jour les tokens dans la base de données
      const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000);
      await supabaseClient
        .from("data_connectors")
        .update({
          config: {
            ...tokens,
            access_token: accessToken,
            expires_at: newExpiresAt.toISOString(),
          },
          last_sync_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("connector_id", connectorId);
    }

    // Récupérer les propriétés Google Analytics disponibles
    const propertiesResponse = await fetch(
      "https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!propertiesResponse.ok) {
      throw new Error(`Erreur API Google Analytics Admin: ${propertiesResponse.status}`);
    }

    const propertiesData = await propertiesResponse.json();

    // Pour chaque propriété, récupérer les métriques de base
    const analyticsData = [];

    for (const accountSummary of propertiesData.accountSummaries || []) {
      for (const propertySummary of accountSummary.propertySummaries || []) {
        const propertyId = propertySummary.property;

        try {
          // Requête pour les métriques des 30 derniers jours
          const reportResponse = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
                dimensions: [
                  { name: "date" },
                  { name: "sessionDefaultChannelGrouping" },
                  { name: "deviceCategory" },
                ],
                metrics: [
                  { name: "sessions" },
                  { name: "totalUsers" },
                  { name: "screenPageViews" },
                  { name: "bounceRate" },
                  { name: "averageSessionDuration" },
                  { name: "conversions" },
                ],
              }),
            }
          );

          if (reportResponse.ok) {
            const reportData: GoogleAnalyticsReport = await reportResponse.json();

            analyticsData.push({
              propertyId,
              propertyName: propertySummary.displayName,
              data: reportData,
              syncedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error(`Erreur pour la propriété ${propertyId}:`, error);
        }
      }
    }

    // Sauvegarder les données dans la table analytics_data
    if (analyticsData.length > 0) {
      const { error: insertError } = await supabaseClient
        .from("analytics_data")
        .upsert(
          analyticsData.map((item) => ({
            user_id: userId,
            connector_id: connectorId,
            property_id: item.propertyId,
            property_name: item.propertyName,
            data: item.data,
            synced_at: item.syncedAt,
          })),
          { onConflict: "user_id,connector_id,property_id" }
        );

      if (insertError) {
        throw new Error(`Erreur sauvegarde données: ${insertError.message}`);
      }
    }

    // Mettre à jour le statut du connecteur
    await supabaseClient
      .from("data_connectors")
      .update({
        last_sync_at: new Date().toISOString(),
        status: "connected",
        sync_error: null,
      })
      .eq("user_id", userId)
      .eq("connector_id", connectorId);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronisation réussie: ${analyticsData.length} propriétés traitées`,
        data: analyticsData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Erreur fonction google-analytics-sync:", error);
    const message = error instanceof Error ? error.message : String(error);

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});