export interface ISource {
  id: string
  name: string
  type: SourceType
  path: string,
  schema: any
}

export enum SourceType {
  File,
  Server
}