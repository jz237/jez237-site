import {restoreBodyworkResolutionBytes} from './bodywork-resolution-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSharedDepthPrevious,restoreSharedDepthBytes,verifySharedDepthRevision} from './shared-depth-invariants';
const source=(file:string)=>restoreBodyworkResolutionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SharedDepth preserves every prior fixture, vehicle asset, control and camera input',verifySharedDepthRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shared-depth/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSharedDepthBytes(file,bytes),readSharedDepthPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSharedDepthBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSharedDepthBytes('src/unknown.ts',unknown),unknown);
});
