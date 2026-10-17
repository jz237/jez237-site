import {restoreRookvaleHoistsBytes} from './rookvale-hoists-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readConiferSprayPrevious,restoreConiferSprayBytes,verifyConiferSprayRevision} from './conifer-spray-invariants';
const source=(file:string)=>restoreRookvaleHoistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ConiferSpray preserves every prior fixture, vehicle asset, control and camera input',verifyConiferSprayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/conifer-spray/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreConiferSprayBytes(file,bytes),readConiferSprayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreConiferSprayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreConiferSprayBytes('src/unknown.ts',unknown),unknown);
});
