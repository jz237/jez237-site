import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReplayResponsivePrevious,restoreReplayResponsiveBytes,verifyReplayResponsiveRevision} from './replay-responsive-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('responsive replay preserves every prior fixture, vehicle asset, control and camera input',verifyReplayResponsiveRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/replay-responsive/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReplayResponsiveBytes(file,bytes),readReplayResponsivePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReplayResponsiveBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReplayResponsiveBytes('src/unknown.ts',unknown),unknown);
});
