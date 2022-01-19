import * as vscode from 'vscode';
import { workspace } from 'vscode';
import { parse, join } from 'path';
import Configuration from '../configuration';

export class PathService {

  constructor(private readonly configuration: Configuration) {
    
  }

  getWorkspaces() {
    return workspace.workspaceFolders?.map(i => i.uri.fsPath);
  }

  getWorkspace() {
    if (!workspace.workspaceFolders || workspace.workspaceFolders.length < 1) {
      return './'
    }

    return workspace.workspaceFolders[0].uri.fsPath;
  }

  getGlob() {
    const workspace = this.getWorkspace();

    return workspace + this.configuration.folder;
  }

  getFilePath(name: string) {
    const workspace = this.getWorkspace();

    return `${workspace}/${name}.ts`;
  }

  prunePath(path: string) {
    const workspace = this.getWorkspace();
    return path.replace(workspace, '.');
  }

  removeFileExt(path: string) {
    const parsed = parse(path);
    return './' + join(parsed.dir, parsed.name);
  }
}