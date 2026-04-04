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

### 建立 Symbolic Link

將 VSCode / Kiro 的設定檔指向這個 repo 裡的檔案。

```bash
# VSCode (macOS)
ln -sf "$(pwd)/.vscode/settings.json" "$HOME/Library/Application Support/Code/User/settings.json"

# Kiro (macOS)
ln -sf "$(pwd)/.vscode/settings.json" "$HOME/Library/Application Support/Kiro/User/settings.json"
```

> 如果目標路徑已有檔案，`ln -sf` 會自動覆蓋。建議先備份原本的設定檔再執行。
