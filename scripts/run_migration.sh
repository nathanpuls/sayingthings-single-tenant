#!/bin/bash
echo "Opening Supabase SQL Editor..."
echo "Please copy and paste the contents of supabase/migrations/upsert_custom_domain_function.sql"
echo "into the SQL editor and run it."
echo ""
cat supabase/migrations/upsert_custom_domain_function.sql
echo ""
echo "Opening browser..."
open "https://supabase.com/dashboard/project/gksbxdajrnjktxcninxr/sql/new"
