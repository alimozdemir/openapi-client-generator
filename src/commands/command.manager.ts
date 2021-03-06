import { commands, Disposable } from "vscode";
import { CommandTypes } from ".";
import { createExtensionAlias } from "../configuration";
import { BaseCommand } from "./base.command";

export class CommandManager implements Disposable {

  private readonly commands: Map<string, Disposable> = new Map<string, Disposable>();

  dispose() {
    for (const command of this.commands.values()) {
      command.dispose();
    }

    this.commands.clear();
  }

  register<T extends BaseCommand>(command: T): T {

    if (!this.commands.has(command.command)) {
      this.commands.set(command.command, commands.registerCommand(command.command, command.execute, command));
    }

    return command;
  }
  
  executeCommand(commandType: CommandTypes, ...args: any[]) {
    const commandAlias = createExtensionAlias(commandType);
    return commands.executeCommand(commandAlias, ...args);
  }

}