import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinecrestPrevious,restorePinecrestBytes,verifyPinecrestRevision} from './pinecrest-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Pinecrest preserves every prior fixture, vehicle asset, control and camera input',verifyPinecrestRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pinecrest/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinecrestBytes(file,bytes),readPinecrestPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinecrestBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinecrestBytes('src/unknown.ts',unknown),unknown);
});
