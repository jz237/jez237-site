import {restoreAggregateConveyorBytes} from './aggregate-conveyor-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readKingswellBandstandsPrevious,restoreKingswellBandstandsBytes,verifyKingswellBandstandsRevision} from './kingswell-bandstands-invariants';
const source=(file:string)=>restoreAggregateConveyorBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('KingswellBandstands preserves every prior fixture, vehicle asset, control and camera input',verifyKingswellBandstandsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/kingswell-bandstands/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreKingswellBandstandsBytes(file,bytes),readKingswellBandstandsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreKingswellBandstandsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreKingswellBandstandsBytes('src/unknown.ts',unknown),unknown);
});
