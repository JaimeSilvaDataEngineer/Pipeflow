# Relatório de Prompts — Branch `feat/leads-data`

**Data:** 2026-08-26
**Branch:** `feat/leads-data`
**Contexto:** Aula 3.4 — Leads & Pipeline com dados reais (M8 + M9 do [PLAN.md](../PLAN.md))

Este documento registra, em ordem cronológica, os prompts executados nesta sessão com o Claude Code, o que cada um pediu e o resultado obtido. Serve como histórico de decisões e como referência para auditoria do que foi (e não foi) feito por IA no projeto.

---

## 1. Validação do estado da autenticação

**Prompt:** pedido de validação se auth real, login/registro, proteção de rotas, onboarding, workspace switcher e conexão com Supabase estavam de fato funcionando (não apenas presentes no código).

**O que foi feito:** leitura de `middleware.ts`, `lib/supabase/middleware.ts`, `auth/confirm/route.ts`, `lib/supabase/workspaces.ts`, `onboarding/actions.ts`, `[workspace]/layout.tsx`, `workspace-switcher.tsx` e `(auth)/actions.ts`.

**Resultado:**
- ✅ Auth, proteção de rotas, onboarding e workspace switcher confirmados como reais e funcionais.
- ⚠️ Achado importante: **leads, pipeline e dashboard ainda usavam dados mock** (`lib/mock/*`), apesar da camada de auth/multi-tenancy já ser real. Esse achado motivou o trabalho das próximas etapas.

---

## 2. Criação da branch e plano de implementação

**Prompt:** leitura do `CLAUDE.md` e do `PLAN.md`, criação da branch `feat/leads-data` e descrição do que seria implementado (aula 3.4 = M8 Leads Backend + M9 Pipeline Backend do plano).

**O que foi feito:**
- Branch `feat/leads-data` criada a partir de `main` (preservando mudanças não commitadas de M7 já existentes no working tree).
- Plano detalhado apresentado: Server Actions de leads e deals, páginas passando a buscar dados reais, remoção dos mocks, teste manual de isolamento por RLS.

**Resultado:** branch criada, plano aprovado implicitamente pelo prompt seguinte.

---

## 3. Implementação: substituir todos os dados fake por dados reais

**Prompt:** "Substitua todos os dados fake por dados reais conforme o PLAN.md. Leads e deals com Server Actions salvando no Supabase. Dashboard com métricas do banco. Filtros e busca funcionando no banco. Drag-and-drop persiste a posição."

**O que foi feito** (lista completa de arquivos):

| Categoria | Arquivos |
|---|---|
| Migration nova | `supabase/migrations/20260826110000_profiles.sql` — tabela `profiles` espelhando `auth.users`, policies de RLS, trigger `on_auth_user_created` |
| Tipos | `types/supabase.ts` (tabela `profiles`), `types/lead.ts` e `types/deal.ts` (campos nullable alinhados ao schema real) |
| Camada de dados | `lib/supabase/members.ts`, `lib/supabase/leads.ts`, `lib/supabase/deals.ts`, `lib/supabase/dashboard.ts` |
| Server Actions | `app/(dashboard)/[workspace]/leads/actions.ts`, `app/(dashboard)/[workspace]/pipeline/actions.ts` |
| Páginas (Server Components) | `leads/page.tsx`, `leads/[id]/page.tsx`, `pipeline/page.tsx`, `dashboard/page.tsx` — todas passaram a buscar dados reais via Supabase, resolvendo o workspace pelo slug e confiando em RLS para isolamento |
| Componentes refatorados | `leads-explorer.tsx`, `leads-table.tsx`, `leads-toolbar.tsx`, `lead-form.tsx`, `lead-form-sheet.tsx`, `lead-detail.tsx`, `member-avatar.tsx`, `pipeline-board.tsx`, `pipeline-column.tsx`, `deal-card.tsx`, `deal-form.tsx`, `deal-form-dialog.tsx`, `funnel-chart.tsx`, `upcoming-deals-table.tsx` — `MOCK_MEMBERS`/`MOCK_LEADS` substituídos por props reais vindas do banco |
| Mocks removidos | `lib/mock/leads.ts`, `lib/mock/deals.ts`, `lib/mock/dashboard.ts`, `lib/mock/members.ts`, `lib/mock/delay.ts` |

**Decisão técnica relevante:** o schema original não tinha como expor nome/e-mail dos membros do workspace para os seletores de "responsável" (a coluna `assigned_to` referencia `auth.users`, que não é consultável via API). Foi necessário criar a tabela `profiles` — decisão tomada durante a implementação e comunicada ao usuário como uma migration adicional.

**Resultado:** `npm run lint` e `npm run typecheck` limpos após a implementação.

---

## 4. Aplicação da migration — pedido de execução

**Prompt:** "você consegue fazer a migração? O que preciso fazer para corrigir isso?"

**Resposta:** Claude não tem acesso a uma conexão Postgres direta nem à CLI do Supabase autenticada neste ambiente (sem `SUPABASE_ACCESS_TOKEN`, sem senha do banco). Foram apresentadas duas opções ao usuário:
- **Opção A** (recomendada): colar o SQL da migration diretamente no SQL Editor do Supabase Studio — não exige compartilhar nenhuma credencial.
- **Opção B**: autenticar a CLI do Supabase localmente (`supabase link` + `supabase db push`) usando um Personal Access Token e a senha do banco, gerados e usados apenas pelo usuário, fora do chat.

---

## 5. Tentativa de fornecer credenciais via `.env.local`

**Prompt:** usuário abriu o `.env.local` no editor e apontou "as credenciais do Supabase estão aqui".

**Resposta:** esclarecido que `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` são tokens de API REST/Auth (PostgREST) — nenhum dos dois abre conexão Postgres direta, que é o que DDL (`CREATE TABLE`, `CREATE TRIGGER`) exige. Reforçada a recomendação pela Opção A (SQL Editor), sem necessidade de repassar segredos.

---

## 6. Incidente de segurança: vazamento de credencial no chat

**Prompt:** usuário colou um token no formato `github_pat_...` tentando usá-lo como `SUPABASE_ACCESS_TOKEN` via `export` (sintaxe Bash, incompatível com o PowerShell que estava usando), resultando em erro de comando.

**Resposta e ação:**
1. Identificado que o token colado era um **Personal Access Token do GitHub**, não do Supabase (formato incorreto, `sbp_...` seria o esperado) — não funcionaria para o propósito pretendido de qualquer forma.
2. **Alerta de segurança:** o token foi exposto em texto puro no chat e deveria ser tratado como comprometido — recomendação explícita de revogação imediata em `github.com/settings/tokens`, independentemente do escopo.
3. Fornecida a sintaxe correta do PowerShell (`$env:SUPABASE_ACCESS_TOKEN = "..."`) para referência futura, reforçando a Opção A como caminho mais seguro.

> Este token **não é reproduzido neste relatório** — segredos comprometidos não devem ser registrados em documentação persistente do projeto.

---

## 7. Verificação de que a migration foi aplicada

**Prompt:** "verifique se a Ação pendente sua: aplicar a migration foi resolvida"

**O que foi feito:** verificação externa via API REST do Supabase (PostgREST), usando a chave anônima, sem expor segredos no terminal — uma consulta a `profiles` e `workspace_members` retornando **HTTP 200** confirma que a tabela existe no schema (se não existisse, o PostgREST retornaria 404 com o erro `PGRST205`).

**Resultado:** ✅ migration confirmada como aplicada pelo usuário via SQL Editor.

---

## 8. Revisão de código e testes de integração

**Prompt:** "Revise o que você criou. Teste: criar lead e verificar que persiste após reload. Arrastar deal e confirmar no Supabase Studio. Conferir que o dashboard reflete dados reais e que filtros funcionam no banco."

**O que foi feito:**

1. **Revisão de código** (skill `code-review`, nível médio) sobre o diff da branch. Encontrados e corrigidos:
   - 🐞 Bug real: busca de leads quebrava com parênteses/vírgula no termo pesquisado (string interpolada sem escaping no filtro `.or()` do PostgREST) — corrigido com escaping + quoting.
   - 🐞 Bug real: `_` (underscore) não era escapado como wildcard do ILIKE, causando falsos positivos na busca — corrigido junto.
   - ⚡ Performance: dashboard buscava a tabela inteira de leads só para exibir o nome da empresa de até 5 negócios — trocado por busca pontual (`getLeadsByIds`).
   - `typecheck` e `lint` confirmados limpos após as correções.

2. **Teste de integração real** contra o Supabase (sessão autenticada de verdade, exercitando as mesmas queries dos Server Actions/Server Components, com RLS ativa):

   | Teste | Resultado |
   |---|---|
   | Criar lead | ✅ persiste |
   | Lead sobrevive a reload (re-fetch do zero) | ✅ |
   | Criar deal | ✅ persiste |
   | Mover deal de etapa (`moveDealStage`) | ✅ confirmado por re-query |
   | Dashboard: contagem de leads bate com o banco | ✅ |
   | Dashboard: negócio movido aparece em "abertos" | ✅ |
   | Busca com termo correspondente | ✅ encontra via query real |
   | Busca com termo não correspondente | ✅ exclui via query real |
   | Regressão do bug de parênteses | ✅ corrigida |
   | Filtro de status via query | ✅ |

   Todos os 13 checks passaram.

**Limitações reportadas com transparência:**
- Não havia ferramenta de automação de navegador disponível no ambiente (`chromium-cli`, Playwright e Puppeteer ausentes) — não foi possível literalmente clicar/arrastar um card e capturar screenshot. O teste de persistência foi feito diretamente contra o Supabase, usando os mesmos caminhos de código que a UI usa.
- O rate limit de e-mail do Supabase (free tier) já havia sido atingido em testes anteriores, então o usuário de teste foi confirmado via Admin API (service role) em vez do fluxo real de e-mail — reportado explicitamente, sem disfarçar como teste do fluxo de confirmação por e-mail.
- Script de teste temporário e servidor de desenvolvimento foram encerrados/limpos ao final.

---

## 9. Este relatório

**Prompt:** "monte um relatório de todos os prompts executados no projeto... coloque dentro da pasta docs\prompts\"

**Resultado:** este arquivo, criado em `Docs/prompts/2026-08-26-feat-leads-data.md`.

---

## Resumo do estado final da branch

- Leads, deals, dashboard e busca/filtros conectados ao Supabase real — nenhum dado mock restante nessas telas.
- Tabela `profiles` adicionada para suportar nomes de responsáveis (não previsto originalmente no schema do M6b).
- 2 bugs de busca + 1 problema de performance encontrados em revisão e corrigidos antes da entrega.
- Testado end-to-end contra o banco real (13/13 checks), com as limitações do ambiente reportadas explicitamente.
- 1 incidente de segurança (token do GitHub exposto no chat) registrado e com revogação recomendada ao usuário.
