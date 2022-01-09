import { window } from "vscode";
import Manager from "../manager";
import { BaseCommand } from "./base.command";

export class SourceAddCommand implements BaseCommand {
  title: string = '';
  command: string = 'openapi-client-generator.explorer.add';
  tooltip?: string | undefined;
  arguments?: any[] | undefined;

  constructor(private readonly manager: Manager) {
  }

  public async execute () {
    const result = await window.showInputBox({ placeHolder: 'Please enter url of open api json/yaml file.' });

    if (!result)
      return;

    await this.manager.addSource(result);

    await this.manager.refresh();

    this.manager.log('A new source added');
  }
}