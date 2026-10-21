import {restoreFireAvoidanceBytes} from './fire-avoidance-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDrumBlastPrevious,restoreDrumBlastBytes,verifyDrumBlastRevision} from './drum-blast-invariants';
const source=(file:string)=>restoreFireAvoidanceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DrumBlast preserves every prior fixture, vehicle asset, venue art and history input',verifyDrumBlastRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/drum-blast/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDrumBlastBytes(file,bytes),readDrumBlastPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDrumBlastBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDrumBlastBytes('src/unknown.ts',unknown),unknown);
});
