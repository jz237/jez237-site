import {restoreClutchSlipBytes} from './clutch-slip-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFuelStarvePrevious,restoreFuelStarveBytes,verifyFuelStarveRevision} from './fuel-starve-invariants';
const source=(file:string)=>restoreClutchSlipBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FuelStarve preserves every prior fixture, vehicle asset, venue art and history input',verifyFuelStarveRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fuel-starve/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFuelStarveBytes(file,bytes),readFuelStarvePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFuelStarveBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFuelStarveBytes('src/unknown.ts',unknown),unknown);
});
