import {restoreSaggingBumpersBytes} from './sagging-bumpers-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBentCornersPrevious,restoreBentCornersBytes,verifyBentCornersRevision} from './bent-corners-invariants';
const source=(file:string)=>restoreSaggingBumpersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BentCorners preserves every prior fixture, vehicle asset, venue art and history input',verifyBentCornersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bent-corners/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBentCornersBytes(file,bytes),readBentCornersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBentCornersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBentCornersBytes('src/unknown.ts',unknown),unknown);
});
