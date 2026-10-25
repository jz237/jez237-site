import {restoreAiAquaplaneBytes} from './ai-aquaplane-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/glass-rim/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGlassRimPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GlassRim baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGlassRimBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAiAquaplaneBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGlassRimPrevious(file);
}
export function verifyGlassRimRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'93a4f2fb3ba2e16894e31139b8b6db932dd3cd73');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAiAquaplaneBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGlassRimBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAiAquaplaneBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GlassRim release');
 assert.equal(manifest.previousFixtureCount,8383);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8383);
}
