import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function verifySetup() {
    console.log("🔍 Verifying 'upsert_custom_domain' RPC existence...");

    // Attempt to call the RPC with dummy data that might fail constraint but proves existence
    // or use a random non-existent domain to succeed if logic allows
    const testDomain = `test-rpc-${Date.now()}.com`;

    try {
        const { data, error } = await supabase.rpc('upsert_custom_domain', {
            p_user_id: '00000000-0000-0000-0000-000000000000', // invalid user, should likely fail FK if exists
            p_domain: testDomain,
            p_verification_token: 'test',
            p_ownership_type: 'txt',
            p_ownership_name: 'test',
            p_ownership_value: 'test',
            p_ssl_name: 'test',
            p_ssl_value: 'test'
        });

        if (error) {
            console.log("❌ RPC Call Failed:", error.message);
            if (error.message.includes("function") && error.message.includes("does not exist")) {
                console.log("🚨 DIAGNOSIS: The 'upsert_custom_domain' function is MISSING from the database.");
            } else if (error.message.includes("violates foreign key constraint")) {
                console.log("✅ DIAGNOSIS: The function EXISTS (FK error expected for dummy user).");
            } else {
                console.log("⚠️  RPC Error details:", error);
            }
        } else {
            console.log("✅ RPC Call Succeeded (Unexpectedly? Did it create a dummy record?)", data);
        }

    } catch (e) {
        console.error("Unexpected execution error:", e);
    }
}

verifySetup();
