import {restoreTordalCarBytes} from './tordal-car-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMillbrookWharfPrevious,restoreMillbrookWharfBytes,verifyMillbrookWharfRevision} from './millbrook-wharf-invariants';
const source=(file:string)=>restoreTordalCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MillbrookWharf preserves every prior fixture, vehicle asset, control and camera input',verifyMillbrookWharfRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/millbrook-wharf/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMillbrookWharfBytes(file,bytes),readMillbrookWharfPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMillbrookWharfBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMillbrookWharfBytes('src/unknown.ts',unknown),unknown);
});
