# 00 — AI-First Project Boilerplate (Copy-and-Start Template)

This folder (`00-project-boilerplate`) is a **clean, language-agnostic project skeleton** containing all the foundational documentation, agent instructions, progressive skills, and safety hooks needed to kick off a new project from scratch with **Google Antigravity CLI (`agy`)**.

Whenever you want to create a new project, copy this directory, launch `agy`, and let the built-in **`init-project`** skill interview you (or read your prompt), fill in all documentation templates, and scaffold your initial code and tests.

---

## 1. Directory Structure & What Each File Does

```text
00-project-boilerplate/
├── README.md                                          # This step-by-step guide
├── AGENTS.md                                          # Root workspace rules template (< 100 lines)
├── docs/                                              # Reference documentation loaded on demand
│   ├── product-spec.md                                # Product requirements, MVP user stories & non-goals
│   ├── architecture.md                                # System boundaries, module layout & domain invariants
│   ├── conventions.md                                 # Coding, testing (AAA), and Git hygiene standards
│   └── adr/
│       └── 0001-initial-architecture-and-stack.md     # Architectural Decision Record (ADR-0001) template
├── .agents/                                           # Antigravity CLI (agy) customization layer
│   ├── hooks.json                                     # PreToolUse hook registration
│   ├── mcp.json                                       # Project-scoped MCP server configuration file
│   ├── scripts/
│   │   └── pre-tool-safety.sh                         # Deterministically blocks rm -rf, git reset --hard, DROP TABLE
│   └── skills/
│       ├── init-project/                              # Skill that turns this boilerplate into a real project
│       │   ├── SKILL.md                               # 5-step initialization instructions for the agent
│       │   ├── scripts/
│       │   │   └── check-boilerplate.sh               # Audits folders, files, and remaining [TODO: ...] markers
│       │   └── references/
│       │       └── initialization-checklist.md        # Readiness checklist before finishing bootstrap
│       └── feature-workflow/                          # Reusable skill for spec-first feature development
│           └── SKILL.md                               # 4-step workflow (Spec -> Code -> Tests -> Gate)
├── src/
│   └── README.md                                      # Placeholder directory for application source code
└── tests/
    └── README.md                                      # Placeholder directory for automated unit/integration tests
```

---

## 2. Step-by-Step Instructions & What to Expect

Follow the four exercises below to see how to inspect, copy, initialize, and build a new project from this boilerplate.

---

### Exercise 1: Run the Boilerplate Audit Script (`check-boilerplate.sh`)

Before launching `agy`, let's run the verification script included in the `init-project` skill to see how it checks the repository structure and detects uninitialized `[TODO: ...]` placeholders.

#### Instructions
1. Open your terminal and navigate to this folder:
   ```bash
   cd examples/00-project-boilerplate
   ```
2. Run the boilerplate audit script:
   ```bash
   ./.agents/skills/init-project/scripts/check-boilerplate.sh
   ```

#### What to Expect
The script executes 3 checks and exits with status code `0`:

```text
=== [1/3] Checking required AI-First directories ===
  [OK] Directory found: docs/
  [OK] Directory found: docs/adr/
  [OK] Directory found: .agents/
  [OK] Directory found: .agents/scripts/
  [OK] Directory found: .agents/skills/init-project/
  [OK] Directory found: .agents/skills/feature-workflow/
  [OK] Directory found: src/
  [OK] Directory found: tests/
=== [2/3] Checking required governance & documentation files ===
  [OK] File found: AGENTS.md
  [OK] File found: docs/product-spec.md
  [OK] File found: docs/architecture.md
  [OK] File found: docs/conventions.md
  [OK] File found: docs/adr/0001-initial-architecture-and-stack.md
  [OK] File found: .agents/hooks.json
  [OK] File found: .agents/scripts/pre-tool-safety.sh
  [OK] File found: .agents/mcp.json
  [OK] File found: .agents/skills/init-project/SKILL.md
  [OK] File found: .agents/skills/feature-workflow/SKILL.md
=== [3/3] Checking customization status ([TODO: ...] placeholders) ===
  [INFO] Template status: UNINITIALIZED BOILERPLATE (22 '[TODO: ...]' placeholders remaining in AGENTS.md and docs/).
  [NEXT] Launch 'agy' and ask: "Use the init-project skill to initialize this project for <your idea>."
=== Boilerplate structure check PASSED ===
```

---

### Exercise 2: Copy the Boilerplate and Initialize a New Project with `agy`

To keep `examples/00-project-boilerplate` clean as a reusable template, you can either copy it to a new directory (e.g., `/tmp/my-habit-tracker`) or run `agy` directly inside it and reset via `git checkout` afterward.

#### Instructions
1. Copy the boilerplate into a fresh project folder (or stay inside `examples/00-project-boilerplate`):
   ```bash
   cp -r examples/00-project-boilerplate /tmp/my-expense-splitter
   cd /tmp/my-expense-splitter
   agy
   ```
2. Inside `agy`, send the following prompt:
   ```text
   Use the init-project skill to initialize this project as a CLI & library for splitting group travel expenses in Python 3.12 (stdlib only, unittest for tests, integer cents for all currency amounts).
   ```
   *(Tip: If you want the agent to interview you interactively before deciding on the stack, type `/grill-me` or ask `"Interview me to initialize this project using the init-project skill"`!)*

#### What to Expect
Watch the 5-step procedure the agent performs automatically:

1. **Step 1 — Runs `check-boilerplate.sh`:**
   - The agent activates `.agents/skills/init-project/SKILL.md` and runs `./.agents/skills/init-project/scripts/check-boilerplate.sh` to inspect the uninitialized template state.
2. **Step 2 & 3 — Populates All Governance & Documentation Files:**
   - **`AGENTS.md`:** Replaces every `[TODO: ...]` with the project name (`expense-splitter`), runtime (`Python 3.12+`), test command (`python3 -m unittest discover -s tests -p "test_*.py" -v`), and domain rules.
   - **`docs/product-spec.md`:** Writes the problem statement, MVP user stories (`US-01` add expense, `US-02` calculate per-person balances, `US-03` settle debts), explicit non-goals, and domain glossary.
   - **`docs/architecture.md` & `docs/adr/0001-initial-architecture-and-stack.md`:** Documents the module layout (`src/` vs `tests/`), the integer-cents invariant, and ADR-0001.
3. **Step 4 — Scaffolds Initial Code (`src/`) and Unit Tests (`tests/`):**
   - Creates the initial domain module in `src/` and unit tests in `tests/`.
   - Runs `python3 -m unittest discover -s tests -p "test_*.py" -v` and confirms all baseline tests pass.
4. **Step 5 — Re-runs `check-boilerplate.sh`:**
   - Runs `./.agents/skills/init-project/scripts/check-boilerplate.sh` a second time, which now outputs:
     ```text
     [OK] Template status: INITIALIZED (0 '[TODO: ...]' placeholders remaining!).
     ```

---

### Exercise 3: Add a Second Feature Using the `feature-workflow` Skill

Once the project is initialized, the boilerplate includes a second skill (`.agents/skills/feature-workflow/SKILL.md`) for ongoing spec-first development.

#### Instructions
Inside your `agy` session, enter:

```text
Use the feature-workflow skill to add a new feature that exports the settlement summary as a formatted Markdown table, including unit tests.
```

#### What to Expect
1. **Spec & Architecture Check:** The agent first reads `docs/product-spec.md` and `docs/architecture.md` (and updates `docs/product-spec.md` with the new user story if needed).
2. **Modular Implementation:** Implements the formatter in `src/` following `docs/conventions.md`.
3. **AAA Unit Tests:** Adds happy-path and edge-case tests in `tests/`.
4. **Verification Gate:** Runs the canonical test command from `AGENTS.md` before finishing.

---

### Exercise 4: Test the `PreToolUse` Safety Hook (`pre-tool-safety.sh`)

Even on day zero of a new project, `.agents/hooks.json` protects your workspace against accidental destructive commands (`rm -rf`, `git reset --hard`, `DROP DATABASE`, `DROP TABLE`).

#### Instructions
Run this command in your terminal to test the hook directly:

```bash
printf '{"tool_name":"Bash","tool_input":{"command":"rm -rf ./"}}' \
  | ./.agents/scripts/pre-tool-safety.sh
```

#### What to Expect
The hook outputs the JSON denial decision immediately:

```json
{"decision":"deny","reason":"Blocked by boilerplate safety hook: destructive rm -rf, git reset --hard, or DROP DATABASE/TABLE commands are not permitted."}
```
