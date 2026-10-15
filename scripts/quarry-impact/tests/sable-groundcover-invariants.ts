import {restoreSableCliffsBytes} from './sable-cliffs-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sable-groundcover/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSableGroundcoverPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SableGroundcover baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSableGroundcoverBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSableCliffsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSableGroundcoverPrevious(file);
}
export function verifySableGroundcoverRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'23909d35edc7ba37b9d33ace9ca4750f9de00bef');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSableCliffsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSableGroundcoverBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSableCliffsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SableGroundcover release');
 assert.equal(manifest.previousFixtureCount,2234);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2234);
}
