import {restoreWrenfordWindpumpBytes} from './wrenford-windpump-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAutomaticDirectionChangePrevious,restoreAutomaticDirectionChangeBytes,verifyAutomaticDirectionChangeRevision} from './automatic-direction-change-invariants';
const source=(file:string)=>restoreWrenfordWindpumpBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AutomaticDirectionChange preserves every prior fixture, vehicle asset, control and camera input',verifyAutomaticDirectionChangeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/automatic-direction-change/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAutomaticDirectionChangeBytes(file,bytes),readAutomaticDirectionChangePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAutomaticDirectionChangeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAutomaticDirectionChangeBytes('src/unknown.ts',unknown),unknown);
});
