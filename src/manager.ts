import { commands, ExtensionContext, OutputChannel, StatusBarAlignment, StatusBarItem, window, workspace } from "vscode";
import Configuration from "./configuration";
import { SourceParser } from "./core/source.parser";
import { SourceService } from "./core/source.service";
import { SourceType } from "./core/sources";
import { NodeProvider } from "./nodes/node.provider";

export default class Manager {

  private logs: OutputChannel | undefined;
  private statusBar: StatusBarItem | undefined;
  private nodeProvider: NodeProvider | undefined;
  private sourceService: SourceService;

  constructor(private readonly context: ExtensionContext, private readonly config: Configuration) {
    this.sourceService = new SourceService(context, new SourceParser());
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

    const addCommand = commands.registerCommand('openapi-client-generator.explorer.add', async () => {
      const result = await window.showInputBox({ placeHolder: 'Please enter url of open api json/yaml file.' });
      
      if (!result)
        return;

      this.sourceService.add(SourceType.Server, result);

      this.nodeProvider?.refresh();

      this.logs?.appendLine('A new source added');
    });

    this.context.subscriptions.push(addCommand)

    this.logs?.appendLine("Tree View initialized.");
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
  

}