import {restoreGlassRainBytes} from './glass-rain-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWetTyresPrevious,restoreWetTyresBytes,verifyWetTyresRevision} from './wet-tyres-invariants';
const source=(file:string)=>restoreGlassRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WetTyres preserves every prior fixture, vehicle asset, venue art and history input',verifyWetTyresRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wet-tyres/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWetTyresBytes(file,bytes),readWetTyresPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWetTyresBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWetTyresBytes('src/unknown.ts',unknown),unknown);
});
