import {readFileSync} from 'node:fs';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
export function verifyRuntimeAssets(root,files){
 for(const f of files){if(f.path.includes('..')||f.path.startsWith('/'))throw Error('Invalid asset path '+f.path);let bytes;try{bytes=readFileSync(resolve(root,f.path));}catch{throw Error('Missing runtime dependency: '+f.path);}
 if(bytes.length!==f.bytes||createHash('sha256').update(bytes).digest('hex')!==f.sha256)throw Error('Runtime dependency mismatch: '+f.path);}
 return files.length;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const m=JSON.parse(readFileSync(new URL('../source/runtime-assets.json',import.meta.url)));console.log(JSON.stringify({verified:verifyRuntimeAssets(process.argv[2]??'public',m.files),root:process.argv[2]??'public'}));}
