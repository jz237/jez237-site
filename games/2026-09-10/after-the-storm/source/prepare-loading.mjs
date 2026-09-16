import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,posix} from 'node:path';

export function prepareLoading(root){
 const versions={};
 function assets(dir){for(const entry of readdirSync(join(root,dir),{withFileTypes:true})){
  const path=posix.join(dir,entry.name);if(entry.isDirectory())assets(path);
  else if(/\.(?:jpg|webp|json|bin)$/.test(path)){
   const bytes=path.endsWith('.json')?readFileSync(join(root,path),'utf8').replaceAll('\r\n','\n'):readFileSync(join(root,path));
   versions[path]=createHash('sha256').update(bytes).digest('hex').slice(0,12);
  }
 }}assets('assets');
 writeFileSync(join(root,'asset-versions.js'),'// Generated asset content identities; never cache HTML or saves.\nexport const assetVersions='+JSON.stringify(versions,null,2)+';\n');
 const graph=new Map(),pattern=/(?:from\s*|import\s*)['"](\.[^'"]+\.js)['"]/g;
 function visit(name){if(graph.has(name))return;const source=readFileSync(join(root,name),'utf8').replaceAll('\r\n','\n');graph.set(name,source);for(const m of source.matchAll(pattern))visit(posix.normalize(posix.join(posix.dirname(name),m[1])));}
 visit('terrain-worker.js');
 const hash=createHash('sha256');for(const [name,source]of [...graph].sort())hash.update(name+'\0'+source+'\0');const revision=hash.digest('hex').slice(0,12);
 mkdirSync(join(root,'terrain-worker'),{recursive:true});
 for(const [name,source]of graph)writeFileSync(join(root,'terrain-worker',name),source.replace(pattern,(all,path)=>all.replace(path,path+'?v='+revision)).trimEnd()+'\n');
 writeFileSync(join(root,'worker-version.js'),`// Every worker dependency uses the same graph revision (workers have no import maps).\nexport const terrainWorkerURL='./terrain-worker/terrain-worker.js?v=${revision}';\n`);
}
