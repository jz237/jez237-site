import {restoreSaggingBumpersBytes} from './sagging-bumpers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bent-corners/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBentCornersPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BentCorners baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBentCornersBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSaggingBumpersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBentCornersPrevious(file);
}
export function verifyBentCornersRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'24d64dbe8528b65bc5a62d0fcf22488c71f4633a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSaggingBumpersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBentCornersBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSaggingBumpersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BentCorners release');
 assert.equal(manifest.previousFixtureCount,9292);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9292);
}
