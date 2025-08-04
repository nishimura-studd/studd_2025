import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Work = {
  id: number
  title: string
  terms: string | null
  skills: string[]
  description: string | null
  is_public: boolean
  image_count: number | null
  project_url: string | null
  is_masked?: boolean
}