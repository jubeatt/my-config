---
name: gsd-note
description: "Zero-friction idea capture. Append, list, or promote notes to todos."
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-note` or describes a task matching this skill.
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
Zero-friction idea capture — one Write call, one confirmation line.

Three subcommands:
- **append** (default): Save a timestamped note file. No questions, no formatting.
- **list**: Show all notes from project and global scopes.
- **promote**: Convert a note into a structured todo.

Runs inline — no Task, no conversational prompting, no Bash.
</objective>

<execution_context>
@$HOME/.kiro/get-shit-done/workflows/note.md
@$HOME/.kiro/get-shit-done/references/ui-brand.md
</execution_context>

<context>
{{GSD_ARGS}}
</context>

<process>
Execute the note workflow from @$HOME/.kiro/get-shit-done/workflows/note.md end-to-end.
Capture the note, list notes, or promote to todo — depending on arguments.
</process>
