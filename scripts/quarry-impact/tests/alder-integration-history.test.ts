import {restoreOnlineAlderBytes} from './online-alder-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAlderIntegrationPrevious,restoreAlderIntegrationBytes,verifyAlderIntegrationRevision} from './alder-integration-invariants';
const source=(file:string)=>restoreOnlineAlderBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AlderIntegration preserves every prior fixture, vehicle asset, control and camera input',verifyAlderIntegrationRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/alder-integration/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAlderIntegrationBytes(file,bytes),readAlderIntegrationPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAlderIntegrationBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAlderIntegrationBytes('src/unknown.ts',unknown),unknown);
});
