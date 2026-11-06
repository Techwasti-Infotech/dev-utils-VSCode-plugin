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
   - JSON Stringify & Escape / Parse Stringified JSON (handles escaped JSON string payloads)
   - YAML Formatter & Prettifier
   - YAML ⇄ JSON Bidirectional Converter
   - YAML ⇄ Java `.properties` Bidirectional Converter
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

6. **API & Code Generation Tools**
   - cURL to Code Converter (JavaScript `fetch` & Python `requests`)
   - JSON to TypeScript Interface Generator
   - Cron Expression Explainer & Humanizer

7. **Color & Web Helpers**
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

## 🛠️ How to Use & Practical Examples

DevUtils is designed to work seamlessly without leaving your workflow:

### 3 Quick Ways to Use Any Tool:
1. **Command Palette**: Press `Ctrl + Shift + P` (or `Cmd + Shift + P`) and type `DevUtils:` to pick any tool.
2. **Right-Click Context Menu**: Select text, right-click, and choose **DevUtils Toolbox**.
3. **Interactive Dashboard**: Press `Ctrl + Alt + D` (or `Cmd + Alt + D`) to open the tabbed UI with live preview and "Load Sample" buttons.

---

### 💡 Real-World Examples

#### 1. SQL Query Formatter (`DevUtils: SQL: Format Query`)
* **Before (messy single-line query)**:
  ```sql
  select u.id, u.name, o.total from users u left join orders o on u.id = o.user_id where u.active = 1 and o.status = "complete" order by o.total desc limit 10
  ```
* **After running DevUtils**:
  ```sql
  SELECT u.id, u.name, o.total
  FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
  WHERE u.active = 1
    AND o.status = "complete"
  ORDER BY o.total DESC
  LIMIT 10
  ```

#### 2. CSV to JSON Converter (`DevUtils: CSV: Convert CSV to JSON`)
* **Before (CSV table)**:
  ```csv
  id,product,price,in_stock
  1,VS Code Extension,0.00,true
  2,Offline Toolbox,0.00,true
  ```
* **After running DevUtils**:
  ```json
  [
    {
      "id": 1,
      "product": "VS Code Extension",
      "price": 0,
      "in_stock": true
    },
    {
      "id": 2,
      "product": "Offline Toolbox",
      "price": 0,
      "in_stock": true
    }
  ]
  ```

#### 3. JSON Prettifier & Minifier (`DevUtils: JSON: Format / Prettify`)
* **Before (Unformatted JSON string)**:
  ```json
  {"name":"Techwasti","tools":["Base64","JSON","SQL","JWT"],"active":true}
  ```
* **After running DevUtils Format (`Ctrl + Alt + J` then `F`)**:
  ```json
  {
    "name": "Techwasti",
    "tools": [
      "Base64",
      "JSON",
      "SQL",
      "JWT"
    ],
    "active": true
  }
  ```

#### 4. JSON Stringify & Parse Escaped JSON (`DevUtils: JSON: Stringify & Escape` / `DevUtils: JSON: Parse Stringified / Escaped JSON`)
* **Use Case**: Quickly escape JSON objects into a single escaped string suitable for API payloads, environment variables, or databases; or unescape ugly escaped JSON strings (`"{\"user\":\"alice\",\"role\":\"admin\"}"`) back into clean, formatted JSON with one click.

#### 5. YAML ⇄ Properties Converter (`DevUtils: YAML: Convert YAML to Properties` / `Properties to YAML`)
* **YAML**:
  ```yaml
  server:
    port: 8080
    host: localhost
  spring:
    datasource:
      url: jdbc:mysql://localhost:3306/db
  ```
* **Converted Properties**:
  ```properties
  server.port=8080
  server.host=localhost
  spring.datasource.url=jdbc:mysql://localhost:3306/db
  ```

#### 6. JWT Inspector (`DevUtils: JWT: Inspect & Decode Token`)
* Run command and paste any `Bearer` JWT token. DevUtils instantly decodes the **Header** and **Payload claims** into a new formatted JSON editor preview, and alerts you whether the token is currently **Valid** or **Expired**.

#### 7. Case Converters (`DevUtils: Case: Convert to camelCase / snake_case / kebab-case`)
* Select `user registration service` and convert instantly:
  - camelCase: `userRegistrationService`
  - CONSTANT_CASE: `USER_REGISTRATION_SERVICE`
  - kebab-case: `user-registration-service`
  - PascalCase: `UserRegistrationService`

#### 8. Convert cURL to Fetch / Python (`DevUtils: cURL: Convert to JavaScript Fetch`)
* Convert any raw `curl` command into production-ready JavaScript `fetch(...)` or Python `requests.post(...)` without any external tools.

#### 9. JSON to TypeScript Interfaces (`DevUtils: JSON: Generate TypeScript Interfaces`)
* Select or open any JSON response and generate typed interfaces with recursive child types and clean exports.

#### 10. Cron Expression Humanizer (`DevUtils: Cron: Humanize & Explain Expression`)
* Turns `*/15 9-17 * * 1-5` into *"Every 15 minutes, between hours 9-17, Monday through Friday"*.

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
