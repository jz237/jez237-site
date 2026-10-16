import {restoreSteeringSixteenBytes} from './steering-sixteen-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineContactScrapingPrevious,restoreOnlineContactScrapingBytes,verifyOnlineContactScrapingRevision} from './online-contact-scraping-invariants';
const source=(file:string)=>restoreSteeringSixteenBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineContactScraping preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineContactScrapingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-contact-scraping/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineContactScrapingBytes(file,bytes),readOnlineContactScrapingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineContactScrapingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineContactScrapingBytes('src/unknown.ts',unknown),unknown);
});
