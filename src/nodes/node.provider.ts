import { Event, ProviderResult, TreeDataProvider, TreeItem } from "vscode";
import { Node } from "./node";

export class NodeProvider implements TreeDataProvider<Node> {
  

  
  onDidChangeTreeData?: Event<void | Node | null | undefined> | undefined;
  
  getTreeItem(element: Node): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: Node): ProviderResult<Node[]> {
    return element?.children;
  }

}