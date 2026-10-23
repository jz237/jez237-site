import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrowdFlashPrevious,restoreCrowdFlashBytes,verifyCrowdFlashRevision} from './crowd-flash-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CrowdFlash preserves every prior fixture, vehicle asset, venue art and history input',verifyCrowdFlashRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crowd-flash/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrowdFlashBytes(file,bytes),readCrowdFlashPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrowdFlashBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrowdFlashBytes('src/unknown.ts',unknown),unknown);
});
