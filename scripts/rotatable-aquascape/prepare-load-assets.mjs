// Run before Vite. Original geometry and JPEG/16-bit masks stay byte-for-byte intact.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=import.meta.dirname,pub=path.join(root,'public'),out=path.join(pub,'load');
fs.mkdirSync(out,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const models=['dead_tree_trunk_02','rock_moss_set_01','fern_02','moss_01'];
const extras=['models/angelfish/silver-angelfish.glb','living-species.png','grazer-material-atlas.png','models/fern_02/textures/fern_02_alpha_2k.png','models/moss_01/textures/moss_01_alpha_2k.png','models/rock_moss_set_01/textures/rock_moss_set_01_ao_2k.jpg','lighting/diffuse-probes.json','lighting/diffuse-probes.bin'];
const manifest={},preloads=[],provenance=JSON.parse(fs.readFileSync(path.join(root,'loading-source/pixel-provenance.json')));
function emit(original,bytes,extension=path.extname(original),as='fetch'){
 if(/\.(gltf|json)$/.test(extension))bytes=Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n'));
 const filename=path.basename(original,path.extname(original))+'-'+hash(bytes).slice(0,16)+extension,url='./load/'+filename;
 fs.writeFileSync(path.join(out,filename),bytes);manifest['./'+original]=url;
 if(!preloads.some(p=>p.href===url))preloads.push({href:url,as});
 return filename;
}
function copy(original,as='fetch'){
 if(manifest['./'+original])return path.basename(manifest['./'+original]);
 const name=path.basename(original,'.png'),proof=provenance[name];
 if(proof){const src=fs.readFileSync(path.join(pub,original)),webp=fs.readFileSync(path.join(root,'loading-source',name+'.webp'));if(hash(src)!==proof.sourceSHA256||hash(webp)!==proof.webpSHA256)throw Error('Regenerate verified lossless texture: '+name);return emit(original,webp,'.webp',as);}
 return emit(original,fs.readFileSync(path.join(pub,original)),path.extname(original),as);
}
for(const model of models){
 const original=`models/${model}/${model}_2k.gltf`,data=JSON.parse(fs.readFileSync(path.join(pub,original)));
 for(const item of [...data.buffers,...data.images])copy(path.posix.join(path.posix.dirname(original),item.uri));
 emit(original,fs.readFileSync(path.join(pub,original)));
}
for(const file of extras)copy(file,/\.(png|jpg)$/.test(file)?'image':'fetch');
fs.writeFileSync(path.join(root,'lib/LoadAssetManifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'LoadPreloads.json'),JSON.stringify(preloads,null,2)+'\n');
console.log('Prepared '+preloads.length+' versioned aquarium assets.');
