export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analysis_sessions: {
        Row: {
          analysis_data: Json | null
          created_at: string
          email_capture_source: string | null
          extracted_text: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          negotiation_data: Json | null
          pdf_file_path: string | null
          property_address: string | null
          property_data: Json | null
          session_id: string
          survey_responses: Json | null
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_question: string | null
        }
        Insert: {
          analysis_data?: Json | null
          created_at?: string
          email_capture_source?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          negotiation_data?: Json | null
          pdf_file_path?: string | null
          property_address?: string | null
          property_data?: Json | null
          session_id: string
          survey_responses?: Json | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_question?: string | null
        }
        Update: {
          analysis_data?: Json | null
          created_at?: string
          email_capture_source?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          negotiation_data?: Json | null
          pdf_file_path?: string | null
          property_address?: string | null
          property_data?: Json | null
          session_id?: string
          survey_responses?: Json | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_question?: string | null
        }
        Relationships: []
      }
      anonymous_reports: {
        Row: {
          analysis_data: Json
          converted_at: string | null
          converted_to_user_id: string | null
          created_at: string
          expires_at: string
          id: string
          inspection_date: string | null
          negotiation_strategy: Json | null
          pdf_file_path: string | null
          pdf_metadata: Json | null
          pdf_text: string | null
          property_address: string | null
          property_data: Json | null
          session_id: string
        }
        Insert: {
          analysis_data: Json
          converted_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          inspection_date?: string | null
          negotiation_strategy?: Json | null
          pdf_file_path?: string | null
          pdf_metadata?: Json | null
          pdf_text?: string | null
          property_address?: string | null
          property_data?: Json | null
          session_id: string
        }
        Update: {
          analysis_data?: Json
          converted_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          inspection_date?: string | null
          negotiation_strategy?: Json | null
          pdf_file_path?: string | null
          pdf_metadata?: Json | null
          pdf_text?: string | null
          property_address?: string | null
          property_data?: Json | null
          session_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          concierge_negotiation_opted_in_at: string | null
          created_at: string
          deletion_requested_at: string | null
          electricians_opted_in_at: string | null
          email: string | null
          full_name: string | null
          hvac_technicians_opted_in_at: string | null
          id: string
          plumbers_opted_in_at: string | null
          recommended_providers_opted_in_at: string | null
          roofing_experts_opted_in_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          concierge_negotiation_opted_in_at?: string | null
          created_at?: string
          deletion_requested_at?: string | null
          electricians_opted_in_at?: string | null
          email?: string | null
          full_name?: string | null
          hvac_technicians_opted_in_at?: string | null
          id: string
          plumbers_opted_in_at?: string | null
          recommended_providers_opted_in_at?: string | null
          roofing_experts_opted_in_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          concierge_negotiation_opted_in_at?: string | null
          created_at?: string
          deletion_requested_at?: string | null
          electricians_opted_in_at?: string | null
          email?: string | null
          full_name?: string | null
          hvac_technicians_opted_in_at?: string | null
          id?: string
          plumbers_opted_in_at?: string | null
          recommended_providers_opted_in_at?: string | null
          roofing_experts_opted_in_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pros_inquiries: {
        Row: {
          address: string | null
          created_at: string
          current_page_url: string | null
          email: string
          id: string
          referrer_url: string | null
          session_id: string
          source: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          current_page_url?: string | null
          email: string
          id?: string
          referrer_url?: string | null
          session_id: string
          source: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          current_page_url?: string | null
          email?: string
          id?: string
          referrer_url?: string | null
          session_id?: string
          source?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      realtor_analysis_sessions: {
        Row: {
          analysis_data: Json | null
          condition_score: number | null
          created_at: string
          email_capture_source: string | null
          extracted_text: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          market_data: Json | null
          negotiation_data: Json | null
          pdf_file_path: string | null
          property_address: string | null
          property_data: Json | null
          session_id: string
          survey_responses: Json | null
          updated_at: string
          user_email: string | null
          user_question: string | null
        }
        Insert: {
          analysis_data?: Json | null
          condition_score?: number | null
          created_at?: string
          email_capture_source?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          market_data?: Json | null
          negotiation_data?: Json | null
          pdf_file_path?: string | null
          property_address?: string | null
          property_data?: Json | null
          session_id: string
          survey_responses?: Json | null
          updated_at?: string
          user_email?: string | null
          user_question?: string | null
        }
        Update: {
          analysis_data?: Json | null
          condition_score?: number | null
          created_at?: string
          email_capture_source?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          market_data?: Json | null
          negotiation_data?: Json | null
          pdf_file_path?: string | null
          property_address?: string | null
          property_data?: Json | null
          session_id?: string
          survey_responses?: Json | null
          updated_at?: string
          user_email?: string | null
          user_question?: string | null
        }
        Relationships: []
      }
      sample_surveys: {
        Row: {
          created_at: string
          email_capture_source: string | null
          id: string
          session_id: string
          survey_responses: Json | null
          updated_at: string
          user_email: string | null
        }
        Insert: {
          created_at?: string
          email_capture_source?: string | null
          id?: string
          session_id: string
          survey_responses?: Json | null
          updated_at?: string
          user_email?: string | null
        }
        Update: {
          created_at?: string
          email_capture_source?: string | null
          id?: string
          session_id?: string
          survey_responses?: Json | null
          updated_at?: string
          user_email?: string | null
        }
        Relationships: []
      }
      service_pros_inquiries: {
        Row: {
          additional_data: Json | null
          city: string | null
          country: string | null
          created_at: string
          current_page_url: string | null
          email_capture_source: string | null
          formatted_address: string | null
          id: string
          inquiry_type: string
          latitude: number | null
          longitude: number | null
          property_address: string | null
          referrer_url: string | null
          session_id: string
          state: string | null
          street_address: string | null
          updated_at: string
          user_agent: string | null
          user_email: string | null
          zip_code: string | null
        }
        Insert: {
          additional_data?: Json | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_page_url?: string | null
          email_capture_source?: string | null
          formatted_address?: string | null
          id?: string
          inquiry_type: string
          latitude?: number | null
          longitude?: number | null
          property_address?: string | null
          referrer_url?: string | null
          session_id: string
          state?: string | null
          street_address?: string | null
          updated_at?: string
          user_agent?: string | null
          user_email?: string | null
          zip_code?: string | null
        }
        Update: {
          additional_data?: Json | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_page_url?: string | null
          email_capture_source?: string | null
          formatted_address?: string | null
          id?: string
          inquiry_type?: string
          latitude?: number | null
          longitude?: number | null
          property_address?: string | null
          referrer_url?: string | null
          session_id?: string
          state?: string | null
          street_address?: string | null
          updated_at?: string
          user_agent?: string | null
          user_email?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      shared_reports: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          report_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          report_token?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          report_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      upload_reminder_emails: {
        Row: {
          created_at: string
          current_page_url: string | null
          email: string
          email_sent_at: string | null
          id: string
          referrer_url: string | null
          session_id: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          current_page_url?: string | null
          email: string
          email_sent_at?: string | null
          id?: string
          referrer_url?: string | null
          session_id: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          current_page_url?: string | null
          email?: string
          email_sent_at?: string | null
          id?: string
          referrer_url?: string | null
          session_id?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      user_analytics_summary: {
        Row: {
          created_at: string
          first_login: string | null
          last_login: string | null
          most_clicked_element: string | null
          most_visited_page: string | null
          total_interactions: number
          total_page_visits: number
          total_sessions: number
          total_time_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_login?: string | null
          last_login?: string | null
          most_clicked_element?: string | null
          most_visited_page?: string | null
          total_interactions?: number
          total_page_visits?: number
          total_sessions?: number
          total_time_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_login?: string | null
          last_login?: string | null
          most_clicked_element?: string | null
          most_visited_page?: string | null
          total_interactions?: number
          total_page_visits?: number
          total_sessions?: number
          total_time_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          element_class: string | null
          element_id: string | null
          element_text: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          page_path: string
          page_visit_id: string | null
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          page_path: string
          page_visit_id?: string | null
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          page_path?: string
          page_visit_id?: string | null
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_page_visit_id_fkey"
            columns: ["page_visit_id"]
            isOneToOne: false
            referencedRelation: "user_page_visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_page_visits: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          page_path: string
          page_title: string | null
          referrer: string | null
          session_id: string | null
          user_id: string
          visit_end: string | null
          visit_start: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          page_path: string
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id: string
          visit_end?: string | null
          visit_start?: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id?: string
          visit_end?: string | null
          visit_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_page_visits_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          analysis_data: Json
          created_at: string
          id: string
          inspection_date: string | null
          is_active: boolean
          negotiation_strategy: Json | null
          pdf_file_path: string | null
          pdf_metadata: Json | null
          pdf_text: string | null
          processing_status: string
          property_address: string | null
          property_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data: Json
          created_at?: string
          id?: string
          inspection_date?: string | null
          is_active?: boolean
          negotiation_strategy?: Json | null
          pdf_file_path?: string | null
          pdf_metadata?: Json | null
          pdf_text?: string | null
          processing_status?: string
          property_address?: string | null
          property_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          id?: string
          inspection_date?: string | null
          is_active?: boolean
          negotiation_strategy?: Json | null
          pdf_file_path?: string | null
          pdf_metadata?: Json | null
          pdf_text?: string | null
          processing_status?: string
          property_address?: string | null
          property_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          session_end: string | null
          session_start: string
          total_duration_seconds: number | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          session_end?: string | null
          session_start?: string
          total_duration_seconds?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          session_end?: string | null
          session_start?: string
          total_duration_seconds?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_anonymous_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      interaction_type:
        | "button_click"
        | "link_click"
        | "form_submit"
        | "download"
        | "navigation"
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
    Enums: {
      interaction_type: [
        "button_click",
        "link_click",
        "form_submit",
        "download",
        "navigation",
      ],
    },
  },
} as const
