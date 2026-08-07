# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PipeFlow CRM — a multi-tenant SaaS CRM for small/medium businesses and sales teams: contact/lead management, a Kanban sales pipeline, activity timelines, per-workspace collaboration, and subscription billing. Full requirements live in [Docs/PRD.md](Docs/PRD.md).

Positioning (per PRD §6): simpler than HubSpot (no marketing automation bloat), freemium alternative to Pipedrive (which has no free plan). The Kanban pipeline is the product's centerpiece and should get the most UX polish.

The project has not been scaffolded yet — no `package.json` or `src/` exists. The first milestone is initializing the Next.js app per the stack below.

## Technology Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript 5 + Tailwind CSS + shadcn/ui
- **Backend/API:** Next.js API Routes / Server Components
- **Database + Auth:** Supabase (PostgreSQL, Row Level Security, Auth)
- **Payments:** Stripe (Checkout + webhooks via Supabase Edge Functions)
- **Transactional email:** Resend
- **Drag-and-drop:** @dnd-kit (Kanban pipeline)
- **Charts:** Recharts (funnel/metrics dashboard)
- **Deploy:** Vercel (frontend) + Supabase (backend/DB)

## Development Commands

Once scaffolded, standard Next.js commands apply:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` (or `tsc --noEmit`) - Type checking
- `npx supabase start` / `npx supabase db push` - Local Supabase / migrations

## Folder Structure

Proposed App Router layout — create it this way when scaffolding:

```
src/
  app/
    (marketing)/            # public landing page (hero, features, pricing, CTA)
    (auth)/                 # login / signup
    (dashboard)/
      [workspace]/
        leads/               # lead/contact list + detail
        pipeline/            # Kanban board
        dashboard/           # metrics, funnel chart
        settings/            # workspace, members, billing
    api/                     # route handlers (webhooks, integrations)
  components/
    ui/                      # shadcn/ui primitives (unmodified generated components)
    kanban/                  # board, column, card
    leads/                   # lead form, list, timeline
    dashboard/               # metric cards, funnel chart
  lib/
    supabase/                # client/server Supabase helpers
    stripe/                  # Checkout + Customer Portal helpers
    resend/                  # transactional email senders
    validations/             # Zod schemas, one per entity (lead, deal, activity, workspace)
  types/                     # shared TS types (mirror Supabase generated types)
supabase/
  migrations/                # SQL migrations, RLS policies
  functions/                 # Edge Functions (Stripe webhook handler)
```

- Route groups `(marketing)` and `(auth)` keep public/unauthenticated routes out of the `[workspace]`-scoped tree.
- Everything under `(dashboard)/[workspace]/` is workspace-scoped by URL param — always resolve and validate `workspace` against the caller's membership before querying.

## Conventions

- **Routes & folders**: kebab-case (`sales-pipeline`, `lead-detail`).
- **Components**: PascalCase filenames matching the exported component (`LeadCard.tsx`, `PipelineBoard.tsx`).
- **Hooks/utils**: camelCase (`useWorkspace.ts`, `formatCurrency.ts`).
- **Database (Supabase/Postgres)**: snake_case table and column names; every workspace-scoped table has a `workspace_id uuid` FK referencing `workspaces.id`, used as the RLS partition key.
- **Data mutations**: prefer Server Actions co-located with the feature for form/board mutations; use `app/api/*` route handlers only for external integrations (Stripe webhooks, third-party APIs).
- **Validation**: every Server Action / API route boundary validates input with a Zod schema from `lib/validations/` before touching Supabase.
- **Money**: store estimated deal values as integers in cents; format with `formatCurrency` at render time — never do float arithmetic on currency.

## Visual Identity / Design System

No final brand kit exists yet; this is the default direction to build against until a designer overrides it.

- **Primary color**: blue (shadcn `blue` scale, e.g. `blue-600` for primary actions/links) — conveys trust/B2B SaaS, differentiates from Pipedrive's green and HubSpot's orange.
- **Neutrals**: shadcn/ui `slate` base palette for backgrounds, borders, and text.
- **Pipeline status colors** (Kanban columns/badges): gray = Novo Lead, blue = Contato Realizado, amber = Proposta Enviada / Negociação, green = Fechado Ganho, red = Fechado Perdido.
- **Typography**: Inter, via `next/font`.
- **Components**: shadcn/ui defaults, `rounded-md`/`rounded-lg` corners, default shadcn spacing scale — don't hand-roll primitives that shadcn already provides (button, dialog, dropdown, table, etc.).
- **Tone**: clean and sales-focused, minimal chrome — avoid HubSpot-style feature sprawl; the Kanban board is the visual centerpiece, styled after Pipedrive's board but simplified.

## Architecture Notes

- **Multi-tenancy**: every table with workspace-scoped data (leads, deals, activities) must enforce isolation via Supabase Row Level Security — never rely on application-level filtering alone.
- **Roles**: two roles per workspace — Admin (full access, billing) and Member (leads/deals only). Enforce in RLS policies, not just UI.
- **Billing**: plan state (Free vs Pro) is the source of truth in Supabase, kept in sync via Stripe webhooks (Edge Function). Don't gate features purely on client-side plan checks.
- **Pipeline stages**: Novo Lead → Contato Realizado → Proposta Enviada → Negociação → Fechado Ganho/Perdido. Drag-and-drop stage changes must persist immediately.

## Code Quality Standards

- TypeScript strict mode; avoid `any`, prefer `unknown` with type guards
- Server Components by default; use Client Components only where interactivity requires it (drag-and-drop, forms)
- Validate all input at API route / Server Action boundaries (Zod recommended)
- Never commit secrets — Supabase, Stripe, and Resend keys belong in `.env.local` (gitignored), not in code

## Process

- Build in milestones per [Docs/PRD.md](Docs/PRD.md) §7: core CRM (leads/contacts) → Kanban pipeline → activities/timeline → dashboard → multi-workspace/RLS → Stripe billing → landing page
- Each milestone should be a working, testable increment before moving to the next
