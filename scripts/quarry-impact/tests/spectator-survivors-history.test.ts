import {restoreRookvaleRaceVenueBytes} from './rookvale-race-venue-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSpectatorSurvivorsPrevious,restoreSpectatorSurvivorsBytes,verifySpectatorSurvivorsRevision} from './spectator-survivors-invariants';
const source=(file:string)=>restoreRookvaleRaceVenueBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SpectatorSurvivors preserves every prior fixture, vehicle asset, control and camera input',verifySpectatorSurvivorsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/spectator-survivors/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSpectatorSurvivorsBytes(file,bytes),readSpectatorSurvivorsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSpectatorSurvivorsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSpectatorSurvivorsBytes('src/unknown.ts',unknown),unknown);
});
