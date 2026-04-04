---
name: gsd-manager
description: "Interactive command center for managing multiple phases from one terminal"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-manager` or describes a task matching this skill.
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
Single-terminal command center for managing a milestone. Shows a dashboard of all phases with visual status indicators, recommends optimal next actions, and dispatches work — discuss runs inline, plan/execute run as background agents.

Designed for power users who want to parallelize work across phases from one terminal: discuss a phase while another plans or executes in the background.

**Creates/Updates:**
- No files created directly — dispatches to existing GSD commands via Skill() and background Task agents.
- Reads `.planning/STATE.md`, `.planning/ROADMAP.md`, phase directories for status.

**After:** User exits when done managing, or all phases complete and milestone lifecycle is suggested.
</objective>

<available_agent_types>
Valid GSD subagent types (use exact names — do not fall back to 'general-purpose'):
- gsd-planner — Creates implementation plans for phases
- gsd-executor — Executes plans (code, tests, commits)
- gsd-phase-researcher — Researches phase requirements
- gsd-verifier — Validates completed phases
</available_agent_types>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/manager.md
@$HOME/.kiro/get-shit-done/references/ui-brand.md
</execution_context>

<context>
No arguments required. Requires an active milestone with ROADMAP.md and STATE.md.

Project context, phase list, dependencies, and recommendations are resolved inside the workflow using `gsd-tools.cjs init manager`. No upfront context loading needed.
</context>

<process>
## Orchestrator Steps (do these yourself)
1. Initialize context via `gsd-tools.cjs init manager`
2. Build and display phase dashboard with status indicators
3. Recommend optimal next actions based on phase states

## DELEGATE — Dispatch work via subagents
4. When user selects an action, spawn the appropriate subagent:
   - "Plan phase X" → invoke plan-phase skill (includes researcher + planner + checker pipeline)
   - "Execute phase X" → invoke execute-phase skill (includes executor + verifier pipeline)
   - "Verify phase X" → invoke verify-work skill (spawns gsd-verifier)
   - "Research phase X" → spawn gsd-phase-researcher
   - Discuss runs inline (lightweight, orchestrator handles)
5. Collect subagent results, refresh dashboard

## Orchestrator Steps (do these yourself)
6. Loop: display updated dashboard → recommend next → dispatch
7. Exit when user is done or all phases complete
</process>
