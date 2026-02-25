# CLAUDE.md — SafeSite (SafetyComplianceSaaS)

## Project Overview

A SaaS platform that helps small-to-mid US construction subcontractors (5-50 employees) stay OSHA-compliant. Built with Next.js 15 App Router, TypeScript strict, PostgreSQL + Prisma, deployed as a single app.

**Core value prop:** "You're a framing crew / electrician / concrete sub with 5–50 guys. You don't have a safety department. OSHA can still fine you $16,550 per serious violation. This tool keeps you covered."

**Product Name:** SafeSite

## Target Customer

Small-to-mid subcontractors in US construction. Electricians, framers, concrete crews, plumbing/HVAC subs. 5–50 employees. The owner or foreman handles safety "on the side." They currently use paper checklists, Excel, or nothing. They don't have budget or patience for enterprise platforms like Procore or SafetyCulture.

**Key insight:** These people are on job sites, not in offices. Mobile-first is not optional. They speak plain English, not compliance jargon. They're motivated by fear of fines and shutdowns, not by "optimizing safety culture."

## Conversion Strategy

- Free tier: unlimited checklists, 1 site, basic incident logging
- Paid tiers: AI photo analysis, multiple sites, PDF reports, email alerts, team accounts
- CTA: Direct sign-up, no demo calls, no waitlist. These people won't book a sales call.

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
- **AI:** OpenAI SDK (vision + chat) — abstracted so we can swap to Anthropic later
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

### Error handling
- AI calls: always have a fallback response when API key is missing
- Stripe: verify webhook signatures, handle missing env gracefully

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

## Design Direction

### What We're Going For

Think "field tool that a foreman trusts" — not "developer dashboard" and not "corporate safety portal." The design should feel:

- **Utilitarian and direct.** Like a well-designed hard hat, not a fashion accessory.
- **High contrast, high readability.** These screens will be viewed on phones in direct sunlight on a job site.
- **Construction-contextual.** The landing page should immediately communicate "this is about construction sites, real hazards, real money."
- **Urgent but not alarmist.** OSHA fines are serious. The tone is "we help you handle this" not "PANIC."

### What We're NOT Going For

- Generic SaaS dark theme with three feature cards in a grid
- Developer-tool aesthetic (no "void", no "dream" color names, no glassmorphism blur cards)
- Enterprise compliance portal look (no stock photos of people in hard hats shaking hands)
- Any AI-slop landing page patterns (gradient orbs, "powered by AI" badges, abstract illustrations)

### Color System

```
Background:        --bg-primary: #0F1419 (near-black, like asphalt)
Surface:           --bg-surface: #1A1F26 (dark steel)
Elevated:          --bg-elevated: #242B35 (with real visible contrast from surface)

Text:              --text-primary: #F0F2F5
                   --text-secondary: #9BA3AF
                   --text-muted: #5D6676

Safety Yellow:     --accent-warning: #F59E0B (OSHA signage yellow — primary action color)
Danger Red:        --accent-danger: #EF4444 (violations, critical alerts)
Safe Green:        --accent-success: #22C55E (compliant, resolved)
Info Blue:         --accent-info: #3B82F6 (neutral info, links)

Border:            --border: #2D3748
```

The **primary accent for CTAs and branding is Safety Yellow** (#F59E0B). This is the color of OSHA signage, hard hats, caution tape.

### Typography

- Headings: **"Plus Jakarta Sans"** (bold weights) or **"Outfit"** — geometric, modern, but not soft.
- Body: Clean sans-serif. "Inter" is fine for body text (just not for headings).
- Data/numbers: JetBrains Mono — works well for stats and penalty amounts.

### Landing Page Structure

The landing page needs to do ONE thing: make a subcontractor think "I need this" within 5 seconds.

**Section 1 — Hero**
- Headline: Something like "Stop hoping OSHA doesn't show up." or "Your $16,550 problem has a $29/month solution."
- Subline: One sentence. What it does, who it's for.
- CTA: "Start Free" — sign up, no credit card.
- Right side or background: NOT a stock photo. Consider a stylized construction site visual, or just raw penalty numbers displayed prominently.

**Section 2 — The Problem (Fear/Pain)**
- "Last year OSHA issued X citations in construction. Average penalty: $X. Most common violations: [list top 5 from OSHA data]."
- This section sells through real numbers, not feature descriptions.
- Maybe show the OSHA "Fatal Four" (falls, struck-by, electrocution, caught-in).

**Section 3 — How It Works (3 steps, not 3 features)**
- Step 1: "Run a jobsite checklist in 5 minutes" (show phone mockup)
- Step 2: "Snap a photo, get instant risk assessment" (AI differentiator)
- Step 3: "Download your compliance report before the inspector arrives"

**Section 4 — Pricing**
- Simple two-column: Free vs Pro (maybe add Team later)
- Show what's gated clearly

**Section 5 — Footer with CTA repeat**

### Dashboard/App Design Notes

- Sidebar: Keep it, but simplify. Icons + labels, no nested menus.
- Mobile: The dashboard should work on a phone. A foreman will check this between tasks.
- Cards: Higher contrast between bg levels. Current surface/elevated difference is invisible.
- Data display: Big numbers, clear labels. Think "truck dashboard" not "analytics platform."

## Design Constraints

- **Dark theme only** — no light mode toggle
- **Mobile-first** — foremen use phones on job sites
- **English only** — target market is US construction
- **High contrast** — screens viewed in direct sunlight

## Technical Priorities (Ordered)

### Priority 1: Photo Upload + AI Vision Analysis
This is the ONE feature that could differentiate from "just another checklist app."

- Implement real file upload (not a URL text field). Use presigned uploads to S3/R2/Vercel Blob.
- Send photos to a vision model (GPT-4o or Claude) with a detailed OSHA-specific system prompt.
- The prompt should reference actual OSHA standards (29 CFR 1926 subparts) and identify specific violations.
- Return structured output: violation type, relevant OSHA standard, severity, recommended action.
- Display results clearly on the incident detail page.

### Priority 2: Landing Page Rebuild
- Rebuild `src/app/page.tsx` from scratch following the design direction above.
- All English. No German.
- Mobile-responsive.
- Real OSHA data/statistics (can be hardcoded from public OSHA data).

### Priority 3: OSHA Knowledge Base
- Replace the 2 dummy checklist templates with real ones based on OSHA's top 10 most-cited standards.
- Structure: each template maps to a specific 29 CFR 1926 subpart.
- Include at minimum: Fall Protection (1926.501), Scaffolding (1926.451), Ladders (1926.1053), Electrical (1926.405), Head Protection (1926.100), Hazard Communication (1926.59).
- The AI compliance chat should have context from these standards (RAG or system prompt enrichment).

### Priority 4: Multi-tenancy / Teams
- Move subscription from User to Company level.
- Add invite flow: owner invites team members by email.
- Team members inherit the company's subscription tier.
- Roles stay as-is: ADMIN (company owner) and SITE_MANAGER.

### Priority 5: English-only cleanup
- Remove ALL German text from the entire codebase.
- UI labels, error messages, placeholder text, comments — everything English.

### Priority 6: Mobile optimization
- Test and fix all pages for mobile viewport.
- Incident form especially — this will be used on phones on job sites.
- Consider bottom nav on mobile instead of sidebar.

## Do NOT

- Add features outside the priority list above
- Change the auth system — it works
- Add dark/light mode toggle
- Add German text anywhere
- Over-engineer (no microservices, GraphQL, event sourcing)
- Add generic placeholder content or AI-slop patterns
- Skip Zod validation on API inputs
- Create generic placeholder content ("Lorem ipsum", "Feature 1", "Coming soon")
- Use AI-generated stock illustrations or abstract SVG backgrounds
- Add a blog, testimonials section, or "trusted by" logos (we have no customers yet)
- Add analytics/tracking scripts yet
