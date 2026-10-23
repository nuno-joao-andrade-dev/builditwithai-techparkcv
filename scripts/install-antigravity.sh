#!/usr/bin/env bash
# ==============================================================================
# install-antigravity.sh
# Downloads & installs Google Antigravity CLI (agy) and configures Gemini API Key
# authentication (~/.gemini/antigravity-cli/settings.json + GEMINI_API_KEY).
# ==============================================================================
set -euo pipefail

AGY_INSTALL_URL="https://antigravity.google/cli/install.sh"
AGY_BIN_DIR="${HOME}/.local/bin"
AGY_CONFIG_DIR="${HOME}/.gemini/antigravity-cli"
AGY_SETTINGS_FILE="${AGY_CONFIG_DIR}/settings.json"

echo "============================================================"
echo "  Google Antigravity CLI (agy) — Installer & Auth Setup"
echo "============================================================"

# ------------------------------------------------------------------------------
# 1. Validate if Antigravity CLI (agy) is already installed; download if missing
# ------------------------------------------------------------------------------
echo ""
echo "[1/4] Checking if Antigravity CLI (agy) is installed..."
export PATH="${AGY_BIN_DIR}:${PATH}"

if command -v agy >/dev/null 2>&1; then
  INSTALLED_VERSION="$(agy --version 2>/dev/null || echo 'unknown')"
  echo "  [OK] Antigravity CLI is already installed ($(command -v agy), version: ${INSTALLED_VERSION}) — skipping download."
else
  echo "  [INFO] Antigravity CLI not found. Downloading and installing..."
  if ! command -v curl >/dev/null 2>&1; then
    echo "[ERROR] 'curl' is required but not installed. Please install curl first." >&2
    exit 1
  fi

  curl -fsSL "${AGY_INSTALL_URL}" | bash

  if command -v agy >/dev/null 2>&1; then
    echo "  [OK] Antigravity CLI installed successfully (version: $(agy --version 2>/dev/null || echo 'installed'))."
  else
    echo "[ERROR] Installation completed but 'agy' binary was not found in ${AGY_BIN_DIR} or PATH." >&2
    exit 1
  fi
fi

# ------------------------------------------------------------------------------
# 2. Prompt the user for their Gemini API Key
# ------------------------------------------------------------------------------
echo ""
echo "[2/4] Configuring API Key Authentication..."

API_KEY="${GEMINI_API_KEY:-}"
if [[ -z "${API_KEY}" ]]; then
  # Read from /dev/tty so the prompt works even if the script is piped
  read -r -s -p "Enter your Gemini API Key (GEMINI_API_KEY): " API_KEY < /dev/tty
  echo ""
fi

# Strip surrounding whitespace
API_KEY="$(printf '%s' "${API_KEY}" | tr -d '[:space:]')"

if [[ -z "${API_KEY}" ]]; then
  echo "[ERROR] API Key cannot be empty. Aborting authentication setup." >&2
  exit 1
fi

# ------------------------------------------------------------------------------
# 3. Configure ~/.gemini/antigravity-cli/settings.json
# ------------------------------------------------------------------------------
echo ""
echo "[3/4] Updating ${AGY_SETTINGS_FILE}..."
mkdir -p "${AGY_CONFIG_DIR}"

if [[ -f "${AGY_SETTINGS_FILE}" ]] && grep -q '"modelProvider"' "${AGY_SETTINGS_FILE}" 2>/dev/null; then
  # Replace existing modelProvider value using sed
  sed -i.bak 's/"modelProvider"[[:space:]]*:[[:space:]]*"[^"]*"/"modelProvider": "gemini"/' "${AGY_SETTINGS_FILE}"
  rm -f "${AGY_SETTINGS_FILE}.bak"
elif [[ -f "${AGY_SETTINGS_FILE}" ]] && grep -q '{' "${AGY_SETTINGS_FILE}" 2>/dev/null; then
  # Insert "modelProvider": "gemini", right after the opening brace {
  sed -i.bak '0,/{/s/{/{\n  "modelProvider": "gemini",/' "${AGY_SETTINGS_FILE}"
  rm -f "${AGY_SETTINGS_FILE}.bak"
else
  cat > "${AGY_SETTINGS_FILE}" <<'EOF'
{
  "modelProvider": "gemini"
}
EOF
fi

chmod 600 "${AGY_SETTINGS_FILE}"
echo "  [OK] Set \"modelProvider\": \"gemini\" in ${AGY_SETTINGS_FILE}"

# ------------------------------------------------------------------------------
# 4. Persist PATH and GEMINI_API_KEY in shell profile (~/.bashrc / ~/.zshrc)
# ------------------------------------------------------------------------------
echo ""
echo "[4/4] Saving GEMINI_API_KEY to shell profile..."

update_shell_rc() {
  local rc_file="$1"
  [[ ! -f "${rc_file}" ]] && touch "${rc_file}"

  # Ensure ~/.local/bin is in PATH
  if ! grep -Fq '/.local/bin' "${rc_file}" 2>/dev/null; then
    printf '\n# Antigravity CLI PATH\nexport PATH="$HOME/.local/bin:$PATH"\n' >> "${rc_file}"
  fi

  # Remove any previous GEMINI_API_KEY export line and write the new one
  if grep -Eq '^[[:space:]]*export[[:space:]]+GEMINI_API_KEY=' "${rc_file}" 2>/dev/null; then
    sed -i.bak '/^[[:space:]]*export[[:space:]]\+GEMINI_API_KEY=/d' "${rc_file}"
    rm -f "${rc_file}.bak"
  fi

  printf 'export GEMINI_API_KEY="%s"\n' "${API_KEY}" >> "${rc_file}"
  echo "  [OK] Updated ${rc_file}"
}

update_shell_rc "${HOME}/.bashrc"
if [[ -f "${HOME}/.zshrc" ]]; then
  update_shell_rc "${HOME}/.zshrc"
fi

export GEMINI_API_KEY="${API_KEY}"

echo ""
echo "============================================================"
echo "  Setup Complete!"
echo "============================================================"
echo "1. Reload your current terminal session:"
echo "     source ~/.bashrc"
echo "2. Launch Antigravity CLI:"
echo "     agy"
echo "============================================================"
