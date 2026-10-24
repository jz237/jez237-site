import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWallSlamPrevious,restoreWallSlamBytes,verifyWallSlamRevision} from './wall-slam-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WallSlam preserves every prior fixture, vehicle asset, venue art and history input',verifyWallSlamRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wall-slam/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWallSlamBytes(file,bytes),readWallSlamPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWallSlamBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWallSlamBytes('src/unknown.ts',unknown),unknown);
});
