import {restoreFuelBlastBytes} from './fuel-blast-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCarFireSpreadPrevious,restoreCarFireSpreadBytes,verifyCarFireSpreadRevision} from './car-fire-spread-invariants';
const source=(file:string)=>restoreFuelBlastBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CarFireSpread preserves every prior fixture, vehicle asset, venue art and history input',verifyCarFireSpreadRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/car-fire-spread/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCarFireSpreadBytes(file,bytes),readCarFireSpreadPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCarFireSpreadBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCarFireSpreadBytes('src/unknown.ts',unknown),unknown);
});
