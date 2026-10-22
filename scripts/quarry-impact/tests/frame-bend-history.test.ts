import {restorePadDamageBytes} from './pad-damage-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFrameBendPrevious,restoreFrameBendBytes,verifyFrameBendRevision} from './frame-bend-invariants';
const source=(file:string)=>restorePadDamageBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FrameBend preserves every prior fixture, vehicle asset, venue art and history input',verifyFrameBendRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/frame-bend/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFrameBendBytes(file,bytes),readFrameBendPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFrameBendBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFrameBendBytes('src/unknown.ts',unknown),unknown);
});
