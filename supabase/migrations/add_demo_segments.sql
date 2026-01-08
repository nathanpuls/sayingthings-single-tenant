-- Add segments column to demos table
ALTER TABLE demos ADD COLUMN IF NOT EXISTS segments JSONB DEFAULT '[]'::jsonb;
