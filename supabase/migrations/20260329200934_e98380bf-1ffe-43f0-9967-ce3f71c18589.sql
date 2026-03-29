
-- Create storage bucket for enrichment uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('enrichment-uploads', 'enrichment-uploads', false, 20971520)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload enrichment files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'enrichment-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read own enrichment files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'enrichment-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own enrichment files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'enrichment-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
