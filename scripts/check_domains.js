import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function checkDomains() {
    console.log("Checking custom domains...");
    const { data, error } = await supabase
        .from('custom_domains')
        .select('*');

    if (error) {
        console.error("Error fetching domains:", error.message);
        return;
    }

    if (data.length === 0) {
        console.log("No custom domains found in the database.");
    } else {
        console.log("Current Custom Domains:");
        console.table(data.map(d => ({
            id: d.id,
            domain: d.domain,
            verified: d.verified,
            ssl: !!d.ssl_value,
            user: d.user_id
        })));
    }
}

checkDomains();
