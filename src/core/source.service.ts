import { ExtensionContext } from "vscode";
import { Node, notEmptyNode } from "../nodes/node";
import { Keys } from "./keys";
import { ISource, SourceType } from "./sources";
import { SourceParser } from "./source.parser";
import { getJSON } from "./request";
import { v4 } from 'uuid';

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
      path: sourcePath,
      name: '',
      schema: undefined
    };

    if (type == SourceType.Server) {
      const response = await getJSON(sourcePath);
      source.schema = response;
      source.name = this.guessName(response);
    }

    this.addSourceToState(source);
  }


  private guessName(response: any) {
    if (response?.info?.title)
      return response.info.title;

    return 'Unknown source';
  }

  remove(node: Node) {
    const source = this.sources.findIndex(i => i.id === node.id);
  
    if (source < 0)
      return false;

    this.sources.splice(source, 1);

    this.context.workspaceState.update(Keys.SOURCES, this.sources);
    
    return true;
  }

  rename(node: Node, name: string) {
    const source = this.sources.find(i => i.id === node.id);
  
    if (!source)
      return false;
    
    source.name = name;
  
    this.context.workspaceState.update(Keys.SOURCES, this.sources);
    
    return true;
  }

  private async prepare () : Promise<Array<Node>> {
    // this.prepareSource(i)
    const promises = this.sources.map(i => this.parser.prepareSource(i));

    const result = await Promise.all(promises);
    
    return result.filter(notEmptyNode);
  }

}