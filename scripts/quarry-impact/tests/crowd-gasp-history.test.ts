import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrowdGaspPrevious,restoreCrowdGaspBytes,verifyCrowdGaspRevision} from './crowd-gasp-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CrowdGasp preserves every prior fixture, vehicle asset, venue art and history input',verifyCrowdGaspRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crowd-gasp/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrowdGaspBytes(file,bytes),readCrowdGaspPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrowdGaspBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrowdGaspBytes('src/unknown.ts',unknown),unknown);
});
