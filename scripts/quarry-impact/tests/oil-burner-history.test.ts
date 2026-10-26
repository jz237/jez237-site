import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOilBurnerPrevious,restoreOilBurnerBytes,verifyOilBurnerRevision} from './oil-burner-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('OilBurner preserves every prior fixture, vehicle asset, venue art and history input',verifyOilBurnerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/oil-burner/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOilBurnerBytes(file,bytes),readOilBurnerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOilBurnerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOilBurnerBytes('src/unknown.ts',unknown),unknown);
});
