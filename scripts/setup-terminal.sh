#!/bin/bash
# Set up terminal environment: font, oh-my-zsh, plugins, iTerm2 config, zshrc symlink.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

# -- Font --
if ls ~/Library/Fonts/JetBrainsMonoNerdFont* &>/dev/null; then
  echo "✓ JetBrains Mono Nerd Font already installed"
else
  echo "Installing JetBrains Mono Nerd Font..."
  brew install --cask font-jetbrains-mono-nerd-font
fi

# -- Oh My Zsh --
if [ -d "$HOME/.oh-my-zsh" ]; then
  echo "✓ Oh My Zsh already installed"
else
  echo "Installing Oh My Zsh..."
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# -- zsh-autosuggestions plugin --
ZSH_AUTOSUGGEST_DIR="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
if [ -d "$ZSH_AUTOSUGGEST_DIR" ]; then
  echo "✓ zsh-autosuggestions already installed"
else
  echo "Installing zsh-autosuggestions..."
  git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_AUTOSUGGEST_DIR"
fi

# -- iTerm2 custom folder --
ITERM_PREFS_DIR="$REPO_DIR/terminal/iterm2"
CURRENT=$(defaults read com.googlecode.iterm2 PrefsCustomFolder 2>/dev/null || echo "")
if [ "$CURRENT" = "$ITERM_PREFS_DIR" ]; then
  echo "✓ iTerm2 custom folder already set"
else
  echo "Setting iTerm2 custom preferences folder..."
  defaults write com.googlecode.iterm2 PrefsCustomFolder -string "$ITERM_PREFS_DIR"
  defaults write com.googlecode.iterm2 LoadPrefsFromCustomFolder -bool true
  echo "  → Restart iTerm2 to apply settings"
fi

# -- Custom zsh theme --
THEME_SRC="$REPO_DIR/terminal/oh-my-zsh/tonotdo.zsh-theme"
THEME_DEST="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/tonotdo.zsh-theme"
if [ -L "$THEME_DEST" ] && [ "$(readlink "$THEME_DEST")" = "$THEME_SRC" ]; then
  echo "✓ tonotdo theme symlink already set"
else
  echo "Linking tonotdo theme..."
  mkdir -p "$(dirname "$THEME_DEST")"
  ln -sf "$THEME_SRC" "$THEME_DEST"
  echo "  ✓ tonotdo.zsh-theme -> $THEME_SRC"
fi

# -- .zshrc symlink --
echo ""
node "$SCRIPT_DIR/link-configs.js" --zsh

echo ""
echo "Done."
