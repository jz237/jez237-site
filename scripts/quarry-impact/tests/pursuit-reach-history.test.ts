import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPursuitReachPrevious,restorePursuitReachBytes,verifyPursuitReachRevision} from './pursuit-reach-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PursuitReach preserves every prior fixture, vehicle asset, control and camera input',verifyPursuitReachRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pursuit-reach/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePursuitReachBytes(file,bytes),readPursuitReachPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePursuitReachBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePursuitReachBytes('src/unknown.ts',unknown),unknown);
});
