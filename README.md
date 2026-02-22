# SafetyComplianceSaaS

Production-ready SaaS scaffolding for construction site managers to reduce OSHA violations.

## Completed phases so far

- **Phase 0**: Next.js 15 + TypeScript + Tailwind setup, Prisma schema, NextAuth scaffold, SEO baseline.
- **Phase 1**: Registration/login, role-aware sessions, onboarding flow and protected route redirects.
- **Phase 2**: Checklists, incidents with AI risk assessment, and AI compliance chat foundations.
- **Phase 3**: Dashboard KPIs, charts, and alerting endpoints.
- **Phase 4**: Admin panel (users, templates, analytics).
- **Phase 5**: Stripe billing foundation (checkout + webhook sync + billing UI).
- **Phase 6**: PDF incident reports and critical incident email notifications.
- **Phase 7 (in progress)**: test/polish/build readiness and deployment hardening.

## OSHA penalty defaults currently used

- Serious violation: **$16,550**
- Repeat/Willful violation: **$165,514**

## Local setup

1. Copy `.env.example` to `.env`
2. Install dependencies
3. Run Prisma generate/migrate
4. Start dev server

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## Deployment (Vercel-ready baseline)

- Set all required environment variables from `.env.example` in Vercel project settings (including `RESEND_API_KEY` and `ALERT_EMAIL_TO` for incident alerts).
- Ensure PostgreSQL is reachable from Vercel runtime.
- Configure Stripe webhook endpoint to `/api/billing/webhook` with `STRIPE_WEBHOOK_SECRET`.
- Run Prisma migrations during deployment lifecycle before first production traffic.
