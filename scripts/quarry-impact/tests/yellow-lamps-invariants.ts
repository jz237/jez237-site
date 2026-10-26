import {restoreTyreMarksBytes} from './tyre-marks-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/yellow-lamps/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readYellowLampsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No YellowLamps baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreYellowLampsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTyreMarksBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readYellowLampsPrevious(file);
}
export function verifyYellowLampsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'81b3fe0957ab960a9a01cf6ae4ae201bc0a10d49');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTyreMarksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreYellowLampsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTyreMarksBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the YellowLamps release');
 assert.equal(manifest.previousFixtureCount,8925);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8925);
}
