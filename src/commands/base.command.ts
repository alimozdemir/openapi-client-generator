import { Command } from "vscode";
import { CommandTypes } from ".";

export interface BaseCommand extends Command {
  type: CommandTypes;
  execute(...args: any[]): any;
}