import {restoreOilSeizeBytes} from './oil-seize-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFireCookPrevious,restoreFireCookBytes,verifyFireCookRevision} from './fire-cook-invariants';
const source=(file:string)=>restoreOilSeizeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FireCook preserves every prior fixture, vehicle asset, venue art and history input',verifyFireCookRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fire-cook/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFireCookBytes(file,bytes),readFireCookPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFireCookBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFireCookBytes('src/unknown.ts',unknown),unknown);
});
