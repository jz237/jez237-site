import {restoreSableScrubBedsBytes} from './sable-scrub-beds-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sable-talus/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSableTalusPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SableTalus baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSableTalusBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSableScrubBedsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSableTalusPrevious(file);
}
export function verifySableTalusRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'880c4ae778b6f12014e9d4c5a020c3f5ced2c175');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSableScrubBedsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSableTalusBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSableScrubBedsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SableTalus release');
 assert.equal(manifest.previousFixtureCount,3889);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3889);
}
