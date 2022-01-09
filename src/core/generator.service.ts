import { compile, Options } from 'json-schema-to-typescript'
import { Node } from '../nodes/node';

export class GeneratorService {

  private compileOptions : Partial<Options> = {
    bannerComment: '',
    declareExternallyReferenced: true,
    unreachableDefinitions: true
  }

  generateSchema(node: Node, obj: any) {
    const refs = node.children.map(i => i.contextValue);
    
    return this.compileSchema(obj, refs, node.label);
  }

  private async compileSchema(obj: any, refs: (string | undefined)[], schemaName: string) {
    const copy = JSON.parse(JSON.stringify(obj));

    refs.forEach(ref => {
      if (!ref) {
        return;
      }

      this.mockRef(copy, ref);
    })

    console.log(JSON.stringify(copy));

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