import {restoreColdStartBytes} from './cold-start-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDustTrailsPrevious,restoreDustTrailsBytes,verifyDustTrailsRevision} from './dust-trails-invariants';
const source=(file:string)=>restoreColdStartBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DustTrails preserves every prior fixture, vehicle asset, venue art and history input',verifyDustTrailsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dust-trails/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDustTrailsBytes(file,bytes),readDustTrailsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDustTrailsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDustTrailsBytes('src/unknown.ts',unknown),unknown);
});
