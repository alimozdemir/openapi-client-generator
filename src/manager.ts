import { ExtensionContext, OutputChannel, StatusBarAlignment, StatusBarItem, window } from "vscode";
import Configuration from "./configuration";
import { GeneratorService } from "./core/generator.service";
import { SourceParser } from "./core/source.parser";
import { SourceService } from "./core/source.service";
import { SourceType } from "./core/sources";
import { DocManager } from "./docs/doc.manager";
import { Node } from "./nodes/node";
import { NodeProvider } from "./nodes/node.provider";

export default class Manager {

  private logs: OutputChannel | undefined;
  private statusBar: StatusBarItem | undefined;
  private nodeProvider: NodeProvider | undefined;
  private sourceService: SourceService;
  private docManager: DocManager;
  private generatorService: GeneratorService;

  constructor(private readonly context: ExtensionContext, private readonly config: Configuration) {
    this.docManager = new DocManager();
    this.generatorService = new GeneratorService();
    this.sourceService = new SourceService(context, new SourceParser(this.docManager));
  }

  async initialize() {
    this.sourceService.refresh();

    this.nodeProvider = new NodeProvider(this.sourceService);
    const treeProvider = window.registerTreeDataProvider('openapi-client-generator.explorer', this.nodeProvider);
    this.context.subscriptions.push(treeProvider);

    const treeView = window.createTreeView('openapi-client-generator.explorer', {
      treeDataProvider: this.nodeProvider
    });

    this.context.subscriptions.push(treeView);

    this.logs?.appendLine("Tree View initialized.");
  }

  async refresh(onlyTreeView: boolean = false) {
    if (!onlyTreeView) {
      await this.sourceService.refresh();
    }
    this.nodeProvider?.refresh();
  }

  diagnostics() {
    if (this.config.diagnostics.logs) {
      this.logs = window.createOutputChannel(this.config.diagnostics.logName);
      this.logs.show();
      this.context.subscriptions.push(this.logs);
    }

    if (this.config.diagnostics.statusBar) {
      this.statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
      this.statusBar.show();
      this.context.subscriptions.push(this.statusBar);
    }

    this.logs?.appendLine("Diagnostics initiliazed");
  }
  
  /**
   * Schema Methods
   */
  getSource(node: Node) {
    return this.sourceService.getSource(node);
  }

  getDoc(schema: any) {
    return this.docManager.getDoc(schema);
  }

  generateSchema(node: Node, obj: any) {
    return this.generatorService.generateSchema(node, obj);
  }

  /**
   * Source methods
   */
  // TODO: try to organize this method with an interface or class (manager)
  addSource(source: string) {
    return this.sourceService.add(SourceType.Server, source);
  }

  renameSource(node: Node, name: string) {
    return this.sourceService.rename(node, name);
  }

  removeSource(node: Node) {
    return this.sourceService.remove(node);
  }

  /**
   * Utils
   */

  log(message: string) {
    this.logs?.appendLine(message);
  }

}