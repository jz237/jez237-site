import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLightContactPrevious,restoreLightContactBytes,verifyLightContactRevision} from './light-contact-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('LightContact preserves every prior fixture, vehicle asset, control and camera input',verifyLightContactRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/light-contact/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLightContactBytes(file,bytes),readLightContactPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLightContactBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLightContactBytes('src/unknown.ts',unknown),unknown);
});
