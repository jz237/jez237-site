import {restoreCrushedPaintBytes} from './crushed-paint-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvaleHoistsPrevious,restoreRookvaleHoistsBytes,verifyRookvaleHoistsRevision} from './rookvale-hoists-invariants';
const source=(file:string)=>restoreCrushedPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RookvaleHoists preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleHoistsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale-hoists/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRookvaleHoistsBytes(file,bytes),readRookvaleHoistsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleHoistsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleHoistsBytes('src/unknown.ts',unknown),unknown);
});
