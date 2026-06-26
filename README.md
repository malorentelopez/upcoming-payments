# ahead — Upcoming Payments

A mobile-first web app to track upcoming expenses — subscriptions, rent, loans, and one-off bills — organized by month.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Supabase** — auth (email + Google) and Postgres with Row Level Security
- **Tailwind CSS** + shadcn/ui
- **next-intl** — English, French, Spanish, German
- **Framer Motion** — subtle page and list animations
- **Recharts** — monthly bar chart and category breakdown
- **Sentry** (optional) — production error monitoring

## Getting started

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order via the SQL Editor:
   - [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
   - [`supabase/migrations/002_add_locale.sql`](supabase/migrations/002_add_locale.sql)
   - [`supabase/migrations/003_payment_category_ownership.sql`](supabase/migrations/003_payment_category_ownership.sql)
3. Copy your project URL and anon key from **Settings → API**

### 2. Google OAuth (optional)

1. Create an OAuth client in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. In Supabase: **Authentication → Providers → Google** — paste client ID and secret

### 3. Local environment

```bash
cp .env.example .env.local
```

Fill in at minimum:

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | For account deletion | Server-only; never expose to the client |
| `NEXT_PUBLIC_SITE_URL` | Recommended | e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Enables Sentry in production builds |

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production launch checklist

Use this before opening signups to other people.

### Supabase

- [ ] All migrations (`001`, `002`, `003`) applied on **production**
- [ ] **Authentication → URL Configuration**
  - Site URL: your production domain (e.g. `https://upcoming-payments.vercel.app`)
  - Redirect URLs: production domain + `/auth/callback`
- [ ] **Authentication → Providers → Email**
  - Enable **Confirm email** for email/password signups
  - Google OAuth users are verified by Google and do not need a separate confirmation email
- [ ] **Authentication → Email templates** — customize confirmation email if desired
- [ ] **Authentication → Rate limits** — review defaults; enable CAPTCHA if you see bot signups
- [ ] **Database → Backups** — confirm backup policy matches your plan
- [ ] Service role key stored only in Vercel (server env), never in the client

### Vercel

- [ ] Environment variables set for **Production** (mirror `.env.example`)
- [ ] Custom domain configured (optional but recommended)
- [ ] Deploy succeeds after env changes
- [ ] Smoke test: sign up (email + Google), add payment, delete account

### App configuration

- [ ] `SUPABASE_SERVICE_ROLE_KEY` set — **Me → Delete account** works
- [ ] `NEXT_PUBLIC_SENTRY_DSN` set (optional) — errors reported in [Sentry](https://sentry.io)
- [ ] Vercel Analytics — users opt in via cookie banner

### Legal & trust

- [ ] Privacy and cookie policies match live behaviour ([`/privacy`](https://upcoming-payments.vercel.app/privacy), [`/cookies`](https://upcoming-payments.vercel.app/cookies))
- [ ] Landing page FAQ reflects what the app does and does not do
- [ ] Support email in privacy policy is monitored

### Signup policy

| Method | Verification |
|--------|----------------|
| **Email + password** | User must confirm email (enable in Supabase). App shows “check your email” after signup. |
| **Google** | No extra email step — Google has already verified the address. |

### Ops (no admin panel needed at first)

- **User support** — email in privacy policy; rare manual deletes via Supabase Dashboard
- **Errors** — Sentry alerts (if DSN configured)
- **Usage** — Supabase + Vercel dashboards for quotas

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run occurrence engine tests |
| `npm run lint` | ESLint |

## Features

- Email/password (with confirmation) and Google sign-in
- Recurring, installment, and one-off payments
- Monthly overview with search and filters
- Category management
- 6-month bar chart and category breakdown on Insights
- Self-service account deletion (GDPR)
- Cookie consent with optional analytics

## Cost

Designed to run at **$0/month** on Supabase Free + Vercel Hobby for modest personal use. Monitor quotas as user count grows.

## License

Private — see repository owner.
