import fs from 'node:fs/promises';
let manifest;
export async function modelTransport(file) {
 if(!file.endsWith('.glb'))return null;
 if(manifest===undefined){
  const html=await fs.readFile('dist/index.html','utf8');
  const entry=html.match(/src="\.\/([^"?#]*\/index-[^"?#]+\.js)"/)?.[1];
  const packed=entry&&(await fs.readFile('dist/'+entry,'utf8')).includes('.glb.gz');
  manifest=packed?JSON.parse(await fs.readFile('source/model-packing.json','utf8')).models:{};
 }
 return manifest[file.split('/').pop()]??null;
}
