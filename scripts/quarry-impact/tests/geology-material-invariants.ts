import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const hash=(value:Uint8Array|string)=>createHash('sha256').update(value).digest('hex');
const oldFactory=readFileSync(new URL('./fixtures/quarry-rock-v5.ts.txt',import.meta.url));
assert.equal(hash(oldFactory),'0b2660b6a3b0a6af83f24f5ad3743ee7287d260f754b8840a77b9d3f8d10f24c');
const baseline=JSON.parse(readFileSync(new URL('./fixtures/circuit-surface-baseline.json',import.meta.url),'utf8'));

/** Only the new import and the quarryRock factory may evolve. The caller then
 * reverses the separately tested circuit integration and checks the original
 * whole-file checksum, including all unrelated materials and geometry. */
export function restoreGeologySurfaceSource(bytes:Buffer){
  let source=bytes.toString('utf8');const nl=source.includes('\r\n')?'\r\n':'\n';
  const imported="import { quarryGeology } from './scenery-geology-material';"+nl;
  assert.equal(source.split(imported).length,2,'exactly one geology factory import');
  source=source.replace(imported,'');
  const wrapper=['export function quarryRock() {','    return quarryGeology();','}'].join(nl);
  assert.equal(source.split(wrapper).length,2,'only the declared quarryRock wrapper can replace the frozen factory');
  return Buffer.from(source.replace(wrapper,oldFactory.toString('utf8').replace(/\r\n/g,'\n').trimEnd().replace(/\n/g,nl)),'utf8');
}

/** Restore just the three previously identified wall material consumers.
 * Geometry, transforms, instance data, maps on unrelated consumers and every
 * non-shader parameter outside the declared photo/normal changes stay exact. */
export function restoreGeologyObjects(objects:any[]){
  const restored=structuredClone(objects);let count=0;
  assert.equal(restored.length,baseline.objects.length);
  for(let i=0;i<restored.length;i++)for(let j=0;j<baseline.objects[i].materials.length;j++){
    const old=baseline.objects[i].materials[j];
    if(old.shader.programKey!=='north-woodland-crest-v1')continue;
    const object=restored[i],next=object.materials[j];
    assert.deepEqual({...object,materials:baseline.objects[i].materials},baseline.objects[i],`rock consumer ${i}: every geometric and instance field remains exact`);
    assert.equal(next.name,'quarry-photographic-geology');
    assert.deepEqual(next.normalScale,[.95,.95]);
    assert.match(next.shader.programKey,/^north-woodland-crest-geology-v\d+$/);
    for(const [key,value]of Object.entries(old.shader.uniforms))assert.deepEqual(next.shader.uniforms[key],value,`the previous crest/dust uniform ${key} is retained`);
    const additions=['geologyWeatheredColor','geologyWeatheredNormal','geologyWeatheredRough'];
    assert.deepEqual(Object.keys(next.shader.uniforms).sort(),[...Object.keys(old.shader.uniforms),...additions].sort(),'only the registered secondary rock channels are added');
    for(const [key,map]of [['geologyWeatheredColor','map'],['geologyWeatheredNormal','normalMap'],['geologyWeatheredRough','roughnessMap']]){
      assert.deepEqual(next.shader.uniforms[key],old.maps[map],'the old source scan remains byte-for-parameter registered as the weathered layer');
      const expected={...old.maps[map],name:old.maps[map].name.replace('/rock_','/geology_rock_')};
      assert.deepEqual(next.maps[map],expected,'primary photos change source only, preserving colour interpretation and texture transforms');
    }
    assert.deepEqual({...next,name:old.name,normalScale:old.normalScale,maps:old.maps,shader:old.shader},old,'all remaining material parameters stay exact');
    object.materials[j]=structuredClone(old);count++;
  }
  assert.equal(count,3,'the quarry wall material change is limited to the three existing consumers');
  return restored;
}
