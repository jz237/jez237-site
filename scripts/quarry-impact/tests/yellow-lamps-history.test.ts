import {restoreTyreMarksBytes} from './tyre-marks-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readYellowLampsPrevious,restoreYellowLampsBytes,verifyYellowLampsRevision} from './yellow-lamps-invariants';
const source=(file:string)=>restoreTyreMarksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('YellowLamps preserves every prior fixture, vehicle asset, venue art and history input',verifyYellowLampsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/yellow-lamps/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreYellowLampsBytes(file,bytes),readYellowLampsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreYellowLampsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreYellowLampsBytes('src/unknown.ts',unknown),unknown);
});
