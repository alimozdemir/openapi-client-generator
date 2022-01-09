import Manager from "../manager";
import { CommandManager } from "./command.manager";
import { SourceAddCommand } from "./source.add";
import { SourceRenameCommand } from "./source.rename";



export function registerCommands(commandManager: CommandManager, manager: Manager) {
  // commandManager.register(new SourceAddCommand(manager));
  commandManager.register(new SourceRenameCommand(manager));
}