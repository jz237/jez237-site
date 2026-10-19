import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRavensmoorCircuitPrevious,restoreRavensmoorCircuitBytes,verifyRavensmoorCircuitRevision} from './ravensmoor-circuit-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RavensmoorCircuit preserves every prior fixture, vehicle asset, venue art and history input',verifyRavensmoorCircuitRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ravensmoor-circuit/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRavensmoorCircuitBytes(file,bytes),readRavensmoorCircuitPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRavensmoorCircuitBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRavensmoorCircuitBytes('src/unknown.ts',unknown),unknown);
});
