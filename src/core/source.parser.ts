import { ExtensionContext, TreeItemCollapsibleState } from "vscode";
import { Node } from "../nodes/node";
import { Keys } from "./keys";
import { ISource } from "./sources";
import * as SwaggerParser from 'swagger-parser';
import { OpenAPIV3, OpenAPIV3_1, OpenAPIV2 } from "openapi-types";

export class SourceParser {
  constructor() {
  }

  async prepareSource(source: ISource) : Promise<Node> {
    const root: Node = new Node(source.name, TreeItemCollapsibleState.Collapsed, []);
    const doc = await SwaggerParser.parse(source.filePath);

    if (doc.info.version == "3.0.0") {
      this.prepareDoc30(root, doc as OpenAPIV3.Document);
    } else if (doc.info.version == "3.1.0") {
      this.prepareDoc31(root, doc as OpenAPIV3_1.Document);
    }

    return root;
  }

  private async prepareDoc30(node: Node, doc: OpenAPIV3.Document) {
    
    if (doc.components)
      this.prepareComponents30(node, doc.components);
  }
  
  private async prepareDoc31(node: Node, doc: OpenAPIV3_1.Document) {
    if (doc.components)
      this.prepareComponents31(node, doc.components);
  }

  private async prepareDoc20(doc: OpenAPIV2.Document) {
    
  }

  private prepareComponents30(node: Node, components: OpenAPIV3.ComponentsObject) {
    if (!components.schemas)
      return;

    const keys = Object.keys(components.schemas);
    
    for (const key in keys)
      node.children.push(new Node(key, TreeItemCollapsibleState.Collapsed, []));
  }


  private prepareComponents31(node: Node, components: OpenAPIV3_1.ComponentsObject) {
    for (const key in components.schemas) {
        node.children.push(new Node(key, TreeItemCollapsibleState.Collapsed, []));
    }
  }
}