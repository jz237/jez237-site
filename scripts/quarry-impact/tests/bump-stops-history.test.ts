import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBumpStopsPrevious,restoreBumpStopsBytes,verifyBumpStopsRevision} from './bump-stops-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BumpStops preserves every prior fixture, vehicle asset, venue art and history input',verifyBumpStopsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bump-stops/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBumpStopsBytes(file,bytes),readBumpStopsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBumpStopsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBumpStopsBytes('src/unknown.ts',unknown),unknown);
});
