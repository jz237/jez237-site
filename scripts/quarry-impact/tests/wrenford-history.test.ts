import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWrenfordPrevious,restoreWrenfordBytes,verifyWrenfordRevision} from './wrenford-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Wrenford preserves every prior fixture, vehicle asset, control and camera input',verifyWrenfordRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wrenford/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWrenfordBytes(file,bytes),readWrenfordPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWrenfordBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWrenfordBytes('src/unknown.ts',unknown),unknown);
});
