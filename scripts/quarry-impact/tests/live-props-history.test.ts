import {restorePropMembershipBytes} from './prop-membership-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLivePropsPrevious,restoreLivePropsBytes,verifyLivePropsRevision} from './live-props-invariants';
const source=(file:string)=>restorePropMembershipBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LiveProps preserves every prior fixture, vehicle asset, control and camera input',verifyLivePropsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/live-props/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLivePropsBytes(file,bytes),readLivePropsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLivePropsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLivePropsBytes('src/unknown.ts',unknown),unknown);
});
