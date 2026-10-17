import {restoreCupVenueLabelsBytes} from './cup-venue-labels-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineSpectatingPrevious,restoreOnlineSpectatingBytes,verifyOnlineSpectatingRevision} from './online-spectating-invariants';
const source=(file:string)=>restoreCupVenueLabelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineSpectating preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineSpectatingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-spectating/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineSpectatingBytes(file,bytes),readOnlineSpectatingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineSpectatingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineSpectatingBytes('src/unknown.ts',unknown),unknown);
});
