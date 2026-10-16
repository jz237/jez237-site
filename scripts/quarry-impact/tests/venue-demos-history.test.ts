import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readVenueDemosPrevious,restoreVenueDemosBytes,verifyVenueDemosRevision} from './venue-demos-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('VenueDemos preserves every prior fixture, vehicle asset, control and camera input',verifyVenueDemosRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/venue-demos/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreVenueDemosBytes(file,bytes),readVenueDemosPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreVenueDemosBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreVenueDemosBytes('src/unknown.ts',unknown),unknown);
});
