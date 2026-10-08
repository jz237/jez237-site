import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDrivingAssistsPrevious,restoreDrivingAssistsBytes,verifyDrivingAssistsRevision} from './driving-assists-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DrivingAssists preserves every prior fixture, vehicle asset, control and camera input',verifyDrivingAssistsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driving-assists/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDrivingAssistsBytes(file,bytes),readDrivingAssistsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDrivingAssistsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDrivingAssistsBytes('src/unknown.ts',unknown),unknown);
});
