const { Project, TypeAliasDeclaration } = require('ts-morph');

function findTypes() {
  const project = new Project();



  const code = `export type OperationStatus = string;

  export interface OperationModel {
    id?: string;
    message?: string;
    status?: OperationStatus;
  }`;

  const sourceFile = project.createSourceFile("test.ts", code);

  const operationStatusRef = project.createSourceFile("OperationStatus.ts", "export type OperationStatus = 0 | 1 | 2 | 3;")
  
  const mytest = project.addSourceFilesAtPaths("/Users/alimozdemir/Documents/Temp/vscodeext/**")
  
  console.log(mytest);

  return;

  const myTestSource = project.getSourceFile("mytest.ts");

  const OTP = project.getModuleResolutionHost();

  console.log(OTP);

  const types = sourceFile.getTypeAlias("OperationStatus");

  types.remove();

  sourceFile.addImportDeclaration({
    namedImports: 'OperationStatus',
    moduleSpecifier: '../OperationStatus.ts'
  })

  console.log(project.getSourceFile("test.ts").getText())
}

findTypes();
