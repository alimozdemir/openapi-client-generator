import { commands } from "vscode";
import Manager from "../manager";
import { BaseCommand } from "./base.command";
import { CommandManager } from "./command.manager";
import { SchemaGenerateCommand } from "./schema.generate";
import { SourceAddCommand } from "./source.add";
import { SourceRefreshCommand } from "./source.refresh";
import { SourceRemoveCommand } from "./source.remove";
import { SourceRenameCommand } from "./source.rename";

export function registerCommands(commandManager: CommandManager, manager: Manager) {
  commandManager.register(new SourceAddCommand(manager));
  commandManager.register(new SourceRenameCommand(manager));
  commandManager.register(new SourceRefreshCommand(manager));
  commandManager.register(new SourceRemoveCommand(manager));
  commandManager.register(new SchemaGenerateCommand(manager));
}

export type CommandTypes = 'explorer.gen-schema' | 'explorer.add' | 'explorer.rename' | 'explorer.refresh' | 'explorer.remove';