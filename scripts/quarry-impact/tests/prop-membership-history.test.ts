import {restorePinecrestMaterialsBytes} from './pinecrest-materials-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPropMembershipPrevious,restorePropMembershipBytes,verifyPropMembershipRevision} from './prop-membership-invariants';
const source=(file:string)=>restorePinecrestMaterialsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PropMembership preserves every prior fixture, vehicle asset, control and camera input',verifyPropMembershipRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/prop-membership/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePropMembershipBytes(file,bytes),readPropMembershipPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePropMembershipBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePropMembershipBytes('src/unknown.ts',unknown),unknown);
});
