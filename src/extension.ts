import * as vscode from 'vscode';
import Configuration from './configuration';
import Manager from './manager';

export async function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('openapi-client-generator.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from openapi-client-generator!');
	});

  const manager: Manager = new Manager(context, new Configuration());
  manager.diagnostics();

  await manager.initialize();
}

export function deactivate() {}
