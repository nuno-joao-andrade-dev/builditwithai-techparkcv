---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
color: #202124
style: |
  section {
    font-family: 'Google Sans', 'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 48px 64px;
    background-color: #ffffff;
    color: #202124;
    border-top: 6px solid transparent;
    border-image: linear-gradient(90deg, #4285F4 0% 25%, #EA4335 25% 50%, #FBBC04 50% 75%, #34A853 75% 100%) 1;
  }
  h1 {
    color: #1a73e8;
    font-weight: 700;
  }
  h2 {
    color: #202124;
    border-bottom: 2px solid #e8eaed;
    padding-bottom: 8px;
  }
  h3 {
    color: #1a73e8;
  }
  strong {
    color: #202124;
  }
  blockquote {
    background: #e8f0fe;
    border-left: 4px solid #4285F4;
    color: #202124;
    padding: 10px 16px;
    border-radius: 0 8px 8px 0;
  }
  code {
    background: #f1f3f4;
    color: #d93025;
    padding: 2px 6px;
    border-radius: 4px;
  }
  pre {
    background: #f8f9fa !important;
    border: 1px solid #dadce0;
    border-radius: 8px;
  }
  pre code {
    color: #202124;
    background: transparent;
  }
  table {
    font-size: 0.78em;
    width: 100%;
    border-collapse: collapse;
  }
  th {
    background: #e8f0fe;
    color: #1a73e8;
    border: 1px solid #dadce0;
  }
  td {
    background: #ffffff;
    color: #3c4043;
    border: 1px solid #dadce0;
  }
  tr:nth-child(even) td {
    background: #f8f9fa;
  }
---

<!-- Slide 1: Título / Capa (Estilo GDE / GDG) -->

##### **GDG Lisbon** • **Google Developer Experts (GDE)** • Sessão Code-Along

# Desenvolvimento AI-First com Antigravity CLI (`agy`)

### Melhores Práticas, Arquitetura de Contexto, Skills, Rules, Hooks, MCP e Plugins

<br/>

**Nuno João Andrade**
Google Developer Expert (GDE) • Organizer @ GDG Lisbon • `nja.dev`

---

<!-- Slide 2: Apresentação Pessoal & GDG Lisbon -->

## Quem Sou Eu & Comunidade GDG Lisbon

| 👨‍💻 **Nuno João Andrade (`nja.dev`)** | 🌐 **GDG Lisbon (Google Developer Group)** |
| :--- | :--- |
| **Google Developer Expert (GDE)** em *Google Cloud* & *Modern Infrastructure* | Comunidade oficial de programadores em Lisboa apoiada pelo programa **Google for Developers** |
| **Senior Backend Developer & Cloud Architect** com +10 anos de experiência internacional em sistemas distribuídos, migrações e alta performance | **Missão:** Partilhar conhecimento aberto, ligar a comunidade técnica e explorar Cloud, IA, Web, Mobile e Infraestrutura |
| Foco atual em **Engenharia AI-First**, Agentes Autónomos (**Antigravity CLI**, **Google ADK**, **Gemini**, **Gemma**) e arquitetura cloud-native | **Eventos:** Meetups mensais, sessões *Code-Along*, *Study Jams*, workshops práticos e o **DevFest Lisbon** |
| Artigos, notas técnicas e projetos em **`https://nja.dev`** | **Junte-se a nós:** `gdg.community.dev/gdg-lisbon` — *Call for Papers (CFP)* sempre aberto à comunidade! |

> **Bem-vindos ao Code-Along!** Todos os slides estão em **Português (pt-PT)** e os 4 projetos de exemplo (`examples/`) estão em **Inglês (EN)** para máxima eficácia com o modelo.

---

<!-- Slide 3: Instalar o Antigravity CLI (agy) -->

## Setup 1/2: Instalar o Google Antigravity CLI (`agy`)

O **Antigravity CLI (`agy`)** instala-se num único comando e coloca o binário em `~/.local/bin/agy`:

```bash
# Opção A — Script automático (instala o agy + pede a GEMINI_API_KEY):
./scripts/install-antigravity.sh && source ~/.bashrc && agy

# Opção B — Instalação manual (Linux, macOS ou WSL):
curl -fsSL https://antigravity.google/cli/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"

# Windows (PowerShell):
irm https://antigravity.google/cli/install.ps1 | iex
```

> **Referência Oficial:** `https://antigravity.google/docs/install/?tab=cli` • `https://antigravity.google/docs/cli/reference` • Configuração global em `~/.gemini/antigravity-cli/settings.json`.

---

<!-- Slide 4: Instalar Python 3 e Node.js via NVM -->

## Setup 2/2: Instalar Python 3 & Node.js (via NVM)

Para correr os **5 exemplos** (`00` a `03` em Python + `04` em Node.js & React), instale ambos os runtimes:

| 🐍 **1. Python 3 (Exemplos 00 a 03)** | 🟩 **2. NVM & Node.js (Exemplo 04)** |
| :--- | :--- |
| **Ubuntu / Debian / WSL:**<br>`sudo apt update && sudo apt install -y python3 python3-venv` | **1. Instalar o NVM:**<br>`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh \| bash` |
| **macOS / Windows:**<br>`brew install python` / `winget install Python.Python.3.12` | **2. Instalar e ativar Node.js LTS:**<br>`source ~/.bashrc && nvm install --lts && nvm use --lts` |
| **Verificar versão (Python 3.11+):**<br>`python3 --version` | **3. Verificar Node.js e npm:**<br>`node -v && npm -v` |

> **Pronto para o Code-Along!** Com `agy --version`, `python3 --version` e `node -v` ativos, todos os exemplos podem ser executados imediatamente.

---

## 1. Agenda da Sessão

1. **Mudança de Paradigma**: De autocompletar código para *Pair Programming* Agêntico
2. **Dominar o Antigravity CLI (`agy`)**: Flags, modos de execução e *slash commands*
3. **Arquitetura de um Projeto AI-Ready**: Estrutura de diretorias e ficheiros recomendados
4. **Os 5 Pilares de Personalização**: Rules, Skills, Hooks, MCP e Plugins
5. **Orçamento de Contexto e Divulgação Progressiva** (*Progressive Disclosure*)
6. **Deep Dive**: `AGENTS.md`, `SKILL.md`, `mcp_config.json`, `hooks.json` e `plugin.json`
7. **Fluxo de Trabalho**: Criar projetos de raiz (*Greenfield*) e manter projetos (*Brownfield*)
8. **Code-Along**: Exploração prática dos 4 projetos de exemplo (`examples/`)

---

## 2. De Autocomplete para Pair Programming Agêntico

| Abordagem Tradicional (Chat / Copilots) | Engenharia AI-First com Antigravity (`agy`) |
| :--- | :--- |
| Prompting ad-hoc, repetindo contexto manualmente | **Contexto versionado no repositório** (`AGENTS.md`, `.agents/`) |
| O modelo adivinha convenções e comandos de teste | **Procedimentos determinísticos** encapsulados em `Skills` e `scripts/` |
| Revisão manual exaustiva de erros básicos de estilo | **Guardrails automáticos** via *Lifecycle Hooks* (`PreToolUse`, `PostToolUse`) |
| Isolado de bases de dados e sistemas internos | **Integração segura e direta** através de servidores **MCP** |
| Uma única conversa longa até esgotar tokens | **Orquestração multi-agente** (`research`, `self`, worktrees) e `/compact` |

> **Regra de Ouro:** Se tiver de corrigir o agente duas vezes sobre a mesma regra do projeto, essa informação pertence a um ficheiro `AGENTS.md`, a uma `Skill` ou a um `Hook`.

---

## 3. Antigravity CLI (`agy`) — Comandos e Modos

O `agy` é a interface de terminal rápida e extensível do ecossistema Google Antigravity.

```bash
# Iniciar sessão interativa no diretório atual
agy

# Retomar a última conversa ou uma conversa específica
agy -c
agy --conversation <id>

# Escolher o modo de operação e o nível de raciocínio (effort)
agy --mode plan --effort high          # Modos: plan | auto | accept-edits
                                       # Effort: low | medium | high | xhigh | max

# Execução não-interativa (ideal para scripts e pipelines CI/CD)
agy -p "Run the test suite and summarize any failures" --output-format json

# Executar com restrições de segurança de terminal ativas
agy --sandbox
```

**Subcomandos de Gestão no Terminal:**
- `agy mcp` (`add`, `remove`, `list`, `enable`, `disable`)
- `agy plugin` (`install`, `uninstall`, `list`, `enable`, `disable`)
- `agy models` / `agy agents` / `agy changelog` / `agy update`

---

## 4. Comandos Slash (`/`) Essenciais no `agy`

Dentro da sessão interativa do `agy`, utilize os comandos `/` para orientar a postura do agente:

| Comando | Quando Utilizar na Prática |
| :--- | :--- |
| **`/grill-me`** | **Antes de começar a programar.** O agente entrevista-o com perguntas estruturadas para alinhar requisitos e decisões de arquitetura. |
| **`/plan`** | Para funcionalidades complexas. Gera um plano passo a passo antes de modificar qualquer ficheiro de código-fonte. |
| **`/boost`** | Ativa pensamento profundo, múltiplas perspetivas e verificação rigorosa para problemas difíceis de arquitetura ou *debugging*. |
| **`/goal`** | Para tarefas longas ou autónomas. O agente itera e verifica até que o objetivo definido seja totalmente cumprido. |
| **`/teamwork`** | Divide um projeto grande entre uma equipa de subagentes autónomos a trabalhar em paralelo. |
| **`/learn`** | **Após corrigir o agente.** Pede ao agente para persistir a aprendizagem (em regras ou skills) para futuras tarefas. |
| **`/compact`** | Resume e compacta o histórico da conversa para libertar espaço na janela de contexto sem perder decisões-chave. |
| **`/schedule`** | Cria tarefas agendadas recorrentes (*cron*) ou temporizadores. |
| **`/browser`** | Quando a tarefa envolve testar aplicações web, navegar ou inspecionar o DOM. |

---

## 5. Estrutura de Diretorias Recomendada para Projetos AI-First

```text
my-project/
├── AGENTS.md                        # Regras globais do projeto (stack, comandos, limites)
├── docs/                            # Documentação viva para humanos e agentes
│   ├── architecture.md              # Mapa de alto nível dos módulos e fluxo de dados
│   ├── conventions.md               # Padrões detalhados de código e testes
│   └── adr/                         # Architecture Decision Records (contexto histórico)
├── .agents/                         # Raiz de personalização partilhada via Git
│   ├── skills.json                  # Registo declarativo / herança de skills partilhadas
│   ├── plugins.json                 # Registo declarativo de plugins da equipa
│   ├── hooks.json                   # Hooks de ciclo de vida (segurança, lint, formatação)
│   ├── scripts/                     # Scripts executados pelos hooks
│   ├── skills/                      # Procedimentos modulares carregados on-demand
│   │   └── db-migration/
│   │       ├── SKILL.md             # Instruções principais + YAML frontmatter
│   │       ├── scripts/             # Scripts auxiliares determinísticos
│   │       ├── examples/            # Exemplos de código de referência
│   │       └── references/          # Documentação extensa lida apenas se necessário
│   └── plugins/                     # Pacotes completos (Skills + Rules + Hooks + MCP)
└── apps/
    ├── api/
    │   └── AGENTS.md                # Regras específicas do Backend (ex: FastAPI/Python)
    └── web/
        └── AGENTS.md                # Regras específicas do Frontend (ex: React/TypeScript)
```

---

## 6. Os 5 Pilares de Personalização do Antigravity

| Pilar | Ficheiro / Localização | Âmbito e Carregamento | Melhor Para... |
| :--- | :--- | :--- | :--- |
| **1. Rules** | `AGENTS.md`, `GEMINI.md` | Contextual e Hierárquico (sempre ativo no diretório) | Impor estilos de código, restrições de API, comandos de build/test e arquitetura local. |
| **2. Skills** | `.agents/skills/<nome>/SKILL.md` | *On-Demand* (Divulgação Progressiva) | Ensinar procedimentos multi-passo, *runbooks*, migrações, *scaffolding* e fluxos de trabalho. |
| **3. Hooks** | `.agents/hooks.json` | Eventos do Ciclo de Vida (Síncrono/Determinístico) | Bloquear comandos perigosos (`PreToolUse`), correr linters (`PostToolUse`) ou validar objetivos (`Stop`). |
| **4. MCP** | `mcp_config.json` | Integração de Ferramentas Externas | Ligar o agente a bases de dados, APIs internas, sistemas de tickets, GitHub, observabilidade. |
| **5. Plugins** | `.agents/plugins/<nome>/plugin.json` | Pacote Partilhável (*Bundle*) | Empacotar Skills, Rules, Hooks e servidores MCP numa única unidade instalável pela equipa. |

---

## 7. Descoberta, Precedência e Divulgação Progressiva

### Ordem de Prioridade (da mais alta para a mais baixa):
1. **Projeto (Workspace):** Descoberta hierárquica subindo do diretório atual até à raiz do repositório (`.agents/`, `AGENTS.md`).
2. **Configurações Declaradas no Projeto:** Listadas em `.agents/skills.json` ou `.agents/plugins.json`.
3. **Configuração Global da Máquina:** `~/.gemini/config/` (aplicável a todos os projetos do utilizador).
4. **Personalizações Built-in:** Skills nativas incluídas no Antigravity.
5. **Configurações Declaradas Globais:** Listadas nos JSONs globais.

### Divulgação Progressiva (*Progressive Disclosure*) e Orçamento:
- **Regras (`AGENTS.md`):** Limite de **24 KB (24.000 bytes)** por ficheiro e um orçamento agregado de **20.000 tokens**. Regras que excedam o orçamento são convertidas em ponteiros de ficheiro para leitura sob pedido.
- **Skills (`SKILL.md`):** **Não** ocupam a janela de contexto por defeito! Apenas o `name` e a `description` são injetados no início. O conteúdo completo só é lido quando o agente ativa a Skill.
- **Deduplicação Automática:** Nenhum ficheiro de regra é injetado mais do que uma vez por turno.

---

## 8. Pilar 1: Regras Hierárquicas (`AGENTS.md` / `GEMINI.md`)

Coloque ficheiros `AGENTS.md` na raiz do repositório e nas subdiretorias onde as regras mudam.

```markdown
# Project Rules (Root AGENTS.md)

## Tech Stack & Commands
- Package manager: `pnpm` (never use `npm` or `yarn`).
- Test command: `pnpm test:unit` (run single file: `pnpm vitest run <path>`).
- Typecheck: `pnpm typecheck`.

## Architectural Boundaries
- `packages/shared/` must remain pure TypeScript with zero framework dependencies.
- Never hardcode secrets or modify generated migrations in `apps/api/migrations/`.
- All new endpoints must have a corresponding integration test before task completion.
```

**Boas Práticas para `AGENTS.md`:**
- **Seja conciso e acionável:** Diga os comandos exatos para compilar, testar um único ficheiro e correr o linter.
- **Divida por subdiretoria:** Regras de React ficam em `apps/web/AGENTS.md`; regras de SQL/Python ficam em `apps/api/AGENTS.md`.
- **Sem Frontmatter:** Ficheiros `AGENTS.md` / `GEMINI.md` são Markdown puro e estão sempre ativos no seu diretório e subdiretorias.

---

## 9. Pilar 2: O que são as Skills (`SKILL.md`)?

As **Skills** são pacotes modulares de conhecimento e procedimentos ("*runbooks* executáveis").

```text
.agents/skills/db-migration/
├── SKILL.md                          # Obrigatório: YAML frontmatter + instruções
├── scripts/validate-sql.sh           # Opcional: Scripts executáveis de validação
├── examples/001_create_users.sql     # Opcional: Exemplos reais de implementação
├── resources/template.sql            # Opcional: Templates prontos a copiar
└── references/zero-downtime.md       # Opcional: Manuais extensos (lidos on-demand)
```

```markdown
---
name: db-migration
description: >-
  Creates and validates zero-downtime PostgreSQL schema migrations.
  Use this skill whenever the user asks to add/modify database tables, columns, or indexes.
---
# Database Migration Workflow
1. Check existing migrations in `apps/api/migrations/`.
2. Draft the new migration following [001_create_users.sql](./examples/001_create_users.sql).
3. Consult [zero-downtime.md](./references/zero-downtime.md) for destructive changes.
4. Validate syntax by running `./scripts/validate-sql.sh <migration_file>`.
```

> **Dica Crítica:** A `description` no YAML frontmatter é o campo mais importante! Escreva-a na **3.ª pessoa** dizendo claramente **o que** a skill faz e **quando** o agente a deve ativar.

---

## 10. Pilar 3: O que é o MCP (Model Context Protocol)?

O **MCP** é o standard aberto que permite ligar modelos de IA a ferramentas e fontes de dados externas de forma segura e padronizada.

- Configurado globalmente em `~/.gemini/config/mcp_config.json` ou dentro de um Plugin (`plugins/<nome>/mcp_config.json`).
- **2 Transportes Suportados no Antigravity:**
  1. **Stdio (Local):** O Antigravity lança o binário/script localmente e comunica via `stdin`/`stdout`.
  2. **Streamable HTTP (Remoto):** Liga-se a um servidor remoto via HTTP(S) (tipicamente no endpoint `/mcp`).

```json
{
  "mcpServers": {
    "project-sqlite": {
      "command": "python3",
      "args": ["./tools/local-mcp-server/server.py", "--db", "./data/app.db"],
      "env": { "DB_READONLY": "true" }
    },
    "team-observability": {
      "url": "https://mcp.internal.example.com/mcp"
    }
  }
}
```

**Como funciona:** Descoberta automática de ferramentas $\rightarrow$ Injeção no prompt do sistema $\rightarrow$ Execução governada por permissões.

---

## 11. Pilar 4: Lifecycle Hooks (`hooks.json`)

Os **Hooks** permitem executar comandos ou scripts determinísticos em pontos exatos do ciclo de vida do agente. Recebem contexto JSON em `stdin` (*camelCase*) e devolvem decisões JSON em `stdout`.

| Evento | Quando Dispara | Caso de Uso Típico |
| :--- | :--- | :--- |
| **`SessionStart`** | No início de uma nova sessão | Injetar estado do ambiente ou avisos iniciais (`injectSteps`). |
| **`PreToolUse`** | **Antes** de uma ferramenta executar | **Segurança:** Bloquear (`deny`), pedir confirmação (`ask`) ou reescrever argumentos (`overwrite`) em `run_command`. |
| **`PostToolUse`** | **Depois** de uma ferramenta terminar | Correr `prettier`/`eslint`/`ruff` automaticamente após `edit_file` ou `write_file`. |
| **`PreInvocation`** | Antes de chamar o modelo | Injetar lembretes efémeros (`ephemeralMessage`). |
| **`PostInvocation`**| Após conclusão das chamadas de ferramentas | Inspecionar saídas e forçar continuação (`force_continue`). |
| **`Stop`** | Quando o agente tenta terminar o turno | Impedir paragem (`"decision": "continue"`) se os testes ainda estiverem a falhar! |

---

## 12. Exemplo Prático de `hooks.json` (`PreToolUse` & `PostToolUse`)

Ficheiro `.agents/hooks.json`:
```json
{
  "command-safety-guard": {
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          { "type": "command", "command": "./scripts/command-guard.sh", "timeout": 5 }
        ]
      }
    ]
  },
  "auto-format-on-edit": {
    "PostToolUse": [
      {
        "matcher": "edit_file|write_file",
        "hooks": [
          { "type": "command", "command": "./scripts/post-edit-check.sh", "timeout": 15 }
        ]
      }
    ]
  }
}
```
Se `command-guard.sh` detetar `rm -rf /` ou `DROP DATABASE`, devolve no `stdout`:
`{"decision": "deny", "reason": "Destructive command blocked by workspace policy."}`

---

## 13. Pilar 5: Plugins (`plugin.json`) e Partilha (`skills.json`)

Quando a sua equipa tem um conjunto coeso de Skills, Rules, Hooks e MCPs, empacote-os num **Plugin**:

```text
.agents/plugins/platform-engineering-kit/
├── plugin.json                # Manifesto: name, description, logo, suggestedPrompts
├── README.md                  # Documentação para humanos (não consome tokens do agente)
├── mcp_config.json            # Servidores MCP associados ao ciclo de vida do plugin
├── hooks.json                 # Hooks na raiz do plugin
├── assets/logo.svg            # Ícone quadrado (mín. 128x128, margem 10%)
├── rules/AGENTS.md            # Regras consolidadas ativas quando o plugin está ligado
└── skills/
    └── incident-triage/SKILL.md
```

**Partilha de Diretorias Personalizadas via `.agents/skills.json`:**
```json
{
  "inherits": [
    { "path": "/opt/company/shared-skills.json", "exclude": ["deprecated-.*"] }
  ],
  "entries": [
    { "path": "tools/shared-skills" }
  ]
}
```

---

## 14. Metodologia: Criar um Projeto do Zero (*Greenfield*) com IA

Não peça ao agente *"Cria uma aplicação completa de e-commerce"*. Siga um fluxo estruturado em 4 fases:

1. **Alinhamento e Entrevista (`/grill-me`):**
   - Descreva a ideia e use `/grill-me` para que o agente identifique casos-limite, requisitos não-funcionais e escolhas tecnológicas antes de escrever código.
2. **Arquitetura e Decisões (`/plan` + `docs/adr/`):**
   - Peça para documentar a arquitetura em `docs/architecture.md` e criar o primeiro ADR em `docs/adr/0001-...md`.
3. **Fundação AI-Ready (`AGENTS.md` + `.agents/`):**
   - Crie logo no primeiro commit o `AGENTS.md` com os comandos de build/test/lint, uma Skill de bootstrap e hooks básicos.
4. **Implementação em Fatias Verticais (*Vertical Slices*):**
   - Implemente uma funcionalidade de ponta a ponta de cada vez (ex: *Healthcheck + Teste* $\rightarrow$ *Modelo + Migração* $\rightarrow$ *Endpoint + Teste*), verificando sempre antes de avançar.

---

## 15. Metodologia: Manter e Escalar Projetos (*Brownfield*)

Como manter a qualidade e velocidade à medida que o projeto cresce:

- **Delegação em Subagentes (`research` vs `self`):**
  - Use subagentes `research` (apenas leitura) para explorar código legado ou procurar *bugs* sem poluir a janela de contexto principal.
  - Use subagentes `self` com *workspace* isolado (`branch` / `share`) para tarefas paralelas independentes.
- **Ciclo de Melhoria Contínua com `/learn`:**
  - Sempre que o agente cometer um erro devido a uma particularidade do projeto, corrija-o e execute `/learn` (ou atualize o `AGENTS.md` / `SKILL.md`) para que o erro nunca se repita.
- **Higiene da Janela de Contexto (`/compact`):**
  - Uma tarefa = uma conversa focada. Quando concluir uma etapa ou a conversa ficar longa, use `/compact` ou inicie uma nova sessão.
- **Testes Rápidos e Determinísticos:**
  - Dê ao agente comandos para correr **um único teste** em milissegundos em vez da suite inteira de 10 minutos.

---

## 16. Code-Along: Os 5 Projetos de Exemplo neste Repositório

Todos os projetos na diretoria [`examples/`](../examples/) estão em **Inglês** (como recomendado para código e prompts técnicos) e prontos a explorar com o `agy`:

0. **`examples/00-project-boilerplate/` — *Copy-and-Start AI-First Project Boilerplate***
   - Esqueleto completo pronto a copiar (`AGENTS.md`, `docs/product-spec.md`, `docs/architecture.md`, `docs/conventions.md`, `docs/adr/`, `.agents/hooks.json`, `.agents/mcp.json`) com as Skills `init-project` e `feature-workflow` para inicializar qualquer projeto novo com o `agy`.
1. **`examples/01-starter-template/` — *Minimalist AI-Ready Project Blueprint***
   - Estrutura base para um novo projeto: `AGENTS.md`, `docs/architecture.md`, `docs/adr/`, uma Skill de validação de ambiente (`project-bootstrap`) e um Hook de segurança (`PreToolUse`).
2. **`examples/02-fullstack-monorepo/` — *Hierarchical Rules, Skills & Quality Hooks***
   - Monorepo com regras hierárquicas (`AGENTS.md` na raiz + `apps/api/AGENTS.md` em Python + `apps/web/AGENTS.md` em TypeScript), Skills com `scripts/`, `examples/`, `resources/` e `references/` (`db-migration`, `api-endpoint-scaffold`) e Hooks de *command guard* + validação pós-edição.
3. **`examples/03-team-plugin-and-mcp/` — *Team Plugins, MCP Server & JSON Configs***
   - Demonstração avançada para equipas: `skills.json`, `plugins.json`, um Plugin completo (`platform-engineering-kit`) e um servidor MCP local funcional em Python (`tools/local-mcp-server/server.py`).
4. **`examples/04-restaurant-reservation/` — *Full-Stack Restaurant Table Reservation App (Node.js + React)***
   - Aplicação 100% funcional com API REST em Node.js (`apps/api`, porta `4000`), Frontend em React 19 + Vite (`apps/web`, porta `5173`), contrato partilhado (`packages/shared/contracts.json`), Skill `add-reservation-feature`, Hooks (`node --check`) e guia passo-a-passo para adicionar novas funcionalidades.

---

## 17. Deep Dive: Exemplo 04 — Reserva de Mesas Full-Stack (`04-restaurant-reservation/`)

Uma aplicação real **Node.js + React** desenhada para demonstrar o fluxo completo de adição de funcionalidades com o `agy`:

| Camada | Ficheiros Principais | Responsabilidade |
| :--- | :--- | :--- |
| **1. Contrato Partilhado** | `packages/shared/contracts.json` | Define `timeSlots` (`17:30`–`21:00`), `zones`, `reservationStatuses` e esquemas JSON. |
| **2. Backend API (Node.js)** | `apps/api/src/{validators,store,app,server}.js` | Validação pura, prevenção de *double-booking* (`409 Conflict`), limite de capacidade (`400`) e testes `node --test`. |
| **3. Frontend Web (React)** | `apps/web/src/{api.js,App.jsx}` | Grelha interativa do mapa de mesas (`T1`–`T6`), formulário de reserva e gestão de estados (`Seat Guests`, `Cancel`). |
| **4. Agente & Guardrails** | `.agents/skills/add-reservation-feature/` + `hooks.json` | Skill de 5 passos com `verify-fullstack.sh` + Hook `PostToolUse` que corre `node --check` a cada edição. |

```bash
cd examples/04-restaurant-reservation
npm test      # Corre os testes da API Node.js + build de produção React
npm start     # Inicia a API (:4000) e o cliente React (:5173) em simultâneo
agy           # Abrir o Antigravity CLI para adicionar novas funcionalidades (ex: Waitlist / Occasion)
```
