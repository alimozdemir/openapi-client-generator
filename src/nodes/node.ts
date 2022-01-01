import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class Node extends TreeItem {
  constructor(public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly children: Array<Node>) {
      super(label, collapsibleState)
  }
}