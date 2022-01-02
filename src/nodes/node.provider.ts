import { Event, ProviderResult, TreeDataProvider, TreeItem, EventEmitter } from "vscode";
import { SourceService } from "../core/source.service";
import { Node } from "./node";

export class NodeProvider implements TreeDataProvider<Node> {
  
  constructor(readonly sourceService: SourceService) {
    
  }

  private _onDidChangeTreeData: EventEmitter<Node | undefined | void> = new EventEmitter<Node | undefined | void>();
	readonly onDidChangeTreeData: Event<Node | undefined | void> = this._onDidChangeTreeData.event;
  
  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Node): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: Node): ProviderResult<Node[]> {
    if (element)
      return element?.children;
    else {
      return this.sourceService.getRoots();
    }
  }

}