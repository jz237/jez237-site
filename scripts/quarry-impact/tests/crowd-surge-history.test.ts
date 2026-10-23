import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrowdSurgePrevious,restoreCrowdSurgeBytes,verifyCrowdSurgeRevision} from './crowd-surge-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CrowdSurge preserves every prior fixture, vehicle asset, venue art and history input',verifyCrowdSurgeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crowd-surge/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrowdSurgeBytes(file,bytes),readCrowdSurgePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrowdSurgeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrowdSurgeBytes('src/unknown.ts',unknown),unknown);
});
