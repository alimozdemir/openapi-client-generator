const { Project, TypeAliasDeclaration } = require('ts-morph');
const path = require('path')
function findTypes() {
  const project = new Project();

  const parsed = path.parse("./a.ts");

  console.log(parsed.root);
  console.log(parsed.dir);
  console.log(parsed.name);
  console.log(parsed.ext);

  console.log((path.join(parsed.dir, parsed.name)));

  return;

  const code = `export type OperationStatus = string;

  export interface OperationModel {
    id?: string;
    message?: string;
    status?: OperationStatus;
  }`;

  const sourceFile = project.createSourceFile("test.ts", code);

  const operationStatusRef = project.createSourceFile("OperationStatus.ts", "export type OperationStatus = 0 | 1 | 2 | 3;")
  
  const mytest = project.addSourceFilesAtPaths("/Users/alimozdemir/Documents/Temp/vscodeext/**")
  
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

const parsed = path.parse("/**");

console.log(parsed.dir);

//findTypes();
