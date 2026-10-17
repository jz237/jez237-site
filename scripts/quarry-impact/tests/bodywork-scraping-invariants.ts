import {restoreExternalLongitudinalBytes} from './external-longitudinal-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bodywork-scraping/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBodyworkScrapingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BodyworkScraping baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBodyworkScrapingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreExternalLongitudinalBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBodyworkScrapingPrevious(file);
}
export function verifyBodyworkScrapingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a5ae8f26a0e52daeb6619b52d4e1f19559d2e56b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreExternalLongitudinalBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBodyworkScrapingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreExternalLongitudinalBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BodyworkScraping release');
 assert.equal(manifest.previousFixtureCount,3717);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3717);
}
