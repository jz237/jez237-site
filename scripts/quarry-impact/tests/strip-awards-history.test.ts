import {restoreScrapeSparksBytes} from './scrape-sparks-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStripAwardsPrevious,restoreStripAwardsBytes,verifyStripAwardsRevision} from './strip-awards-invariants';
const source=(file:string)=>restoreScrapeSparksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('StripAwards preserves every prior fixture, vehicle asset, venue art and history input',verifyStripAwardsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/strip-awards/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStripAwardsBytes(file,bytes),readStripAwardsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStripAwardsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStripAwardsBytes('src/unknown.ts',unknown),unknown);
});
