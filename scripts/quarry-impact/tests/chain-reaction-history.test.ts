import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChainReactionPrevious,restoreChainReactionBytes,verifyChainReactionRevision} from './chain-reaction-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ChainReaction preserves every prior fixture, vehicle asset, venue art and history input',verifyChainReactionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/chain-reaction/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChainReactionBytes(file,bytes),readChainReactionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChainReactionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChainReactionBytes('src/unknown.ts',unknown),unknown);
});
