-- ==========================================
-- ALTER ORDERS TABLE (FINANCIAL & CRM FIELDS)
-- ==========================================
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS est_revenue NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_revenue NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_hours NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_hours NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_fuel_litres NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_fuel_litres NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_fuel_cost NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_fuel_cost NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_distance NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_distance NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_van_cost NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_van_cost NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_rental NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_rental NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_toll NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_toll NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_parking NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_parking NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_materials NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_materials NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_other_cost NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_other_cost NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vat_amount NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS surcharges NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_source TEXT,
ADD COLUMN IF NOT EXISTS lost_reason TEXT;

-- ==========================================
-- CREATE MOVERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.movers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  employment_type TEXT,
  standard_hourly_rate NUMERIC(10, 2) DEFAULT 0,
  weekend_hourly_rate NUMERIC(10, 2) DEFAULT 0,
  evening_rate NUMERIC(10, 2) DEFAULT 0,
  international_rate NUMERIC(10, 2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.movers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin to manage movers" ON public.movers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- CREATE ORDER_MOVERS TABLE (CREW)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.order_movers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  mover_id UUID REFERENCES public.movers(id) ON DELETE CASCADE,
  hours NUMERIC(10, 2) DEFAULT 0,
  hourly_rate NUMERIC(10, 2) DEFAULT 0,
  total_cost NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_movers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin to manage order_movers" ON public.order_movers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- CREATE VEHICLES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  ownership_type TEXT, -- Owned, Rental, Partner
  cost_model TEXT,
  cost_percentage NUMERIC(10, 2) DEFAULT 0,
  daily_cost NUMERIC(10, 2) DEFAULT 0,
  included_km NUMERIC(10, 2) DEFAULT 0,
  extra_km_fee NUMERIC(10, 2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin to manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- ALTER EXPENSES TABLE
-- ==========================================
ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS supplier TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS amount_excl_vat NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vat_amount NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS related_job_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS related_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS frequency TEXT,
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Move data from old amount to amount_excl_vat temporarily to keep it intact, then zero it or ignore
UPDATE public.expenses SET amount_excl_vat = amount WHERE amount_excl_vat = 0;

-- ==========================================
-- CREATE CLAIMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  date_reported DATE DEFAULT CURRENT_DATE,
  type TEXT,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  mover_notes TEXT,
  customer_notes TEXT,
  est_cost NUMERIC(10, 2) DEFAULT 0,
  actual_cost NUMERIC(10, 2) DEFAULT 0,
  insurance_involved BOOLEAN DEFAULT false,
  insurance_claim_number TEXT,
  status TEXT DEFAULT 'Open',
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin to manage claims" ON public.claims FOR ALL TO authenticated USING (true) WITH CHECK (true);
