import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DataConnector, ConnectorKey, SyncFrequency } from "@/types/connectors";

interface UseDataConnectorsReturn {
  connectors: DataConnector[];
  loading: boolean;
  addConnector: (connectorId: ConnectorKey, config?: Record<string, unknown>) => Promise<void>;
  updateConnector: (connectorId: ConnectorKey, updates: Partial<DataConnector>) => Promise<void>;
  disconnectConnector: (connectorId: ConnectorKey) => Promise<void>;
  setFrequency: (connectorId: ConnectorKey, frequency: SyncFrequency) => Promise<void>;
  simulateSync: (connectorId: ConnectorKey) => Promise<void>;
}

const db = supabase as any;

export function useDataConnectors(userId: string | undefined): UseDataConnectorsReturn {
  const [connectors, setConnectors] = useState<DataConnector[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    const { data } = await db.from("data_connectors").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setConnectors(data as DataConnector[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addConnector = useCallback(async (connectorId: ConnectorKey, config: Record<string, unknown> = {}) => {
    if (!userId) return;
    const { data } = await db
      .from("data_connectors")
      .upsert(
        { user_id: userId, connector_id: connectorId, status: "connected", config, last_sync_at: new Date().toISOString() },
        { onConflict: "user_id,connector_id" }
      )
      .select()
      .single();
    if (data) setConnectors((prev: DataConnector[]) => {
      const exists = prev.find((c) => c.connector_id === connectorId);
      if (exists) return prev.map((c) => c.connector_id === connectorId ? data as DataConnector : c);
      return [data as DataConnector, ...prev];
    });
  }, [userId]);

  const updateConnector = useCallback(async (connectorId: ConnectorKey, updates: Partial<DataConnector>) => {
    if (!userId) return;
    const { data } = await db
      .from("data_connectors")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("connector_id", connectorId)
      .select()
      .single();
    if (data) setConnectors((prev: DataConnector[]) => prev.map((c) => c.connector_id === connectorId ? data as DataConnector : c));
  }, [userId]);

  const disconnectConnector = useCallback(async (connectorId: ConnectorKey) => {
    await updateConnector(connectorId, { status: "disconnected", last_sync_at: null });
  }, [updateConnector]);

  const setFrequency = useCallback(async (connectorId: ConnectorKey, frequency: SyncFrequency) => {
    await updateConnector(connectorId, { frequency });
  }, [updateConnector]);

  const simulateSync = useCallback(async (connectorId: ConnectorKey) => {
    await updateConnector(connectorId, { last_sync_at: new Date().toISOString(), status: "connected", sync_error: null });
  }, [updateConnector]);

  return { connectors, loading, addConnector, updateConnector, disconnectConnector, setFrequency, simulateSync };
}
