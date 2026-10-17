import {restoreExternalLongitudinalBytes} from './external-longitudinal-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBodyworkScrapingPrevious,restoreBodyworkScrapingBytes,verifyBodyworkScrapingRevision} from './bodywork-scraping-invariants';
const source=(file:string)=>restoreExternalLongitudinalBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BodyworkScraping preserves every prior fixture, vehicle asset, control and camera input',verifyBodyworkScrapingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bodywork-scraping/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBodyworkScrapingBytes(file,bytes),readBodyworkScrapingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBodyworkScrapingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBodyworkScrapingBytes('src/unknown.ts',unknown),unknown);
});
