-- 1) Drop the dangerous "api keys" table (hardcoded secret in default value)
DROP TABLE IF EXISTS public."api keys";

-- 2) Add missing UPDATE policy on enrichment-uploads storage bucket
CREATE POLICY "Users can update their own enrichment uploads"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'enrichment-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'enrichment-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);