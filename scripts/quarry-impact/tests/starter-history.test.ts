import {restoreFrameBendBytes} from './frame-bend-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStarterPrevious,restoreStarterBytes,verifyStarterRevision} from './starter-invariants';
const source=(file:string)=>restoreFrameBendBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Starter preserves every prior fixture, vehicle asset, venue art and history input',verifyStarterRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/starter/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStarterBytes(file,bytes),readStarterPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStarterBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStarterBytes('src/unknown.ts',unknown),unknown);
});
