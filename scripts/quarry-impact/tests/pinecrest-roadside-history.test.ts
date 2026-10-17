import {restoreHudInitialStateBytes} from './hud-initial-state-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinecrestRoadsidePrevious,restorePinecrestRoadsideBytes,verifyPinecrestRoadsideRevision} from './pinecrest-roadside-invariants';
const source=(file:string)=>restoreHudInitialStateBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PinecrestRoadside preserves every prior fixture, vehicle asset, control and camera input',verifyPinecrestRoadsideRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pinecrest-roadside/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinecrestRoadsideBytes(file,bytes),readPinecrestRoadsidePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinecrestRoadsideBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinecrestRoadsideBytes('src/unknown.ts',unknown),unknown);
});
