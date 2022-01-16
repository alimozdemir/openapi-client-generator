import { workspace } from "vscode";

export const ExtensionCodeName = 'openapi-client-generator';

export function createExtensionAlias(name: string) {
  return ExtensionCodeName + '.' + name;
}

export default class Configuration {
  name: string = ExtensionCodeName;
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