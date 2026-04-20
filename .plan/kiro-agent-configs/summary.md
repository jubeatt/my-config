# Summary: Kiro Agent Configs Overhaul

## 背景

擴充 `ai/.kiro/` 的 agent、skill、hook 設定，新增 7 個 agent、3 個 skill、1 個 hook，並升級既有 8 個 agent 的 prompt，同時保留既有慣例（手寫 JSON、steering/rules.md、Biome、pnpm）。

## 決策紀錄

### 採用

| 項目                   | 說明                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| 7 個新 agent           | planner, librarian, researcher, council-master, councillor-a/b/c — 含 .md + .json       |
| 8 個 agent prompt 升級 | code_supervisor, developer, explorer, reviewer, designer, debugger, tester, simplifier — XML tags 結構、新增功能 |
| 3 個新 skill           | get-code-context-exa, web-search-advanced-research-paper-exa, council-session            |
| 1 個新 hook            | phase-reminder.sh（postResponse on code_supervisor）                                     |
| README.md              | 新增使用指南（zh-TW）                                                                    |

### 不採用

| 項目              | 原因                                      |
| ----------------- | ----------------------------------------- |
| cartography skill | 功能與 explorer 的 exploration-brief 重疊 |

### 特殊處理

| 項目                                      | 處理方式                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| simplifier.md                             | 移除 mcpServers frontmatter；「Git MCP tools」→「Git command line tools」 |
| designer.md / explorer.md / researcher.md | 移除 mcpServers frontmatter（MCP 設定由 .json 管理）                      |
| councillor-b.json                         | model 設為 `glm-5`，description 標註 "(GLM-5)"                            |
| councillor-c.json                         | model 設為 `claude-opus-4.5`                                              |

## 變更清單

### 修改的檔案（10 個）

- `ai/.kiro/agents/code_supervisor.md` — 重大改寫：Planner 委派、grill loop、8 階段 workflow、Communication 規則
- `ai/.kiro/agents/code_supervisor.json` — 加入 7 個新 agent 到 availableAgents/trustedAgents + phase-reminder hook
- `ai/.kiro/agents/developer.md` — 新增 EfficiencyPrinciples、結構化 Output、subagent constraint
- `ai/.kiro/agents/explorer.md` — 新增 compact results format、subagent constraint；移除 mcpServers frontmatter
- `ai/.kiro/agents/reviewer.md` — 新增 SimplificationPrinciples (YAGNI)、subagent constraint
- `ai/.kiro/agents/designer.md` — 新增 DesignPrinciples（7 子項）、擴充 Capabilities；移除 mcpServers frontmatter
- `ai/.kiro/agents/debugger.md` — 新增 DeepArchitecturalReasoning
- `ai/.kiro/agents/tester.md` — 新增 subagent constraint
- `ai/.kiro/agents/simplifier.md` — 移除 mcpServers frontmatter、Git MCP → Git CLI
- `ai/.kiro/agents/light.json` — 加入 7 個新 agent 到 availableAgents/trustedAgents

### 新增的檔案（22 個）

**Agents（14 個）：**
- `ai/.kiro/agents/planner.md` + `planner.json`
- `ai/.kiro/agents/librarian.md` + `librarian.json`
- `ai/.kiro/agents/researcher.md` + `researcher.json`
- `ai/.kiro/agents/council-master.md` + `council-master.json`
- `ai/.kiro/agents/councillor-a.md` + `councillor-a.json`
- `ai/.kiro/agents/councillor-b.md` + `councillor-b.json`
- `ai/.kiro/agents/councillor-c.md` + `councillor-c.json`

**Skills（3 個）：**
- `ai/.kiro/skills/get-code-context-exa/SKILL.md`
- `ai/.kiro/skills/web-search-advanced-research-paper-exa/SKILL.md`
- `ai/.kiro/skills/council-session/SKILL.md`

**Hooks（1 個）：**
- `ai/.kiro/hooks/phase-reminder.sh`

**文件（1 個）：**
- `ai/.kiro/README.md`

### 刪除的檔案

- `ai/.kiro/skills/cartography/`（整個目錄）

## 目前架構

### Agent 總覽（15 個）

| Agent           | Model           | MCP 依賴                                              |
| --------------- | --------------- | ----------------------------------------------------- |
| code_supervisor | claude-opus-4.6 | —                                                     |
| light           | claude-opus-4.6 | @context7, @exa, @figma-developer-mcp, @mcp-atlassian |
| planner         | claude-opus-4.6 | —                                                     |
| developer       | claude-opus-4.6 | @chrome-devtools                                      |
| reviewer        | claude-opus-4.6 | —                                                     |
| designer        | claude-opus-4.6 | @figma-developer-mcp                                  |
| simplifier      | claude-opus-4.6 | —                                                     |
| tester          | claude-opus-4.6 | —                                                     |
| debugger        | claude-opus-4.6 | —                                                     |
| explorer        | claude-opus-4.6 | @context7, @exa, @chrome-devtools                     |
| librarian       | claude-opus-4.6 | @context7, @exa                                       |
| researcher      | claude-opus-4.6 | @exa                                                  |
| council-master  | claude-opus-4.6 | —                                                     |
| councillor-a    | claude-opus-4.6 | —                                                     |
| councillor-b    | glm-5           | —                                                     |
| councillor-c    | claude-opus-4.5 | —                                                     |

### Skills（7 個）

git-workflow, playwright-cli, vercel-react-best-practices, vercel-composition-patterns, get-code-context-exa, web-search-advanced-research-paper-exa, council-session

### Hooks（2 個）

- phase-reminder.sh — workflow 階段提醒（postResponse on code_supervisor）

## 後續可迭代方向

- councillor-b description 仍寫 "(GLM-5)"，若換 model 記得同步更新
- council-session SKILL.md 中提到 `generate-configs.sh` 來換 model，但我們用手寫 JSON，可考慮更新該段說明
- light.md 中的 agent 列表仍是舊版（7 個），可考慮更新加入新 agent 描述
