ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS username TEXT UNIQUE CONSTRAINT username_length CHECK (char_length(username) >= 3);
