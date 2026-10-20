import {restoreHubcapsBytes} from './hubcaps-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readScrapeSparksPrevious,restoreScrapeSparksBytes,verifyScrapeSparksRevision} from './scrape-sparks-invariants';
const source=(file:string)=>restoreHubcapsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ScrapeSparks preserves every prior fixture, vehicle asset, venue art and history input',verifyScrapeSparksRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/scrape-sparks/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreScrapeSparksBytes(file,bytes),readScrapeSparksPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreScrapeSparksBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreScrapeSparksBytes('src/unknown.ts',unknown),unknown);
});
