# my config

存一些和開發相關的 config

## VSCode

### 安裝推薦的 Extensions

```bash
# VSCode
cat .vscode/extensions.json | jq -r '.recommendations[]' | xargs -L 1 code --install-extension

# Kiro
cat .vscode/extensions.json | jq -r '.recommendations[]' | xargs -L 1 kiro --install-extension
```

### 從 IDE 同步 Extensions 清單

以目前 IDE 安裝的插件為主，更新 `.vscode/extensions.json`。

```bash
# 從 VSCode 同步
node scripts/gen-vscode-extensions.js --vscode

# 從 Kiro 同步
node scripts/gen-vscode-extensions.js --kiro

# 兩者合併
node scripts/gen-vscode-extensions.js --vscode --kiro

# 預覽變更，不寫入檔案
node scripts/gen-vscode-extensions.js --vscode --dryrun
```

> 不帶 `--vscode` / `--kiro` 時會互動式提示選擇。

### 建立 Symbolic Link

將 VSCode / Kiro 的設定檔指向這個 repo 裡的檔案。

```bash
# VSCode (macOS)
ln -sf "$(pwd)/.vscode/settings.json" "$HOME/Library/Application Support/Code/User/settings.json"

# Kiro (macOS)
ln -sf "$(pwd)/.vscode/settings.json" "$HOME/Library/Application Support/Kiro/User/settings.json"
```

> 如果目標路徑已有檔案，`ln -sf` 會自動覆蓋。建議先備份原本的設定檔再執行。
