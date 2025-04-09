# Python Code Analyzer

Python Code Analyzer is a VS Code extension that performs static analysis on Python files. It detects:

- ❌ Syntax errors
- ⚠️ Style violations (naming conventions, unnecessary semicolons)
- 📏 Line count stats
- 💡 Suggestions for best practices

Analysis results are shown with squiggly lines, hover messages, and in the **Problems** panel.

---

## Features

- 🐍 Analyze Python files with one click or automatically on save
- 🚨 Warnings for bad class and function names (e.g., not using CamelCase or snake_case)
- ❗ Syntax error reporting
- ✅ Suggestions for fixes (e.g., remove semicolon, rename to match convention)

---

## Requirements

- Python 3.x must be installed and added to your system PATH.
- `analyzer.py` should be present in the extension root (already included).

---

## Usage

1. Open a Python `.py` file in VS Code.
2. Run the command `Run Python Code Analyzer` from the Command Palette (`Ctrl+Shift+P`).
3. Review feedback in the Problems panel or hover tooltips.
4. Save the file to auto-run the analyzer again.

---

## Known Issues

- Currently limited to basic static analysis (no deep type checking or refactoring).
- Only supports `.py` files in the open editor.

---

## Release Notes

### 0.0.1

- Initial release of Python Code Analyzer

---

Enjoy! 🐍🧠
