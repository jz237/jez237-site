import {restoreChaseNetworkBytes} from './chase-network-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChaseAuthorityPrevious,restoreChaseAuthorityBytes,verifyChaseAuthorityRevision} from './chase-authority-invariants';
const source=(file:string)=>restoreChaseNetworkBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ChaseAuthority preserves every prior fixture, vehicle asset, control and camera input',verifyChaseAuthorityRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/chase-authority/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChaseAuthorityBytes(file,bytes),readChaseAuthorityPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChaseAuthorityBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChaseAuthorityBytes('src/unknown.ts',unknown),unknown);
});
