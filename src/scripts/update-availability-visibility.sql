-- Add visibility column to availability table
ALTER TABLE availability ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- Update the admin check policy to include the new column
-- (The existing "Admin can manage availability" already covers ALL operations)

-- Update the selection policy for regular users to only see visible slots
DROP POLICY IF EXISTS "Anyone can view availability" ON availability;
CREATE POLICY "Users can view visible availability"
  ON availability FOR SELECT
  TO authenticated
  USING ( 
    is_visible = true OR 
    exists (select 1 from profiles where id = auth.uid() and subscription_status = 'admin')
  );
