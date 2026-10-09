import {restoreFenwickBytes} from './fenwick-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStuntPrevious,restoreStuntBytes,verifyStuntRevision} from './stunt-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Stunt preserves every prior fixture, vehicle asset, control and camera input',verifyStuntRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/stunt/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreFenwickBytes(file,source(file));assert.deepEqual(restoreStuntBytes(file,bytes),readStuntPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStuntBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStuntBytes('src/unknown.ts',unknown),unknown);
});
