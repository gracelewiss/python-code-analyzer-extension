import os
import re
import timeit
import ast
from typing import List
import json

class CodeAnalyzer:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def check_code_style(self) -> List[str]:
        issues = []
        with open(self.file_path) as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                if re.search(r';\s*$', line):
                    issues.append(f"Line {i+1}: Unnecessary semicolon")
                if re.search(r'class\s+[a-z]\w*', line):
                    class_name = re.findall(r'class\s+([a-zA-Z]\w*)', line)[0]
                    if class_name != class_name.title():
                        issues.append(f"Line {i+1}: Class name should be in CamelCase")
                if re.search(r'def\s+([a-zA-Z_]\w*)\(', line):
                    function_name = re.findall(r'def\s+([a-zA-Z_]\w*)\(', line)[0]
                    if not re.match(r'^[a-z][a-z_]*$', function_name):
                        issues.append(f"Line {i+1}: Function name should be in snake_case")
                if re.search(r'(?<!\w)[A-Z][a-z]+(?:[A-Z][a-z]+)*\b', line):
                    variable_name = re.findall(r'(?<!\w)([A-Z][a-z]+(?:[A-Z][a-z]+)*)\b', line)[0]
                    if not re.match(r'^[a-z][a-z_]*$', variable_name):
                        issues.append(f"Line {i+1}: Variable name should be in snake_case")
        return issues

    def check_syntax_errors(self) -> List[str]:
        issues = []
        try:
            with open(self.file_path) as f:
                code = f.read()
                compile(code, self.file_path, 'exec')
        except SyntaxError as e:
            issues.append(f'Syntax error: {e}')
        return issues

    def check_lines_of_code(self) -> List[str]:
        issues = []
        with open(self.file_path) as f:
            lines = f.readlines()
            issues.append(f'Lines of code: {len(lines)}')
        return issues

    def analyze(self) -> None:
        issues = []
        issues += self.check_syntax_errors()
        issues += self.check_lines_of_code()
        issues += self.check_code_style()

        formatted_issues = []

        for issue in issues:
            match = re.match(r'Line (\d+): (.+)', issue)
            if match:
                line = int(match.group(1)) - 1
                message = match.group(2)
                suggestion = ""

                if "CamelCase" in message:
                    suggestion = "Consider renaming the class using CamelCase."
                elif "snake_case" in message:
                    suggestion = "Consider renaming using snake_case."
                elif "semicolon" in message:
                    suggestion = "Remove unnecessary semicolon."
                elif "Syntax error" in message:
                    suggestion = "Fix the syntax error."

                formatted_issues.append({
                    "line": line,
                    "message": message,
                    "severity": "warning" if "should" in message else "error",
                    "suggestion": suggestion
                })


        print(json.dumps(formatted_issues))



if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python analyzer.py <file_path>")
    else:
        analyzer = CodeAnalyzer(sys.argv[1])
        analyzer.analyze()
