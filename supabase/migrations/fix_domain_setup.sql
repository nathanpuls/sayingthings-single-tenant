-- Combined Migration to Fix Custom Domain Setup

-- 1. Ensure the 'custom_domains' table has all necessary columns
ALTER TABLE custom_domains 
ADD COLUMN IF NOT EXISTS ownership_type TEXT DEFAULT 'txt',
ADD COLUMN IF NOT EXISTS ownership_name TEXT,
ADD COLUMN IF NOT EXISTS ownership_value TEXT,
ADD COLUMN IF NOT EXISTS ssl_name TEXT,
ADD COLUMN IF NOT EXISTS ssl_value TEXT;

-- 2. Create or Replace the upsert function required by the Edge Function
CREATE OR REPLACE FUNCTION upsert_custom_domain(
  p_user_id UUID,
  p_domain TEXT,
  p_verification_token TEXT,
  p_ownership_type TEXT,
  p_ownership_name TEXT,
  p_ownership_value TEXT,
  p_ssl_name TEXT,
  p_ssl_value TEXT
)
RETURNS custom_domains AS $$
DECLARE
  result custom_domains;
BEGIN
  -- Insert or Update the domain record
  INSERT INTO custom_domains (
    user_id,
    domain,
    verification_token,
    ownership_type,
    ownership_name,
    ownership_value,
    ssl_name,
    ssl_value,
    verified,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_domain,
    p_verification_token,
    p_ownership_type,
    p_ownership_name,
    p_ownership_value,
    p_ssl_name,
    p_ssl_value,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (domain) DO UPDATE SET
    -- Update these fields if the domain already exists
    user_id = EXCLUDED.user_id, -- Optional: Allow re-assigning user or keep original? Keeping assumes same user or overwrite.
    verification_token = EXCLUDED.verification_token,
    ownership_type = EXCLUDED.ownership_type,
    ownership_name = EXCLUDED.ownership_name,
    ownership_value = EXCLUDED.ownership_value,
    ssl_name = EXCLUDED.ssl_name,
    ssl_value = EXCLUDED.ssl_value,
    updated_at = NOW()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION upsert_custom_domain TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_custom_domain TO service_role;
