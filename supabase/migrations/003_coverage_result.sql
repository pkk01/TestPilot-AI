-- Add coverage_result column to generations table
-- Stores the AI-generated coverage analysis as JSONB
ALTER TABLE generations ADD COLUMN IF NOT EXISTS coverage_result JSONB;
