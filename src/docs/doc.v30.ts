import { ThemeIcon, TreeItemCollapsibleState } from "vscode";
import { Node } from "../nodes/node";
import { OpenAPIV3 } from "openapi-types";
import { Doc } from "./doc";
 
export class DocV30 extends Doc {
  
  version: string = '3.0';

  prepareComponents(node: Node, doc: OpenAPIV3.Document) {
    const components = doc.components;

    if (!components || !components.schemas)
      return;

    const keys = Object.entries(components.schemas);
    
    keys.forEach(([key, value]) => {
      const refs = this.prepareRefs(value, key);
      const componentNode = new Node(key, refs.length > 0 ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None, []);
      componentNode.contextValue = 'schema';
      componentNode.id = node.id + '/' + key;
      componentNode.children.push(...refs);

      this.schemas.set(key, componentNode);

      node.children.push(componentNode);
    });
  }


  private prepareRefs(value: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, schemaName: string) {
    const refs = new Set<string>();
    
    const nodes: Node[] = [];

    this.findReferences(refs, value, schemaName);

    refs.forEach((val, key) => {
      const refNode = new Node(this.normalizeRef(val), TreeItemCollapsibleState.None, []);
      refNode.contextValue = val;
      nodes.push(refNode);
      refNode.iconPath = new ThemeIcon("references");
    });

    return nodes;
  }

  pruneRefs(value: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, schemaName: string) {
    const refs = new Set<string>();
    this.findReferences(refs, value, schemaName, true);
    return refs;
  }

  private simplifyRef(val: string, schemaName: string) {
    const path = val.split('/');
    const name = path[path.length - 1];

    if (name != schemaName) {
      return '#/' + path[path.length - 1];
    } else {
      return '#'; // root
    }
  }

  private setReference(refs: Set<string>, val: { $ref: string }, schemaName: string, prune: boolean = false) {

    if (prune) {
      const pruneRef = this.simplifyRef(val.$ref, schemaName);
      val.$ref = pruneRef;
      refs.add(pruneRef);
    } else {
      refs.add(val.$ref);
    }
  }

  private findReferences(refs: Set<string>, value: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, schemaName: string, prune: boolean = false) {

    if ('$ref' in value) {
      //refs.add(value.$ref);
      this.setReference(refs, value, schemaName, prune);
      return;
    }

    if (value.type === 'array') {
      if ('$ref' in value.items) {
        // refs.add(value.items.$ref);
        this.setReference(refs, value.items, schemaName, prune);
        return;
      }

    }

    if (!value.properties)
      return;

    const props = Object.entries(value.properties);

    props.forEach(([key, val]) => {
      if ('$ref' in val) {
        // refs.add(val.$ref);
        this.setReference(refs, val, schemaName, prune);
        return;
      }

      if (val.type !== 'array') {
        return;
      }

      if ('$ref' in val.items) {
        // refs.add(val.items.$ref);
        this.setReference(refs, val.items, schemaName, prune);
        return;
      }
    });
  }

  preparePaths(node: Node, doc: OpenAPIV3.Document) {
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

  getSchema(doc: OpenAPIV3.Document, name: string) {
    if (!doc.components || !doc.components.schemas) {
      return;
    }

    return doc.components.schemas[name];
  }

}
