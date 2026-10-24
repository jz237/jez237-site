import {restoreFrenzyBytes} from './frenzy-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWreckNotePrevious,restoreWreckNoteBytes,verifyWreckNoteRevision} from './wreck-note-invariants';
const source=(file:string)=>restoreFrenzyBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WreckNote preserves every prior fixture, vehicle asset, venue art and history input',verifyWreckNoteRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wreck-note/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWreckNoteBytes(file,bytes),readWreckNotePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWreckNoteBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWreckNoteBytes('src/unknown.ts',unknown),unknown);
});
