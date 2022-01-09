import { TreeItemCollapsibleState } from "vscode";
import { Node } from "../nodes/node";
import { ISource } from "./sources";
import * as SwaggerParser from 'swagger-parser';
import { Doc } from "../docs/doc";
import { DocV30 } from "../docs/doc.v30";
import { DocV31 } from "../docs/doc.v31";

export class SourceParser {
  private docs: Doc[] = [];

  constructor() {
    this.docs.push(new DocV30());
    this.docs.push(new DocV31());
  }

  async prepareSource(source: ISource) : Promise<Node | undefined> {
    const root: Node = new Node(source.name, TreeItemCollapsibleState.Collapsed, []);
    root.contextValue = 'root';
    root.id = source.id;

    const parsedDoc = await SwaggerParser.parse(source.schema);

    if (!source.schema.openapi) {
      return;
    }

    this.docs.forEach(doc => {
      if (!source.schema.openapi.startsWith(doc.version)) {
        return;
      }
      doc.prepareDoc(root, parsedDoc);
    });

    return root;
  }

}