import { Project, SyntaxKind } from 'ts-morph';
import { Node } from '../nodes/node';

export class ReferenceService {

  constructor() {
    
  }

  resolve(code: string, node: Node) {

    const refs = node.children.map(i => i.label);
    
    this.makeImports(code, refs);
  }

  private makeImports(code: string, refs: (string | undefined)[]) {
    const project = new Project();

    const sourceFile = project.createSourceFile("test.ts", code);
  

    refs.forEach(ref => {
      if (!ref) {
        return;
      }

      const exp = sourceFile.getExportDeclaration(ref);

      console.log(exp);
    })

  }

}