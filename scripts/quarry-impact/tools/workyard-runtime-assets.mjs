import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export async function workyardRuntimeAssetPlan(){
  const model=JSON.parse(await fs.readFile('source/models/quarry-workyard-manifest.json','utf8'));
  const textures=JSON.parse(await fs.readFile('public/assets/workyard/manifest.json','utf8'));
  const plan=[...model.files.filter(f=>f.path.endsWith('.glb')).map(f=>({...f,file:f.path.replace(/^public\//,'')})),
    ...textures.map(f=>({...f,file:'assets/workyard/'+f.file}))];
  for(const item of plan)for(const root of ['public','dist']){
    const bytes=await fs.readFile(root+'/'+item.file);
    assert.equal(bytes.length,item.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256);
  }
  return plan;
}
