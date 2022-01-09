import { Doc } from "./doc";
import { DocV30 } from "./doc.v30";
import { DocV31 } from "./doc.v31";

export class DocManager {
  private readonly docs: Doc[] = [];
  
  constructor() {
    this.docs.push(new DocV30());
    this.docs.push(new DocV31());
  }

  getDocs() : Doc[] {
    return this.docs;
  }

  getDoc(schema: any): Doc | undefined {
    return this.docs.find(doc => schema.openapi.startsWith(doc.version));
  }

}