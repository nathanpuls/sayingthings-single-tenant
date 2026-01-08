// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// VERSION: 2.0 - Using RPC upsert
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Authenticate user
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response("Unauthorized", { status: 401, headers: corsHeaders })
        }

        const { domain } = await req.json()
        console.log("[TRACE] Received domain:", domain);
        if (!domain) {
            return new Response("Missing domain", { status: 400, headers: corsHeaders })
        }

        // 2. Call Cloudflare API to add Custom Hostname
        const cfToken = Deno.env.get('CLOUDFLARE_API_TOKEN')
        const cfZoneId = Deno.env.get('CLOUDFLARE_ZONE_ID')
        console.log("[TRACE] CF Token exists:", !!cfToken, "CF Zone exists:", !!cfZoneId);

        const isMisconfigured = !cfToken || !cfZoneId ||
            cfToken === 'your_real_token' || cfZoneId === 'your_real_zone_id' ||
            cfToken === 'your_token_here' || cfZoneId === 'your_zone_id_here';

        console.log("[TRACE] Is misconfigured (mock mode):", isMisconfigured);

        if (isMisconfigured) {
            // Predictable mock token based on domain so it doesn't change every re-add
            const mockToken = `built-verify-${domain.split('.').join('-')}`;
            const { error: dbError } = await supabaseClient
                .from('custom_domains')
                .insert({
                    user_id: user.id,
                    domain: domain,
                    verification_token: mockToken,
                    ownership_type: 'txt',
                    ownership_name: `_cf-custom-hostname.${domain}`,
                    ownership_value: mockToken,
                    verified: false
                })

            if (dbError) throw dbError

            return new Response(JSON.stringify({
                success: true,
                verification_token: mockToken,
                message: "Mock Mode"
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // Real Cloudflare Implementation
        console.log(`Checking Cloudflare for domain: ${domain} (Zone: ${cfZoneId})`);

        let hostnameResult = null;
        let cloudflareError = null;

        try {
            // 2a. Check if hostname already exists
            const checkCfResponse = await fetch(
                `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/custom_hostnames?hostname=${domain}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${cfToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!checkCfResponse.ok) {
                const t = await checkCfResponse.text();
                throw new Error(`Cloudflare Check Failed: ${checkCfResponse.status} ${t}`);
            }

            const checkCfData = await checkCfResponse.json()

            if (checkCfData && checkCfData.success && Array.isArray(checkCfData.result) && checkCfData.result.length > 0) {
                hostnameResult = checkCfData.result[0];
                console.log("Found existing hostname record");
            } else {
                console.log("Hostname not found, attempting to create...");
                const cfResponse = await fetch(
                    `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/custom_hostnames`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${cfToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            hostname: domain,
                            ssl: { method: 'txt', type: 'dv' },
                        }),
                    }
                )

                if (!cfResponse.ok) {
                    const t = await cfResponse.text();
                    throw new Error(`Cloudflare Create Failed: ${cfResponse.status} ${t}`);
                }

                const cfData = await cfResponse.json()
                if (!cfData || !cfData.success) {
                    throw new Error(`Cloudflare API Error: ${cfData?.errors?.[0]?.message || 'Unknown'}`);
                }
                hostnameResult = cfData.result;
            }
        } catch (e: any) {
            console.error("⚠️ Cloudflare Error (Non-Fatal):", e);
            cloudflareError = e.message;
        }

        // Ownership verification
        const ownership = hostnameResult?.ownership_verification || {};
        const ownershipType = ownership.type || 'txt';
        const ownershipName = ownership.name || `_cf-custom-hostname.${domain}`;
        const ownershipValue = ownership.value || '';

        // SSL verification
        const ssl = hostnameResult?.ssl || {};
        const sslRecords = ssl.validation_records || [];

        let sslName = '';
        let sslValue = '';

        if (sslRecords.length > 0) {
            const record = sslRecords[0];
            // Prefer TXT if available
            if (record.txt_name && record.txt_value) {
                sslName = record.txt_name;
                sslValue = record.txt_value;
            }
            // Fallback to CNAME (DCV Delegation)
            else if (record.cname_target) {
                sslName = record.cname || `_acme-challenge.${domain}`;
                sslValue = record.cname_target;
            }
        }

        if (cloudflareError && cloudflareError.includes('Authentication error')) {
            console.log("Cloudflare Auth Error detected. Skipping DB overwrite to protect manual verification.");
            return new Response(JSON.stringify({
                success: true,
                warning: `Cloudflare API authentication failed. If you verified manually, this is safe to ignore.`,
                skipped_db_update: true
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        console.log("Final Records to Save:", { ownershipName, ownershipValue: ownershipValue ? 'PRESENT' : 'MISSING' });

        // 3. Call the database upsert function
        const { data: upsertResult, error: dbError } = await supabaseClient
            .rpc('upsert_custom_domain', {
                p_user_id: user.id,
                p_domain: domain,
                p_verification_token: ownershipValue,
                p_ownership_type: ownershipType,
                p_ownership_name: ownershipName,
                p_ownership_value: ownershipValue,
                p_ssl_name: sslName,
                p_ssl_value: sslValue
            });

        if (dbError) {
            console.error("Database Upsert Error:", dbError);
            throw dbError;
        }

        console.log("Upsert successful!");

        return new Response(JSON.stringify({
            success: true,
            data: hostnameResult,
            warning: cloudflareError ? `Cloudflare provisioning failed: ${cloudflareError}. Saved locally.` : null
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error("Global Catch Error:", error)
        return new Response(JSON.stringify({
            error: error.message,
            stack: error.stack,
            details: error
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
