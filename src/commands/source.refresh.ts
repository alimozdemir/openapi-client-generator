import { CommandTypes } from ".";
import { createExtensionAlias } from "../configuration";
import Manager from "../manager";
import { BaseCommand } from "./base.command";

export class SourceRefreshCommand implements BaseCommand {
  title: string = 'Source Refresh';
  
  type: CommandTypes = 'explorer.refresh';

  get command() : string {
    return createExtensionAlias(this.type);
  }

  constructor(private readonly manager: Manager) {
  }

  public async execute () {
    await this.manager.refresh();

    this.manager.log('Refreshing the sources');
  }
}