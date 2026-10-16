import {restoreSteeringSixteenBytes} from './steering-sixteen-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-contact-scraping/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineContactScrapingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineContactScraping baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineContactScrapingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSteeringSixteenBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineContactScrapingPrevious(file);
}
export function verifyOnlineContactScrapingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6ab69b1760ca7b66ce1bf7081b7c3672a953ff5c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSteeringSixteenBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineContactScrapingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSteeringSixteenBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineContactScraping release');
 assert.equal(manifest.previousFixtureCount,3216);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3216);
}
