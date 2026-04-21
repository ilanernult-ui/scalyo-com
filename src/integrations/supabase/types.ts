export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_results: {
        Row: {
          created_at: string
          id: string
          results: Json
          service: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          results?: Json
          service: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          results?: Json
          service?: string
          user_id?: string
        }
        Relationships: []
      }
      company_data: {
        Row: {
          active_clients: number | null
          active_clients_30d: number | null
          annual_revenue: number | null
          avg_basket: number | null
          avg_client_payment_days: number | null
          avg_relationship_months: number | null
          avg_supplier_payment_days: number | null
          cac: number | null
          cash_available: number | null
          churn_history: Json | null
          client_ltv: number | null
          company_name: string | null
          company_size: string | null
          competitors: string | null
          complaints_current: number | null
          complaints_previous: number | null
          conversion_rates: Json | null
          created_at: string
          current_month_revenue: number | null
          employees: number | null
          fixed_costs: number | null
          gross_margin: number | null
          growth_target_12m: number | null
          growth_target_6m: number | null
          id: string
          inactive_60d: number | null
          inactive_90d: number | null
          ltv: number | null
          main_churn_reason: string | null
          main_sales_channel: string | null
          marketing_budget: number | null
          monthly_transactions: number | null
          net_income: number | null
          net_margin: number | null
          new_clients_history: Json | null
          nps_score: number | null
          renewal_rate: number | null
          retention_rate: number | null
          revenue_history: Json | null
          sector: string | null
          total_clients: number | null
          unpaid_amount: number | null
          unpaid_invoices: number | null
          updated_at: string
          upsell_rate: number | null
          user_id: string
          variable_costs: number | null
          vip_clients: number | null
          vip_revenue: number | null
        }
        Insert: {
          active_clients?: number | null
          active_clients_30d?: number | null
          annual_revenue?: number | null
          avg_basket?: number | null
          avg_client_payment_days?: number | null
          avg_relationship_months?: number | null
          avg_supplier_payment_days?: number | null
          cac?: number | null
          cash_available?: number | null
          churn_history?: Json | null
          client_ltv?: number | null
          company_name?: string | null
          company_size?: string | null
          competitors?: string | null
          complaints_current?: number | null
          complaints_previous?: number | null
          conversion_rates?: Json | null
          created_at?: string
          current_month_revenue?: number | null
          employees?: number | null
          fixed_costs?: number | null
          gross_margin?: number | null
          growth_target_12m?: number | null
          growth_target_6m?: number | null
          id?: string
          inactive_60d?: number | null
          inactive_90d?: number | null
          ltv?: number | null
          main_churn_reason?: string | null
          main_sales_channel?: string | null
          marketing_budget?: number | null
          monthly_transactions?: number | null
          net_income?: number | null
          net_margin?: number | null
          new_clients_history?: Json | null
          nps_score?: number | null
          renewal_rate?: number | null
          retention_rate?: number | null
          revenue_history?: Json | null
          sector?: string | null
          total_clients?: number | null
          unpaid_amount?: number | null
          unpaid_invoices?: number | null
          updated_at?: string
          upsell_rate?: number | null
          user_id: string
          variable_costs?: number | null
          vip_clients?: number | null
          vip_revenue?: number | null
        }
        Update: {
          active_clients?: number | null
          active_clients_30d?: number | null
          annual_revenue?: number | null
          avg_basket?: number | null
          avg_client_payment_days?: number | null
          avg_relationship_months?: number | null
          avg_supplier_payment_days?: number | null
          cac?: number | null
          cash_available?: number | null
          churn_history?: Json | null
          client_ltv?: number | null
          company_name?: string | null
          company_size?: string | null
          competitors?: string | null
          complaints_current?: number | null
          complaints_previous?: number | null
          conversion_rates?: Json | null
          created_at?: string
          current_month_revenue?: number | null
          employees?: number | null
          fixed_costs?: number | null
          gross_margin?: number | null
          growth_target_12m?: number | null
          growth_target_6m?: number | null
          id?: string
          inactive_60d?: number | null
          inactive_90d?: number | null
          ltv?: number | null
          main_churn_reason?: string | null
          main_sales_channel?: string | null
          marketing_budget?: number | null
          monthly_transactions?: number | null
          net_income?: number | null
          net_margin?: number | null
          new_clients_history?: Json | null
          nps_score?: number | null
          renewal_rate?: number | null
          retention_rate?: number | null
          revenue_history?: Json | null
          sector?: string | null
          total_clients?: number | null
          unpaid_amount?: number | null
          unpaid_invoices?: number | null
          updated_at?: string
          upsell_rate?: number | null
          user_id?: string
          variable_costs?: number | null
          vip_clients?: number | null
          vip_revenue?: number | null
        }
        Relationships: []
      }
      detected_problems: {
        Row: {
          category: string | null
          created_at: string
          criticality: string
          description: string
          id: string
          monthly_loss_eur: number | null
          probable_cause: string | null
          rank: number
          resolved: boolean
          title: string
          trend: string | null
          trend_delta_pct: number | null
          updated_at: string
          user_id: string
          weekly_hours_lost: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          criticality?: string
          description: string
          id?: string
          monthly_loss_eur?: number | null
          probable_cause?: string | null
          rank?: number
          resolved?: boolean
          title: string
          trend?: string | null
          trend_delta_pct?: number | null
          updated_at?: string
          user_id: string
          weekly_hours_lost?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          criticality?: string
          description?: string
          id?: string
          monthly_loss_eur?: number | null
          probable_cause?: string | null
          rank?: number
          resolved?: boolean
          title?: string
          trend?: string | null
          trend_delta_pct?: number | null
          updated_at?: string
          user_id?: string
          weekly_hours_lost?: number | null
        }
        Relationships: []
      }
      loss_history: {
        Row: {
          amount_eur: number
          category: string
          created_at: string
          explanation: string | null
          id: string
          period_month: string
          user_id: string
        }
        Insert: {
          amount_eur?: number
          category: string
          created_at?: string
          explanation?: string | null
          id?: string
          period_month: string
          user_id: string
        }
        Update: {
          amount_eur?: number
          category?: string
          created_at?: string
          explanation?: string | null
          id?: string
          period_month?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          plan: string
          plan_expires_at: string | null
          plan_status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          plan?: string
          plan_expires_at?: string | null
          plan_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          plan?: string
          plan_expires_at?: string | null
          plan_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      savings_log: {
        Row: {
          amount_eur: number
          created_at: string
          description: string | null
          id: string
          occurred_at: string
          source: string
          source_ref: string | null
          user_id: string
        }
        Insert: {
          amount_eur?: number
          created_at?: string
          description?: string | null
          id?: string
          occurred_at?: string
          source: string
          source_ref?: string | null
          user_id: string
        }
        Update: {
          amount_eur?: number
          created_at?: string
          description?: string | null
          id?: string
          occurred_at?: string
          source?: string
          source_ref?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
