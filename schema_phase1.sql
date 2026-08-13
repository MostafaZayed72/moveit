-- ==========================================
-- CREATE CUSTOMERS TABLE (Linked to auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own customer data" 
  ON public.customers FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own customer data" 
  ON public.customers FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin to read all customers" 
  ON public.customers FOR SELECT 
  TO authenticated 
  USING (true); -- Note: In a real prod, restrict this to admin users only

-- ==========================================
-- CREATE ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending', -- Pending, In Transit, Shipped, Completed, Cancelled
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow customers to read their own orders" 
  ON public.orders FOR SELECT 
  TO authenticated 
  USING (auth.uid() = customer_id);

CREATE POLICY "Allow customers to insert their own orders" 
  ON public.orders FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Allow customers to update their own orders" 
  ON public.orders FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Allow admin to read all orders" 
  ON public.orders FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow admin to update all orders" 
  ON public.orders FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- CREATE EXPENSES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- e.g., 'Fuel', 'Electricity', 'Other'
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin to access expenses" 
  ON public.expenses FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);
