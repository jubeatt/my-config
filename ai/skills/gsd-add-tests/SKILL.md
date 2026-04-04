---
name: gsd-add-tests
description: "Generate tests for a completed phase based on UAT criteria and implementation"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-add-tests` or describes a task matching this skill.
- Treat all user text after the skill mention as `{{GSD_ARGS}}`.
- If no arguments are present, treat `{{GSD_ARGS}}` as empty.

## B. User Prompting
When the workflow needs user input, prompt the user conversationally:
- Present options as a numbered list in your response text
- Ask the user to reply with their choice
- For multi-select, ask for comma-separated numbers

## C. Tool Usage
Use these Kiro tools when executing GSD workflows:
- `execute_bash` for running commands (terminal operations)
- `fs_write` with str_replace for editing existing files
- `fs_read`, `fs_write`, `glob`, `grep`, `use_subagent`, `web_search`, `web_fetch`, `todo_list` as needed

## D. Subagent Spawning
When the workflow needs to spawn a subagent, use the `use_subagent` tool:
- Set `agent_name` to the GSD agent (e.g., "gsd-executor", "gsd-planner", "gsd-verifier")
- Set `query` to the full task description including file paths to read
- Set `relevant_context` for additional context
- Up to 4 subagents can run in parallel for independent tasks
- Do NOT include `model` or `isolation` parameters — Kiro handles these automatically
</kiro_skill_adapter>

<objective>
Generate unit and E2E tests for a completed phase, using its SUMMARY.md, CONTEXT.md, and VERIFICATION.md as specifications.

Analyzes implementation files, classifies them into TDD (unit), E2E (browser), or Skip categories, presents a test plan for user approval, then generates tests following RED-GREEN conventions.

Output: Test files committed with message `test(phase-{N}): add unit and E2E tests from add-tests command`
</objective>

<available_agent_types>
Valid GSD subagent types (use exact names — do not fall back to 'general-purpose'):
- gsd-executor — Generates and runs tests based on phase specifications
</available_agent_types>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/add-tests.md
</execution_context>

<context>
Phase: {{GSD_ARGS}}

@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<process>
## Orchestrator Steps (do these yourself)
1. Initialize context via `gsd-tools.cjs init add-tests`
2. Parse {{GSD_ARGS}} for phase number and additional instructions
3. Gather phase artifacts: SUMMARY.md, CONTEXT.md, VERIFICATION.md

## DELEGATE — Spawn gsd-executor
4. Spawn gsd-executor with test generation context
   - Pass phase artifacts, implementation file list, workflow from @$HOME/.kiro/get-shit-done/workflows/add-tests.md
   - Executor handles file classification, test plan creation, RED-GREEN test generation, and commits
   - Do NOT classify files or write tests yourself

## Orchestrator Steps (do these yourself)
5. Collect executor results (test files created, coverage summary)
6. Present results and any gap reports to user
</process>
