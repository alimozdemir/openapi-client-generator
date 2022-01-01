import { workspace } from "vscode";

export default class Configuration {
  name: string = 'openapi-client-generator';
  diagnostics: Diagnostics;

  constructor() {
    const configuration = workspace.getConfiguration(this.name);
    this.diagnostics = configuration.get('diagnostics', new Diagnostics());
  }
}

export class Diagnostics {
  logs: boolean = true;
  logName: string = 'OpenAPI Client Generator';

  statusBar: boolean = true;
  statusBarPrefix: string = 'OpenAPI';
}