import {restoreScrapeLayersBytes} from './scrape-layers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/airbags/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAirbagsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Airbags baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAirbagsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreScrapeLayersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAirbagsPrevious(file);
}
export function verifyAirbagsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f8aa69bf18cec39582e810902bc0ebff4ab0a54a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreScrapeLayersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAirbagsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreScrapeLayersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Airbags release');
 assert.equal(manifest.previousFixtureCount,8600);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8600);
}
