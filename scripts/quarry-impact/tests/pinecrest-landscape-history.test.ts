import {restorePinecrestRoadsideBytes} from './pinecrest-roadside-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinecrestLandscapePrevious,restorePinecrestLandscapeBytes,verifyPinecrestLandscapeRevision} from './pinecrest-landscape-invariants';
const source=(file:string)=>restorePinecrestRoadsideBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PinecrestLandscape preserves every prior fixture, vehicle asset, control and camera input',verifyPinecrestLandscapeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pinecrest-landscape/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinecrestLandscapeBytes(file,bytes),readPinecrestLandscapePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinecrestLandscapeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinecrestLandscapeBytes('src/unknown.ts',unknown),unknown);
});
