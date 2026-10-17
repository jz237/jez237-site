import {restoreDemoStartModeBytes} from './demo-start-mode-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAshfordRoadWearPrevious,restoreAshfordRoadWearBytes,verifyAshfordRoadWearRevision} from './ashford-road-wear-invariants';
const source=(file:string)=>restoreDemoStartModeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AshfordRoadWear preserves every prior fixture, vehicle asset, control and camera input',verifyAshfordRoadWearRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ashford-road-wear/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAshfordRoadWearBytes(file,bytes),readAshfordRoadWearPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAshfordRoadWearBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAshfordRoadWearBytes('src/unknown.ts',unknown),unknown);
});
