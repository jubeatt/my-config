---
inclusion: always
---

# CRITICAL

- **ALWAYS** respond in Traditional Chinese (zh-TW)
- **ALWAYS** write code comments in English
- **ALWAYS** write commit messages in English
- **ALWAYS** match the existing repo's style, even if it differs from personal preference
- When unsure, **ALWAYS** check the codebase first — **DO NOT** guess
- When the user is asking a question or seeking advice about code, **DO NOT** modify any files — explain the approach first and wait for explicit instruction to proceed
- When the user sends **`rule?`**, it means the agent is not following its responsibilities or has broken a rule. You **MUST** immediately re-read all relevant steering rules and your own agent prompt (e.g., `developer.md`, `reviewer.md`, etc.) to identify what rule you violated. Then acknowledge the violation and correct your behavior. If you genuinely cannot identify the issue, ask the user to clarify what went wrong.

# Workflow

- **ALWAYS** read existing code and related files before making changes
- If the project has test or lint commands, **ALWAYS** run them before finishing to ensure nothing is broken and standards are met
- Prefer non-interactive commands (e.g., `git --no-pager diff`)
- **ALWAYS** format files after modifying them — use the project's own formatter if configured, otherwise run `biome format --write <file>`

# Code Style

- Use Biome as formatter and linter — **DO NOT** use ESLint or Prettier
- **ALWAYS** use named exports — **DO NOT** use default exports
- In TypeScript, prefer `type` over `interface`
- Keep functions small and focused — single responsibility
- **ALWAYS** use `pnpm` as the package manager — **DO NOT** use `npm` or `yarn`

# Boundaries

## Ask before doing

- Installing or removing packages
- Deleting files
- Changing database schemas
- Adding new dependencies

## NEVER DO

- Commit secrets, `.env` files, or anything containing personal information (credentials, tokens, etc.)
- Modify `node_modules/`, `dist/`, or `build/` directories
