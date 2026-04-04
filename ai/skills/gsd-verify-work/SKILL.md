---
name: gsd-verify-work
description: "Validate built features through conversational UAT"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-verify-work` or describes a task matching this skill.
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
Validate built features through conversational testing with persistent state.

Purpose: Confirm what Claude built actually works from user's perspective. One test at a time, plain text responses, no interrogation. When issues are found, automatically diagnose, plan fixes, and prepare for execution.

Output: {phase_num}-UAT.md tracking all test results. If issues found: diagnosed gaps, verified fix plans ready for /gsd-execute-phase
</objective>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/verify-work.md
@$HOME/.kiro/get-shit-done/templates/UAT.md
</execution_context>

<context>
Phase: {{GSD_ARGS}} (optional)
- If provided: Test specific phase (e.g., "4")
- If not provided: Check for active sessions or prompt for phase

Context files are resolved inside the workflow (`init verify-work`) and delegated via `<files_to_read>` blocks.
</context>

<available_agent_types>
Valid GSD subagent types (use exact names — do not fall back to 'general-purpose'):
- gsd-verifier — Validates built features against specs and runs UAT
</available_agent_types>

<process>
## Orchestrator Steps (do these yourself)
1. Initialize context via `gsd-tools.cjs init verify-work`
2. Parse {{GSD_ARGS}} for phase number
3. Check for active verification sessions

## DELEGATE — Spawn gsd-verifier
4. Spawn gsd-verifier with phase context
   - Pass phase number, SUMMARY.md paths, VERIFICATION.md template, UAT criteria
   - The verifier handles all testing, diagnosis, and gap identification
   - Do NOT run tests or verify work yourself

## Orchestrator Steps (do these yourself)
5. Collect verifier results (UAT.md, any gap plans)
6. If issues found: present diagnosed gaps and fix plans to user
7. Offer to run `/gsd-execute-phase --gaps-only` for fixes
</process>
