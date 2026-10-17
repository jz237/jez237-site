import {restoreScrapeSurfaceAudioBytes} from './scrape-surface-audio-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvaleWearPrevious,restoreRookvaleWearBytes,verifyRookvaleWearRevision} from './rookvale-wear-invariants';
const source=(file:string)=>restoreScrapeSurfaceAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RookvaleWear preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleWearRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale-wear/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRookvaleWearBytes(file,bytes),readRookvaleWearPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleWearBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleWearBytes('src/unknown.ts',unknown),unknown);
});
