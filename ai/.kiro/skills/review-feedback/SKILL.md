---
name: review-feedback
description: >
  讀取 GitHub PR 的 review comments，比對最新 commit 的 diff，產生結構化的 feedback 修正紀錄 comment。
  適用於 PR 經過 code review 後，需要回覆哪些項目已修正、哪些暫不處理的場景。
---

# Skill: Review Feedback

讀取 PR 的 review comment，比對指定 commit 的修改內容，產生結構化的 feedback 修正紀錄並留在 PR comment。

## 觸發條件

使用者提到「留 feedback」、「review feedback」、「修正紀錄」，或指定某個 PR 需要回覆 review。

## 流程

### 1. 收集資訊

需要從使用者取得：

- **PR URL 或編號**（必要）
- **第幾輪 feedback**（必要，用於標題及定位對應的 review comment）
- **對應的 commit**（必要，用於比對 diff）

```bash
# 讀取 PR 資訊（title, body, comments, commits）
gh pr view <number> --repo <owner/repo> --json title,body,comments,commits

# 取得指定 commit 的 diff
git --no-pager diff <commit>^..<commit>
```

### 2. 定位對應的 Review Comment

PR 上可能有多輪 review comment（通常由 bot 或 reviewer 留下）。**第 N 輪 feedback 必須比對第 N 筆 review comment**，而非最新一筆。

定位方式：

1. 從 PR comments 中篩選出所有 review comment（通常是 `github-actions` bot 留的，以 `# PR Review` 開頭）
2. 按時間排序，第 N 筆即為第 N 輪 feedback 要比對的 review
3. **不要**用前一輪 feedback 的「暫不處理」項目作為比對來源 — 每輪都要從對應的 review comment 重新解析 findings

```bash
# 列出所有 comments 的作者和前 120 字，確認哪些是 review comment
gh pr view <number> --json comments --jq '.comments[] | {author: .author.login, preview: (.body[:120])}'

# 取得第 N 筆 review comment（0-indexed，跳過非 review 的 comment）
# 例如第 2 輪 feedback 要取第 2 筆 review comment（index 視實際排列而定）
```

### 3. 分析 Review Comment

從定位到的 review comment 中識別每個 finding 的：
- **嚴重度**：Critical / Important / Suggestion
- **類別**：Correctness / Architecture / Readability / Performance
- **位置**：檔案路徑和行號
- **問題描述**

### 4. 比對 Diff

將 commit diff 與每個 finding 逐一比對：

- **已修正**：diff 中有對應的修改，且修改方向與建議一致
- **部分修正**：有修改但未完全按建議處理（例如只改了一半，或用了不同方案）
- **暫不處理**：diff 中沒有對應修改

### 5. 產生 Feedback Comment

使用以下格式：

```markdown
## Review Feedback 修正紀錄（第 N 輪）

### ✅ 已修正

| #   | 嚴重度   | 項目         | 說明             |
| --- | -------- | ------------ | ---------------- |
| 1   | Critical | 簡短描述問題 | 簡短描述怎麼修的 |

### ⚠️ 部分修正

| #   | 嚴重度    | 項目         | 說明                   |
| --- | --------- | ------------ | ---------------------- |
| N   | Important | 簡短描述問題 | 說明修了什麼、沒修什麼 |

### ❌ 暫不處理

| #   | 嚴重度     | 項目         | 原因                          |
| --- | ---------- | ------------ | ----------------------------- |
| N   | Suggestion | 簡短描述問題 | 原因或 `<!-- placeholder -->` |
```

#### 格式規則

- 每個 section 只在有內容時才出現（例如沒有「部分修正」就不要有 `### ⚠️ 部分修正`）
- 編號從 1 開始連續編號，跨 section 連續
- 「項目」欄用反引號標註檔案名或變數名，簡短描述問題本身
- 「說明」/「原因」欄簡短扼要，一兩句話
- 若使用者未提供暫不處理的原因，填入 `<!-- placeholder -->` 讓使用者之後自行編輯

### 6. 留 Comment

```bash
gh pr comment <number> --repo <owner/repo> --body '<content>'
```

## 注意事項

- 若前一輪已有 feedback comment，參考其格式保持一致
- 嚴重度保留 review 原文的分類（Critical / Important / Suggestion），不自行調整
- 比對 diff 時注意：有些修改可能用了不同於建議的方案，只要問題被解決就算「已修正」
- 若使用者主動說明某些項目的處理方式或不處理原因，直接採用使用者的說法
