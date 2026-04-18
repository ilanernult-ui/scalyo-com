-- Create analytics_data table for storing Google Analytics data
CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connector_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  property_name TEXT,
  data JSONB NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one record per user/connector/property combination
  UNIQUE(user_id, connector_id, property_id),

  -- Index for efficient queries
  INDEX idx_analytics_data_user_connector (user_id, connector_id),
  INDEX idx_analytics_data_synced_at (synced_at)
);

-- Enable RLS
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own analytics data"
  ON analytics_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics data"
  ON analytics_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics data"
  ON analytics_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics data"
  ON analytics_data FOR DELETE
  USING (auth.uid() = user_id);