
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env manually
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach(line => {
    const [key, value] = line.split("=");
    if (key && value) envVars[key.trim()] = value.trim();
});

const supabaseUrl = envVars["VITE_SUPABASE_URL"];
const supabaseAnonKey = envVars["VITE_SUPABASE_ANON_KEY"];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSupabase() {
    const tables = ["demos", "videos", "studio_gear", "clients", "reviews", "site_settings"];
    console.log("Checking Supabase tables...");

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
        if (error) {
            console.error(`Error reading ${table}:`, error.message);
        } else {
            console.log(`${table}: ${count} rows`);
        }
    }
}

checkSupabase();
