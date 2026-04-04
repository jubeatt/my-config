---
name: gsd-workstreams
description: "Manage parallel workstreams — list, create, switch, status, progress, complete, and resume"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-workstreams` or describes a task matching this skill.
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

# /gsd-workstreams

Manage parallel workstreams for concurrent milestone work.

## Usage

`/gsd-workstreams [subcommand] [args]`

### Subcommands

| Command | Description |
|---------|-------------|
| `list` | List all workstreams with status |
| `create <name>` | Create a new workstream |
| `status <name>` | Detailed status for one workstream |
| `switch <name>` | Set active workstream |
| `progress` | Progress summary across all workstreams |
| `complete <name>` | Archive a completed workstream |
| `resume <name>` | Resume work in a workstream |

## Step 1: Parse Subcommand

Parse the user's input to determine which workstream operation to perform.
If no subcommand given, default to `list`.

## Step 2: Execute Operation

### list
Run: `node "$GSD_TOOLS" workstream list --raw --cwd "$CWD"`
Display the workstreams in a table format showing name, status, current phase, and progress.

### create
Run: `node "$GSD_TOOLS" workstream create <name> --raw --cwd "$CWD"`
After creation, display the new workstream path and suggest next steps:
- `/gsd-new-milestone --ws <name>` to set up the milestone

### status
Run: `node "$GSD_TOOLS" workstream status <name> --raw --cwd "$CWD"`
Display detailed phase breakdown and state information.

### switch
Run: `node "$GSD_TOOLS" workstream set <name> --raw --cwd "$CWD"`
Also set `GSD_WORKSTREAM` env var for the current session.

### progress
Run: `node "$GSD_TOOLS" workstream progress --raw --cwd "$CWD"`
Display a progress overview across all workstreams.

### complete
Run: `node "$GSD_TOOLS" workstream complete <name> --raw --cwd "$CWD"`
Archive the workstream to milestones/.

### resume
Set the workstream as active and suggest `/gsd-resume-work --ws <name>`.

## Step 3: Display Results

Format the JSON output from gsd-tools into a human-readable display.
Include the `${GSD_WS}` flag in any routing suggestions.
