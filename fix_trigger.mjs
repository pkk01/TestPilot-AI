// Fix the handle_new_user trigger using Supabase service_role key
// Uses the supabase-js .from('').select() with raw SQL via the pg_catalog approach

const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZGVnb291cmp4Y2Jod2Nkc3R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc4MDkxOSwiZXhwIjoyMDg4MzU2OTE5fQ.xwgp0efW32AFZPEW26YUddgAVxl-EJNwDN-8vDYR-Wk";
const PROJECT_REF = "qhdegoourjxcbhwcdstv";
const DB_PASSWORD = process.argv[2];

if (!DB_PASSWORD) {
  console.log("============================================");
  console.log("  SUPABASE TRIGGER FIX - INSTRUCTIONS");
  console.log("============================================\n");
  console.log("Option 1: Run with your DB password:");
  console.log("  node fix_trigger.mjs YOUR_DB_PASSWORD\n");
  console.log("Option 2: Use the Supabase CLI:");
  console.log("  npx supabase db execute --project-ref qhdegoourjxcbhwcdstv -f fix_trigger.sql\n");
  console.log("Option 3: Copy the SQL below into Supabase Dashboard > SQL Editor:\n");
  console.log(`CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'email',
      new.email
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`);
  process.exit(0);
}

// Connect directly to Postgres via the Supabase connection string
const connectionString = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;

// Use dynamic import for pg (if available) or fall back to fetch approach  
try {
  // Try the Supabase SQL API v1 beta endpoint
  const sql = `CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'email',
      new.email
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`;

  // Try via Supabase's /query endpoint with service role
  const resp = await fetch(`https://${PROJECT_REF}.supabase.co/query`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "x-supabase-db-password": DB_PASSWORD,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (resp.ok) {
    console.log("SUCCESS! Trigger function updated.");
    const result = await resp.json();
    console.log(JSON.stringify(result, null, 2));
  } else {
    const text = await resp.text();
    console.log("Query endpoint response:", resp.status, text);
    console.log("\nTrying Supabase CLI approach...");
    
    // Write the SQL to a temp file and use npx supabase
    const fs = await import("fs");
    fs.writeFileSync("fix_trigger.sql", sql);
    console.log("SQL written to fix_trigger.sql");
    console.log("Run: npx supabase db execute --project-ref qhdegoourjxcbhwcdstv -f fix_trigger.sql");
  }
} catch (err) {
  console.error("Error:", err.message);
}
