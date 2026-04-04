---
name: gsd-audit-milestone
description: "Audit milestone completion against original intent before archiving"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-audit-milestone` or describes a task matching this skill.
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
Verify milestone achieved its definition of done. Check requirements coverage, cross-phase integration, and end-to-end flows.

**This command IS the orchestrator.** Reads existing VERIFICATION.md files (phases already verified during execute-phase), aggregates tech debt and deferred gaps, then spawns integration checker for cross-phase wiring.
</objective>

<available_agent_types>
Valid GSD subagent types (use exact names — do not fall back to 'general-purpose'):
- gsd-integration-checker — Checks cross-phase integration and wiring
</available_agent_types>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/audit-milestone.md
</execution_context>

<context>
Version: {{GSD_ARGS}} (optional — defaults to current milestone)

Core planning files are resolved in-workflow (`init milestone-op`) and loaded only as needed.

**Completed Work:**
Glob: .planning/phases/*/*-SUMMARY.md
Glob: .planning/phases/*/*-VERIFICATION.md
</context>

<process>
## Orchestrator Steps (do these yourself)
1. Initialize context via `gsd-tools.cjs init milestone-op`
2. Read existing VERIFICATION.md and SUMMARY.md files from all phases
3. Aggregate tech debt and deferred gaps
4. Determine scope of integration check needed

## DELEGATE — Spawn gsd-integration-checker
5. Spawn gsd-integration-checker for cross-phase wiring validation
   - Pass phase summaries, verification results, and integration points
   - Do NOT perform integration checks yourself

## Orchestrator Steps (do these yourself)
6. Collect integration check results
7. Compile final audit report (requirements coverage, tech debt, gaps)
8. Present results and recommend next steps (complete milestone or fix gaps)
</process>
