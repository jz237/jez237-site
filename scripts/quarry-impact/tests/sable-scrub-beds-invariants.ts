import {restoreSableSettlingWorksBytes} from './sable-settling-works-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sable-scrub-beds/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSableScrubBedsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SableScrubBeds baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSableScrubBedsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSableSettlingWorksBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSableScrubBedsPrevious(file);
}
export function verifySableScrubBedsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ccfc995fb59d53f905289163a5d6c087fcc52e66');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSableSettlingWorksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSableScrubBedsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSableSettlingWorksBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SableScrubBeds release');
 assert.equal(manifest.previousFixtureCount,3898);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3898);
}
