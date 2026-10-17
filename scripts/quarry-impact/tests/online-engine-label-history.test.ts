import {restoreOnlineOpponentsBytes} from './online-opponents-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineEngineLabelPrevious,restoreOnlineEngineLabelBytes,verifyOnlineEngineLabelRevision} from './online-engine-label-invariants';
const source=(file:string)=>restoreOnlineOpponentsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineEngineLabel preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineEngineLabelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-engine-label/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineEngineLabelBytes(file,bytes),readOnlineEngineLabelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineEngineLabelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineEngineLabelBytes('src/unknown.ts',unknown),unknown);
});
