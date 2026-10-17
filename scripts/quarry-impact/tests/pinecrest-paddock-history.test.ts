import {restorePinecrestSignBytes} from './pinecrest-sign-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinecrestPaddockPrevious,restorePinecrestPaddockBytes,verifyPinecrestPaddockRevision} from './pinecrest-paddock-invariants';
const source=(file:string)=>restorePinecrestSignBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PinecrestPaddock preserves every prior fixture, vehicle asset, control and camera input',verifyPinecrestPaddockRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pinecrest-paddock/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinecrestPaddockBytes(file,bytes),readPinecrestPaddockPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinecrestPaddockBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinecrestPaddockBytes('src/unknown.ts',unknown),unknown);
});
