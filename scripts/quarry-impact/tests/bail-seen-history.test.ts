import {restoreCabinSmokeBytes} from './cabin-smoke-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBailSeenPrevious,restoreBailSeenBytes,verifyBailSeenRevision} from './bail-seen-invariants';
const source=(file:string)=>restoreCabinSmokeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BailSeen preserves every prior fixture, vehicle asset, venue art and history input',verifyBailSeenRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bail-seen/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBailSeenBytes(file,bytes),readBailSeenPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBailSeenBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBailSeenBytes('src/unknown.ts',unknown),unknown);
});
