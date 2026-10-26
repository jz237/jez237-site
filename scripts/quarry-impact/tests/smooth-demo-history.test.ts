import {restoreSteadyTiersBytes} from './steady-tiers-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSmoothDemoPrevious,restoreSmoothDemoBytes,verifySmoothDemoRevision} from './smooth-demo-invariants';
const source=(file:string)=>restoreSteadyTiersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SmoothDemo preserves every prior fixture, vehicle asset, venue art and history input',verifySmoothDemoRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/smooth-demo/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSmoothDemoBytes(file,bytes),readSmoothDemoPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSmoothDemoBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSmoothDemoBytes('src/unknown.ts',unknown),unknown);
});
