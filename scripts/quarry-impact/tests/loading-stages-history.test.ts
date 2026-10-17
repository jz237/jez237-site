import {restoreOnlineEngineLabelBytes} from './online-engine-label-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLoadingStagesPrevious,restoreLoadingStagesBytes,verifyLoadingStagesRevision} from './loading-stages-invariants';
const source=(file:string)=>restoreOnlineEngineLabelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LoadingStages preserves every prior fixture, vehicle asset, control and camera input',verifyLoadingStagesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/loading-stages/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLoadingStagesBytes(file,bytes),readLoadingStagesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLoadingStagesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLoadingStagesBytes('src/unknown.ts',unknown),unknown);
});
