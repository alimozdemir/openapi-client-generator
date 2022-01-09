import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { CommandManager } from './commands/command.manager';
import Configuration from './configuration';
import Manager from './manager';

export async function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('openapi-client-generator.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from openapi-client-generator!');
	});
  
  const commandManager: CommandManager = new CommandManager();

  const manager: Manager = new Manager(context, new Configuration());
  manager.diagnostics();

  registerCommands(commandManager, manager);
  context.subscriptions.push(commandManager);

  await manager.initialize();
}

export function deactivate() {}
