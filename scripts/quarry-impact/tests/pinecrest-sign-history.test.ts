import {restorePinecrestLandscapeBytes} from './pinecrest-landscape-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinecrestSignPrevious,restorePinecrestSignBytes,verifyPinecrestSignRevision} from './pinecrest-sign-invariants';
const source=(file:string)=>restorePinecrestLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PinecrestSign preserves every prior fixture, vehicle asset, control and camera input',verifyPinecrestSignRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pinecrest-sign/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinecrestSignBytes(file,bytes),readPinecrestSignPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinecrestSignBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinecrestSignBytes('src/unknown.ts',unknown),unknown);
});
