import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMudFlapsPrevious,restoreMudFlapsBytes,verifyMudFlapsRevision} from './mud-flaps-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('MudFlaps preserves every prior fixture, vehicle asset, venue art and history input',verifyMudFlapsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/mud-flaps/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMudFlapsBytes(file,bytes),readMudFlapsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMudFlapsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMudFlapsBytes('src/unknown.ts',unknown),unknown);
});
