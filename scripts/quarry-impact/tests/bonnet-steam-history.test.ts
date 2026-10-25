import {restoreRoofRainBytes} from './roof-rain-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBonnetSteamPrevious,restoreBonnetSteamBytes,verifyBonnetSteamRevision} from './bonnet-steam-invariants';
const source=(file:string)=>restoreRoofRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BonnetSteam preserves every prior fixture, vehicle asset, venue art and history input',verifyBonnetSteamRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bonnet-steam/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBonnetSteamBytes(file,bytes),readBonnetSteamPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBonnetSteamBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBonnetSteamBytes('src/unknown.ts',unknown),unknown);
});
