# CLAUDE.md — SafeSite (SafetyComplianceSaaS)

## Project Overview

SaaS platform helping US construction subcontractors (5-50 employees) stay OSHA-compliant. Built with Next.js 15 App Router, TypeScript strict, PostgreSQL + Prisma, deployed as a single app.

## Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build — must pass before pushing
npm run lint             # ESLint — must pass before pushing
npm run prisma:generate  # Regenerate Prisma client after schema changes
npm run prisma:migrate   # Run DB migrations (dev mode)
```

**Always run `npm run lint` and `npm run build` to verify changes.**

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS with custom design tokens in `src/app/globals.css`
- **Database:** PostgreSQL + Prisma ORM (`prisma/schema.prisma`)
- **Auth:** NextAuth v5 (JWT strategy, Google OAuth + credentials)
- **Validation:** Zod on all API inputs
- **AI:** OpenAI SDK (vision + chat)
- **Payments:** Stripe (checkout + webhooks)
- **Email:** Resend
- **PDF:** pdf-lib
- **Charts:** Recharts
- **UI:** shadcn-style components, Lucide icons

## Project Structure

```
src/
  app/
    (app)/dashboard/     # Authenticated app pages (checklists, incidents, ai-chat, billing)
    admin/               # Admin panel (ADMIN role only)
    api/                 # API routes: api/[resource]/route.ts
    login/, register/    # Public auth pages
    onboarding/          # Post-registration company setup
    page.tsx             # Public landing page
    globals.css          # Tailwind + design tokens (CSS variables)
  components/
    ui/                  # Low-level primitives (button, input, card, etc.)
    forms/               # Domain form components
    dashboard/           # Charts, metrics
    layout/              # Header, Sidebar
    admin/, billing/     # Domain-specific components
  lib/
    auth.ts              # NextAuth config
    prisma.ts            # Prisma client singleton
    auth-context.ts      # getCurrentUserContext() — use in all API routes
    auth-schema.ts       # Zod schemas for auth
    password.ts          # Password hashing (Node crypto.scrypt)
    billing/             # Stripe helpers + plan definitions
    reports/             # PDF generation
    notifications/       # Email alerts
    osha/                # Default checklist templates
  types/
    next-auth.d.ts       # NextAuth session/JWT type extensions
  middleware.ts          # Route protection
prisma/
  schema.prisma          # Database schema
```

## Key Patterns

### Auth in API routes
Always use `getCurrentUserContext()` from `src/lib/auth-context.ts`. Never trust JWT claims alone for company scoping — always verify against DB.

```ts
const ctx = await getCurrentUserContext();
if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// ctx.userId, ctx.companyId, ctx.role are verified
```

### API error responses
Return `{ error: string }` with appropriate HTTP status codes.

### Client components
Must have `"use client"` directive at top of file.

### File naming
- API routes: `src/app/api/[resource]/route.ts`
- Pages: `src/app/(app)/dashboard/[section]/page.tsx`
- Components: `src/components/[domain]/[ComponentName].tsx`
- Shared logic: `src/lib/[domain]/[module].ts`

### Path alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

## Database Models

Key models in `prisma/schema.prisma`: User, Company, Site, Checklist, Audit, Incident, ComplianceChatMessage, AdminContent. Multi-tenant: most models scoped to Company.

Roles: `ADMIN` (company owner) and `SITE_MANAGER`.

After schema changes, run: `npm run prisma:generate && npm run prisma:migrate`

## Design Constraints

- **Dark theme only** — no light mode toggle
- **Mobile-first** — foremen use phones on job sites
- **English only** — target market is US construction
- **High contrast** — screens viewed in direct sunlight
- Color system: Safety Yellow (#F59E0B) as primary accent, Danger Red (#EF4444), Safe Green (#22C55E), Info Blue (#3B82F6)

## Do NOT

- Add features outside the defined priority list (see `Claude.md` for priorities)
- Change the auth system — it works
- Add dark/light mode toggle
- Add German text anywhere
- Over-engineer (no microservices, GraphQL, event sourcing)
- Add generic placeholder content or AI-slop patterns
- Skip Zod validation on API inputs
