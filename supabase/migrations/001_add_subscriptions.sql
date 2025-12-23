-- Migration: Add subscriptions table for CV Crafter
-- Date: 2025-12-23
-- Description: Adds subscription management system with free/premium tiers

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure end_date is after start_date if provided
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date > start_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_end_date_idx ON subscriptions(end_date);

-- Add comment to the table
COMMENT ON TABLE subscriptions IS 'User subscription plans with expiration dates for CV Crafter';
COMMENT ON COLUMN subscriptions.plan_type IS 'Subscription tier: free (1 CV), premium (unlimited CVs), enterprise (future)';
COMMENT ON COLUMN subscriptions.status IS 'Current status: active, expired, cancelled, trial';
COMMENT ON COLUMN subscriptions.end_date IS 'Expiration date for the subscription. NULL means unlimited/lifetime subscription';

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own subscription
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Only service role can insert/update/delete subscriptions
-- This prevents users from modifying their own subscriptions
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Function to automatically update updated_at timestamp
-- Note: This function should already exist from cvs table, but we'll create it if not
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helper function: Get active subscription for a user
CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  plan_type TEXT,
  status TEXT,
  end_date TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.plan_type, s.status, s.end_date
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status = 'active'
    AND (s.end_date IS NULL OR s.end_date > NOW())
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$;

COMMENT ON FUNCTION get_active_subscription IS 'Returns the active subscription for a given user. Checks that status is active and end_date has not passed.';

-- Helper function: Check if user is premium
CREATE OR REPLACE FUNCTION is_user_premium(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_type TEXT;
BEGIN
  -- Get the plan_type from the active subscription
  SELECT plan_type INTO v_plan_type
  FROM get_active_subscription(p_user_id);

  -- Return true if plan is premium or enterprise, false otherwise
  RETURN COALESCE(v_plan_type IN ('premium', 'enterprise'), FALSE);
END;
$$;

COMMENT ON FUNCTION is_user_premium IS 'Checks if a user has an active premium or enterprise subscription';

-- Initialize subscriptions for all existing users
-- Give them free plan by default
INSERT INTO subscriptions (user_id, plan_type, status, start_date, end_date)
SELECT
  id,
  'free',
  'active',
  NOW(),
  NULL  -- No expiration for free plan
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT DO NOTHING;
