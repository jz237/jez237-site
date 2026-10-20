import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFeedWheelsPrevious,restoreFeedWheelsBytes,verifyFeedWheelsRevision} from './feed-wheels-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FeedWheels preserves every prior fixture, vehicle asset, venue art and history input',verifyFeedWheelsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/feed-wheels/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFeedWheelsBytes(file,bytes),readFeedWheelsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFeedWheelsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFeedWheelsBytes('src/unknown.ts',unknown),unknown);
});
