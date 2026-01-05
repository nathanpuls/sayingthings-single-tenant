
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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

async function testWrite() {
    console.log("Attempting to write to 'demos'...");
    const { data, error } = await supabase.from('demos').insert([
        { name: "Test Write", url: "http://example.com/test.mp3", order: 999, user_id: "00000000-0000-0000-0000-000000000000" }
    ]).select();

    if (error) {
        console.error("Write failed:", error.message);
    } else {
        console.log("Write success:", data);
    }
}

testWrite();
