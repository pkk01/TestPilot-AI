-- ============================================================
-- AI Usage Log — Tracks daily AI usage per user
-- ============================================================
-- Each row = one Groq API call. The `batch_id` groups calls
-- from a single "Generate" action so they count as 1 daily use.
-- Daily limit = COUNT(DISTINCT batch_id) per user per day.

CREATE TABLE IF NOT EXISTS ai_usage_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  batch_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  ip_address TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookups for daily usage counting
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date
  ON ai_usage_log(user_id, created_at DESC);

-- Fast lookups for duplicate detection
CREATE INDEX IF NOT EXISTS idx_ai_usage_input_hash
  ON ai_usage_log(user_id, input_hash);

-- Fast lookups by batch_id
CREATE INDEX IF NOT EXISTS idx_ai_usage_batch
  ON ai_usage_log(user_id, batch_id);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON ai_usage_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON ai_usage_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);
