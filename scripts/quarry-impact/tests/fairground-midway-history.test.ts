import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFairgroundMidwayPrevious,restoreFairgroundMidwayBytes,verifyFairgroundMidwayRevision} from './fairground-midway-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FairgroundMidway preserves every prior fixture, vehicle asset, control and camera input',verifyFairgroundMidwayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fairground-midway/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFairgroundMidwayBytes(file,bytes),readFairgroundMidwayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFairgroundMidwayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFairgroundMidwayBytes('src/unknown.ts',unknown),unknown);
});
