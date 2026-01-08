-- Enable Read Access for All Users on Public Tables
-- Only applied if policy doesn't exist, but 'create policy if not exists' is not standard SQL, 
-- so we drop and recreate to be safe and idempotent.

-- site_settings
DROP POLICY IF EXISTS "Public Read site_settings" ON site_settings;
CREATE POLICY "Public Read site_settings" ON site_settings FOR SELECT USING (true);

-- demos
DROP POLICY IF EXISTS "Public Read demos" ON demos;
CREATE POLICY "Public Read demos" ON demos FOR SELECT USING (true);

-- videos
DROP POLICY IF EXISTS "Public Read videos" ON videos;
CREATE POLICY "Public Read videos" ON videos FOR SELECT USING (true);

-- studio_gear
DROP POLICY IF EXISTS "Public Read studio_gear" ON studio_gear;
CREATE POLICY "Public Read studio_gear" ON studio_gear FOR SELECT USING (true);

-- clients
DROP POLICY IF EXISTS "Public Read clients" ON clients;
CREATE POLICY "Public Read clients" ON clients FOR SELECT USING (true);

-- reviews
DROP POLICY IF EXISTS "Public Read reviews" ON reviews;
CREATE POLICY "Public Read reviews" ON reviews FOR SELECT USING (true);

-- custom_domains
DROP POLICY IF EXISTS "Public Read custom_domains" ON custom_domains;
CREATE POLICY "Public Read custom_domains" ON custom_domains FOR SELECT USING (true);
