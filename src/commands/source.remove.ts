import { window } from "vscode";
import Manager from "../manager";
import { Node } from "../nodes/node";
import { BaseCommand } from "./base.command";

export class SourceRemoveCommand implements BaseCommand {
  title: string = 'Source Remove';
  command: string = 'openapi-client-generator.explorer.remove';

  constructor(private readonly manager: Manager) {
  }

  public async execute (node: Node) {
    if (!node || !node.id) {
      this.manager.log('You have to run this command from the tree view.');
      return;
    }

    this.manager.log('Removing the source');
    
    const action = this.manager.removeSource(node);

    if (action) {
      window.showInformationMessage(`The source ${node.label} is deleted`);
      this.manager.refresh();
    } else {
      window.showWarningMessage(`The source ${node.label} is not deleted`)
    }

    this.manager.log('Source removed');
  }
}