import {restoreMirrorHangBytes} from './mirror-hang-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEngineMountsPrevious,restoreEngineMountsBytes,verifyEngineMountsRevision} from './engine-mounts-invariants';
const source=(file:string)=>restoreMirrorHangBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('EngineMounts preserves every prior fixture, vehicle asset, venue art and history input',verifyEngineMountsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/engine-mounts/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEngineMountsBytes(file,bytes),readEngineMountsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEngineMountsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEngineMountsBytes('src/unknown.ts',unknown),unknown);
});
