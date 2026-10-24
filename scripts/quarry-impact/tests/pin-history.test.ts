import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinPrevious,restorePinBytes,verifyPinRevision} from './pin-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Pin preserves every prior fixture, vehicle asset, venue art and history input',verifyPinRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pin/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinBytes(file,bytes),readPinPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinBytes('src/unknown.ts',unknown),unknown);
});
