import {restoreKiteBytes} from './kite-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTrackAcousticsPrevious,restoreTrackAcousticsBytes,verifyTrackAcousticsRevision} from './track-acoustics-invariants';
const source=(file:string)=>restoreKiteBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TrackAcoustics preserves every prior fixture, vehicle asset, control and camera input',verifyTrackAcousticsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/track-acoustics/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTrackAcousticsBytes(file,bytes),readTrackAcousticsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTrackAcousticsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTrackAcousticsBytes('src/unknown.ts',unknown),unknown);
});
