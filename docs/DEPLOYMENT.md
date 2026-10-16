# Production Deployment Guide
## Baba Anandeshwar Internet Cafe

### 1. Architecture Topology
- **Frontend**: Static SPA hosted on Vercel, Netlify, or Cloudflare Pages.
- **Backend API**: Node.js container service hosted on Render, Railway, or VPS.
- **Database & Auth**: Supabase Managed PostgreSQL.

---

### 2. Supabase Project Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Run the migration script:
   - Copy contents of `supabase/migrations/20250101000000_initial_schema.sql` and execute.
4. Run the seed data script:
   - Copy contents of `supabase/seed.sql` and execute to seed all 50 services, categories, hours, and settings.

#### Provisioning the Initial Administrator Account:
1. In the Supabase Dashboard, go to **Authentication -> Users -> Add User**.
2. Enter the administrator email (e.g. `anandeshwarcafe@gmail.com`) and a secure password.
3. Copy the created User's UUID (`auth.users.id`).
4. Execute in SQL Editor:
   ```sql
   INSERT INTO public.profiles (id, display_name, role, is_active)
   VALUES ('<COPIED_USER_UUID>', 'Anurag Mishra', 'admin', true)
   ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;
   ```
5. The administrator can now log in at `/admin/login`.

---

### 3. Backend Deployment (Render / Railway)

1. Connect your repository and select directory `apps/api`.
2. Configure environment variables:
   ```env
   NODE_ENV=production
   PORT=4000
   FRONTEND_ORIGIN=https://anandeshwarcafe.in
   SUPABASE_URL=https://<your-project>.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   BOOKING_LOOKUP_PEPPER=<generate_random_32_char_secret>
   ```
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Verify health: `GET https://your-api.onrender.com/api/health`

---

### 4. Frontend Deployment (Vercel / Netlify)

1. Connect repository and select root directory or `apps/web`.
2. Build Settings:
   - Framework Preset: **Vite**
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Environment Variables:
   ```env
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_API_BASE_URL=https://your-api.onrender.com/api
   ```
4. For single-page app (SPA) routing, ensure standard redirect rewrites rule (`/* -> /index.html 200`).
