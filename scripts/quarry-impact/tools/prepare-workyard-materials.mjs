// Restore free photographic maps with source checksums; gameplay uses local files.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const directory='public/assets/workyard';
await fs.mkdir(directory,{recursive:true});
await fs.mkdir('source/workyard',{recursive:true});
const manifest=[];
for(const id of ['container_side','rusty_painted_metal','concrete_layers_02']) {
  const info=await fetch(`https://api.polyhaven.com/info/${id}`).then(r=>{assert.ok(r.ok);return r.json();});
  const files=await fetch(`https://api.polyhaven.com/files/${id}`).then(r=>{assert.ok(r.ok);return r.json();});
  await fs.writeFile(`source/workyard/${id}-source.json`,JSON.stringify({source:`https://polyhaven.com/a/${id}`,license:'CC0-1.0',info,files},null,2));
  for(const [kind,key]of [['diff','Diffuse'],['normal','nor_gl'],['arm','arm']]) {
    const source=files[key]['2k'].jpg;
    const file=`${id}-${kind}.jpg`,target=`${directory}/${file}`;
    let bytes=await fs.readFile(target).catch(()=>null);
    if(!bytes||createHash('md5').update(bytes).digest('hex')!==source.md5) {
      const r=await fetch(source.url);assert.ok(r.ok,source.url);bytes=Buffer.from(await r.arrayBuffer());
      assert.equal(createHash('md5').update(bytes).digest('hex'),source.md5);
      await fs.writeFile(target,bytes);
    }
    manifest.push({file,source:`https://polyhaven.com/a/${id}`,url:source.url,license:'CC0-1.0',authors:info.authors,
      scaleMetres:info.dimensions.map(n=>n/1000),bytes:bytes.length,md5:source.md5,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
}
await fs.writeFile(`${directory}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({files:manifest.length,bytes:manifest.reduce((n,m)=>n+m.bytes,0)}));
