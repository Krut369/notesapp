export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          created_at: string
          title: string
          subject: string[]
          person: string[]
          description: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          subject: string[]
          person: string[]
          description: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          subject?: string[]
          person?: string[]
          description?: string
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
