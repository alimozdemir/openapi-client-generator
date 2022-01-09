import Manager from "../manager";
import { BaseCommand } from "./base.command";

export class SourceRefreshCommand implements BaseCommand {
  title: string = 'Source Refresh';
  command: string = 'openapi-client-generator.explorer.refresh';

  constructor(private readonly manager: Manager) {
  }

  public async execute () {
    await this.manager.refresh();

    this.manager.log('Refreshing the sources');
  }
}