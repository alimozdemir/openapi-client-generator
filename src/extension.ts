import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusBar.text = "OpenAPI: Initialized";
  statusBar.show();

  const output = vscode.window.createOutputChannel("OpenAPI Client Generator");
  output.appendLine("Initialized")
  output.show();

	let disposable = vscode.commands.registerCommand('openapi-client-generator.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from openapi-client-generator!');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(output);
}

export function deactivate() {}
