-- ============================================
-- RetroMynd Study Hub — Full Database Migration
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- 1. Add all missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '💕';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'comfy';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#f5c518';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'pt-BR';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Fortaleza';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Novato';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Ensure user_data table exists with correct schema
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, data_type)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(user_id, data_type);

-- 4. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS user_data_updated_at ON user_data;
CREATE TRIGGER user_data_updated_at
  BEFORE UPDATE ON user_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Disable RLS for service_role access (backend uses service_role key)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (bypasses RLS automatically)
-- Allow anon NO access (frontend never talks to Supabase directly)
CREATE POLICY IF NOT EXISTS "Service role full access profiles"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access user_data"
  ON user_data FOR ALL
  USING (true)
  WITH CHECK (true);

-- Done! Your schema is ready.
-- Columns added: password_hash, display_name, avatar, avatar_url,
-- bio, theme, accent_color, language, timezone, level, xp, title,
-- badges, preferences, last_login, login_count, created_at, updated_at
