import {restoreChaseUIBytes} from './chase-ui-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChaseNetworkPrevious,restoreChaseNetworkBytes,verifyChaseNetworkRevision} from './chase-network-invariants';
const source=(file:string)=>restoreChaseUIBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ChaseNetwork preserves every prior fixture, vehicle asset, control and camera input',verifyChaseNetworkRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/chase-network/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChaseNetworkBytes(file,bytes),readChaseNetworkPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChaseNetworkBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChaseNetworkBytes('src/unknown.ts',unknown),unknown);
});
