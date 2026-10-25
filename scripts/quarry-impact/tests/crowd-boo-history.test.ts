import {restorePlayerHornBytes} from './player-horn-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrowdBooPrevious,restoreCrowdBooBytes,verifyCrowdBooRevision} from './crowd-boo-invariants';
const source=(file:string)=>restorePlayerHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CrowdBoo preserves every prior fixture, vehicle asset, venue art and history input',verifyCrowdBooRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crowd-boo/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrowdBooBytes(file,bytes),readCrowdBooPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrowdBooBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrowdBooBytes('src/unknown.ts',unknown),unknown);
});
