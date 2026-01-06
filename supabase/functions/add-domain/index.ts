// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
        if (!domain) {
            return new Response("Missing domain", { status: 400, headers: corsHeaders })
        }

        // 2. Call Cloudflare API to add Custom Hostname
        // You need to set CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID in your Supabase Dashboard
        const cfToken = Deno.env.get('CLOUDFLARE_API_TOKEN')
        const cfZoneId = Deno.env.get('CLOUDFLARE_ZONE_ID')

        // Check if tokens are missing OR are just the placeholder text from the tutorial
        const isMisconfigured = !cfToken || !cfZoneId ||
            cfToken === 'your_real_token' || cfZoneId === 'your_real_zone_id' ||
            cfToken === 'your_token_here' || cfZoneId === 'your_zone_id_here';

        if (isMisconfigured) {
            console.warn("Missing or placeholder Cloudflare config - Falling back to MOCK MODE")
            // return new Response("Server configuration error", { status: 500, headers: corsHeaders })

            // Fallback for demo purposes if no CF keys are set:
            // We will just return a mock response so the UI works, 
            // but in production this should error out.

            const mockToken = `built-verify-${Math.random().toString(36).substring(7)}`;

            // Insert into DB (mock path)
            const { error: dbError } = await supabaseClient
                .from('custom_domains')
                .insert({
                    user_id: user.id,
                    domain: domain,
                    verification_token: mockToken,
                    verified: false
                })

            if (dbError) throw dbError

            return new Response(JSON.stringify({
                success: true,
                verification_token: mockToken,
                message: "Domain added (Mock Mode - Configure Cloudflare Keys to Enable Real Provisioning)"
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // Real Cloudflare Implementation
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
                    ssl: {
                        method: 'txt', // TXT validation for SSL
                        type: 'dv',
                    },
                }),
            }
        )

        const cfData = await cfResponse.json()

        if (!cfData.success) {
            console.error("Cloudflare Error:", cfData.errors)
            return new Response(JSON.stringify({ error: cfData.errors[0]?.message || "Cloudflare Error" }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const hostnameResult = cfData.result
        // Extract verification token (ownership verification)
        // usually in hostnameResult.ownership_verification.value
        // or ssl verification in hostnameResult.ssl.validation_records

        // For simplicity, we'll grab the ownership token if available, or just a placeholder
        const verificationToken = hostnameResult.ownership_verification?.value ||
            hostnameResult.ssl?.validation_records?.[0]?.value ||
            "pending_verification";

        // 3. Insert into Supabase
        const { error: dbError } = await supabaseClient
            .from('custom_domains')
            .insert({
                user_id: user.id,
                domain: domain,
                verification_token: verificationToken,
                verified: false,
                // We could store the Cloudflare ID too if we added a column for it
                // cf_hostname_id: hostnameResult.id 
            })

        if (dbError) {
            if (dbError.code === '23505') { // Unique violation
                return new Response(JSON.stringify({ error: "Domain already registered" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            throw dbError
        }

        return new Response(JSON.stringify({
            success: true,
            data: hostnameResult,
            verification_token: verificationToken
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error(error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
