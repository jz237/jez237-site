import {restoreReplayThermalBytes} from './replay-thermal-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDemoStartModePrevious,restoreDemoStartModeBytes,verifyDemoStartModeRevision} from './demo-start-mode-invariants';
const source=(file:string)=>restoreReplayThermalBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DemoStartMode preserves every prior fixture, vehicle asset, control and camera input',verifyDemoStartModeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/demo-start-mode/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDemoStartModeBytes(file,bytes),readDemoStartModePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDemoStartModeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDemoStartModeBytes('src/unknown.ts',unknown),unknown);
});
