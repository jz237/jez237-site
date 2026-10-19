import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readNewcomersCupPrevious,restoreNewcomersCupBytes,verifyNewcomersCupRevision} from './newcomers-cup-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('NewcomersCup preserves every prior fixture, vehicle asset, venue art and history input',verifyNewcomersCupRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/newcomers-cup/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreNewcomersCupBytes(file,bytes),readNewcomersCupPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreNewcomersCupBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreNewcomersCupBytes('src/unknown.ts',unknown),unknown);
});
