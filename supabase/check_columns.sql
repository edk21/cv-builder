-- Verify if the new columns exist in the cvs table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cvs'
ORDER BY column_name;
