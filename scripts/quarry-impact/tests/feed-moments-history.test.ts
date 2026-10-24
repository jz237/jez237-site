import {restoreWreckNoteBytes} from './wreck-note-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFeedMomentsPrevious,restoreFeedMomentsBytes,verifyFeedMomentsRevision} from './feed-moments-invariants';
const source=(file:string)=>restoreWreckNoteBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FeedMoments preserves every prior fixture, vehicle asset, venue art and history input',verifyFeedMomentsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/feed-moments/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFeedMomentsBytes(file,bytes),readFeedMomentsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFeedMomentsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFeedMomentsBytes('src/unknown.ts',unknown),unknown);
});
