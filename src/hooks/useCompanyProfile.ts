import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CompanyProfile, CompanyContact, BusinessObjective, CompanyNote } from "@/types/company";

interface UseCompanyProfileReturn {
  profile: CompanyProfile | null;
  contacts: CompanyContact[];
  objectives: BusinessObjective[];
  notes: CompanyNote[];
  loading: boolean;
  updateProfile: (updates: Partial<CompanyProfile>) => Promise<void>;
  addContact: (c: Omit<CompanyContact, "id" | "user_id" | "created_at">) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addObjective: (o: Omit<BusinessObjective, "id" | "user_id" | "created_at">) => Promise<void>;
  updateObjective: (id: string, updates: Partial<BusinessObjective>) => Promise<void>;
  deleteObjective: (id: string) => Promise<void>;
  addNote: (content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export function useCompanyProfile(userId: string | undefined): UseCompanyProfileReturn {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [objectives, setObjectives] = useState<BusinessObjective[]>([]);
  const [notes, setNotes] = useState<CompanyNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [p, c, o, n] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      (supabase as any).from("company_contacts").select("*").eq("user_id", userId).order("is_main", { ascending: false }),
      (supabase as any).from("business_objectives").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      (supabase as any).from("company_notes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    if (p.data) setProfile(p.data as unknown as CompanyProfile);
    if (c.data) setContacts(c.data as CompanyContact[]);
    if (o.data) setObjectives(o.data as BusinessObjective[]);
    if (n.data) setNotes(n.data as CompanyNote[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateProfile = useCallback(async (updates: Partial<CompanyProfile>) => {
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq("id", userId)
      .select()
      .single();
    if (data) setProfile(data as unknown as CompanyProfile);
  }, [userId]);

  const addContact = useCallback(async (c: Omit<CompanyContact, "id" | "user_id" | "created_at">) => {
    if (!userId) return;
    const { data } = await (supabase as any).from("company_contacts").insert({ ...c, user_id: userId }).select().single();
    if (data) setContacts((prev) => [data as CompanyContact, ...prev]);
  }, [userId]);

  const deleteContact = useCallback(async (id: string) => {
    await (supabase as any).from("company_contacts").delete().eq("id", id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addObjective = useCallback(async (o: Omit<BusinessObjective, "id" | "user_id" | "created_at">) => {
    if (!userId) return;
    const { data } = await (supabase as any).from("business_objectives").insert({ ...o, user_id: userId }).select().single();
    if (data) setObjectives((prev) => [data as BusinessObjective, ...prev]);
  }, [userId]);

  const updateObjective = useCallback(async (id: string, updates: Partial<BusinessObjective>) => {
    const { data } = await (supabase as any).from("business_objectives").update(updates).eq("id", id).select().single();
    if (data) setObjectives((prev) => prev.map((o) => (o.id === id ? data as BusinessObjective : o)));
  }, []);

  const deleteObjective = useCallback(async (id: string) => {
    await (supabase as any).from("business_objectives").delete().eq("id", id);
    setObjectives((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const addNote = useCallback(async (content: string) => {
    if (!userId) return;
    const { data } = await (supabase as any).from("company_notes").insert({ content, user_id: userId }).select().single();
    if (data) setNotes((prev) => [data as CompanyNote, ...prev]);
  }, [userId]);

  const deleteNote = useCallback(async (id: string) => {
    await (supabase as any).from("company_notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { profile, contacts, objectives, notes, loading, updateProfile, addContact, deleteContact, addObjective, updateObjective, deleteObjective, addNote, deleteNote };
}
