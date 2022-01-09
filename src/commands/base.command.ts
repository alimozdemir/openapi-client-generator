import { Command } from "vscode";

export interface BaseCommand extends Command {
  execute(...args: any[]): any;
}