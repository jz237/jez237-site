import {restoreCanalSceneryBytes} from './canal-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDunesSceneryPrevious,restoreDunesSceneryBytes,verifyDunesSceneryRevision} from './dunes-scenery-invariants';
const source=(file:string)=>restoreCanalSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DunesScenery preserves every prior fixture, vehicle asset, control and camera input',verifyDunesSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dunes-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDunesSceneryBytes(file,bytes),readDunesSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDunesSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDunesSceneryBytes('src/unknown.ts',unknown),unknown);
});
