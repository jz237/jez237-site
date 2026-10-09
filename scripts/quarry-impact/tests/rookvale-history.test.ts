import {restoreElmsworthBytes} from './elmsworth-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvalePrevious,restoreRookvaleBytes,verifyRookvaleRevision} from './rookvale-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Rookvale preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreElmsworthBytes(file,source(file));assert.deepEqual(restoreRookvaleBytes(file,bytes),readRookvalePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleBytes('src/unknown.ts',unknown),unknown);
});
