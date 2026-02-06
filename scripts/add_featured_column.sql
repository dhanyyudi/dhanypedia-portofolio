-- Add is_featured column to resumes table
-- This column is used to mark which CV should appear on the About page

ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN resumes.is_featured IS 'Whether this CV is featured on the About page';

-- Optional: Create an index for faster queries on featured CVs
CREATE INDEX IF NOT EXISTS idx_resumes_is_featured ON resumes(is_featured) 
WHERE is_featured = TRUE;

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'resumes' AND column_name = 'is_featured';
