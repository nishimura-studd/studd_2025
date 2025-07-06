import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Work = {
  id: string
  title: string
  terms: string | null
  skills: string[]
  description: string | null
  is_public: boolean
  image_url: string | null
  project_url: string | null
  created_at: string
  updated_at: string
  is_masked?: boolean
}