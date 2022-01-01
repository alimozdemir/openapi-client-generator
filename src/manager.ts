import { ExtensionContext, OutputChannel, StatusBarAlignment, StatusBarItem, window, workspace } from "vscode";
import Configuration from "./configuration";

export default class Manager {

  private logs: OutputChannel | undefined;
  private statusBar: StatusBarItem | undefined;

  constructor(private readonly context: ExtensionContext, private readonly config: Configuration) {
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

    this.logs?.appendLine("Extension initiliazed");
  }
  

}