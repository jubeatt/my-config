# my config

存一些和開發相關的 config（VSCode / Kiro）。

## 建立 Symbolic Link

把 repo 裡的 `settings.json` 和 `keybindings.json` 透過 symbolic link 指向 IDE

```bash
node scripts/link-ide-configs.js --vscode
node scripts/link-ide-configs.js --kiro
```

> 不帶參數時會互動式提示選擇。

## 安裝 Extensions

從 `ide/<editor>/extensions.json` 讀取清單並安裝。

```bash
node scripts/install-extensions.js --vscode
node scripts/install-extensions.js --kiro
```

## 同步 Extensions 清單

以目前 IDE 安裝的插件為主，更新 `ide/<editor>/extensions.json`。

```bash
node scripts/gen-vscode-extensions.js --vscode
node scripts/gen-vscode-extensions.js --kiro

# 預覽變更，不寫入檔案
node scripts/gen-vscode-extensions.js --vscode --dryrun
```
