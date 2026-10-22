import {restorePropshaftBytes} from './propshaft-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/roll-bar/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRollBarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RollBar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRollBarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePropshaftBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRollBarPrevious(file);
}
export function verifyRollBarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9fe63399f9ebcad6de2b12d8d1512813101274b9');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePropshaftBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRollBarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePropshaftBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RollBar release');
 assert.equal(manifest.previousFixtureCount,6142);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6142);
}
