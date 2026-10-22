import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGearPopPrevious,restoreGearPopBytes,verifyGearPopRevision} from './gear-pop-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('GearPop preserves every prior fixture, vehicle asset, venue art and history input',verifyGearPopRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/gear-pop/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGearPopBytes(file,bytes),readGearPopPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGearPopBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGearPopBytes('src/unknown.ts',unknown),unknown);
});
