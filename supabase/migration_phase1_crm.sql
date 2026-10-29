-- ==============================================================================
-- PHASE 1 CRM SCHEMA UPGRADE FOR MOVEIT MAASTRICHT
-- Safe migration: preserves 100% of existing historical data
-- ==============================================================================

-- 1. Add Three-Track Status System & Operational Columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS sales_status TEXT DEFAULT 'New Lead',
ADD COLUMN IF NOT EXISTS operational_status TEXT DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Not Invoiced',
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS coordinator TEXT DEFAULT 'Sherif Eliwa',
ADD COLUMN IF NOT EXISTS assigned_team JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS assigned_vehicle TEXT DEFAULT 'Ford Transit (SMEK 25)',
ADD COLUMN IF NOT EXISTS next_action TEXT DEFAULT 'Review Quote',
ADD COLUMN IF NOT EXISTS next_action_date DATE;

-- 2. Backfill existing orders based on their current status (safely casting status::text)
UPDATE public.orders 
SET 
  operational_status = CASE 
    WHEN status::text ILIKE '%complete%' THEN 'Completed'
    WHEN status::text ILIKE '%transit%' OR status::text ILIKE '%progress%' THEN 'In Progress'
    WHEN status::text ILIKE '%confirm%' THEN 'Confirmed'
    WHEN status::text ILIKE '%cancel%' THEN 'Cancelled'
    ELSE 'Pending'
  END,
  sales_status = CASE 
    WHEN status::text ILIKE '%complete%' OR status::text ILIKE '%confirm%' OR status::text ILIKE '%transit%' OR status::text ILIKE '%progress%' THEN 'Won / Confirmed'
    WHEN status::text ILIKE '%cancel%' THEN 'Lost / Cancelled'
    ELSE 'New Lead'
  END,
  payment_status = CASE 
    WHEN status::text ILIKE '%complete%' THEN 'Paid'
    WHEN status::text ILIKE '%confirm%' OR status::text ILIKE '%transit%' OR status::text ILIKE '%progress%' THEN 'Invoiced'
    ELSE 'Not Invoiced'
  END
WHERE operational_status IS NULL OR operational_status = 'Pending';

-- 3. Link expenses to specific orders for accurate job profit calculations
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;

-- 4. Create status audit trail logs table
CREATE TABLE IF NOT EXISTS public.order_status_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  changed_by TEXT DEFAULT 'Sherif Eliwa',
  status_type TEXT NOT NULL, -- 'sales', 'operational', 'payment'
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public/anon and authenticated read order logs" ON public.order_status_logs;
CREATE POLICY "Allow public/anon and authenticated read order logs" 
  ON public.order_status_logs FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Allow public/anon and authenticated insert order logs" ON public.order_status_logs;
CREATE POLICY "Allow public/anon and authenticated insert order logs" 
  ON public.order_status_logs FOR INSERT 
  WITH CHECK (true);
