import { createClient } from "@supabase/supabase-js"

// These environment variables need to be set in your project
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_ANON_KEY || ""

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)