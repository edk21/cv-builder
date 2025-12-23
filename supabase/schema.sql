-- CV Crafter Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Mon CV',
  template_id TEXT NOT NULL DEFAULT 'modern',
  theme_color TEXT NOT NULL DEFAULT '#2563eb',
  personal_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  experiences JSONB NOT NULL DEFAULT '[]'::jsonb,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  languages JSONB NOT NULL DEFAULT '[]'::jsonb,
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS cvs_user_id_idx ON cvs(user_id);
CREATE INDEX IF NOT EXISTS cvs_updated_at_idx ON cvs(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own CVs
DROP POLICY IF EXISTS "Users can view own cvs" ON cvs;
CREATE POLICY "Users can view own cvs" ON cvs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own CVs
DROP POLICY IF EXISTS "Users can insert own cvs" ON cvs;
CREATE POLICY "Users can insert own cvs" ON cvs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own CVs
DROP POLICY IF EXISTS "Users can update own cvs" ON cvs;
CREATE POLICY "Users can update own cvs" ON cvs
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own CVs
DROP POLICY IF EXISTS "Users can delete own cvs" ON cvs;
CREATE POLICY "Users can delete own cvs" ON cvs
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_cvs_updated_at ON cvs;
CREATE TRIGGER update_cvs_updated_at
  BEFORE UPDATE ON cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: To use this schema:
-- 1. Create a new Supabase project at https://supabase.com
-- 2. Go to SQL Editor and run this script
-- 3. Get your project URL and anon key from Settings > API
-- 4. Add them to your .env.local file:
--    NEXT_PUBLIC_SUPABASE_URL=your_project_url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

