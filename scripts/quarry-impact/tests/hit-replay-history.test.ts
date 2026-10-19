import {restoreTakedownSlowmoBytes} from './takedown-slowmo-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHitReplayPrevious,restoreHitReplayBytes,verifyHitReplayRevision} from './hit-replay-invariants';
const source=(file:string)=>restoreTakedownSlowmoBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('HitReplay preserves every prior fixture, vehicle asset, venue art and history input',verifyHitReplayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hit-replay/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHitReplayBytes(file,bytes),readHitReplayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHitReplayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHitReplayBytes('src/unknown.ts',unknown),unknown);
});
