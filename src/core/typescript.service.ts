import { Project, SourceFile } from 'ts-morph';
import { v4 } from 'uuid';
import { PathService } from './path.service';

export class TypescriptService {
  private project: Project;
  private sourceMap: Map<string, string[]> = new Map<string, string[]>();
  
  constructor(readonly pathService: PathService) {
    this.project = new Project();
  }

  generateRandomFileName() {
    return v4() + '.ts';
  }

  removeTypes(code: string, refs: string[]) {
    const fileName = this.generateRandomFileName();

    const sourceFile = this.project.createSourceFile(fileName, code);

    refs.forEach(ref => {
      const type = sourceFile.getTypeAlias(ref);
      type?.remove();
    });

    const result = sourceFile.getText();

    this.project.removeSourceFile(sourceFile);

    return result;
  }

  private addOrUpdateSourceMap(key: string, value: string) {
    
    if (this.sourceMap.has(key)) {
      const values = this.sourceMap.get(key)!;
      values.push(value);
      this.sourceMap.set(key, values);
    } else {
      this.sourceMap.set(key, [value]);
    }
  }

  scan() {
    this.sourceMap.clear();
    const path = this.pathService.getGlob();
    const sourceFiles = this.project.addSourceFilesAtPaths(path);
    
    sourceFiles.forEach(sourceFile => {
      this.seekForInterfaces(sourceFile);
      this.seekForTypes(sourceFile);
    });
  }

  private seekForInterfaces(sourceFile: SourceFile) {
    const interfaces = sourceFile.getInterfaces();

    const sourceFilePath = sourceFile.getFilePath();

    interfaces.forEach(i => {
      this.addOrUpdateSourceMap(i.getName(), sourceFilePath);
    });
  }

  private seekForTypes(sourceFile: SourceFile) {
    const types = sourceFile.getTypeAliases();

    const sourceFilePath = sourceFile.getFilePath();

    types.forEach(i => {
      this.addOrUpdateSourceMap(i.getName(), sourceFilePath);
    });
  }

  findLocationOfRefs(refs: string[]) {
    const result: Map<string, string[]> = new Map<string, string[]>();

    refs.forEach(ref => {
      const values = this.sourceMap.get(ref);
      if (values)
        result.set(ref, values);
    });

    return result;
  }

  addImports(code: string, refPairs: Map<string, string>) {
    const fileName = this.generateRandomFileName();
    const sourceFile = this.project.createSourceFile(fileName, code);

    refPairs.forEach((value: string, key: string) => {
      const prunePath = this.pathService.prunePath(value);

      sourceFile.addImportDeclaration({
        namedImports: [key],
        moduleSpecifier: this.pathService.removeFileExt(prunePath)
      });
    });

    const result = sourceFile.getText();

    this.project.removeSourceFile(sourceFile);
    
    return result;
  }
}