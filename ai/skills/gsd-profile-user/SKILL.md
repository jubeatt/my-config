---
name: gsd-profile-user
description: "Generate developer behavioral profile and create Claude-discoverable artifacts"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-profile-user` or describes a task matching this skill.
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
Generate a developer behavioral profile from session analysis (or questionnaire) and produce artifacts (USER-PROFILE.md, /gsd-dev-preferences, .kiro/steering/ section) that personalize Claude's responses.

Routes to the profile-user workflow which orchestrates the full flow: consent gate, session analysis or questionnaire fallback, profile generation, result display, and artifact selection.
</objective>

<available_agent_types>
Valid GSD subagent types (use exact names — do not fall back to 'general-purpose'):
- gsd-user-profiler — Analyzes developer sessions and generates behavioral profiles
</available_agent_types>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/profile-user.md
@$HOME/.kiro/get-shit-done/references/ui-brand.md
</execution_context>

<context>
Flags from {{GSD_ARGS}}:
- `--questionnaire` -- Skip session analysis entirely, use questionnaire-only path
- `--refresh` -- Rebuild profile even when one exists, backup old profile, show dimension diff
</context>

<process>
## Orchestrator Steps (do these yourself)
1. Initialize context and check for existing profile
2. Parse {{GSD_ARGS}} for flags (--questionnaire, --refresh)
3. Run consent gate before session analysis

## DELEGATE — Spawn gsd-user-profiler
4. Spawn gsd-user-profiler with session data or questionnaire mode
   - Pass session logs, existing profile (if --refresh), and mode flags
   - Profiler handles all analysis, scoring, and profile generation
   - Do NOT analyze sessions or generate profiles yourself

## Orchestrator Steps (do these yourself)
5. Collect profiler results (USER-PROFILE.md)
6. Display report card and highlights to user
7. Offer artifact selection (dev-preferences, .kiro/steering/ sections)
8. If user selects artifacts: spawn gsd-user-profiler again for artifact generation
</process>
