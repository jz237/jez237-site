import {restoreDriverSwayBytes} from './driver-sway-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sponsor-stickers/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSponsorStickersPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SponsorStickers baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSponsorStickersBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDriverSwayBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSponsorStickersPrevious(file);
}
export function verifySponsorStickersRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'69830e528b43d40d037b0f77e83ff76d547ac9c7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDriverSwayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSponsorStickersBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDriverSwayBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SponsorStickers release');
 assert.equal(manifest.previousFixtureCount,7561);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7561);
}
