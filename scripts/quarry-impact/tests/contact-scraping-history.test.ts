import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readContactScrapingPrevious,restoreContactScrapingBytes,verifyContactScrapingRevision} from './contact-scraping-invariants';
const source=(file:string)=>restoreWheelContactMotionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ContactScraping preserves every prior fixture, vehicle asset, control and camera input',verifyContactScrapingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/contact-scraping/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreContactScrapingBytes(file,bytes),readContactScrapingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreContactScrapingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreContactScrapingBytes('src/unknown.ts',unknown),unknown);
});

import {restoreWheelContactMotionBytes} from './wheel-contact-motion-invariants';
