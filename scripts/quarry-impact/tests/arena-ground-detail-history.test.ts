import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readArenaGroundDetailPrevious,restoreArenaGroundDetailBytes,verifyArenaGroundDetailRevision} from './arena-ground-detail-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ArenaGroundDetail preserves every prior fixture, vehicle asset, control and camera input',verifyArenaGroundDetailRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/arena-ground-detail/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreArenaGroundDetailBytes(file,bytes),readArenaGroundDetailPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreArenaGroundDetailBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreArenaGroundDetailBytes('src/unknown.ts',unknown),unknown);
});
