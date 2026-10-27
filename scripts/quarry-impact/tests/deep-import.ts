import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

/** Imports a module that heads a long chain of local imports without overflowing Node's module linker. Each history leaf's
 * invariants import the next newer leaf's, so an old one sits hundreds of modules deep, and linking that in one graph
 * recurses past the stack ("Maximum call stack size exceeded" before a test runs). Its local imports are followed through
 * the source text and imported deepest first, so each import links only modules already loaded. */
export async function importDeep<M=Record<string,any>>(url:URL):Promise<M>{
  const order:string[]=[],seen=new Set<string>();
  const local=(file:string)=>{
    const out:string[]=[];
    for(const m of readFileSync(file,'utf8').matchAll(/^\s*(?:import|export)\b[^'";]*?\bfrom\s*['"](\.{1,2}\/[^'"]+)['"]/gm)){
      const base=resolve(dirname(file),m[1]),found=[base,base+'.ts',base+'.js'].find(f=>existsSync(f)&&/\.(ts|js)$/.test(f));
      if(found)out.push(found);
    }
    return out;
  };
  // Post-order without recursion (the chain is as deep as the one that overflows).
  const stack:{file:string;deps:string[];next:number}[]=[];
  const push=(file:string)=>{seen.add(file);stack.push({file,deps:local(file),next:0});};
  push(fileURLToPath(url));
  while(stack.length){
    const top=stack[stack.length-1];
    if(top.next<top.deps.length){const dep=top.deps[top.next++];if(!seen.has(dep))push(dep);continue;}
    order.push(top.file);stack.pop();
  }
  let last:any;
  for(const file of order)last=await import(pathToFileURL(file).href);
  return last as M;
}
