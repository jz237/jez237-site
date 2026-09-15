import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {assetURL,resolveAssetURL} from '../lib/AssetPaths.ts';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root)),hash=b=>createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(read('lib/LoadAssetManifest.json')),preloads=JSON.parse(read('LoadPreloads.json'));
test('versioned assets preserve geometry, textures and lighting with verified lossless PNG replacements',()=>{
 const proof=JSON.parse(read('loading-source/pixel-provenance.json'));
 for(const [original,target] of Object.entries(manifest)){
  const bytes=read('public/'+target.slice(2));assert.ok(target.includes(hash(bytes).slice(0,16)),'filename follows content');
  const name=path.basename(original,'.png'),record=proof[name];
  if(record){assert.equal(hash(read('public/'+original.slice(2))),record.sourceSHA256);assert.equal(hash(bytes),record.webpSHA256);}
  else{let source=read('public/'+original.slice(2));if(/\.(gltf|json)$/.test(original))source=Buffer.from(source.toString('utf8').replace(/\r\n/g,'\n'));assert.deepEqual(bytes,source,original);}
 }
 assert.equal(preloads.length,27);assert.equal(new Set(preloads.map(p=>p.href)).size,27);
 assert.ok(preloads.every(p=>Object.values(manifest).includes(p.href)));
});
test('model dependencies use identical versioned URLs for all site and relative loader paths',()=>{
 for(const base of ['https://jez237.com/demos/rotatable-aquascape/?stats=1','https://hidden-reef.pages.dev/showroom/aquarium/?showroom=hidden-reef','http://127.0.0.1:5199/dist/']){
  for(const [original,target] of Object.entries(manifest)){
   assert.equal(resolveAssetURL(original,base),target);assert.equal(resolveAssetURL(new URL(original,base).href,base),target);assert.equal(assetURL(original),target);
   if(original.endsWith('.gltf')){const model=JSON.parse(read('public/'+original.slice(2)));for(const item of [...model.buffers,...model.images]){const url=new URL(item.uri,new URL(original,base));assert.ok(resolveAssetURL(url.href,base).startsWith('./load/'));}}
  }
  assert.equal(resolveAssetURL('https://unrelated.test/image.jpg',base),'https://unrelated.test/image.jpg');assert.equal(resolveAssetURL('data:image/png;base64,AA==',base),'data:image/png;base64,AA==');
 }
});
