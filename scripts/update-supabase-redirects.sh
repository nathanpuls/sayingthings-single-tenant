#!/bin/bash

# Supabase Project Configuration
PROJECT_REF="gksbxdajrnjktxcninxr"

# Get Supabase access token from MCP or prompt user
echo "To update Supabase OAuth redirect URLs, you need a Supabase access token."
echo ""
echo "Please follow these steps:"
echo "1. Go to https://supabase.com/dashboard/account/tokens"
echo "2. Create a new access token (or use an existing one)"
echo "3. Paste the token below:"
echo ""
read -sp "Supabase Access Token: " SUPABASE_TOKEN
echo ""

if [ -z "$SUPABASE_TOKEN" ]; then
    echo "Error: No token provided"
    exit 1
fi

# Define the redirect URLs you want to allow
REDIRECT_URLS='[
  "http://localhost:5173/admin",
  "http://localhost:3000/admin",
  "https://studio.sayingthings.com/admin",
  "https://sayingthings-single-tenant.pages.dev/admin"
]'

echo ""
echo "Updating OAuth redirect URLs for project: $PROJECT_REF"
echo "Allowed URLs:"
echo "$REDIRECT_URLS" | jq -r '.[]'
echo ""

# Update the auth configuration
RESPONSE=$(curl -s -X PATCH \
  "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"SITE_URL\": \"https://sayingthings.com\",
    \"URI_ALLOW_LIST\": $(echo "$REDIRECT_URLS" | jq -c .)
  }")

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    echo "Error updating configuration:"
    echo "$RESPONSE" | jq -r '.error'
    exit 1
else
    echo "✅ Successfully updated OAuth redirect URLs!"
    echo ""
    echo "You can now sign in from any of these URLs:"
    echo "$REDIRECT_URLS" | jq -r '.[]'
fi
