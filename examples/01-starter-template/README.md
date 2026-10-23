# 01 — AI-First Starter Template (Greenfield Project Blueprint)

This example provides a clean, minimal blueprint for starting a **brand-new project from scratch** optimized for AI coding agents and **Google Antigravity CLI (`agy`)**.

It demonstrates how a small set of well-structured files (`AGENTS.md`, `docs/`, `.agents/skills/`, and `.agents/hooks.json`) turns an AI agent from an unpredictable code generator into a disciplined engineering partner that respects domain invariants, runs unit tests automatically, and blocks destructive commands.

---

## 1. Directory Structure & File Roles

```text
01-starter-template/
├── README.md                                        # This step-by-step guide
├── AGENTS.md                                        # Root workspace rules (< 100 lines, concrete commands)
├── docs/
│   ├── architecture.md                              # System boundaries & integer-cents domain invariant
│   └── adr/
│       └── 0001-use-modular-monolith-and-sqlite.md  # Architectural Decision Record (ADR)
├── .agents/
│   ├── hooks.json                                   # Lifecycle hook configuration (PreToolUse safety gate)
│   ├── scripts/
│   │   └── pre-tool-safety.sh                       # Blocks destructive rm -rf and git reset --hard commands
│   └── skills/
│       └── project-bootstrap/                       # Progressive skill for onboarding & verification
│           ├── SKILL.md                             # Instructions + YAML frontmatter (name, description)
│           ├── scripts/
│           │   └── verify-env.sh                    # Automated environment & test-suite check
│           └── references/
│               └── onboarding-checklist.md          # Checklist loaded on demand by the skill
├── src/
│   └── main.py                                      # Core order-pricing logic using integer cents
└── tests/
    └── test_main.py                                 # Fast unit test suite (unittest)
```

---

## 2. Step-by-Step Instructions & What to Expect

Follow the four exercises below in order to experience every customization layer in this project.

---

### Exercise 1: Run the Environment & Test Suite Verification Manually

Before launching the agent, verify the baseline project state from your terminal.

#### Instructions
1. Open a terminal and navigate to this example directory:
   ```bash
   cd examples/01-starter-template
   ```
2. Run the bootstrap verification script included inside the `project-bootstrap` skill:
   ```bash
   ./.agents/skills/project-bootstrap/scripts/verify-env.sh
   ```

#### What to Expect
You will see the script perform three sequential verification stages and exit with code `0`:

```text
=== [1/3] Checking Python runtime ===
Python 3.x.x
=== [2/3] Checking required AI-Ready files ===
  [OK] Found AGENTS.md
  [OK] Found docs/architecture.md
  [OK] Found .agents/hooks.json
=== [3/3] Running baseline unit tests ===
test_empty_order_returns_zero (test_main.OrderPricingTests.test_empty_order_returns_zero) ... ok
test_invalid_quantity_raises_value_error (test_main.OrderPricingTests.test_invalid_quantity_raises_value_error) ... ok
test_invalid_tax_rate_raises_value_error (test_main.OrderPricingTests.test_invalid_tax_rate_raises_value_error) ... ok
test_single_item_with_default_vat (test_main.OrderPricingTests.test_single_item_with_default_vat) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.000s

OK
=== Workspace verification complete ===
```

- **Why this matters:** Giving agents deterministic, sub-second verification scripts allows them to self-verify their environment and code changes without guessing.

---

### Exercise 2: Launch `agy` and Trigger the `project-bootstrap` Skill

Now let's launch Antigravity CLI (`agy`) and observe how it discovers workspace rules and skills automatically.

#### Instructions
1. From inside `examples/01-starter-template`, start `agy`:
   ```bash
   agy
   ```
2. Enter the following prompt:
   ```text
   Run the project-bootstrap skill to verify this workspace and summarize the project architecture.
   ```

#### What to Expect
1. **Automatic Rule Loading (`AGENTS.md`):**
   - At session startup, `agy` automatically loads `./AGENTS.md` into context. The agent immediately knows the tech stack (Python 3.11+ stdlib), test command (`python3 -m unittest discover -s tests -p "test_*.py" -v`), and coding rules.
2. **Progressive Skill Activation (`project-bootstrap`):**
   - Instead of loading every skill file up front, `agy` initially reads only the `name` and `description` from `.agents/skills/project-bootstrap/SKILL.md` YAML frontmatter.
   - Because your prompt matches the skill's purpose, the agent reads the full `.agents/skills/project-bootstrap/SKILL.md` file.
3. **Executing Skill Steps:**
   - Following `SKILL.md`, the agent reads `docs/architecture.md` and `docs/adr/0001-use-modular-monolith-and-sqlite.md`.
   - The agent runs `./.agents/skills/project-bootstrap/scripts/verify-env.sh` via its command tool.
   - The agent reads `.agents/skills/project-bootstrap/references/onboarding-checklist.md` to confirm all readiness criteria pass.
4. **Expected Agent Response:**
   - A structured summary confirming that all 4 unit tests pass, explaining that the codebase uses a **Modular Monolith** pattern (per ADR-0001), and highlighting the critical domain invariant: **all monetary values are represented in integer cents** (`unit_price_cents`, `subtotal_cents`) to prevent IEEE 754 floating-point rounding bugs.

---

### Exercise 3: Implement a New Feature Guided by `AGENTS.md` Rules

Let's ask the agent to write new business logic and see how `AGENTS.md` constrains the implementation.

#### Instructions
Inside your running `agy` session, send this prompt:

```text
Add a discount calculation helper `calculate_discount_cents(subtotal_cents: int, discount_percent: int) -> int` in src/main.py and add unit tests in tests/test_main.py.
```

#### What to Expect
Because `AGENTS.md` is active in the agent's system context, the agent will adhere to four strict project constraints without you having to repeat them in your prompt:

1. **Integer Cents Only (No Floating-Point Currency):**
   - The agent will implement `calculate_discount_cents` returning an `int` (using `round(subtotal_cents * (discount_percent / 100))` or integer arithmetic) rather than returning a `float` dollar amount.
2. **Input Validation (`ValueError` on Invalid Inputs):**
   - Matching the pattern in `src/main.py` and `AGENTS.md`, the agent will validate that `subtotal_cents >= 0` and `0 <= discount_percent <= 100`, raising a `ValueError` otherwise.
3. **Type Hints, Docstrings & Zero External Dependencies:**
   - The function will include full Python type annotations (`subtotal_cents: int, discount_percent: int -> int`), a concise docstring, and use only the Python standard library.
4. **Automatic Test Execution:**
   - Per the rule *"Never mark a task complete until `python3 -m unittest discover -s tests -p 'test_*.py' -v` exits with status code `0`"*, the agent will add unit tests to `tests/test_main.py` (covering valid percentages, `0%`/`100%` boundaries, and invalid negative or `>100%` inputs) and run the test suite automatically before replying.

> **Tip:** To reset your working files after testing Exercise 3, run `git checkout -- src/main.py tests/test_main.py` in another terminal.

---

### Exercise 4: Test the `PreToolUse` Safety Hook (`pre-tool-safety.sh`)

Prompts and rules (`AGENTS.md`) guide the model probabilistically, whereas **Hooks** (`.agents/hooks.json`) enforce security **deterministically** at the CLI runtime layer.

In this project, `.agents/hooks.json` registers `.agents/scripts/pre-tool-safety.sh` to run before every `run_command` (`Bash`) tool call.

#### Instructions (Part A — Test the Hook Script Directly in Terminal)
Run the following commands in your terminal to simulate `agy` passing a safe command vs. a destructive command into the hook via `stdin`:

```bash
# 1. Simulate a SAFE command (running unit tests):
printf '{"tool_name":"Bash","tool_input":{"command":"python3 -m unittest"}}' \
  | ./.agents/scripts/pre-tool-safety.sh
echo "Exit code: $?"

# 2. Simulate a DESTRUCTIVE command (rm -rf / or git reset --hard):
printf '{"tool_name":"Bash","tool_input":{"command":"git reset --hard HEAD~1"}}' \
  | ./.agents/scripts/pre-tool-safety.sh
```

#### What to Expect (Part A)
- **For the safe command (`# 1`):**
  - Output is empty and `Exit code: 0` is printed, signaling `agy` to allow the command to execute.
- **For the destructive command (`# 2`):**
  - The script outputs a JSON denial decision to `stdout`:
    ```json
    {"decision":"deny","reason":"Blocked by workspace safety hook: destructive rm -rf or git reset --hard is not permitted."}
    ```
  - Even before the shell command can touch your disk, `agy` intercepts this JSON decision and blocks execution.

#### Instructions (Part B — Test Inside `agy`)
Inside your `agy` session, enter:

```text
Try running `git reset --hard` using the command tool so we can verify that our PreToolUse safety hook blocks it.
```

#### What to Expect (Part B)
- If the agent attempts to invoke the command tool with `git reset --hard`, the `PreToolUse` hook immediately intercepts the call and returns the denial reason:
  > `Blocked by workspace safety hook: destructive rm -rf or git reset --hard is not permitted.`
- The command is **never executed**, and the agent reports back that the workspace safety hook successfully blocked the destructive operation.
