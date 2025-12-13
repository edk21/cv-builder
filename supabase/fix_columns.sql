-- Migration to align cvs table with new schema
-- This script adds missing columns and attempts to migrate data from the old 'cv_data' blob if it exists.

-- 1. Add new columns if they don't exist
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Mon CV';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#2563eb';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS personal_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS experiences JSONB DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate data from old columns (if they exist)
DO $$
BEGIN
  -- Check if 'cv_data' column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cvs' AND column_name = 'cv_data') THEN
    
    -- Migrate basic fields if they are null
    UPDATE cvs 
    SET 
        name = COALESCE(NULLIF(name, 'Mon CV'), title, 'Mon CV'),
        template_id = COALESCE(NULLIF(template_id, 'modern'), template_key, 'modern'),
        theme_color = COALESCE(NULLIF(theme_color, '#2563eb'), (theme->>'color'), '#2563eb')
    WHERE title IS NOT NULL OR template_key IS NOT NULL OR theme IS NOT NULL;

    -- Migrate JSON fields
    UPDATE cvs
    SET
        personal_info = CASE WHEN personal_info = '{}'::jsonb THEN COALESCE(cv_data->'personalInfo', '{}'::jsonb) ELSE personal_info END,
        experiences = CASE WHEN experiences = '[]'::jsonb THEN COALESCE(cv_data->'experiences', '[]'::jsonb) ELSE experiences END,
        education = CASE WHEN education = '[]'::jsonb THEN COALESCE(cv_data->'education', '[]'::jsonb) ELSE education END,
        skills = CASE WHEN skills = '[]'::jsonb THEN COALESCE(cv_data->'skills', '[]'::jsonb) ELSE skills END,
        projects = CASE WHEN projects = '[]'::jsonb THEN COALESCE(cv_data->'projects', '[]'::jsonb) ELSE projects END,
        languages = CASE WHEN languages = '[]'::jsonb THEN COALESCE(cv_data->'languages', '[]'::jsonb) ELSE languages END,
        certifications = CASE WHEN certifications = '[]'::jsonb THEN COALESCE(cv_data->'certifications', '[]'::jsonb) ELSE certifications END;
        
  END IF;
END $$;

-- 3. Cleanup old columns (Optional: Uncomment if you are sure)
-- ALTER TABLE cvs DROP COLUMN IF EXISTS cv_data;
-- ALTER TABLE cvs DROP COLUMN IF EXISTS title;
-- ALTER TABLE cvs DROP COLUMN IF EXISTS template_key;
-- ALTER TABLE cvs DROP COLUMN IF EXISTS theme;

-- 4. Re-apply policies (just in case)
DROP POLICY IF EXISTS "Users can view own cvs" ON cvs;
CREATE POLICY "Users can view own cvs" ON cvs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cvs" ON cvs;
CREATE POLICY "Users can insert own cvs" ON cvs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cvs" ON cvs;
CREATE POLICY "Users can update own cvs" ON cvs FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cvs" ON cvs;
CREATE POLICY "Users can delete own cvs" ON cvs FOR DELETE USING (auth.uid() = user_id);

-- 5. Force schema cache reload (Critical for Supabase API to see new columns)
NOTIFY pgrst, 'reload schema';
