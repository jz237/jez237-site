import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRoofKnockPrevious,restoreRoofKnockBytes,verifyRoofKnockRevision} from './roof-knock-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RoofKnock preserves every prior fixture, vehicle asset, venue art and history input',verifyRoofKnockRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roof-knock/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRoofKnockBytes(file,bytes),readRoofKnockPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRoofKnockBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRoofKnockBytes('src/unknown.ts',unknown),unknown);
});
