// Rebuild the installed, pinned Rapier source-map sources with a Workers WASM-module
// initializer. No binary patching, dynamic compilation or replacement physics.
import { readFile, writeFile, mkdir, copyFile, readdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pkg=join(root,'node_modules/@dimforge/rapier3d-compat');
const out=join(root,'multiplayer/.generated');
await mkdir(out,{recursive:true});
const map=JSON.parse(await readFile(join(pkg,'rapier.mjs.map'),'utf8'));
for(let i=0;i<map.sources.length;i++){
  const marker='../gen3d/gen3d/', source=map.sources[i];
  if(!source.startsWith(marker))continue;
  const relative=source.slice(marker.length);
  if(relative==='init.ts')continue;
  const path=join(out,relative);await mkdir(dirname(path),{recursive:true});await writeFile(path,map.sourcesContent[i]);
}
for(const directory of ['dynamics','geometry','pipeline','control'])await copyFile(join(pkg,directory,'index.d.ts'),join(out,directory,'index.ts'));
for(const directory of ['dynamics','geometry','pipeline','control'])for(const file of await readdir(join(pkg,directory)))if(file.endsWith('.d.ts')){
  const target=join(out,directory,file.replace('.d.ts','.ts'));
  try{await access(target);}catch{await copyFile(join(pkg,directory,file),target);}
}
await copyFile(join(pkg,'rapier_wasm3d.js'),join(out,'rapier_wasm3d.js'));
await copyFile(join(pkg,'rapier_wasm3d_bg.wasm'),join(out,'rapier.wasm'));
await writeFile(join(out,'raw.ts'),`export * from './rapier_wasm3d.js';\n`);
await writeFile(join(out,'init.ts'),`import wasm from './rapier.wasm';\nimport { initSync } from './rapier_wasm3d.js';\nlet ready=false;\nexport function init(){if(!ready){initSync({module:wasm});ready=true;}}\n`);
await writeFile(join(out,'rapier.ts'),`export * from './exports';\nimport * as R from './exports';\nexport default R;\n`);
await build({entryPoints:[join(out,'rapier.ts')],outfile:join(out,'rapier-worker.mjs'),bundle:true,format:'esm',platform:'neutral',external:['./rapier.wasm'],minify:true});
console.log('Prepared Rapier 0.19.3 for precompiled Workers WASM modules.');
