import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMirrorHangPrevious,restoreMirrorHangBytes,verifyMirrorHangRevision} from './mirror-hang-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('MirrorHang preserves every prior fixture, vehicle asset, venue art and history input',verifyMirrorHangRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/mirror-hang/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMirrorHangBytes(file,bytes),readMirrorHangPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMirrorHangBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMirrorHangBytes('src/unknown.ts',unknown),unknown);
});
