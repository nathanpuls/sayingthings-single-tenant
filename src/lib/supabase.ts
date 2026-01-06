import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// Make sure to add these to your .env file!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables! Check your .env file.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

