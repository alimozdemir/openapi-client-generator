import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class Node extends TreeItem {
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
