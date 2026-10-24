import {restoreBumpStartBytes} from './bump-start-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMirrorClipPrevious,restoreMirrorClipBytes,verifyMirrorClipRevision} from './mirror-clip-invariants';
const source=(file:string)=>restoreBumpStartBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MirrorClip preserves every prior fixture, vehicle asset, venue art and history input',verifyMirrorClipRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/mirror-clip/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMirrorClipBytes(file,bytes),readMirrorClipPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMirrorClipBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMirrorClipBytes('src/unknown.ts',unknown),unknown);
});
