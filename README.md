# Upcoming Payments

A mobile-first web app to track upcoming expenses — subscriptions, rent, loans, and one-off bills — organized by month.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Supabase** — auth (email + Google) and Postgres with Row Level Security
- **Tailwind CSS** + shadcn/ui
- **Framer Motion** — subtle page and list animations
- **Recharts** — monthly bar chart and category breakdown

## Getting started

### 1. Supabase project (free tier)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) via the SQL Editor
3. Copy your project URL and anon key from **Settings → API**

### 2. Google OAuth (optional, free)

1. Create an OAuth client in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
3. In Supabase: **Authentication → Providers → Google** — paste client ID and secret

### 3. Local environment

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy (free)

- Push to GitHub and import on [Vercel](https://vercel.com)
- Add the same env vars in Vercel project settings
- Set Supabase **Authentication → URL Configuration** redirect URLs to your Vercel domain

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run occurrence engine tests |
| `npm run lint` | ESLint |

## Features

- Email/password and Google sign-in
- Recurring, installment, and one-off payments
- Monthly overview with search and filters
- Category management
- 6-month bar chart and category donut on Insights

## Cost

Designed to run at **$0/month** on Supabase Free + Vercel Hobby for personal use.
