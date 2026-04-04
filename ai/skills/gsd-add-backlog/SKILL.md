---
name: gsd-add-backlog
description: "Add an idea to the backlog parking lot (999.x numbering)"
---

<kiro_skill_adapter>
## A. Skill Invocation
- This skill is invoked when the user mentions `gsd-add-backlog` or describes a task matching this skill.
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
Add a backlog item to the roadmap using 999.x numbering. Backlog items are
unsequenced ideas that aren't ready for active planning — they live outside
the normal phase sequence and accumulate context over time.
</objective>

<process>

1. **Read ROADMAP.md** to find existing backlog entries:
   ```bash
   cat .planning/ROADMAP.md
   ```

2. **Find next backlog number:**
   ```bash
   NEXT=$(node "$HOME/.kiro/get-shit-done/bin/gsd-tools.cjs" phase next-decimal 999 --raw)
   ```
   If no 999.x phases exist, start at 999.1.

3. **Create the phase directory:**
   ```bash
   SLUG=$(node "$HOME/.kiro/get-shit-done/bin/gsd-tools.cjs" generate-slug "{{GSD_ARGS}}")
   mkdir -p ".planning/phases/${NEXT}-${SLUG}"
   touch ".planning/phases/${NEXT}-${SLUG}/.gitkeep"
   ```

4. **Add to ROADMAP.md** under a `## Backlog` section. If the section doesn't exist, create it at the end:

   ```markdown
   ## Backlog

   ### Phase {NEXT}: {description} (BACKLOG)

   **Goal:** [Captured for future planning]
   **Requirements:** TBD
   **Plans:** 0 plans

   Plans:
   - [ ] TBD (promote with /gsd-review-backlog when ready)
   ```

5. **Commit:**
   ```bash
   node "$HOME/.kiro/get-shit-done/bin/gsd-tools.cjs" commit "docs: add backlog item ${NEXT} — ${ARGUMENTS}" --files .planning/ROADMAP.md ".planning/phases/${NEXT}-${SLUG}/.gitkeep"
   ```

6. **Report:**
   ```
   ## 📋 Backlog Item Added

   Phase {NEXT}: {description}
   Directory: .planning/phases/{NEXT}-{slug}/

   This item lives in the backlog parking lot.
   Use /gsd-discuss-phase {NEXT} to explore it further.
   Use /gsd-review-backlog to promote items to active milestone.
   ```

</process>

<notes>
- 999.x numbering keeps backlog items out of the active phase sequence
- Phase directories are created immediately, so /gsd-discuss-phase and /gsd-plan-phase work on them
- No `Depends on:` field — backlog items are unsequenced by definition
- Sparse numbering is fine (999.1, 999.3) — always uses next-decimal
</notes>
