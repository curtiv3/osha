# Finished Work Log

## Phase 0
- Next.js 15 + TypeScript scaffold
- Tailwind + shadcn-style UI base
- Prisma schema + NextAuth foundation
- SEO baseline (`metadataBase`, robots, sitemap)

## Phase 1
- Registration + credentials login flow
- Role-aware sessions (`ADMIN`, `SITE_MANAGER`)
- Onboarding flow (company + sites)
- Protected route redirects and dashboard onboarding guard
- Fixed Edge auth crash by switching to JWT session strategy

## Phase 2 (started)
- Checklist module started:
  - `GET/POST /api/checklists`
  - Dashboard page `/dashboard/checklists`
  - OSHA default checklist templates in `src/lib/osha/default-checklists.ts`
- Audit/Incident reporting started:
  - `GET/POST /api/incidents`
  - AI assessment integration via OpenAI (with safe fallback if no API key)
  - Dashboard page `/dashboard/incidents`
- AI Compliance Chat started:
  - `GET/POST /api/compliance-chat`
  - Persistent chat history model (`ComplianceChatMessage`)
  - Dashboard page `/dashboard/ai-chat`
- Navigation updated with AI Chat link

## What to test now
1. Register user -> Login -> onboarding -> dashboard redirect flow
2. Create checklist under `/dashboard/checklists`
3. Create incident under `/dashboard/incidents` and verify AI assessment output
4. Ask AI compliance question under `/dashboard/ai-chat`
5. If DB schema changed, run Prisma migration/generate before testing

## Hotfixes after Phase 2 kickoff
- Fixed dashboard hydration mismatch noise caused by client-side DOM mutation (e.g. dark mode extensions) by adding `suppressHydrationWarning` on root HTML/body.
- Fixed redirect loop/stale-session behavior for `/dashboard/checklists` and `/dashboard/incidents` by resolving current user/company from DB (`getCurrentUserContext`) instead of relying only on JWT `companyId`.
- Updated checklists/incidents/chat APIs to use the same DB-backed auth context resolution for robust authorization after onboarding updates.
- Added `suppressHydrationWarning` directly on Lucide SVG icons in sidebar/dashboard to suppress Dark Reader-injected SVG attribute mismatches during hydration.

## Phase 3 (started)
- Dashboard metrics expanded:
  - Compliance score
  - Open high/critical issues
  - Total incidents and sites
- Charts added with Recharts:
  - Violations per month bar chart
  - Site risk heatmap bars
- Alerts section added with penalty-aware messages
- Added `/api/dashboard-metrics` endpoint for aggregated stats payloads

## Phase 4 (started)
- `/admin` page added with admin-only guard
- User management section:
  - List users
  - Change role between `ADMIN` and `SITE_MANAGER`
- Content updates section:
  - Edit and persist OSHA checklist templates JSON
- Admin analytics section:
  - Users, companies, incidents, high-risk incidents, AI chats
- Admin APIs added:
  - `GET /api/admin/users`
  - `PATCH /api/admin/users/[id]`
  - `GET/PUT /api/admin/checklist-templates`
  - `GET /api/admin/analytics`


## Phase 5 (started)
- Billing page `/dashboard/billing` with plan selection cards
- Stripe Checkout API: `POST /api/billing/checkout`
- Stripe Webhook API: `POST /api/billing/webhook` for subscription sync
- User subscription fields added in Prisma (`subscriptionStatus`, `stripeCustomerId`, `stripePriceId`)
- Stripe plan env support added (`STRIPE_PRICE_BASIC_MONTHLY`, `STRIPE_PRICE_PRO_MONTHLY`)

## Phase 7 (started)
- Stability/polish pass executed for auth + production build readiness.
- Replaced `bcryptjs` dependency usage with Node.js `crypto.scrypt` helper (`src/lib/password.ts`) to avoid missing-module build failures in restricted environments.
- Updated credentials auth verification and register hashing to use shared password helper.
- Validation checks run:
  - `npm run lint` ✅
  - `npm run build` ✅

## Ready-to-test checklist (latest)
1. Register new user and login with credentials.
2. Confirm onboarding still creates company/site and redirects into dashboard.
3. Verify login with wrong password is rejected.
4. Verify production build command succeeds locally (`npm run build`).


## Phase 6 (completed)
- PDF Export for incidents implemented via `GET /api/reports/incidents/[incidentId]` using `pdf-lib`.
- Incident list now includes direct PDF download action for each record.
- Email alerts for HIGH/CRITICAL incidents implemented with Resend helper (`RESEND_API_KEY` + `ALERT_EMAIL_TO`).
- Alerts include company/site/incident context, AI assessment summary, and OSHA penalty reminder.

## Phase 6 test focus
1. Create a HIGH or CRITICAL incident and verify request succeeds.
2. Download report PDF from incidents page and verify contents.
3. Configure `RESEND_API_KEY` + `ALERT_EMAIL_TO` and verify alert email delivery for HIGH/CRITICAL incidents.
