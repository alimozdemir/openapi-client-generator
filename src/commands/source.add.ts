import { window } from "vscode";
import { CommandTypes } from ".";
import { createExtensionAlias } from "../configuration";
import Manager from "../manager";
import { BaseCommand } from "./base.command";

export class SourceAddCommand implements BaseCommand {
  title: string = '';
  tooltip?: string | undefined;
  arguments?: any[] | undefined;
  type: CommandTypes = 'explorer.add';

  get command() : string {
    return createExtensionAlias(this.type);
  }

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