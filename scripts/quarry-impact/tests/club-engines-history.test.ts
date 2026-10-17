import {restoreClubEngineHudBytes} from './club-engine-hud-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readClubEnginesPrevious,restoreClubEnginesBytes,verifyClubEnginesRevision} from './club-engines-invariants';
const source=(file:string)=>restoreClubEngineHudBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ClubEngines preserves every prior fixture, vehicle asset, control and camera input',verifyClubEnginesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/club-engines/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreClubEnginesBytes(file,bytes),readClubEnginesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreClubEnginesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreClubEnginesBytes('src/unknown.ts',unknown),unknown);
});
