import {restoreShadowQualityTransitionBytes} from './shadow-quality-transition-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWrenfordWindpumpPrevious,restoreWrenfordWindpumpBytes,verifyWrenfordWindpumpRevision} from './wrenford-windpump-invariants';
const source=(file:string)=>restoreShadowQualityTransitionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WrenfordWindpump preserves every prior fixture, vehicle asset, control and camera input',verifyWrenfordWindpumpRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wrenford-windpump/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWrenfordWindpumpBytes(file,bytes),readWrenfordWindpumpPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWrenfordWindpumpBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWrenfordWindpumpBytes('src/unknown.ts',unknown),unknown);
});
