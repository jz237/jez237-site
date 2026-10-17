import {restoreBodyworkScrapingBytes} from './bodywork-scraping-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rookvale-freight/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRookvaleFreightPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RookvaleFreight baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRookvaleFreightBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBodyworkScrapingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRookvaleFreightPrevious(file);
}
export function verifyRookvaleFreightRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6e32325adfeed386ad0ed976d3a0b7879eb4f75d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBodyworkScrapingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRookvaleFreightBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBodyworkScrapingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RookvaleFreight release');
 assert.equal(manifest.previousFixtureCount,3708);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3708);
}
