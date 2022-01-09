import Manager from "../manager";
import { Node } from "../nodes/node";
import { BaseCommand } from "./base.command";

export class SchemaGenerateCommand implements BaseCommand {
  title: string = 'Schema Generate';
  command: string = 'openapi-client-generator.explorer.gen-schema';

  constructor(private readonly manager: Manager) {
  }

  public async execute (node: Node) {
    if (node.contextValue != 'schema') {
      this.manager.log('This command only runs with schema nodes.')
      return;
    }

    const source = this.manager.getSource(node);
    
    if (!source) {
      this.manager.log('The source is not found');
      return;
    }

    

  }
}