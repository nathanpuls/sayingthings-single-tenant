import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function debugEdgeFunction() {
    console.log("🔍 Debugging 'add-domain' Edge Function...");
    const domain = "debug-test-" + Date.now() + ".com";
    console.log(`invoking add-domain with domain: ${domain}`);

    // Login logic to get a token?
    // The function requires an authorized user.
    // I need to sign in a user to get a JWT.

    const email = "nathanpuls@gmail.com"; // Trying the user's email if evident, or random?
    // Actually, I can't easily sign in without password.

    // BUT the previous logs showed the user IS signed in on the frontend.
    // I will try to use a script that just logs the status.
    // I can't invoke the function successfully without a user token.

    // Plan B: I will instruct the user to check the browser console for the SPECIFIC error body.
    // Or I can update `src/lib/domains.ts` to log the error structure more aggressively to the console, 
    // which the user can then share or I can see if the user clicks the button.
}

// Better approach to get the error:
// I'll update the frontend code to show the error in an alert or log it better.
// The user trace provides:
// `domains.ts:128 Add domain error: FunctionsHttpError`
// The `addCustomDomain` function catches it.

// Let's modify `src/lib/domains.ts` to log the `await res.text()` of the error context.

console.log("Use the updated frontend code to debug.");
