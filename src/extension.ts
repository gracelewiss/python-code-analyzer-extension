import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('pythonCodeAnalyzer');
    
	let disposable = vscode.commands.registerCommand('python-code-analyzer.run', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor || editor.document.languageId !== 'python') {
			vscode.window.showErrorMessage('Please open a Python file to analyze.');
			return;
		}

		const filePath = editor.document.uri.fsPath;
		const scriptPath = path.join(context.extensionPath, 'analyzer.py');

		exec(`python "${scriptPath}" "${filePath}"`, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage(`Analyzer error: ${stderr}`);
				return;
			}

			try {
				const diagnostics: vscode.Diagnostic[] = [];
				const issues = JSON.parse(stdout);

				issues.forEach((issue: any) => {
					const line = issue.line;
					const range = new vscode.Range(line, 0, line, 100);
				
					const severity = issue.severity === 'error'
						? vscode.DiagnosticSeverity.Error
						: issue.severity === 'warning'
						? vscode.DiagnosticSeverity.Warning
						: vscode.DiagnosticSeverity.Information;
				
					const message = issue.suggestion
						? `${issue.message} 💡 Suggestion: ${issue.suggestion}`
						: issue.message;
				
					const diagnostic = new vscode.Diagnostic(range, message, severity);
					diagnostic.source = 'Python Code Analyzer';
					diagnostics.push(diagnostic);
				});
				

				diagnosticCollection.set(editor.document.uri, diagnostics);
				vscode.window.showInformationMessage("Code analysis complete. Check the Problems panel!");
			} catch (parseError) {
				vscode.window.showErrorMessage("Failed to parse analyzer output.");
				console.error(parseError);
			}
		});
	});
	vscode.workspace.onDidSaveTextDocument((document) => {
		console.log("Auto-save listener triggered on:", document.uri.fsPath);
		
		if (document.languageId === 'python') {
			const filePath = document.uri.fsPath;
			const scriptPath = path.join(context.extensionPath, 'analyzer.py');
	
			exec(`python "${scriptPath}" "${filePath}"`, (err, stdout, stderr) => {
				if (err) {
					vscode.window.showErrorMessage(`Analyzer error: ${stderr}`);
					return;
				}
	
				try {
					const issues = JSON.parse(stdout);
					const diagnostics: vscode.Diagnostic[] = [];
	
					issues.forEach((issue: any) => {
						const range = new vscode.Range(issue.line, 0, issue.line, 100);
						const severity = issue.severity === 'error'
							? vscode.DiagnosticSeverity.Error
							: issue.severity === 'warning'
							? vscode.DiagnosticSeverity.Warning
							: vscode.DiagnosticSeverity.Information;
	
						const message = issue.suggestion
							? `${issue.message} 💡 Suggestion: ${issue.suggestion}`
							: issue.message;
	
						const diagnostic = new vscode.Diagnostic(range, message, severity);
						diagnostic.source = 'Python Code Analyzer';
						diagnostics.push(diagnostic);
					});
	
					diagnosticCollection.set(document.uri, diagnostics);
					vscode.window.showInformationMessage("Auto analysis complete!");
				} catch (e) {
					vscode.window.showErrorMessage("Failed to parse analyzer output.");
					console.error(e);
					
				}
				
			});
		}
	});
	
	context.subscriptions.push(disposable, diagnosticCollection);
}

export function deactivate() {}
