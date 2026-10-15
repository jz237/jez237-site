import {restoreSableStationBytes} from './sable-station-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSableCliffsPrevious,restoreSableCliffsBytes,verifySableCliffsRevision} from './sable-cliffs-invariants';
const source=(file:string)=>restoreSableStationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SableCliffs preserves every prior fixture, vehicle asset, control and camera input',verifySableCliffsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sable-cliffs/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSableCliffsBytes(file,bytes),readSableCliffsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSableCliffsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSableCliffsBytes('src/unknown.ts',unknown),unknown);
});
