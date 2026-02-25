# CLAUDE.md — SafetyComplianceSaaS

## What This Is

A SaaS platform that helps small-to-mid US construction subcontractors stay OSHA-compliant. The core value prop: "You're a framing crew / electrician / concrete sub with 5–50 guys. You don't have a safety department. OSHA can still fine you $16,550 per serious violation. This tool keeps you covered."

## Target Customer

**Small-to-mid subcontractors in US construction.** Electricians, framers, concrete crews, plumbing/HVAC subs. 5–50 employees. The owner or foreman handles safety "on the side." They currently use paper checklists, Excel, or nothing. They Google "OSHA checklist construction" when an inspection is coming. They don't have budget or patience for enterprise platforms like Procore or SafetyCulture.

**Key insight:** These people are on job sites, not in offices. Mobile-first is not optional. They speak plain English, not compliance jargon. They're motivated by fear of fines and shutdowns, not by "optimizing safety culture."

## Product Name

**SafeSite** (working name — cleaner than "SafetyComplianceSaaS")

## Conversion Strategy

- Free tier: unlimited checklists, 1 site, basic incident logging
- Paid tiers: AI photo analysis, multiple sites, PDF reports, email alerts, team accounts
- CTA: Direct sign-up, no demo calls, no waitlist. These people won't book a sales call.

## Language

**Everything in English.** The entire UI, landing page, all copy, all OSHA references. Zero German. The target market is US construction.

---

## Design Direction

### What We're Going For

Think "field tool that a foreman trusts" — not "developer dashboard" and not "corporate safety portal." The design should feel:

- **Utilitarian and direct.** Like a well-designed hard hat, not a fashion accessory.
- **High contrast, high readability.** These screens will be viewed on phones in direct sunlight on a job site.
- **Construction-contextual.** The landing page should immediately communicate "this is about construction sites, real hazards, real money."
- **Urgent but not alarmist.** OSHA fines are serious. The tone is "we help you handle this" not "PANIC."

### What We're NOT Going For

- Generic SaaS dark theme with three feature cards in a grid (this is what we have now — kill it)
- Developer-tool aesthetic (no "void", no "dream" color names, no glassmorphism blur cards)
- Enterprise compliance portal look (no stock photos of people in hard hats shaking hands)
- Any AI-slop landing page patterns (gradient orbs, "powered by AI" badges, abstract illustrations)

### Color System (Revised)

Replace the current abstract color tokens. Use names that map to construction/safety semantics:

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

The **primary accent for CTAs and branding is Safety Yellow** (#F59E0B). This is the color of OSHA signage, hard hats, caution tape. It's immediately recognizable to anyone in construction and it pops against the dark background.

### Typography

- Headings: Something with weight and presence. Not Inter. Try **"Plus Jakarta Sans"** (bold weights) or **"Outfit"** — geometric, modern, but not soft.
- Body: Clean sans-serif. "Inter" is fine for body text (just not for headings).
- Data/numbers: Keep JetBrains Mono — it works well for stats and penalty amounts.

### Landing Page Structure

The landing page needs to do ONE thing: make a subcontractor think "I need this" within 5 seconds.

**Section 1 — Hero**
- Headline: Something like "Stop hoping OSHA doesn't show up." or "Your $16,550 problem has a $29/month solution."
- Subline: One sentence. What it does, who it's for.
- CTA: "Start Free" — sign up, no credit card.
- Right side or background: NOT a stock photo. Consider a stylized construction site visual, or just raw penalty numbers displayed prominently. The penalty amounts ARE the visual.

**Section 2 — The Problem (Fear/Pain)**
- "Last year OSHA issued X citations in construction. Average penalty: $X. Most common violations: [list top 5 from OSHA data]."
- This section sells through real numbers, not feature descriptions.
- Maybe show the OSHA "Fatal Four" (falls, struck-by, electrocution, caught-in) — these are the hazards every sub knows.

**Section 3 — How It Works (3 steps, not 3 features)**
- Step 1: "Run a jobsite checklist in 5 minutes" (show phone mockup)
- Step 2: "Snap a photo, get instant risk assessment" (this is the AI differentiator)
- Step 3: "Download your compliance report before the inspector arrives"
- This is about workflow, not features.

**Section 4 — Pricing**
- Simple two-column: Free vs Pro (maybe add Team later)
- Show what's gated clearly

**Section 5 — Footer with CTA repeat**

### Dashboard/App Design Notes

- Sidebar: Keep it, but simplify. Icons + labels, no nested menus.
- Mobile: The dashboard should work on a phone. A foreman will check this between tasks.
- Cards: Higher contrast between bg levels. Current surface/elevated difference is invisible.
- Data display: Big numbers, clear labels. Think "truck dashboard" not "analytics platform."

---

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

---

## Code Conventions

- **Framework:** Next.js 15 App Router, TypeScript strict
- **Styling:** Tailwind CSS with custom design tokens (see color system above)
- **Database:** Prisma + PostgreSQL
- **Auth:** NextAuth v5 (JWT strategy)
- **Validation:** Zod on all API inputs
- **AI:** OpenAI SDK (but abstract so we can swap to Anthropic later)
- **Payments:** Stripe (checkout + webhooks)
- **Email:** Resend
- **PDF:** pdf-lib

### File Structure Patterns
- API routes: `src/app/api/[resource]/route.ts`
- Pages: `src/app/(app)/dashboard/[section]/page.tsx`
- Components: `src/components/[domain]/[component].tsx`
- Shared logic: `src/lib/[domain]/[module].ts`
- Client components must have `"use client"` directive

### Auth Pattern
Always use `getCurrentUserContext()` from `src/lib/auth-context.ts` in API routes. Never trust JWT claims alone for company scoping — always verify against DB.

### Error Handling
- API routes: return `{ error: string }` with appropriate HTTP status
- AI calls: always have a fallback response when API key is missing
- Stripe: verify webhook signatures, handle missing env gracefully

---

## What NOT To Do

- Don't add features that aren't in the priority list above
- Don't create generic placeholder content ("Lorem ipsum", "Feature 1", "Coming soon")
- Don't use AI-generated stock illustrations or abstract SVG backgrounds
- Don't add a blog, testimonials section, or "trusted by" logos (we have no customers yet)
- Don't over-engineer (no microservices, no event sourcing, no GraphQL)
- Don't add analytics/tracking scripts yet
- Don't change the auth system — it works, leave it alone
- Don't add dark/light mode toggle — dark only
