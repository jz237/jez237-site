import {restoreBatteryOutBytes} from './battery-out-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBumpStartPrevious,restoreBumpStartBytes,verifyBumpStartRevision} from './bump-start-invariants';
const source=(file:string)=>restoreBatteryOutBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BumpStart preserves every prior fixture, vehicle asset, venue art and history input',verifyBumpStartRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bump-start/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBumpStartBytes(file,bytes),readBumpStartPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBumpStartBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBumpStartBytes('src/unknown.ts',unknown),unknown);
});
