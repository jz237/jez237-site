import {restoreDustTrailsBytes} from './dust-trails-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTyreSteamPrevious,restoreTyreSteamBytes,verifyTyreSteamRevision} from './tyre-steam-invariants';
const source=(file:string)=>restoreDustTrailsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TyreSteam preserves every prior fixture, vehicle asset, venue art and history input',verifyTyreSteamRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tyre-steam/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTyreSteamBytes(file,bytes),readTyreSteamPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTyreSteamBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTyreSteamBytes('src/unknown.ts',unknown),unknown);
});
