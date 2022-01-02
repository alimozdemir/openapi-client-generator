import { ExtensionContext, Task, TreeItemCollapsibleState, Uri, workspace } from "vscode";
import { Node } from "../nodes/node";
import { Keys } from "./keys";
import { ISource, SourceType } from "./sources";
import { SourceParser } from "./source.parser";
import { getJSON } from "./request";
import { v4 } from 'uuid';
import * as fs from 'fs';
import { getFileNameFromURL } from "./utils";

export class SourceService {
  private sources: Array<ISource> = [];
  roots: Node[] = [];

  constructor(readonly context: ExtensionContext, readonly parser: SourceParser) {
  
  }

  async refresh() {
    this.sources = this.context.workspaceState.get<Array<ISource>>(Keys.SOURCES, []);
    this.roots = await this.prepare();
  }

  getRoots() {
    return this.roots;
  }

  private addSourceToState(source: ISource) {
    this.sources.push(source);
    this.context.workspaceState.update(Keys.SOURCES, this.sources);
  }

  async add(type: SourceType, sourcePath: string) {
    const source: ISource = {
      id: v4(),
      type: type,
      sourcePath: sourcePath,
      filePath: "",
      name: "Source #1"
    };

    if (type == SourceType.Server) {
      const response = await getJSON(sourcePath)
      
      const savePath = source.id;

      
      // TODO use callback
      source.filePath = savePath;
    }

    this.addSourceToState(source);
  }

  private async prepare () : Promise<Array<Node>> {
    // this.prepareSource(i)
    const promises = this.sources.map(i => this.parser.prepareSource(i));

    const result = await Promise.all(promises);
    
    return result;
  }

}