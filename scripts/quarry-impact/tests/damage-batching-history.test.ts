import {restoreReplayResponsiveBytes} from './replay-responsive-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDamageBatchingPrevious,restoreDamageBatchingBytes,verifyDamageBatchingRevision} from './damage-batching-invariants';
const source=(file:string)=>restoreReplayResponsiveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('damage batching preserves every prior fixture, vehicle asset, control and camera input',verifyDamageBatchingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/damage-batching/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDamageBatchingBytes(file,bytes),readDamageBatchingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDamageBatchingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDamageBatchingBytes('src/unknown.ts',unknown),unknown);
});
