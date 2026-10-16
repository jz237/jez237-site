import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDerbyFeedPrevious,restoreDerbyFeedBytes,verifyDerbyFeedRevision} from './derby-feed-invariants';
const source=(file:string)=>restoreSteeringRefreshBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DerbyFeed preserves every prior fixture, vehicle asset, control and camera input',verifyDerbyFeedRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/derby-feed/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDerbyFeedBytes(file,bytes),readDerbyFeedPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDerbyFeedBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDerbyFeedBytes('src/unknown.ts',unknown),unknown);
});

import {restoreSteeringRefreshBytes} from './steering-refresh-invariants';
