import {restoreWetReflectionsBytes} from './wet-reflections-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrakeSteamPrevious,restoreBrakeSteamBytes,verifyBrakeSteamRevision} from './brake-steam-invariants';
const source=(file:string)=>restoreWetReflectionsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BrakeSteam preserves every prior fixture, vehicle asset, venue art and history input',verifyBrakeSteamRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/brake-steam/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrakeSteamBytes(file,bytes),readBrakeSteamPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrakeSteamBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrakeSteamBytes('src/unknown.ts',unknown),unknown);
});
