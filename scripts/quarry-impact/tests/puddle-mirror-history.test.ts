import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPuddleMirrorPrevious,restorePuddleMirrorBytes,verifyPuddleMirrorRevision} from './puddle-mirror-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PuddleMirror preserves every prior fixture, vehicle asset, venue art and history input',verifyPuddleMirrorRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/puddle-mirror/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePuddleMirrorBytes(file,bytes),readPuddleMirrorPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePuddleMirrorBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePuddleMirrorBytes('src/unknown.ts',unknown),unknown);
});
