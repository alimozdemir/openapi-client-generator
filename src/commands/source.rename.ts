import { window } from "vscode";
import { CommandTypes } from ".";
import { createExtensionAlias } from "../configuration";
import Manager from "../manager";
import { Node } from "../nodes/node";
import { BaseCommand } from "./base.command";

export class SourceRenameCommand implements BaseCommand {
  title: string = 'Rename Source';
  
  type: CommandTypes = 'explorer.rename';
  get command() : string {
    return createExtensionAlias(this.type);
  }

  constructor(private readonly manager: Manager) {
  }

  public async execute (node: Node) {
    if (!node || !node.id) {
      this.manager.log('You have to run this command from the tree view.');
      return;
    }

    this.manager.log('Renaming the source');

    const result = await window.showInputBox({ placeHolder: 'Please enter a new name for the given source.' });

    if (!result) {
      this.manager.log('The rename input is empty. Leaving the renaming process.');
      return;
    }

    const action = this.manager.renameSource(node, result);

    if (action) {
      window.showInformationMessage(`The source ${node.label} is renamed`);
      node.label = result;
      this.manager.refresh(true);
    } else {
      window.showWarningMessage(`The source ${node.label} is not renamed`)
    }

  }
}