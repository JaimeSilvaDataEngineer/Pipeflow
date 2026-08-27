# Relatório de Prompts — Histórico Completo do Projeto

**Projeto:** PipeFlow CRM
**Período coberto:** 2026-08-03 (commit inicial) até 2026-08-26
**Referência:** [CLAUDE.md](../../CLAUDE.md) · [PLAN.md](../PLAN.md)

## Nota importante sobre este documento

Este relatório tem duas partes com níveis de precisão diferentes, e é importante não confundi-las:

- **Parte 1 — M0 a M7 (reconstruído do histórico do Git):** essas milestones foram executadas em sessões de chat anteriores a esta, das quais não há transcript acessível. O que está descrito aqui foi **reconstruído a partir das mensagens de commit e do `PLAN.md`** — é um resumo fiel do que foi entregue em cada etapa, mas **não é o texto literal dos prompts** usados para chegar lá.
- **Parte 2 — M8/M9, branch `feat/leads-data` (log real de prompts):** esta é a sessão atual. Aqui sim há registro exato de cada prompt do usuário, na ordem em que foram executados. Ver [2026-08-26-feat-leads-data.md](./2026-08-26-feat-leads-data.md) para o detalhamento completo.

---

## Parte 1 — M0 a M7 (reconstruído do histórico do Git)

| Data | Milestone | Commit(s) | O que foi entregue |
|---|---|---|---|
| 2026-08-03 | — | `ac34ce4` | Commit inicial do repositório |
| 2026-08-07 | **M0 — Setup** | `98ce46f` | Scaffold do Next.js 14 (App Router) + TypeScript strict + Tailwind + shadcn/ui, estrutura de pastas, `formatCurrency`/`cn`/constantes de pipeline, ESLint/Prettier/`typecheck` |
| 2026-08-11 | — | `d9a3b90` | `PLAN.md` atualizado marcando M0 como concluída |
| 2026-08-15 | **M1 — App Shell** | `107f1cc`, `38a4e48` | Layout do dashboard, sidebar, navegação, header com workspace switcher (mock), rotas placeholder, correção de bug de ref/dropdown |
| 2026-08-18 | — | `ebe9636`, `cdb8207` | M1 marcada como concluída e mesclada na `main` |
| 2026-08-18 | **M2 — Leads UI (mock)** | `e056227`, `1bdefff` | Listagem de leads, busca/filtros client-side, formulário de criação/edição, página de detalhe — tudo com dados mock |
| 2026-08-19 | **M3 — Auth & Onboarding UI** *(inserida no plano)* | `62949a4`, `bac3561`, `0460e42` | Formulários de login/signup/onboarding com validação (ainda sem integração real); `PLAN.md` renumerado para acomodar essa milestone nova |
| 2026-08-19 | — | `3b4d05c`, `a9fd1d4` | Correção: edição de lead na página de detalhe estava sendo um no-op |
| 2026-08-19 | **M3(pipeline) — Kanban UI (mock)** | `0d6357d` | Board Kanban com `@dnd-kit`, 6 colunas por etapa, drag-and-drop local, dialog de criação/edição de negócio — dados mock |
| 2026-08-20 | — | `994f370` | Plano dividido: M4a (dashboard) e M4b (atividades) |
| 2026-08-21 | **M4a — Dashboard UI (mock)** | `8c1b2ad` | Metric cards, gráfico de funil (Recharts), tabela de negócios com prazo próximo — dados mock |
| 2026-08-21 | — | `ff267eb` | Plano dividido: M5a (landing) e M5b (settings/billing) |
| 2026-08-21 | **M5a — Landing Page** | `a75b854`, `7b1f0b1` | Página pública de marketing (hero, features, pricing, CTA), depois ajuste de responsividade mobile |
| 2026-08-21 | — | `fffc60f`, `0985804`, `3e5c4e0` | Merge das PRs de pipeline, dashboard e landing na `main` |
| 2026-08-21 | — | `cf40efa` | Plano dividido: M6a (setup Supabase) e M6b (schema/RLS) |
| 2026-08-24 | **M6a — Setup Supabase** | `38834d6`, `9fd6da9` | Projeto Supabase provisionado, `@supabase/supabase-js`/`@supabase/ssr` instalados, helpers `createClient` (browser + server) |
| 2026-08-25 | **M6b/M7 — Schema, RLS e Auth real** | `5435c00`, `feb2167` | Migrations (`workspaces`, `workspace_members`, `leads`, `deals`, `activities`, `subscriptions`), políticas RLS, e substituição do auth mock por Supabase Auth real com criação de workspace no onboarding |

**M4b (Atividades UI)** e **M5b (Settings/Billing UI)** seguem pendentes no `PLAN.md` — nenhum commit encontrado para elas até 2026-08-25.

---

## Parte 2 — Sessão atual: `feat/leads-data` (M8 + M9)

A partir daqui, o registro é **prompt a prompt, na íntegra**, cobrindo:

1. Validação do estado real de autenticação, proteção de rotas e onboarding (que revelou que leads/pipeline/dashboard ainda eram mock)
2. Criação da branch `feat/leads-data` e plano de implementação
3. Implementação completa: leads e deals com Server Actions reais, dashboard com métricas do banco, filtros/busca via query, drag-and-drop persistindo no Supabase
4. Aplicação da migration de `profiles` (com um incidente de segurança registrado — token do GitHub exposto no chat, revogação recomendada)
5. Verificação de que a migration foi aplicada
6. Revisão de código (2 bugs de busca + 1 problema de performance corrigidos) e testes de integração reais contra o Supabase (13/13 checks aprovados)

**Ver o detalhamento completo em:** [2026-08-26-feat-leads-data.md](./2026-08-26-feat-leads-data.md)

---

## Resumo do estado do projeto em 2026-08-26

| Área | Status |
|---|---|
| Auth (login/signup/sessão/logout) | ✅ Real, Supabase |
| Proteção de rotas | ✅ Real, middleware + verificação no server |
| Onboarding / criação de workspace | ✅ Real |
| Workspace switcher | ✅ Real |
| Leads (CRUD, busca, filtros) | ✅ Real, Supabase (esta sessão) |
| Pipeline / Kanban (CRUD, drag-and-drop) | ✅ Real, Supabase (esta sessão) |
| Dashboard (métricas, funil) | ✅ Real, Supabase (esta sessão) |
| Atividades / timeline do lead | ⏳ Pendente (M4b/M10 — ainda mock/placeholder) |
| Settings / membros / billing UI | ⏳ Pendente (M5b) |
| Stripe billing | ⏳ Pendente (M12) |
| Convites por e-mail (Resend) | ⏳ Pendente (M13) |
| Deploy em produção | ⏳ Pendente (M14) |
