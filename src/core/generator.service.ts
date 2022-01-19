import { compile, Options } from 'json-schema-to-typescript'
import { Doc } from '../docs/doc';
import { Node } from '../nodes/node';

export class GeneratorService {

  private compileOptions : Partial<Options> = {
    bannerComment: '',
    declareExternallyReferenced: true,
    unreachableDefinitions: true
  }

  generateSchema(node: Node, obj: any, doc: Doc) {
    return this.compileSchema(obj, node.label, doc);
  }

  private async compileSchema(obj: any, schemaName: string, doc: Doc) {
    let copy = JSON.parse(JSON.stringify(obj));

    copy.title = schemaName;
    const refs = doc.pruneRefs(copy, schemaName);

    refs.forEach(ref => {
      if (ref) {
        if (ref == '#') // root
          return;
        this.mockRef(copy, ref);
      } else {
        throw Error ('Unexpected behavior from typescript generation')
      }
    });

    const compiled = await compile(copy, schemaName, this.compileOptions);
  
    return compiled;
  }

  private mockRef(obj:any, ref: string) {
    const splitted = ref.split('/');
  
    let trav = obj;
    let name: string = '';
    for (let i = 1; i < splitted.length; i++) {
      name = splitted[i];
      
      trav[name] = {};
      trav = trav[name];
    }

    Object.assign(trav, {
      type: 'string',
      title: name
    })

  }
  
}