# DevUtils for VS Code (by Techwasti)

A developer toolbox directly inside Visual Studio Code. Offline-first, privacy-focused, zero external network dependency utility suite for everyday developer tasks.

[![CI](https://github.com/Techwasti-Infotech/dev-utils-VSCode-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/Techwasti-Infotech/dev-utils-VSCode-plugin/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/Docs-GitHub%20Pages-blue)](https://Techwasti-Infotech.github.io/dev-utils-VSCode-plugin/)
[![VS Code Version](https://img.shields.io/badge/VS%20Code-%3E%3D%201.75.0-brightgreen.svg)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Features

DevUtils brings common developer utilities directly into VS Code via both an **Interactive Webview Dashboard**, **Command Palette / Context Menu**, and **Keyboard Shortcuts**:

1. **Encoders & Decoders**
   - Base64 (Text & UTF-8 safe)
   - URL Encode / Decode
   - HTML Entities Encode / Decode
   - Hex Converter (Text <-> Hex)
   - JWT Decoder & Inspector (Header, Payload Claims, Expiry verification)

2. **Formatters & Beautifiers**
   - JSON Formatter & Minifier with syntax validation
   - XML Formatter & Minifier
   - SQL Query Formatter (keywords uppercase, clauses formatted)
   - CSV ⇄ JSON bidirectional converter

3. **Generators & Identifiers**
   - UUID / GUID Generator (RFC 4122 v4)
   - Nanoid Generator
   - Cryptographic Hash & Checksum (SHA-256, MD5, SHA-1)
   - Lorem Ipsum Generator (paragraphs & sentences)

4. **Time & Date Tools**
   - Unix Epoch Timestamp <-> Human Readable Date / ISO 8601
   - Insert Current Epoch (seconds & milliseconds)

5. **Text & Line Utilities**
   - Case Converters (camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, Title Case)
   - Line Sorter (A-Z, Z-A)
   - Deduplicate Lines
   - Text Statistics (Characters, Words, Lines, Byte size)

6. **Color & Web Helpers**
   - HEX <-> RGB Converter with live color swatch preview

---

## ⌨️ Keyboard Shortcuts

| Utility | Windows / Linux Shortcut | macOS Shortcut | Context |
| :--- | :--- | :--- | :--- |
| **Open DevUtils Dashboard** | `Ctrl + Alt + D` | `Cmd + Alt + D` | Global |
| **Base64 Encode** | `Ctrl + Alt + B` then `E` | `Cmd + Alt + B` then `E` | Active Selection |
| **Base64 Decode** | `Ctrl + Alt + B` then `D` | `Cmd + Alt + B` then `D` | Active Selection |
| **JSON Format / Prettify** | `Ctrl + Alt + J` then `F` | `Cmd + Alt + J` then `F` | Editor |
| **JSON Minify** | `Ctrl + Alt + J` then `M` | `Cmd + Alt + J` then `M` | Editor |
| **JWT Token Inspector** | `Ctrl + Alt + J` then `W` | `Cmd + Alt + J` then `W` | Global |
| **Generate UUID v4** | `Ctrl + Alt + U` | `Cmd + Alt + U` | Editor cursor |
| **Insert Current Epoch** | `Ctrl + Alt + T` | `Cmd + Alt + T` | Editor cursor |
| **Sort Lines A-Z** | `Ctrl + Alt + S` | `Cmd + Alt + S` | Active Selection |

---

## 🛠️ Usage

### 1. Interactive DevUtils Dashboard
Press `Ctrl+Alt+D` (or `Cmd+Alt+D` on macOS), or run `DevUtils: Open Developer Dashboard` from the Command Palette (`Ctrl+Shift+P`).

### 2. Context Menu
Right click anywhere in an open file or selection and navigate to **DevUtils Toolbox** for quick one-click actions.

---

## 💻 Compatibility & Local Development

- **VS Code Engine Compatibility**: `>= 1.75.0` (compatible with all modern VS Code, Cursor, and VSCodium versions).
- **Node.js**: `>= 18.x` (tested across Node 18, 20, and 22).

### Setup
```bash
git clone git@github.com:Techwasti-Infotech/dev-utils-VSCode-plugin.git
cd dev-utils-VSCode-plugin
npm install
npm test
npm run compile
```

### Packaging & Publishing
- Package locally to `.vsix`:
  ```bash
  npm run package
  ```
- Install local `.vsix` in VS Code:
  ```bash
  code --install-extension dev-utils-vscode-plugin-0.2.0.vsix
  ```
- **Automated CI/CD Publishing**:
  Set the `VSCE_PAT` (Personal Access Token from [Azure DevOps / VS Code Marketplace](https://marketplace.visualstudio.com/manage)) in your GitHub Repository Secrets (`Settings > Secrets and variables > Actions`). Trigger the `Release & Publish VS Code Extension` workflow or create a GitHub Release tag to automatically package, attach the VSIX artifact, and publish to the VS Code Marketplace.

---

## 📄 License
MIT License - Copyright (c) 2026 **Techwasti Infotech** (`techwastiinfotech@gmail.com`).
