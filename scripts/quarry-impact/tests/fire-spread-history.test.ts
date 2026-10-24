import {restoreExhaustCrushBytes} from './exhaust-crush-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFireSpreadPrevious,restoreFireSpreadBytes,verifyFireSpreadRevision} from './fire-spread-invariants';
const source=(file:string)=>restoreExhaustCrushBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FireSpread preserves every prior fixture, vehicle asset, venue art and history input',verifyFireSpreadRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fire-spread/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFireSpreadBytes(file,bytes),readFireSpreadPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFireSpreadBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFireSpreadBytes('src/unknown.ts',unknown),unknown);
});
