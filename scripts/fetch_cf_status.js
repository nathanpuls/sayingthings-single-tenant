import dotenv from 'dotenv';
dotenv.config();

async function fetchCloudflareStatus() {
    const cfToken = process.env.CLOUDFLARE_API_TOKEN;
    const cfZoneId = process.env.CLOUDFLARE_ZONE_ID;

    if (!cfToken || !cfZoneId) {
        console.error("Missing Cloudflare credentials in .env");
        return;
    }

    console.log(`Fetching hostnames for zone ${cfZoneId}...`);

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/custom_hostnames`,
        {
            headers: {
                'Authorization': `Bearer ${cfToken}`,
                'Content-Type': 'application/json',
            }
        }
    );

    const data = await response.json();
    if (!data.success) {
        console.error("Cloudflare API Error:", data.errors);
        return;
    }

    console.log("Cloudflare Custom Hostnames:");
    data.result.forEach(h => {
        console.log(`\nDomain: ${h.hostname}`);
        console.log(`Status: ${h.status}`);
        console.log(`SSL Status: ${h.ssl.status}`);
        console.log(`SSL Method: ${h.ssl.method}`);
        if (h.ssl.validation_records) {
            console.log("SSL Validation Records:");
            h.ssl.validation_records.forEach(r => {
                console.log(`  Type: TXT`);
                console.log(`  Name: ${r.txt_name}`);
                console.log(`  Value: ${r.txt_value}`);
            });
        }
        if (h.ownership_verification) {
            console.log("Ownership Verification:");
            console.log(`  Name: ${h.ownership_verification.name}`);
            console.log(`  Value: ${h.ownership_verification.value}`);
        }
    });
}

fetchCloudflareStatus();
