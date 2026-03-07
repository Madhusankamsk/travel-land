-- Create supabase_admin so Supabase Studio Table Editor can connect.
-- Runs automatically on first DB start via docker-entrypoint-initdb.d.
-- For an existing DB, run once: docker compose exec db psql -U postgres -f - < scripts/init-db-supabase-user.sql
CREATE USER supabase_admin WITH PASSWORD 'postgres' SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE postgres TO supabase_admin;
GRANT ALL ON SCHEMA public TO supabase_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO supabase_admin;
