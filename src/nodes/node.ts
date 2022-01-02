import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class Node extends TreeItem {
  
  /**
   * Optional; only for the roots
   * TODO: consider to use this property as required
   */
  id: string | undefined;

  constructor(public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly children: Array<Node>) {
      super(label, collapsibleState)
  }
}

export function notEmptyNode(value: Node | undefined): value is Node {
  if (value === null || value === undefined) return false;
  const testDummy: Node = value;
  return true;
}
