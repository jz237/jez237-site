import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDoorChainsPrevious,restoreDoorChainsBytes,verifyDoorChainsRevision} from './door-chains-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DoorChains preserves every prior fixture, vehicle asset, venue art and history input',verifyDoorChainsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/door-chains/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDoorChainsBytes(file,bytes),readDoorChainsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDoorChainsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDoorChainsBytes('src/unknown.ts',unknown),unknown);
});
