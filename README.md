# Melhores Práticas de Engenharia AI-First & Antigravity CLI (`agy`)

Este repositório contém uma apresentação completa (em **Português de Portugal**) e cinco diretorias de projetos de exemplo (em **Inglês**) sobre como estruturar, criar e manter projetos de software utilizando inteligência artificial e o **Google Antigravity CLI (`agy`)**.

---

## Estrutura do Repositório

```text
code-along/
├── README.md                          # Este guia geral passo-a-passo (pt-PT)
├── scripts/
│   └── install-antigravity.sh         # Script Bash que instala o agy e configura autenticação por API Key
├── slides/                            # Apresentação sobre Melhores Práticas AI-First (pt-PT)
│   ├── index.html                     # Deck interativo HTML/CSS/JS (zero dependências, notas de orador, ecrã inteiro)
│   └── apresentacao.md                # Deck em Markdown (compatível com Marp / Reveal.js)
└── examples/                          # Projetos de Exemplo AI-Ready (em Inglês)
    ├── 00-project-boilerplate/        # Esqueleto base (Boilerplate) pronto a copiar para iniciar qualquer projeto novo
    ├── 01-starter-template/           # Blueprint minimalista para criar um projeto do zero (Greenfield)
    ├── 02-fullstack-monorepo/         # Monorepo com Regras Hierárquicas, Skills progressivas e Hooks de qualidade
    ├── 03-team-plugin-and-mcp/        # Partilha em equipa: Plugins, Servidor MCP local e skills.json / plugins.json
    └── 04-restaurant-reservation/     # App Full-Stack Funcional (Node.js API + React) de Reserva de Mesas com guia passo-a-passo
```

---

## 1. Como Visualizar os Slides (`slides/`)

Tem duas versões sincronizadas dos slides em **Português de Portugal**:

### Opção A: Apresentação Web Interativa (`slides/index.html`)
Basta abrir o ficheiro [`slides/index.html`](./slides/index.html) em qualquer navegador web moderno:
- **Setas `←` / `→` ou `Espaço`:** Navegar entre slides
- **Tecla `N`:** Mostrar / ocultar a gaveta de **Notas do Orador**
- **Tecla `F`:** Alternar modo de **Ecrã Inteiro**

### Opção B: Apresentação em Markdown / Marp (`slides/apresentacao.md`)
O ficheiro [`slides/apresentacao.md`](./slides/apresentacao.md) está formatado com frontmatter **Marp** e pode ser visualizado diretamente no IDE, convertido em PDF/HTML via Marp CLI (`npx @marp-team/marp-cli slides/apresentacao.md --pdf`), ou lido como documento de referência.

---

## 2. Instruções Detalhadas e O Que Esperar em Cada Exemplo (`examples/`)

Todos os projetos dentro de `examples/` seguem a recomendação de manter ficheiros técnicos (`AGENTS.md`, `SKILL.md`, `hooks.json`, código-fonte e `README.md` de cada exemplo) em **Inglês**. Abaixo encontra o guia passo-a-passo detalhado (e o que esperar em cada etapa) para cada um dos 5 exemplos (`00` a `04`).

---

### Exemplo 00: [`examples/00-project-boilerplate/`](./examples/00-project-boilerplate/)
**Objetivo:** Esqueleto base (*Boilerplate*) agnóstico à linguagem, pronto a copiar (`cp -r examples/00-project-boilerplate <novo-projeto>`) com toda a documentação (`AGENTS.md`, `docs/product-spec.md`, `docs/architecture.md`, `docs/conventions.md`, `docs/adr/`), hooks de segurança e as skills `init-project` e `feature-workflow`.

#### Passo 1: Auditar a estrutura do Boilerplate (`check-boilerplate.sh`)
```bash
cd examples/00-project-boilerplate
./.agents/skills/init-project/scripts/check-boilerplate.sh
```
- **O que esperar:**
  - Verifica todas as diretorias (`docs/`, `docs/adr/`, `.agents/`, `src/`, `tests/`) e ficheiros obrigatórios (`AGENTS.md`, `docs/product-spec.md`, `docs/architecture.md`, `docs/conventions.md`, `.agents/hooks.json`, `.agents/mcp.json`).
  - Deteta que existem `22 '[TODO: ...]' placeholders remaining` e informa como inicializar o projeto com o `agy`.

#### Passo 2: Copiar o Boilerplate e Inicializar um Projeto Novo com o `agy` (`init-project`)
```bash
cp -r examples/00-project-boilerplate /tmp/my-new-project
cd /tmp/my-new-project
agy
```
- **Prompt a introduzir no `agy`:**
  > `"Use the init-project skill to initialize this project as a CLI & library for splitting group travel expenses in Python 3.12 (stdlib only, unittest for tests, integer cents for all currency amounts)."`
- **O que esperar:**
  1. O agente ativa a skill `.agents/skills/init-project/SKILL.md` e executa `check-boilerplate.sh`.
  2. Substitui todos os marcadores `[TODO: ...]` em `AGENTS.md`, `docs/product-spec.md`, `docs/architecture.md` e `docs/adr/0001-initial-architecture-and-stack.md` com as especificações reais do projeto.
  3. Cria o código inicial em `src/` e a suite de testes em `tests/`, executa os testes e volta a correr `check-boilerplate.sh`, confirmando `0 '[TODO: ...]' placeholders remaining!`.

---

### Exemplo 01: [`examples/01-starter-template/`](./examples/01-starter-template/)
**Objetivo:** Estrutura base recomendada para criar um projeto novo (*Greenfield*), demonstrando `AGENTS.md`, `docs/architecture.md`, `ADR`, a skill `project-bootstrap` e um hook de segurança `PreToolUse`.

#### Passo 1: Executar a verificação manual do ambiente e testes
```bash
cd examples/01-starter-template
./.agents/skills/project-bootstrap/scripts/verify-env.sh
```
- **O que esperar:**
  - O script executa 3 fases: `[1/3] Checking Python runtime`, `[2/3] Checking required AI-First documentation files` (confirma a presença de `AGENTS.md`, `docs/architecture.md` e `.agents/hooks.json`) e `[3/3] Running unit test suite`.
  - Os **4 testes unitários** em `tests/test_main.py` passam (`OK`) em menos de 5ms e o script termina com `=== Environment verification PASSED ===`.

#### Passo 2: Testar a skill `project-bootstrap` no `agy`
```bash
cd examples/01-starter-template
agy
```
- **Prompt a introduzir:**
  > `"Run the project-bootstrap skill to verify this workspace and summarize the project architecture."`
- **O que esperar:**
  1. O `agy` carrega automaticamente o `AGENTS.md` na raiz.
  2. Ativa a skill `.agents/skills/project-bootstrap/SKILL.md` por *progressive disclosure*.
  3. O agente lê `docs/architecture.md` e `docs/adr/0001-use-modular-monolith-and-sqlite.md`, executa `./.agents/skills/project-bootstrap/scripts/verify-env.sh`, consulta `references/onboarding-checklist.md` e apresenta um resumo confirmando que o projeto segue uma arquitetura *Modular Monolith* onde todos os valores monetários são representados em **cêntimos inteiros** (`int`) para evitar erros de vírgula flutuante.

#### Passo 3: Implementar uma nova funcionalidade guiada pelo `AGENTS.md`
- **Prompt a introduzir no `agy`:**
  > `"Add a discount calculation helper calculate_discount_cents(subtotal_cents: int, discount_percent: int) -> int in src/main.py and add unit tests in tests/test_main.py."`
- **O que esperar:**
  - Sem precisar de o repetir no prompt, o agente cumpre todas as regras do `AGENTS.md`: utiliza apenas **cêntimos inteiros (`int`)**, levanta `ValueError` para valores negativos ou percentagens fora de `0..100`, adiciona *type annotations* e *docstrings*, usa apenas a biblioteca padrão do Python e executa automaticamente `python3 -m unittest discover -s tests -p "test_*.py" -v` antes de concluir.

#### Passo 4: Testar o Hook Determinístico `PreToolUse` (`pre-tool-safety.sh`)
- **Comando no terminal (ou pedindo ao agente para executar `git reset --hard`):**
  ```bash
  printf '{"tool_name":"Bash","tool_input":{"command":"git reset --hard HEAD~1"}}' \
    | ./.agents/scripts/pre-tool-safety.sh
  ```
- **O que esperar:**
  - O script devolve imediatamente a decisão JSON que bloqueia a execução no `agy`:
    ```json
    {"decision":"deny","reason":"Blocked by workspace safety hook: destructive rm -rf or git reset --hard is not permitted."}
    ```

---

### Exemplo 02: [`examples/02-fullstack-monorepo/`](./examples/02-fullstack-monorepo/)
**Objetivo:** Escalar o desenvolvimento assistido por IA num monorepo multi-serviço (*Brownfield*) com **Regras Hierárquicas** (`AGENTS.md` na raiz, `apps/api/AGENTS.md` e `apps/web/AGENTS.md`), **Skills de fluxo de trabalho** (`db-migration`, `api-endpoint-scaffold`) e **Hooks `PreToolUse` + `PostToolUse`**.

#### Passo 1: Validar manualmente uma migração SQL zero-downtime
```bash
cd examples/02-fullstack-monorepo
./.agents/skills/db-migration/scripts/validate-sql.sh apps/api/migrations/001_create_users.sql
```
- **O que esperar:**
  - O validador analisa o cabeçalho `-- Migration:` e verifica a ausência de instruções destrutivas (`DROP TABLE` sem guarda ou `TRUNCATE`), imprimindo:
    `[PASS] Migration apps/api/migrations/001_create_users.sql passed all static zero-downtime checks.`

#### Passo 2: Criar uma nova migração SQL com o `agy` (`db-migration`)
```bash
cd examples/02-fullstack-monorepo
agy
```
- **Prompt a introduzir:**
  > `"Create a new zero-downtime migration 002_add_projects_table.sql in apps/api/migrations/ for a projects table (id, name, owner_user_id, created_at) and validate it."`
- **O que esperar:**
  1. O agente ativa a skill `db-migration`, lê `examples/001_create_users.sql` e `references/zero-downtime-migrations.md`.
  2. Cria o ficheiro `apps/api/migrations/002_add_projects_table.sql` com cabeçalho `-- Migration: 002_add_projects_table` e DDL idempotente (`CREATE TABLE IF NOT EXISTS projects ...`).
  3. Executa automaticamente `./.agents/skills/db-migration/scripts/validate-sql.sh apps/api/migrations/002_add_projects_table.sql` e confirma `[PASS]`.

#### Passo 3: Criar um Endpoint Full-Stack respeitando o `AGENTS.md` de cada diretoria
- **Prompt a introduzir no `agy`:**
  > `"Add a GET /v1/projects endpoint (list_projects) to apps/api/src/routes.py and add a ProjectSummary interface and renderProjectRow helper in apps/web/src/App.tsx."`
- **O que esperar:**
  1. **Contract-First (`packages/shared/schemas.json`):** Seguindo o `AGENTS.md` da raiz e a skill `api-endpoint-scaffold`, o agente atualiza primeiro `packages/shared/schemas.json` com a definição `"Project"`.
  2. **Regras de Backend (`apps/api/AGENTS.md`) + Hook `PostToolUse`:** Ao editar `apps/api/src/routes.py`, o agente cria `list_projects(request_id: str) -> dict[str, Any]` devolvendo o envelope padronizado `{"data": ..., "meta": {"requestId": request_id, "count": ...}}` com chaves em `camelCase`. Assim que o ficheiro `.py` é guardado, o hook `PostToolUse` (`.agents/scripts/post-edit-check.sh`) corre `python3 -m py_compile` automaticamente.
  3. **Regras de Frontend (`apps/web/AGENTS.md`):** Ao editar `apps/web/src/App.tsx`, aplica as regras de TypeScript/React e cria `ProjectSummary` e `renderProjectRow` com HTML semântico (`<tr data-project-id="...">`).

#### Passo 4: Testar o guarda de segurança SQL (`command-guard.sh`)
```bash
printf '{"tool_name":"run_command","tool_input":{"command":"sqlite3 app.db \"DROP TABLE users;\""}}' \
  | ./.agents/scripts/command-guard.sh
```
- **O que esperar:**
  - Bloqueio imediato com:
    `{"decision":"deny","reason":"Blocked by monorepo safety hook: DROP DATABASE/TABLE and destructive rm -rf commands are prohibited."}`

---

### Exemplo 03: [`examples/03-team-plugin-and-mcp/`](./examples/03-team-plugin-and-mcp/)
**Objetivo:** Partilhar configurações avançadas em equipa usando **Ficheiros Declarativos JSON** (`.agents/skills.json` e `.agents/plugins.json`), um **Plugin Completo** (`platform-engineering-kit`) e um **Servidor MCP Stdio local** em Python (`tools/local-mcp-server/server.py`).

#### Passo 1: Testar o Servidor MCP Stdio diretamente na linha de comandos
```bash
cd examples/03-team-plugin-and-mcp
printf '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n' \
  | python3 tools/local-mcp-server/server.py | python3 -m json.tool
```
- **O que esperar:**
  - O servidor MCP responde via JSON-RPC 2.0 sobre `stdout` listando duas ferramentas (`list_registered_services` e `get_service_metadata`) sem qualquer erro ou dependência externa.

#### Passo 2: Iniciar o `agy` e fazer Triagem de Incidentes com MCP + Skill `incident-triage`
```bash
cd examples/03-team-plugin-and-mcp
agy
```
- **Prompt a introduzir:**
  > `"Run an incident triage for our services, check the metadata of any degraded service via MCP, and generate a triage report."`
- **O que esperar:**
  1. **No arranque da sessão (`SessionStart`):** O plugin `platform-engineering-kit` injeta a mensagem de sistema indicando que as skills `incident-triage` e `release-readiness` estão ativas, e liga-se ao servidor MCP `platform-engineering-kit-registry` (`REGISTRY_ENV=staging`).
  2. **Execução de Diagnóstico (`collect-diagnostics.sh`):** O agente corre `./.agents/plugins/platform-engineering-kit/skills/incident-triage/scripts/collect-diagnostics.sh`, detetando que `checkout-api` está `healthy` (`p95LatencyMs: 42`), mas `inventory-worker` está `degraded` (`p95LatencyMs: 890`, `errorRatePct: 2.40`, *"Database connection pool saturation at 92%"*).
  3. **Consulta MCP (`get_service_metadata`):** O agente invoca a ferramenta MCP `get_service_metadata` para `inventory-worker`, descobrindo que pertence à equipa `supply-chain-team`, `tier-2`, versão `1.8.3`.
  4. **Classificação de Severidade (`severity-matrix.md`):** Como `errorRatePct > 1%` (`2.40%`) e `p95LatencyMs > 500ms` (`890ms`), o agente classifica o incidente como **SEV-2** (SLA de resposta `< 30 min`) e gera um relatório *blameless* conforme exigido em `rules/AGENTS.md`.

#### Passo 3: Avaliar `release-readiness` e `security-audit`
- **Prompts a introduzir no `agy`:**
  > `"Evaluate whether inventory-worker is ready for production deployment using our release-readiness skill."`
  > `"Run a security audit on this repository using our security-audit skill."`
- **O que esperar:**
  - Na avaliação de *Release Readiness*, o agente devolve um **Release Gate Scorecard** com estado **`BLOCKED`** para o `inventory-worker`, pois a taxa de erro (`2.40%`) viola o limite máximo de `< 0.5%` definido em `release-gate-criteria.md`.
  - Na auditoria de segurança, utiliza a skill partilhada `tools/shared-skills/security-audit/SKILL.md` (carregada via `.agents/skills.json`).

---

### Exemplo 04: [`examples/04-restaurant-reservation/`](./examples/04-restaurant-reservation/)
**Objetivo:** Aplicação Full-Stack 100% funcional de **Reserva de Mesas de Restaurante** em **Node.js** (`apps/api`) e **React 19 + Vite** (`apps/web`), acompanhada de guia detalhado de extensão passo-a-passo.

#### Passo 1: Executar a verificação completa Full-Stack (`npm test`)
```bash
cd examples/04-restaurant-reservation
npm test
```
- **O que esperar:**
  1. `[1/3] Checking Node.js backend syntax`: Corre `node --check` em todos os ficheiros `.js` do backend.
  2. `[2/3] Running Node.js API integration test suite`: Executa **6 testes de integração** (`node --test tests/api.test.js`) que testam `/api/v1/health`, disponibilidade de mesas, criação de reservas, prevenção de *double-booking* (`409 Conflict`), limite de capacidade (`400 Bad Request`) e cancelamento de reservas (`pass 6 | fail 0`).
  3. `[3/3] Verifying React frontend production build`: Compila a aplicação React com `vite build` sem erros (`=== Full-stack verification PASSED ===`).

#### Passo 2: Iniciar a Aplicação (Backend API + Frontend React)
```bash
cd examples/04-restaurant-reservation
npm start
```
- **O que esperar:**
  - O servidor **Node.js REST API** arranca em `http://localhost:4000` e o servidor **React + Vite** arranca em `http://localhost:5173`.
  - Ao abrir **`http://localhost:5173`** no navegador:
    - Pode alterar a **Data**, **Horário (`17:30`–`21:00`)** e **Número de Pessoas (`Party Size`)**.
    - Na grelha visual **Floor Plan & Table Availability**, as mesas `T1`–`T6` mudam dinamicamente entre verde (**`Available`**), vermelho (**`Booked`**) e cinzento (**`Max N Guests`** quando o grupo excede a capacidade da mesa).
    - Ao clicar numa mesa disponível, preencher os dados do cliente e submeter o formulário, a reserva aparece imediatamente na tabela inferior e a mesa passa a **`Booked`** na planta do restaurante.
    - Clicar em **Cancel** numa reserva liberta imediatamente a mesa para novas reservas nesse horário.

#### Passo 3: Adicionar novas funcionalidades com o `agy` (ou manualmente passo-a-passo)
```bash
cd examples/04-restaurant-reservation
agy
```
- **Prompt a introduzir no `agy`:**
  > `"Use the add-reservation-feature skill to add an 'occasion' field (none, birthday, anniversary, business) to reservations across contracts.json, the Node.js API, API tests, and the React booking form and schedule table."`
- **O que esperar:**
  1. O agente ativa a skill `add-reservation-feature` e segue a arquitetura de 6 passos documentada em [`README.md`](./examples/04-restaurant-reservation/README.md) e [`docs/adding-functionality-guide.md`](./examples/04-restaurant-reservation/docs/adding-functionality-guide.md).
  2. Atualiza `packages/shared/contracts.json`, valida o campo em `apps/api/src/validators.js`, persiste-o em `apps/api/src/store.js`, adiciona testes em `apps/api/tests/api.test.js`, atualiza o formulário React em `apps/web/src/App.jsx` e executa `verify-fullstack.sh` no final para garantir que todos os testes e o build React passam.
