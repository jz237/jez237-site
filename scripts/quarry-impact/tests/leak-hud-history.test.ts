import {restoreReplaySlicksBytes} from './replay-slicks-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLeakHudPrevious,restoreLeakHudBytes,verifyLeakHudRevision} from './leak-hud-invariants';
const source=(file:string)=>restoreReplaySlicksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LeakHud preserves every prior fixture, vehicle asset, venue art and history input',verifyLeakHudRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/leak-hud/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLeakHudBytes(file,bytes),readLeakHudPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLeakHudBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLeakHudBytes('src/unknown.ts',unknown),unknown);
});
