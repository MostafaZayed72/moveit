-- =============================================================================
-- MoveIt Maastricht CRM — Phase 3 Idempotent Database Migration
-- File: supabase/migration_phase3_crm.sql
-- Automations, Client Communication, Review Collection & Predictive Analytics
-- Safe to run multiple times without errors.
-- =============================================================================

-- 1. Automations Definition Table
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  trigger_event TEXT NOT NULL,
  category TEXT DEFAULT 'Leads',
  channels TEXT[] DEFAULT ARRAY['email', 'whatsapp'],
  delay_hours INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  runs_count INT DEFAULT 0,
  success_rate NUMERIC DEFAULT 100,
  last_run_at TIMESTAMPTZ,
  template_subject TEXT,
  template_body TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all columns exist if table was already created
ALTER TABLE public.automations
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS trigger_event TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Leads',
  ADD COLUMN IF NOT EXISTS channels TEXT[] DEFAULT ARRAY['email', 'whatsapp'],
  ADD COLUMN IF NOT EXISTS delay_hours INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS runs_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS success_rate NUMERIC DEFAULT 100,
  ADD COLUMN IF NOT EXISTS last_run_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS template_subject TEXT,
  ADD COLUMN IF NOT EXISTS template_body TEXT;

-- 2. Automation Execution Logs
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES public.automations(id) ON DELETE SET NULL,
  automation_name TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  channel TEXT NOT NULL, -- 'email', 'whatsapp', 'sms'
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
  payload JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.automation_logs
  ADD COLUMN IF NOT EXISTS automation_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent',
  ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS error_message TEXT;

-- 3. Customer Reviews, Ratings & NPS Feedback Table
CREATE TABLE IF NOT EXISTS public.reviews_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback_text TEXT,
  service_speed_rating INT DEFAULT 5,
  mover_care_rating INT DEFAULT 5,
  google_review_clicked BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published', -- 'published', 'pending', 'disputed'
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reviews_feedback
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS rating INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS feedback_text TEXT,
  ADD COLUMN IF NOT EXISTS service_speed_rating INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS mover_care_rating INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS google_review_clicked BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- 4. Quote Follow-Ups Queue Table
CREATE TABLE IF NOT EXISTS public.quote_followups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  attempt_number INT DEFAULT 1,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'replied', 'accepted', 'declined'
  scheduled_for TIMESTAMPTZ DEFAULT now() + interval '3 days',
  sent_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quote_followups
  ADD COLUMN IF NOT EXISTS attempt_number INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 5. Seasonal Demand & Capacity Forecasts Table
CREATE TABLE IF NOT EXISTS public.seasonal_forecasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  period_label TEXT NOT NULL, -- e.g. 'Q1 2026', 'April 2026'
  demand_level TEXT DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
  projected_jobs INT DEFAULT 45,
  projected_revenue NUMERIC DEFAULT 25000,
  recommended_vans INT DEFAULT 2,
  recommended_movers INT DEFAULT 5,
  peak_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_forecasts ENABLE ROW LEVEL SECURITY;

-- 7. Idempotent Policies
DROP POLICY IF EXISTS "Allow public and authenticated full access to automations" ON public.automations;
CREATE POLICY "Allow public and authenticated full access to automations" ON public.automations
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public and authenticated full access to automation_logs" ON public.automation_logs;
CREATE POLICY "Allow public and authenticated full access to automation_logs" ON public.automation_logs
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public and authenticated full access to reviews_feedback" ON public.reviews_feedback;
CREATE POLICY "Allow public and authenticated full access to reviews_feedback" ON public.reviews_feedback
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public and authenticated full access to quote_followups" ON public.quote_followups;
CREATE POLICY "Allow public and authenticated full access to quote_followups" ON public.quote_followups
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public and authenticated full access to seasonal_forecasts" ON public.seasonal_forecasts;
CREATE POLICY "Allow public and authenticated full access to seasonal_forecasts" ON public.seasonal_forecasts
  FOR ALL TO public USING (true) WITH CHECK (true);

-- 8. Seed Default Phase 3 Automations (Idempotent)
INSERT INTO public.automations (name, subtitle, trigger_event, category, channels, delay_hours, active, runs_count, success_rate, template_subject, template_body)
SELECT * FROM (VALUES
  (
    'New Lead Welcome & Instant Response',
    'Get notified and send instant welcome when a lead submits quote request',
    'lead_submitted',
    'Leads',
    ARRAY['email', 'whatsapp'],
    0,
    true,
    84,
    100,
    'Your MoveIt Maastricht Relocation Request is Confirmed! 🚚',
    'Hello {{customer_name}}, thank you for requesting a moving quote with MoveIt Maastricht! Our coordinator is reviewing your request.'
  ),
  (
    'Automated Quotation Dispatch',
    'Send official A4 PDF quotation and digital summary to customer',
    'quotation_ready',
    'Quotations',
    ARRAY['email', 'whatsapp'],
    0,
    true,
    62,
    100,
    'Your Official MoveIt Relocation Quotation (Ref: {{quote_ref}})',
    'Hello {{customer_name}}, your tailored relocation proposal for {{route}} is ready. View your guaranteed fixed-price quote.'
  ),
  (
    'Unanswered Quote Follow-Up (3-Day Check-in)',
    'Follow up automatically with unaccepted quotes after 3 calendar days',
    'quote_unanswered_3d',
    'Quotations',
    ARRAY['email', 'whatsapp'],
    72,
    true,
    43,
    98,
    'Quick check-in regarding your upcoming move from {{origin}}',
    'Hello {{customer_name}}, Sherif from MoveIt here! I wanted to check if you had any questions regarding quotation {{quote_ref}}.'
  ),
  (
    'Pre-Move Reminder & Checklist (24 Hours Before)',
    'Send moving day checklist, crew details and parking advice 1 day before move',
    'job_reminder_24h',
    'Jobs',
    ARRAY['email', 'whatsapp', 'sms'],
    24,
    true,
    58,
    100,
    'MoveIt Moving Tomorrow! Important Checklist & Arrival Time (08:00)',
    'Hello {{customer_name}}, our team ({{team_lead}}) will arrive tomorrow at {{time}} with {{van_name}}. Please ensure your parking reservation is clear.'
  ),
  (
    'Post-Move Review & Google 5-Star Feedback',
    'Request verified review and NPS score 24 hours after move completion',
    'job_completed_24h',
    'Customers',
    ARRAY['email', 'whatsapp'],
    24,
    true,
    51,
    98,
    'How was your move with MoveIt Maastricht? ⭐⭐⭐⭐⭐',
    'Hello {{customer_name}}, we hope you are settling nicely into {{destination}}! We would deeply appreciate your feedback on Google.'
  ),
  (
    'Automated Tax Invoice Generation & Dispatch',
    'Generate Dutch VAT invoice and send payment link upon move completion',
    'invoice_generated',
    'Finances',
    ARRAY['email'],
    0,
    true,
    49,
    100,
    'Invoice {{invoice_num}} from MoveIt Maastricht B.V.',
    'Dear {{customer_name}}, please find attached your official relocation tax invoice with 21% Dutch BTW.'
  )
) AS v(name, subtitle, trigger_event, category, channels, delay_hours, active, runs_count, success_rate, template_subject, template_body)
WHERE NOT EXISTS (SELECT 1 FROM public.automations LIMIT 1);

-- 9. Seed Default Seasonal Forecasts
INSERT INTO public.seasonal_forecasts (period_label, demand_level, projected_jobs, projected_revenue, recommended_vans, recommended_movers, peak_notes)
SELECT * FROM (VALUES
  ('Q1 2026 (Jan - Mar)', 'Medium', 115, 68000, 2, 4, 'Moderate local moves, winter student semester starts in Maastricht.'),
  ('Q2 2026 (Apr - Jun)', 'High', 190, 114000, 3, 6, 'Peak spring home buying season across Limburg and Belgium.'),
  ('Q3 2026 (Jul - Sep)', 'High', 220, 138000, 3, 8, 'Maximum demand season: University of Maastricht student intake and international corporate relocations.'),
  ('Q4 2026 (Oct - Dec)', 'Medium', 135, 82000, 2, 5, 'Year-end commercial moves and holiday residential relocations.')
) AS f(period_label, demand_level, projected_jobs, projected_revenue, recommended_vans, recommended_movers, peak_notes)
WHERE NOT EXISTS (SELECT 1 FROM public.seasonal_forecasts LIMIT 1);

