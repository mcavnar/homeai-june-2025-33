export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
