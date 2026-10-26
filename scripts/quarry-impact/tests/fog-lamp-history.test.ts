import {restoreShiftSmokeBytes} from './shift-smoke-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFogLampPrevious,restoreFogLampBytes,verifyFogLampRevision} from './fog-lamp-invariants';
const source=(file:string)=>restoreShiftSmokeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FogLamp preserves every prior fixture, vehicle asset, venue art and history input',verifyFogLampRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fog-lamp/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFogLampBytes(file,bytes),readFogLampPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFogLampBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFogLampBytes('src/unknown.ts',unknown),unknown);
});
