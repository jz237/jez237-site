import {restoreOilSmokeBytes} from './oil-smoke-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRadiatorSteamPrevious,restoreRadiatorSteamBytes,verifyRadiatorSteamRevision} from './radiator-steam-invariants';
const source=(file:string)=>restoreOilSmokeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RadiatorSteam preserves every prior fixture, vehicle asset, venue art and history input',verifyRadiatorSteamRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/radiator-steam/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRadiatorSteamBytes(file,bytes),readRadiatorSteamPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRadiatorSteamBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRadiatorSteamBytes('src/unknown.ts',unknown),unknown);
});
