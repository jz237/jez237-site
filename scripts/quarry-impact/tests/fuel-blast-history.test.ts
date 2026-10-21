import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFuelBlastPrevious,restoreFuelBlastBytes,verifyFuelBlastRevision} from './fuel-blast-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FuelBlast preserves every prior fixture, vehicle asset, venue art and history input',verifyFuelBlastRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fuel-blast/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFuelBlastBytes(file,bytes),readFuelBlastPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFuelBlastBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFuelBlastBytes('src/unknown.ts',unknown),unknown);
});
