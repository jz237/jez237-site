import {restoreAbsBytes} from './abs-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRegentPrevious,restoreRegentBytes,verifyRegentRevision} from './regent-invariants';
const source=(file:string)=>restoreAbsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Regent preserves every prior fixture, vehicle asset, control and camera input',verifyRegentRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/regent/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRegentBytes(file,bytes),readRegentPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRegentBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRegentBytes('src/unknown.ts',unknown),unknown);
});
