-- =============================================================================
-- MoveIt Maastricht CRM — Settings & Company Profile Database Migration
-- File: supabase/migration_settings_crm.sql
-- Enables persistent multi-user database storage for all CRM settings.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  general JSONB DEFAULT '{}'::jsonb,
  company JSONB DEFAULT '{}'::jsonb,
  business_hours JSONB DEFAULT '[]'::jsonb,
  team_members JSONB DEFAULT '[]'::jsonb,
  service_packages JSONB DEFAULT '[]'::jsonb,
  notif_prefs JSONB DEFAULT '[]'::jsonb,
  billing JSONB DEFAULT '{}'::jsonb,
  security JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist if table was already created
ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS general JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS company JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS service_packages JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notif_prefs JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS billing JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS security JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Enable RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies (Allow access to admin users / public anon key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow all access to company_settings'
  ) THEN
    CREATE POLICY "Allow all access to company_settings" ON public.company_settings
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Insert default seed row if not exists
INSERT INTO public.company_settings (id, general, company, billing, security)
VALUES (
  'default',
  '{"vatRate": 21, "labourRate": 20, "vanRate": 100, "bufferTime": 1, "cancellationPolicy": "72 hours", "quoteValidity": 14, "distanceUnit": "Kilometers (km)", "weightUnit": "Kilograms (kg)", "currency": "Euro (€)", "language": "English (Primary), Dutch (Secondary)", "timezone": "Europe/Amsterdam (CET)"}'::jsonb,
  '{"name": "MoveIt Maastricht", "legalEntity": "S&S Services (VOF)", "kvk": "85672914", "vatNumber": "NL863218765B01", "address": "Dokter van Kleefstraat 46C, 6217 JK Maastricht, Netherlands", "phone": "+31 6 12 34 56 78", "email": "info@moveit-maastricht.nl", "website": "www.moveit-maastricht.nl", "serviceArea": "Limburg, Netherlands + EU"}'::jsonb,
  '{"beneficiary": "MoveIt Maastricht B.V.", "bankName": "Rabobank Maastricht", "iban": "NL44 RABO 0123 4567 89", "bic": "RABONL2U", "invPrefix": "INV-", "paymentTermDays": 14}'::jsonb,
  '{"twoFactor": true, "sessionTimeout": "8 hours", "passwordPolicy": "Enforced"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

