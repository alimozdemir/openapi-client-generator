import { TreeItemCollapsibleState } from "vscode";
import { Node } from "../nodes/node";
import { ISource } from "./sources";
import * as SwaggerParser from 'swagger-parser';
import { DocManager } from "../docs/doc.manager";

export class SourceParser {

  constructor(private readonly docManager: DocManager) {
  }

  async prepareSource(source: ISource) : Promise<Node | undefined> {
    const root: Node = new Node(source.name, TreeItemCollapsibleState.Expanded, []);
    root.contextValue = 'root';
    root.id = source.id;

    const parsedDoc = await SwaggerParser.parse(source.schema);

    if (!source.schema.openapi) {
      return;
    }

    const docs = this.docManager.getDocs();

    docs.forEach(doc => {
      if (!source.schema.openapi.startsWith(doc.version)) {
        return;
      }
      doc.prepareDoc(root, parsedDoc);
    });

    return root;
  }

}