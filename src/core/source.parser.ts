import { ThemeIcon, TreeItemCollapsibleState } from "vscode";
import { Node } from "../nodes/node";
import { Keys } from "./keys";
import { ISource } from "./sources";
import * as SwaggerParser from 'swagger-parser';
import { OpenAPIV3, OpenAPIV3_1, OpenAPIV2 } from "openapi-types";

export class SourceParser {
  constructor() {
  }

  async prepareSource(source: ISource) : Promise<Node | undefined> {
    const root: Node = new Node(source.name, TreeItemCollapsibleState.Collapsed, []);
    root.contextValue = 'root';
    root.id = source.id;

    const doc = await SwaggerParser.parse(source.schema);

    if (!source.schema.openapi) {
      return;
    }

    if (source.schema.openapi == "3.0.0") {
      this.prepareDoc30(root, doc as OpenAPIV3.Document);
    } else if (source.schema.openapi == "3.1.0") {
      this.prepareDoc31(root, doc as OpenAPIV3_1.Document);
    }

    return root;
  }

  private async prepareDoc30(node: Node, doc: OpenAPIV3.Document) {
    if (!doc.components)
      return;


    const paths = new Node('Paths', TreeItemCollapsibleState.Collapsed, []);
    node.children.push(paths);

    this.preparePaths30(paths, doc.paths);

    const schemas = new Node('Schemas', TreeItemCollapsibleState.Collapsed, []);
    schemas.iconPath = new ThemeIcon("preview")
    node.children.push(schemas);

    this.prepareComponents30(schemas, doc.components);
  }
  
  private async prepareDoc31(node: Node, doc: OpenAPIV3_1.Document) {
    if (doc.components)
      this.prepareComponents31(node, doc.components);
  }

  private async prepareDoc20(doc: OpenAPIV2.Document) {
    
  }

  // TODO: Use a design pattern or an interface for parsing versions
  private prepareComponents30(node: Node, components: OpenAPIV3.ComponentsObject) {
    if (!components.schemas)
      return;

    const keys = Object.entries(components.schemas);
    
    keys.forEach(([key, value]) => {
      const refs = this.prepareRefs(value);
      const componentNode = new Node(key, refs.length > 0 ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None, []);
      componentNode.children.push(...refs);

      node.children.push(componentNode);
    });
  }

  private prepareRefs(value: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) {
    const refs = new Set<string>();
    
    const nodes: Node[] = [];

    this.findReferences(refs, value);

    refs.forEach((val, key) => {
      const refNode = new Node(this.normalizeRef(val), TreeItemCollapsibleState.None, []);
      nodes.push(refNode);
      refNode.iconPath = new ThemeIcon("references");
    });

    return nodes;
  }

  private normalizeRef(path: string) {
    const data = path.split('/');
    return data[0] + data[data.length - 1];
  }

  private findReferences(refs: Set<string>, value: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) {

    if ('$ref' in value) {
      refs.add(value.$ref);
      return;
    }

    if (value.type === 'array') {
      if ('$ref' in value.items) {
        refs.add(value.items.$ref);
        return;
      }

    }

    if (!value.properties)
      return;

    const props = Object.entries(value.properties);

    props.forEach(([key, val]) => {
      if ('$ref' in val) {
        refs.add(val.$ref);
        return;
      }

      if (val.type !== 'array') {
        return;
      }

      if ('$ref' in val.items) {
        refs.add(val.items.$ref);
        return;
      }
    });
  }

  private preparePaths30(node: Node, paths: OpenAPIV3.PathsObject) {
    if (!paths)
      return;
    
    const keys = Object.entries(paths);

    keys.forEach(([key, value]) => {
      const path = new Node(key, TreeItemCollapsibleState.Collapsed, []);
      node.children.push(path);

      this.prepareActions30(path, value);
    });
  }
  prepareActions30(node: Node, value: any) {
    const keys = Object.entries(value);
    
    keys.forEach(([key, value]) => {
      node.children.push(new Node(key, TreeItemCollapsibleState.None, []));
    });
  }

  private prepareComponents31(node: Node, components: OpenAPIV3_1.ComponentsObject) {
    for (const key in components.schemas) {
        node.children.push(new Node(key, TreeItemCollapsibleState.Collapsed, []));
    }
  }
}