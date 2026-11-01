-- =============================================================================
-- MoveIt Maastricht CRM — Phase 2 Idempotent Database Migration
-- File: supabase/migration_phase2_crm.sql
-- Safe to run multiple times even when tables already exist from earlier versions!
-- =============================================================================

-- 1. Movers Table (Labor & Payroll tracking)
CREATE TABLE IF NOT EXISTS public.movers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all Phase 2 columns exist on public.movers even if table was created earlier
ALTER TABLE public.movers
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Mover',
  ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC NOT NULL DEFAULT 18.00,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 2. Order Movers Junction Table (Tracks hours worked per mover per order + field stages)
CREATE TABLE IF NOT EXISTS public.order_movers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  mover_id UUID REFERENCES public.movers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_movers
  ADD COLUMN IF NOT EXISTS mover_name TEXT,
  ADD COLUMN IF NOT EXISTS role_in_job TEXT DEFAULT 'Mover',
  ADD COLUMN IF NOT EXISTS hourly_rate_snapshot NUMERIC NOT NULL DEFAULT 18.00,
  ADD COLUMN IF NOT EXISTS hours_worked NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stages_worked TEXT[] DEFAULT ARRAY['Loading', 'Driving', 'Unloading'],
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Vehicles & Fleet Management
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS license_plate TEXT,
  ADD COLUMN IF NOT EXISTS capacity_m3 NUMERIC DEFAULT 20,
  ADD COLUMN IF NOT EXISTS hourly_cost NUMERIC DEFAULT 15.00,
  ADD COLUMN IF NOT EXISTS km_cost NUMERIC DEFAULT 0.35,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 4. Claims & Damages Tracking
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  item_damaged TEXT NOT NULL DEFAULT 'General Item',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.claims
  ADD COLUMN IF NOT EXISTS item_damaged TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS claim_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS settled_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS blame_mover_id UUID REFERENCES public.movers(id) ON DELETE SET NULL;

-- 5. Enhance Expenses Table with Direct Order Linking & Phase 2 Categories
ALTER TABLE public.expenses 
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_direct_cost BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS vendor TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Company Card';

-- 6. Enhance Orders Table with Phase 2 Operational, Financial & Time-Tracking Fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC DEFAULT 4,
  ADD COLUMN IF NOT EXISTS actual_hours NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vehicle_cost NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fuel_cost NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS materials_cost NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS external_equipment_cost NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vat_rate NUMERIC DEFAULT 21,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'Website',
  ADD COLUMN IF NOT EXISTS move_type TEXT DEFAULT 'Residential',
  ADD COLUMN IF NOT EXISTS customer_rating INTEGER,
  ADD COLUMN IF NOT EXISTS scheduled_time_slot TEXT DEFAULT '08:00 - 12:00',
  ADD COLUMN IF NOT EXISTS assigned_team TEXT DEFAULT 'Team 1',
  ADD COLUMN IF NOT EXISTS assigned_van TEXT DEFAULT 'Van 1',
  ADD COLUMN IF NOT EXISTS time_logs JSONB DEFAULT '{}'::jsonb;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.movers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_movers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- 8. Idempotent Policies (Drop first if exists, then create)
DROP POLICY IF EXISTS "Allow authenticated full access to movers" ON public.movers;
CREATE POLICY "Allow authenticated full access to movers" ON public.movers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access to order_movers" ON public.order_movers;
CREATE POLICY "Allow authenticated full access to order_movers" ON public.order_movers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access to vehicles" ON public.vehicles;
CREATE POLICY "Allow authenticated full access to vehicles" ON public.vehicles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access to claims" ON public.claims;
CREATE POLICY "Allow authenticated full access to claims" ON public.claims
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Seed Default Movers & Vehicles (Idempotent)
INSERT INTO public.movers (name, role, hourly_rate, phone, active)
SELECT * FROM (VALUES
  ('Rico', 'Driver / Lead', 22.50, '+31 6 8439 9289', true),
  ('Tariq', 'Lead Mover', 20.00, '+31 6 1122 3344', true),
  ('Sami', 'Mover / Packer', 18.00, '+31 6 5566 7788', true),
  ('Youssef', 'Helper', 16.50, '+31 6 9988 7766', true)
) AS v(name, role, hourly_rate, phone, active)
WHERE NOT EXISTS (SELECT 1 FROM public.movers LIMIT 1);

INSERT INTO public.vehicles (name, license_plate, capacity_m3, hourly_cost, km_cost, active)
SELECT * FROM (VALUES
  ('Van 1 — Renault Master Box (22m³)', 'V-123-NL', 22, 18.00, 0.35, true),
  ('Van 2 — Mercedes Sprinter XL (20m³)', 'V-456-NL', 20, 16.00, 0.32, true),
  ('Van 3 — City Transit Van (12m³)', 'V-789-NL', 12, 12.00, 0.25, true),
  ('Moving Lift (Geda / Böcker 27m)', 'LIFT-01', 0, 45.00, 0.20, true)
) AS v(name, license_plate, capacity_m3, hourly_cost, km_cost, active)
WHERE NOT EXISTS (SELECT 1 FROM public.vehicles LIMIT 1);
