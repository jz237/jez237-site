import {restoreLoadingStagesBytes} from './loading-stages-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readClubEngineHudPrevious,restoreClubEngineHudBytes,verifyClubEngineHudRevision} from './club-engine-hud-invariants';
const source=(file:string)=>restoreLoadingStagesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ClubEngineHud preserves every prior fixture, vehicle asset, control and camera input',verifyClubEngineHudRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/club-engine-hud/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreClubEngineHudBytes(file,bytes),readClubEngineHudPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreClubEngineHudBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreClubEngineHudBytes('src/unknown.ts',unknown),unknown);
});
