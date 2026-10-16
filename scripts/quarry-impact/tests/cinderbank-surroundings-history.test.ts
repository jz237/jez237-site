import {restoreOnlineContactScrapingBytes} from './online-contact-scraping-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCinderbankSurroundingsPrevious,restoreCinderbankSurroundingsBytes,verifyCinderbankSurroundingsRevision} from './cinderbank-surroundings-invariants';
const source=(file:string)=>restoreOnlineContactScrapingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CinderbankSurroundings preserves every prior fixture, vehicle asset, control and camera input',verifyCinderbankSurroundingsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cinderbank-surroundings/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCinderbankSurroundingsBytes(file,bytes),readCinderbankSurroundingsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCinderbankSurroundingsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCinderbankSurroundingsBytes('src/unknown.ts',unknown),unknown);
});
