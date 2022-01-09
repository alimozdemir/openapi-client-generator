import { ThemeIcon, TreeItemCollapsibleState } from "vscode";
import { Node } from "../nodes/node";
import { OpenAPIV3_1 } from "openapi-types";
import { Doc } from "./doc";
 
export class DocV31 extends Doc {
  
  version: string = '3.1';

  prepareComponents(node: Node, doc: OpenAPIV3_1.Document) {
    const components = doc.components;

    if (!components || !components.schemas)
      return;

    const keys = Object.entries(components.schemas);
    
    keys.forEach(([key, value]) => {
      const refs = this.prepareRefs(value);
      const componentNode = new Node(key, refs.length > 0 ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None, []);
      componentNode.contextValue = 'schema';
      componentNode.id = node.id + '/' + key;
      componentNode.children.push(...refs);

      node.children.push(componentNode);
    });
  }


  private prepareRefs(value: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject) {
    const refs = new Set<string>();
    
    const nodes: Node[] = [];

    this.findReferences(refs, value);

    refs.forEach((val, key) => {
      const refNode = new Node(this.normalizeRef(val), TreeItemCollapsibleState.None, []);
      refNode.contextValue = val;
      nodes.push(refNode);
      refNode.iconPath = new ThemeIcon("references");
    });

    return nodes;
  }

  private findReferences(refs: Set<string>, value: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject) {

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

  preparePaths(node: Node, doc: OpenAPIV3_1.Document) {
    const paths = doc.paths;

    if (!paths)
      return;
    
    const keys = Object.entries(paths);

    keys.forEach(([key, value]) => {
      const path = new Node(key, TreeItemCollapsibleState.Collapsed, []);
      path.contextValue = "path";
      node.children.push(path);

      this.prepareActions(path, value);
    });
  }
  
  prepareActions(node: Node, value: any) {
    const keys = Object.entries(value);
    
    keys.forEach(([key, value]) => {
      node.children.push(new Node(key, TreeItemCollapsibleState.None, []));
    });
  }

}
