import {restoreDunesSceneryBytes} from './dunes-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readParkSceneryPrevious,restoreParkSceneryBytes,verifyParkSceneryRevision} from './park-scenery-invariants';
const source=(file:string)=>restoreDunesSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ParkScenery preserves every prior fixture, vehicle asset, control and camera input',verifyParkSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/park-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreParkSceneryBytes(file,bytes),readParkSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreParkSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreParkSceneryBytes('src/unknown.ts',unknown),unknown);
});
