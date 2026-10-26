import {restoreExhaustFlamesBytes} from './exhaust-flames-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readScrapeLayersPrevious,restoreScrapeLayersBytes,verifyScrapeLayersRevision} from './scrape-layers-invariants';
const source=(file:string)=>restoreExhaustFlamesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ScrapeLayers preserves every prior fixture, vehicle asset, venue art and history input',verifyScrapeLayersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/scrape-layers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreScrapeLayersBytes(file,bytes),readScrapeLayersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreScrapeLayersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreScrapeLayersBytes('src/unknown.ts',unknown),unknown);
});
