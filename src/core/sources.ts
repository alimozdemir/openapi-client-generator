export interface ISource {
  id: string
  name: string
  type: SourceType
  sourcePath: string
  filePath: string
}

export enum SourceType {
  File,
  Server
}