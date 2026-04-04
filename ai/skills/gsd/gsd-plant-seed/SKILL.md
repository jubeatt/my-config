---
name: gsd-plant-seed
description: "Capture a forward-looking idea with trigger conditions — surfaces automatically at the right milestone"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-plant-seed` or describes a task matching this skill.
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
Capture an idea that's too big for now but should surface automatically when the right
milestone arrives. Seeds solve context rot: instead of a one-liner in Deferred that nobody
reads, a seed preserves the full WHY, WHEN to surface, and breadcrumbs to details.

Creates: .planning/seeds/SEED-NNN-slug.md
Consumed by: /gsd-new-milestone (scans seeds and presents matches)
</objective>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/plant-seed.md
</execution_context>

<process>
Execute the plant-seed workflow from @$HOME/.kiro/get-shit-done/workflows/plant-seed.md end-to-end.
</process>
