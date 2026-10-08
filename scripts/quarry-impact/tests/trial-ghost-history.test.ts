import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTrialGhostPrevious,restoreTrialGhostBytes,verifyTrialGhostRevision} from './trial-ghost-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TrialGhost preserves every prior fixture, vehicle asset, control and camera input',verifyTrialGhostRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/trial-ghost/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTrialGhostBytes(file,bytes),readTrialGhostPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTrialGhostBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTrialGhostBytes('src/unknown.ts',unknown),unknown);
});
