# Connect Travel-Land to Supabase Cloud

This project uses **Prisma** for the database (PostgreSQL) and **Supabase JS** for Storage (and optional server-side features). To use **Supabase Cloud** instead of local Supabase, follow these steps.

---

## 1. Create a Supabase Cloud project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New project**.
3. Choose your **organization**, set **Project name** (e.g. `travel-land`), **Database password** (save it securely), and **Region**.
4. Wait for the project to be provisioned.

---

## 2. Get connection details from the Supabase dashboard

### 2.1 Project URL and API keys (for Storage / server-side Supabase client)

1. In the dashboard, open **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** → you will use this for `SUPABASE_URL`.
   - **Project API keys** → **service_role** (secret) → you will use this for `SUPABASE_SERVICE_ROLE_KEY`.  
     ⚠️ Never expose the service role key in the browser or in client-side code.

### 2.2 Database connection strings (for Prisma)

1. Open **Project Settings** → **Database**.
2. Scroll to **Connection string**.
3. You need **two** connection strings:

   | Use case              | Supabase option              | Port | Env variable   |
   |-----------------------|------------------------------|------|----------------|
   | Migrations (Prisma)   | **URI** → **Direct connection** | 5432 | `DIRECT_URL`   |
   | App runtime (Prisma)  | **URI** → **Connection pooling** (Transaction mode) | 6543 | `DATABASE_URL` |

4. For each URI, replace the placeholder `[YOUR-PASSWORD]` with your **Database password** (from step 1).
5. If Supabase shows a **Session mode** pooler on port 5432 and a **Transaction mode** pooler on 6543, use:
   - **Direct** (no pooler, or Session) for migrations → `DIRECT_URL`
   - **Transaction** (port 6543) for the app → `DATABASE_URL`

   Example pattern (your actual host/region will differ):

   - **Direct (migrations):**  
     `postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres`
   - **Pooled (app):**  
     `postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

   If your Supabase project uses **IPv4** add-on, the host might be different; use the exact strings from the dashboard.

6. **SSL:** For Supabase Cloud, add `?sslmode=require` if not already present (e.g. end of URI: `...postgres?sslmode=require` or `...postgres?pgbouncer=true&sslmode=require`).

---

## 3. Update your environment variables

Edit your **`.env`** (and **`.env.local`** if you use it for local overrides). Use **production** values only in a safe place (e.g. your deployment platform’s env config), not committed to git.

Set:

```env
# ——— Supabase Cloud ———
SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-from-dashboard"

# ——— Database (Supabase Cloud) ———
# For Prisma migrations (direct connection, port 5432)
DIRECT_URL="postgresql://postgres.[project-ref]:YOUR-DB-PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"

# For app runtime (connection pooling, port 6543)
DATABASE_URL="postgresql://postgres.[project-ref]:YOUR-DB-PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

NODE_ENV="production"
```

Replace:

- `YOUR-PROJECT-REF` with your project reference (from Project URL).
- `your-service-role-key-from-dashboard` with the **service_role** key from **Settings → API**.
- `YOUR-DB-PASSWORD` with your database password.
- `[project-ref]`, `REGION`, and host with the exact values from **Settings → Database**.

Your `.env` comment says the app does not use `NEXT_PUBLIC_SUPABASE_*`; that’s correct for this server-only setup.

---

## 4. Run migrations on Supabase Cloud

From the project root, with `DIRECT_URL` and `DATABASE_URL` pointing at Supabase Cloud:

```bash
npx prisma migrate deploy
```

This applies all migrations in `prisma/migrations/` to the cloud database. For a fresh project, you can optionally seed:

```bash
npx prisma db seed
```

(Ensure your seed script uses `DATABASE_URL` or `DIRECT_URL` as it does today.)

---

## 5. Verify the connection

- **Database:** Run the app and use a feature that reads/writes (e.g. login, tours, bookings). You can also open **Table Editor** in the Supabase dashboard and check `users`, `tours`, `bookings`, etc.
- **Storage:** If you use Supabase Storage (e.g. uploads in `lib/upload.ts`), test an upload; it uses `getSupabaseServer()` which reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

---

## 6. Optional: Keep local Supabase for development

To keep using **local Supabase** (Docker) for development and only use Cloud in production:

1. Use **`.env.local`** for **local** values (e.g. `DIRECT_URL`/`DATABASE_URL`/`SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` pointing to `localhost`).
2. In your **deployment** (Vercel, etc.), set the **Cloud** values for `DIRECT_URL`, `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Run `prisma migrate deploy` in CI or after deploy so the cloud DB stays in sync.

---

## Summary checklist

| Step | Action |
|------|--------|
| 1 | Create a Supabase Cloud project and save the DB password. |
| 2 | Copy **Project URL** and **service_role** key → `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. |
| 3 | Copy **Direct** and **Connection pooling (Transaction)** URIs, replace password, add SSL if needed → `DIRECT_URL`, `DATABASE_URL`. |
| 4 | Update `.env` (or deployment env) with these four variables. |
| 5 | Run `npx prisma migrate deploy` (and optionally `npx prisma db seed`). |
| 6 | Test app and Storage against the cloud project. |

Your app already uses `DIRECT_URL` for migrations (in `prisma.config.ts`) and `DATABASE_URL` for the Prisma client at runtime (`lib/prisma.ts`), and Supabase only on the server (`lib/supabase-server.ts`), so no code changes are required—only environment configuration.
