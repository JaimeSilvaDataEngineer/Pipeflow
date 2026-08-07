# PipeFlow CRM

CRM multi-tenant para pequenas e médias equipes de vendas — gestão de leads, pipeline Kanban, timeline de atividades e billing por assinatura.

Requisitos completos: [Docs/PRD.md](Docs/PRD.md). Plano de execução por milestones: [Docs/PLAN.md](Docs/PLAN.md). Convenções e stack: [CLAUDE.md](CLAUDE.md).

## Stack

Next.js 14 (App Router) · TypeScript 5 (strict) · Tailwind CSS 4 · shadcn/ui · Supabase (DB/Auth) · Stripe · Resend · @dnd-kit · Recharts.

## Getting Started

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Copie `.env.example` para `.env.local` e preencha as chaves de Supabase, Stripe e Resend antes de usar as features que dependem de backend (a partir da M6).

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build         # build de produção
npm run start          # servidor de produção (após build)
npm run lint            # ESLint
npm run typecheck        # checagem de tipos (tsc --noEmit)
npm run format             # formata com Prettier
npm run format:check        # verifica formatação sem escrever
```

## Estrutura de pastas

```
src/
  app/            # rotas (App Router): (marketing), (auth), (dashboard)/[workspace], api
  components/     # ui (shadcn), kanban, leads, dashboard
  lib/            # supabase, stripe, resend, validations, constants
  types/          # tipos compartilhados
supabase/
  migrations/     # SQL migrations e políticas RLS
  functions/      # Edge Functions
```

Veja a árvore completa em [CLAUDE.md](CLAUDE.md#folder-structure).
