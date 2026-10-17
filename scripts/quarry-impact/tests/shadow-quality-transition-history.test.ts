import {restoreWrenfordClearanceBytes} from './wrenford-clearance-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readShadowQualityTransitionPrevious,restoreShadowQualityTransitionBytes,verifyShadowQualityTransitionRevision} from './shadow-quality-transition-invariants';
const source=(file:string)=>restoreWrenfordClearanceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ShadowQualityTransition preserves every prior fixture, vehicle asset, control and camera input',verifyShadowQualityTransitionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shadow-quality-transition/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreShadowQualityTransitionBytes(file,bytes),readShadowQualityTransitionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreShadowQualityTransitionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreShadowQualityTransitionBytes('src/unknown.ts',unknown),unknown);
});
