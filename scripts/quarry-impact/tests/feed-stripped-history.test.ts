import {restoreBurntCreditBytes} from './burnt-credit-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFeedStrippedPrevious,restoreFeedStrippedBytes,verifyFeedStrippedRevision} from './feed-stripped-invariants';
const source=(file:string)=>restoreBurntCreditBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FeedStripped preserves every prior fixture, vehicle asset, venue art and history input',verifyFeedStrippedRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/feed-stripped/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFeedStrippedBytes(file,bytes),readFeedStrippedPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFeedStrippedBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFeedStrippedBytes('src/unknown.ts',unknown),unknown);
});
