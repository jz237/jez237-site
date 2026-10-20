import {restoreBodyCrushBytes} from './body-crush-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/slow-puncture/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSlowPuncturePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SlowPuncture baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSlowPunctureBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBodyCrushBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSlowPuncturePrevious(file);
}
export function verifySlowPunctureRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5e31416d12cbd80a2da060616e4becf01f4d4695');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBodyCrushBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSlowPunctureBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBodyCrushBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SlowPuncture release');
 assert.equal(manifest.previousFixtureCount,5052);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5052);
}
