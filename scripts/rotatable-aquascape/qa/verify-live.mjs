import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const dist=path.resolve(import.meta.dirname,'../dist'),manifest=JSON.parse(fs.readFileSync(path.join(dist,'build-manifest.json')));
const model=fs.readdirSync(path.join(dist,'load')).find(f=>/^silver-angelfish-.*\.glb$/.test(f));
for(const base of ['https://hidden-reef.pages.dev/showroom/aquarium/','https://jez237.com/demos/rotatable-aquascape/']){
 const get=async file=>{const r=await fetch(base+file,{signal:AbortSignal.timeout(45000),headers:{'Cache-Control':'no-cache'}});assert.ok(r.ok,`${r.status}: ${base+file}`);return Buffer.from(await r.arrayBuffer());};
 const html=(await get('?verify='+Date.now())).toString();
 for(const file of manifest.filter(f=>/index-.*\.(js|css)$/.test(f)))assert.ok(html.includes(file),'active entry mismatch: '+base);
 assert.deepEqual(JSON.parse((await get('build-manifest.json')).toString()),manifest);
 for(const file of [...manifest,'load/'+model]){const actual=await get(file),expected=fs.readFileSync(path.join(dist,file));assert.ok(file.endsWith('.glb')?actual.equals(expected):actual.toString().replaceAll('\r\n','\n')===expected.toString().replaceAll('\r\n','\n'),'different live bytes: '+base+file);}
 console.log(base+' verified active HTML, all JS/CSS chunks and angelfish model bytes.');
}
