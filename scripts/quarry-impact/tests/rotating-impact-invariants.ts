import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rotating-impact/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRotatingImpactPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RotatingImpact baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRotatingImpactBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreArmorWearBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRotatingImpactPrevious(file);
}
export function verifyRotatingImpactRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'338af7ae44b7c1d7de10d48115eef5bdd9a04a80');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreArmorWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRotatingImpactBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreArmorWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RotatingImpact release');
 assert.equal(manifest.previousFixtureCount,2715);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2715);
}

import {restoreArmorWearBytes} from './armor-wear-invariants';
