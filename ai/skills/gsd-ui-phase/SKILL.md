---
name: gsd-ui-phase
description: "Generate UI design contract (UI-SPEC.md) for frontend phases"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-ui-phase` or describes a task matching this skill.
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
Create a UI design contract (UI-SPEC.md) for a frontend phase.
Orchestrates gsd-ui-researcher and gsd-ui-checker.
Flow: Validate → Research UI → Verify UI-SPEC → Done
</objective>

<available_agent_types>
Valid GSD subagent types (use exact names — do not fall back to 'general-purpose'):
- gsd-ui-researcher — Researches UI patterns, component libraries, and design systems
- gsd-ui-checker — Validates UI-SPEC.md against design standards and accessibility
</available_agent_types>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/ui-phase.md
@$HOME/.kiro/get-shit-done/references/ui-brand.md
</execution_context>

<context>
Phase number: {{GSD_ARGS}} — optional, auto-detects next unplanned phase if omitted.
</context>

<process>
## Orchestrator Steps (do these yourself)
1. Initialize context via `gsd-tools.cjs init ui-phase`
2. Parse {{GSD_ARGS}} for phase number
3. Validate phase exists and is a frontend phase

## DELEGATE — Spawn gsd-ui-researcher
4. Spawn gsd-ui-researcher with phase context
   - Pass ROADMAP.md phase description, CONTEXT.md, ui-brand reference
   - Researcher produces UI-SPEC.md

## DELEGATE — Spawn gsd-ui-checker
5. Spawn gsd-ui-checker to validate the UI-SPEC.md
   - Pass UI-SPEC.md and phase requirements
   - If checker returns issues: re-spawn gsd-ui-researcher with feedback

## Orchestrator Steps (do these yourself)
6. Present UI-SPEC.md summary to user
7. Update STATE.md via gsd-tools
</process>
