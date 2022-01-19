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

  async refresh(force: boolean = false) {
    this.sources = this.context.workspaceState.get<Array<ISource>>(Keys.SOURCES, []);

    if (force) {
      const sourceTasks: Array<Promise<void>> = [];

      for (const source of this.sources) {
        sourceTasks.push(this.updateSource(source));
      }
  
      await Promise.all(sourceTasks);
  
      this.context.workspaceState.update(Keys.SOURCES, this.sources);
    }

    this.roots = await this.prepare();
  }

  private findSource(id: string) {
    return this.sources.find(i => i.id === id);
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
      await this.updateSource(source);
    }

    this.addSourceToState(source);
  }

  private async updateSource(source: ISource) {
    const response = await getJSON(source.path);
    source.schema = response;
    source.name = this.guessName(response);
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

  private getSourceId(id: string) {
    const theFirstSplash = id.indexOf('/');
    const endLength = theFirstSplash > -1 ? theFirstSplash : id.length;

    return id.substring(0, endLength)
  }

  public getSource(node: Node) {
    if (!node.id) {
      throw Error('Id is not found');
    }

    const sourceId = this.getSourceId(node.id);

    const source = this.findSource(sourceId);

    return source;
  }

}