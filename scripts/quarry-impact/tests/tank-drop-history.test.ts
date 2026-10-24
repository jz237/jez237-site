import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTankDropPrevious,restoreTankDropBytes,verifyTankDropRevision} from './tank-drop-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TankDrop preserves every prior fixture, vehicle asset, venue art and history input',verifyTankDropRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tank-drop/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTankDropBytes(file,bytes),readTankDropPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTankDropBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTankDropBytes('src/unknown.ts',unknown),unknown);
});
