# SafetyComplianceSaaS

Production-ready SaaS scaffolding for construction site managers to reduce OSHA violations.

## Phase 0 delivered

- Next.js 15 + TypeScript + Tailwind setup (App Router)
- Prisma schema with core domain models
- NextAuth v5 scaffold (Google + Credentials)
- SEO baseline (`metadataBase`, robots, sitemap)
- Dashboard shell with OSHA penalty defaults:
  - Serious: **$16,550**
  - Repeat/Willful: **$165,514**

## Local setup

1. Copy `.env.example` to `.env`
2. Install dependencies
3. Run Prisma generate/migrate
4. Start dev server

```bash
npm install
npm run prisma:generate
npm run dev
```
