import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readVenueCrowdPrevious,restoreVenueCrowdBytes,verifyVenueCrowdRevision} from './venue-crowd-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('VenueCrowd preserves every prior fixture, vehicle asset, control and camera input',verifyVenueCrowdRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/venue-crowd/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreVenueCrowdBytes(file,bytes),readVenueCrowdPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreVenueCrowdBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreVenueCrowdBytes('src/unknown.ts',unknown),unknown);
});
