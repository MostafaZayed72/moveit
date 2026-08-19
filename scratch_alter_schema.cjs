const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/SUPABASE_URL=(.*)/)[1];
const key = env.match(/SUPABASE_KEY=(.*)/)[1];
const s = createClient(url, key);

async function run() {
  const q = `
    ALTER TABLE public.orders 
    ALTER COLUMN est_revenue TYPE NUMERIC(15,2),
    ALTER COLUMN actual_revenue TYPE NUMERIC(15,2),
    ALTER COLUMN est_hours TYPE NUMERIC(15,2),
    ALTER COLUMN actual_hours TYPE NUMERIC(15,2),
    ALTER COLUMN est_fuel_litres TYPE NUMERIC(15,2),
    ALTER COLUMN actual_fuel_litres TYPE NUMERIC(15,2),
    ALTER COLUMN est_fuel_cost TYPE NUMERIC(15,2),
    ALTER COLUMN actual_fuel_cost TYPE NUMERIC(15,2),
    ALTER COLUMN est_distance TYPE NUMERIC(15,2),
    ALTER COLUMN actual_distance TYPE NUMERIC(15,2),
    ALTER COLUMN est_van_cost TYPE NUMERIC(15,2),
    ALTER COLUMN actual_van_cost TYPE NUMERIC(15,2),
    ALTER COLUMN est_materials TYPE NUMERIC(15,2),
    ALTER COLUMN actual_materials TYPE NUMERIC(15,2);
  `;
  const { data, error } = await s.rpc('execute_sql', { sql: q });
  console.log(error || 'SQL Executed Successfully');
}
run();
