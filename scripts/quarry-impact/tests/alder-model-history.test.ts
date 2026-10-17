import {restoreAlderIntegrationBytes} from './alder-integration-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAlderModelPrevious,restoreAlderModelBytes,verifyAlderModelRevision} from './alder-model-invariants';
const source=(file:string)=>restoreAlderIntegrationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AlderModel preserves every prior fixture, vehicle asset, control and camera input',verifyAlderModelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/alder-model/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAlderModelBytes(file,bytes),readAlderModelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAlderModelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAlderModelBytes('src/unknown.ts',unknown),unknown);
});
