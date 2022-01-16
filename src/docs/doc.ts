import { ThemeIcon, TreeItemCollapsibleState } from "vscode";
import { Node } from "../nodes/node";
import { ISource } from "../core/sources";

export abstract class Doc {
  abstract version: string;
  protected schemas: Map<string, Node>;

  constructor() {
    this.schemas = new Map<string, Node>();
  }

  getNodeBySchema(name: string) {
    return this.schemas.get(name);
  }

  normalizeRef(path: string) {
    const data = path.split('/');
    return data[data.length - 1];
  }

  prepareSource(source: ISource, doc: any) : Node | undefined {
    const root: Node = new Node(source.name, TreeItemCollapsibleState.Collapsed, []);
    root.contextValue = 'root';
    root.id = source.id;

    if (!source.schema.openapi) {
      return;
    }

    this.prepareDoc(root, doc);

    return root;
  }

  prepareDoc(node: Node, doc: any) {
    const paths = new Node('Paths', TreeItemCollapsibleState.Collapsed, []);
    node.children.push(paths);

    this.preparePaths(paths, doc);

    const schemas = new Node('Schemas', TreeItemCollapsibleState.Collapsed, []);
    schemas.iconPath = new ThemeIcon("preview")
    schemas.id = node.id + '/schemas';
    node.children.push(schemas);

    this.prepareComponents(schemas, doc);
  }
  
  abstract prepareComponents(node: Node, doc: any) : void;

  abstract preparePaths(node: Node, doc: any) : void;

  abstract getSchema(doc: any, name: string): any;
}