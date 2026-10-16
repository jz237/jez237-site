import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTerrainCachePrevious,restoreTerrainCacheBytes,verifyTerrainCacheRevision} from './terrain-cache-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TerrainCache preserves every prior fixture, vehicle asset, control and camera input',verifyTerrainCacheRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/terrain-cache/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTerrainCacheBytes(file,bytes),readTerrainCachePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTerrainCacheBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTerrainCacheBytes('src/unknown.ts',unknown),unknown);
});
