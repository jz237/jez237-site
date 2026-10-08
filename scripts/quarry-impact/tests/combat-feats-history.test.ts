import {restoreShuttleBytes} from './shuttle-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCombatFeatsPrevious,restoreCombatFeatsBytes,verifyCombatFeatsRevision} from './combat-feats-invariants';
const source=(file:string)=>restoreShuttleBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CombatFeats preserves every prior fixture, vehicle asset, control and camera input',verifyCombatFeatsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/combat-feats/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCombatFeatsBytes(file,bytes),readCombatFeatsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCombatFeatsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCombatFeatsBytes('src/unknown.ts',unknown),unknown);
});
