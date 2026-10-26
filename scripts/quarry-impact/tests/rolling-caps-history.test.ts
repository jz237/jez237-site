import {restoreBodyDustBytes} from './body-dust-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRollingCapsPrevious,restoreRollingCapsBytes,verifyRollingCapsRevision} from './rolling-caps-invariants';
const source=(file:string)=>restoreBodyDustBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RollingCaps preserves every prior fixture, vehicle asset, venue art and history input',verifyRollingCapsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rolling-caps/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRollingCapsBytes(file,bytes),readRollingCapsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRollingCapsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRollingCapsBytes('src/unknown.ts',unknown),unknown);
});
