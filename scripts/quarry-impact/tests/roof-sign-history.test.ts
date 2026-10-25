import {restoreDriverFigureBytes} from './driver-figure-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRoofSignPrevious,restoreRoofSignBytes,verifyRoofSignRevision} from './roof-sign-invariants';
const source=(file:string)=>restoreDriverFigureBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RoofSign preserves every prior fixture, vehicle asset, venue art and history input',verifyRoofSignRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roof-sign/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRoofSignBytes(file,bytes),readRoofSignPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRoofSignBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRoofSignBytes('src/unknown.ts',unknown),unknown);
});
