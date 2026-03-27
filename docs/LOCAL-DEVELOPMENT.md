# Local development with Supabase

Run Supabase (Postgres, Studio, API) locally so you don’t need the cloud and avoid port/firewall issues.

## Requirements

- **Docker Desktop** (or another Docker-compatible engine) installed and running.
- **Node.js** (already used for this project).

## One-time setup

1. **Install dependencies** (includes Supabase CLI):
   ```bash
   npm install
   ```

2. **Env:** Copy `.env.example` to `.env` (or use existing `.env`). For local Supabase:
   - `DIRECT_URL` and `DATABASE_URL`: `postgresql://postgres:postgres@localhost:54322/postgres`
   - `SUPABASE_URL`: `http://127.0.0.1:54321`
   - `SUPABASE_SERVICE_ROLE_KEY`: run `npm run supabase:status` and copy the `service_role` key (or use the default from `.env.example`).
3. **Cloudinary (uploads):** Add these env vars in `.env` (or `.env.local`) so hero images and program PDFs upload correctly:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Daily workflow

1. **Start Supabase** (Postgres on port 54322, Studio on 54323):
   ```bash
   npm run supabase:start
   ```
   First run may take a few minutes while images download.

2. **Apply Prisma migrations** (creates/updates tables in the local DB):
   ```bash
   npm run db:migrate
   ```
   Prisma uses `DIRECT_URL` from `.env.local` (localhost:54322).

3. **Start the Next.js app**:
   ```bash
   npm run dev
   ```

4. **When you’re done**, stop Supabase:
   ```bash
   npm run supabase:stop
   ```

## Useful URLs (when Supabase is running)

| Service        | URL                        |
|----------------|----------------------------|
| Your app       | http://localhost:3000      |
| Supabase Studio| http://localhost:54323     |
| Supabase API   | http://localhost:54321     |

- **Studio**: open tables, run SQL, inspect data, and create the **tours** Storage bucket (Storage → New bucket → name `tours` → Public).
- **Prisma Studio**: `npm run db:studio` to edit data via Prisma.

## Env precedence

- **Local:** `.env.local` is loaded and overrides `.env` for `DIRECT_URL` when running Prisma (see `prisma.config.ts`). Use `.env.local` for the local Supabase URL only; keep production URLs in `.env` or in your deployment env.
- **Production:** Use `.env` (or your host’s env) with your hosted Supabase `DIRECT_URL` and keys.

## Docker Compose (app in container)

**Start all services (including Supabase dashboard):**  
`docker compose up -d`  
Then open **Supabase Studio** at **http://localhost:54323** to browse the database (Table Editor, SQL, etc.). The dashboard uses the same Postgres as the app (`db`).  
**Note:** Docker Compose in this repo runs Postgres + Studio UI. File uploads are handled by Cloudinary directly from the app server and do not depend on Supabase Storage.

**Image & PDF uploads in Docker:** Set Cloudinary env vars for the app container, then restart it:

1. Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
2. Restart app container so it picks up env: `docker compose up -d app`

If Cloudinary env is missing, uploads fall back to local `public/uploads` only in development.

## Troubleshooting

- **“Docker not running”**  
  Start Docker Desktop (or your Docker engine) and run `npm run supabase:start` again.

- **“Can’t reach database”**  
  Ensure Supabase is running (`npm run supabase:status`) and `DIRECT_URL` in `.env.local` is `postgresql://postgres:postgres@localhost:54322/postgres`.

- **Port already in use**  
  Change ports in `supabase/config.toml` (e.g. `[db] port = 54322`) or stop the process using that port.
