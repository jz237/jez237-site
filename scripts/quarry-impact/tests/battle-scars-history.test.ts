import {restoreYellowLampsBytes} from './yellow-lamps-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBattleScarsPrevious,restoreBattleScarsBytes,verifyBattleScarsRevision} from './battle-scars-invariants';
const source=(file:string)=>restoreYellowLampsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BattleScars preserves every prior fixture, vehicle asset, venue art and history input',verifyBattleScarsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/battle-scars/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBattleScarsBytes(file,bytes),readBattleScarsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBattleScarsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBattleScarsBytes('src/unknown.ts',unknown),unknown);
});
