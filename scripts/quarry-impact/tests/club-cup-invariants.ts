import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/club-cup/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readClubCupPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Club Cup baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreClubCupBytes(file:string,bytes:Buffer){
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readClubCupPrevious(file);
}
export function verifyClubCupRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'cbe3e0b49e9ba1be44d35a4d1501cd809032b207');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreClubCupBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' stays unchanged during the Club Cup revision');
 const block=(text:string)=>text.split('function updateCamera(dt: number) {')[1].split('function frame(now: number) {')[0];
 const main=readFileSync(new URL('../src/main.ts',import.meta.url)).toString();
 assert.equal(block(main),block(readClubCupPrevious('src/main.ts').toString()),'Club Cup leaves the complete main camera implementation byte-exact');
 assert.equal(main.replaceAll('\r\n','').includes('\n'),false,'Main keeps CRLF line endings');
}
