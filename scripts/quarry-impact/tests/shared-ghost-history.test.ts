import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSharedGhostPrevious,restoreSharedGhostBytes,verifySharedGhostRevision} from './shared-ghost-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SharedGhost preserves every prior fixture, vehicle asset, control and camera input',verifySharedGhostRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shared-ghost/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSharedGhostBytes(file,bytes),readSharedGhostPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSharedGhostBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSharedGhostBytes('src/unknown.ts',unknown),unknown);
});
