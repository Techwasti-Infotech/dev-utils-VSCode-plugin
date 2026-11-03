# DevUtils for VS Code (by Techwasti)

A developer toolbox directly inside Visual Studio Code. Offline-first, privacy-focused, zero external network dependency utility suite for everyday developer tasks.

[![CI](https://github.com/Techwasti-Infotech/dev-utils-VSCode-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/Techwasti-Infotech/dev-utils-VSCode-plugin/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/Docs-GitHub%20Pages-blue)](https://Techwasti-Infotech.github.io/dev-utils-VSCode-plugin/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Features

DevUtils brings all common developer utilities directly into VS Code via both **Interactive Webview Dashboard** and **Command Palette / Context Menu**:

1. **Encoders & Decoders**
   - Base64 (Text & File/Data URL)
   - URL Encode / Decode
   - HTML Entities Encode / Decode
   - Hex / Binary / ASCII Converter
   - JWT Decoder & Inspector (Header, Payload, Expiry)

2. **Formatters & Beautifiers**
   - JSON Formatter & Minifier with syntax validation
   - XML Formatter & Minifier
   - YAML <-> JSON Converter
   - SQL Formatter
   - CSV <-> JSON Converter

3. **Generators & Identifiers**
   - UUID / GUID Generator (v4, v1, bulk generation)
   - Nanoid & ULID Generator
   - Hash & Checksum (MD5, SHA-1, SHA-256, SHA-512, HMAC)
   - Lorem Ipsum Generator (paragraphs, sentences, words)
   - Random String & Password Generator

4. **Time & Date Tools**
   - Unix Epoch Timestamp <-> Human Readable Date / ISO 8601
   - Relative time & timezone converter
   - Current Epoch millisecond & second inspector

5. **Text & String Utilities**
   - Case Converter (camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, Title Case)
   - Text Diff Inspector
   - Regex Tester & Explainer
   - Line Sort, Unique Lines, Deduplication & Trimming
   - Word, Character, Line Count & Byte Counter

6. **Network & Web Helpers**
   - HTTP Status Codes Lookup & descriptions
   - Color Converter (HEX, RGB, HSL, RGBA) with preview

---

## 🛠️ Usage

### 1. Interactive DevUtils Dashboard
Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and run:
```
DevUtils: Open Developer Dashboard
```
Or click the **DevUtils** icon on the Activity Bar.

### 2. Quick Command Palette Actions
Directly select any text in your editor and choose:
- `DevUtils: Base64 Encode Selection` / `DevUtils: Base64 Decode Selection`
- `DevUtils: JSON Format` / `DevUtils: JSON Minify`
- `DevUtils: Convert to camelCase / snake_case / kebab-case`
- `DevUtils: Generate UUID v4`
- `DevUtils: Inspect JWT Token`
- `DevUtils: Convert Timestamp to Date`

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (>= 18.x recommended, tested on Node 20 & 22)
- [npm](https://www.npmjs.com/) (>= 9.x)
- Visual Studio Code (>= 1.85.0)

### Steps
1. Clone the repository:
   ```bash
   git clone git@github.com:Techwasti-Infotech/dev-utils-VSCode-plugin.git
   cd dev-utils-VSCode-plugin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile & Watch for changes:
   ```bash
   npm run watch
   ```
4. Debugging:
   - Open the project in VS Code: `code .`
   - Press `F5` to start a new VS Code Extension Development Host window.
5. Run tests & lint:
   ```bash
   npm test
   npm run lint
   ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Please check our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Maintained by

**Techwasti Infotech**  
Website: [techwasti.com](https://techwasti.com)  
Email: `techwastiinfotech@gmail.com`
