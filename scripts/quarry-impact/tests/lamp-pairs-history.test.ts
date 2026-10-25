import {restoreLampSprayBytes} from './lamp-spray-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLampPairsPrevious,restoreLampPairsBytes,verifyLampPairsRevision} from './lamp-pairs-invariants';
const source=(file:string)=>restoreLampSprayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LampPairs preserves every prior fixture, vehicle asset, venue art and history input',verifyLampPairsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lamp-pairs/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLampPairsBytes(file,bytes),readLampPairsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLampPairsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLampPairsBytes('src/unknown.ts',unknown),unknown);
});
