import {restoreControllerRumbleBytes} from './controller-rumble-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBodyworkResolutionPrevious,restoreBodyworkResolutionBytes,verifyBodyworkResolutionRevision} from './bodywork-resolution-invariants';
const source=(file:string)=>restoreControllerRumbleBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BodyworkResolution preserves every prior fixture, vehicle asset, control and camera input',verifyBodyworkResolutionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bodywork-resolution/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBodyworkResolutionBytes(file,bytes),readBodyworkResolutionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBodyworkResolutionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBodyworkResolutionBytes('src/unknown.ts',unknown),unknown);
});
