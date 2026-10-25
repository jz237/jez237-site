import {restoreSponsorStickersBytes} from './sponsor-stickers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/window-net/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWindowNetPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WindowNet baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWindowNetBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSponsorStickersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWindowNetPrevious(file);
}
export function verifyWindowNetRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a05d4ee5ed541a5b047bf427ee3568e24d3501ef');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSponsorStickersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWindowNetBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSponsorStickersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WindowNet release');
 assert.equal(manifest.previousFixtureCount,7549);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7549);
}
