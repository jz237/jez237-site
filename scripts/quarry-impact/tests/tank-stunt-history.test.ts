import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTankStuntPrevious,restoreTankStuntBytes,verifyTankStuntRevision} from './tank-stunt-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TankStunt preserves every prior fixture, vehicle asset, venue art and history input',verifyTankStuntRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tank-stunt/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTankStuntBytes(file,bytes),readTankStuntPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTankStuntBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTankStuntBytes('src/unknown.ts',unknown),unknown);
});
