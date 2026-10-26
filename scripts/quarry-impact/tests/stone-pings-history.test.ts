import {restoreFogLampBytes} from './fog-lamp-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStonePingsPrevious,restoreStonePingsBytes,verifyStonePingsRevision} from './stone-pings-invariants';
const source=(file:string)=>restoreFogLampBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('StonePings preserves every prior fixture, vehicle asset, venue art and history input',verifyStonePingsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/stone-pings/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStonePingsBytes(file,bytes),readStonePingsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStonePingsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStonePingsBytes('src/unknown.ts',unknown),unknown);
});
