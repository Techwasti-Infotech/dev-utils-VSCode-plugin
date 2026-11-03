# Contributing to DevUtils for VS Code

First off, thank you for considering contributing to **DevUtils for VS Code** by **Techwasti Infotech**! It's people like you that make open source such a great tool for developers.

---

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### Reporting Bugs
Before creating bug reports, please check existing issues as you might find that you don't need to create a new one.

When creating a bug report, please include as much detail as possible:
- A clear descriptive title.
- Steps to reproduce the issue.
- Expected behavior vs actual behavior.
- VS Code version and OS platform.
- Any error output or screenshots.

### Suggesting Enhancements & New Utilities
We are always eager to include more developer utilities! If there is a tool you miss in your offline daily workflow, open an issue using the Feature Request template:
- Explain why this enhancement would be useful.
- Provide examples of input and expected output.
- Link any standards or RFCs if applicable (e.g. UUID, JWT, Base64).

### Submitting Pull Requests
1. Fork the repo and create your branch from `main`.
2. Install dependencies: `npm install`
3. If you've added code that should be tested, add tests.
4. Ensure the test suite passes: `npm test`
5. Run linting checks: `npm run lint`
6. Issue that pull request!

---

## Development Guidelines

- **Zero-Telemetries & Offline-First**: DevUtils is strictly an offline utility suite. Do not introduce network calls for processing user data. All parsing, hashing, conversion, and decoding must happen locally in memory.
- **Privacy First**: Sensitive data like JWTs, private keys, or credentials must never leave the user's machine.
- **Commit Standards**: Use concise, conventional commit messages (`feat: ...`, `fix: ...`, `docs: ...`, `test: ...`).

---

## Questions?

Feel free to open a discussion or reach out to us at `techwastiinfotech@gmail.com`.
