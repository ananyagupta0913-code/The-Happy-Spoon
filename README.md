# The Happy Spoon — Full-Stack Setup Guide

## Project Overview

This is the complete full-stack version of The Happy Spoon café website, powered by **Supabase** as the backend and database.

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, ES Modules |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Hosting | Vercel (recommended) |
| Fonts | Google Fonts (Outfit + Playfair Display) |

---

## Folder Structure

```
happy-spoon/
├── index.html              ← Main public-facing site
├── style.css               ← All styles (original + new sections)
├── script.js               ← Public JS (forms + scroll animations)
├── vercel.json             ← Vercel deployment config
├── .env.example            ← Environment variables template
├── supabase_schema.sql     ← Run this in Supabase SQL Editor
├── assets/
│   ├── hero.png            ← Hero/about image
│   ├── food.png            ← Food menu image
│   └── beverage.png        ← Beverage menu image
├── js/
│   ├── supabase.js         ← Supabase client singleton
│   ├── toast.js            ← Toast notification utility
│   └── validation.js       ← Form validation helpers
└── admin/
    ├── index.html          ← Admin login page
    └── dashboard.html      ← Admin dashboard (reservations + messages)
```

---

## Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and fill in:
   - **Name**: `happy-spoon`
   - **Database Password**: choose a strong password (save it!)
   - **Region**: pick the closest to India (e.g., `ap-south-1` Mumbai)
3. Wait ~2 minutes for the project to spin up.

---

## Step 2 — Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Paste the entire contents of `supabase_schema.sql` into the editor.
4. Click **Run** (▶).

This creates:
- `reservations` table with RLS policies
- `contact_messages` table with RLS policies
- Performance indexes

---

## Step 3 — Create Your Admin User

1. In Supabase → **Authentication** → **Users** tab.
2. Click **Invite User** (or **Add User** → **Create New User**).
3. Enter your admin email and a strong password.
4. This user will be able to log in to `/admin/` and see all data.

---

## Step 4 — Get Your API Keys

1. In Supabase → **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## Step 5 — Configure Environment Variables

### For Local Development
Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Plain HTML (without Vite/bundler)
Replace the `%%VITE_SUPABASE_URL%%` and `%%VITE_SUPABASE_ANON_KEY%%` placeholders in:
- `index.html` (the `<script>window.__ENV__</script>` block near the top)
- `admin/index.html` (same block)
- `admin/dashboard.html` (same block)

With your actual values:
```html
<script>
  window.__ENV__ = {
    VITE_SUPABASE_URL:      'https://xxxx.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  };
</script>
```

> ⚠️ The `anon` key is safe to expose in the browser — it's limited by Row Level Security. Never expose your `service_role` key.

---

## Step 6 — Add Your Assets

Place your images in the `assets/` folder:
- `assets/hero.png` — hero section + about section background
- `assets/food.png` — food menu cards
- `assets/beverage.png` — beverage menu card

---

## Step 7 — Deploy to Vercel

### Option A: Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# From the project folder
vercel

# Follow prompts, then add env vars:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard

1. Push your project to a GitHub repository.
2. Go to [https://vercel.com](https://vercel.com) → **New Project** → import your repo.
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Click **Deploy**.

> **Important for plain HTML deployment**: Since this project doesn't use Vite/bundler, Vercel won't auto-inject env vars. You'll need to either:
> - Use a build script that replaces the `%%PLACEHOLDER%%` tokens, **or**
> - Manually paste your keys into the `window.__ENV__` block in each HTML file before deploying.

---

## Security Notes

| Concern | How it's handled |
|---|---|
| API keys in frontend | Only `anon` key used — safe by design |
| Public form spam | Can add Cloudflare Turnstile CAPTCHA to forms |
| Admin access | Protected by Supabase Auth session check |
| SQL injection | All queries use Supabase SDK parameterized calls |
| XSS | Admin dashboard escapes all user content before rendering |
| Data isolation | Row Level Security ensures anon users can only INSERT, never read |

---

## Admin Dashboard Features

- **Overview** — Stats cards (total reservations, pending, confirmed today, unread messages)
- **Reservations** — Filter by status, update status (Pending/Confirmed/Cancelled), delete
- **Messages** — Filter by read/unread, mark as read, delete
- **Real-time** — Dashboard auto-updates when new data arrives via Supabase Realtime

Access the admin panel at: `https://yourdomain.com/admin/`

---

## Local Development (no bundler needed)

Since this project uses ES Modules with CDN imports, you just need a simple HTTP server:

```bash
# Python
python3 -m http.server 3000

# Node.js (npx)
npx serve .

# Then open http://localhost:3000
```

---

## Troubleshooting

**"Supabase env vars missing" console error**
→ Make sure you've filled in the `window.__ENV__` block in all HTML files.

**Forms not submitting / 401 errors**
→ Check that RLS policies were created correctly. Re-run `supabase_schema.sql`.

**Admin login not working**
→ Make sure you created a user via Supabase Auth → Users tab (not just a database record).

**Real-time not working**
→ Enable Realtime for both tables: Supabase → Database → Replication → toggle both tables.
