import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/foundry-industrial/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFoundryIndustrialPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FoundryIndustrial baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFoundryIndustrialBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFoundryApronBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFoundryIndustrialPrevious(file);
}
export function verifyFoundryIndustrialRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f078d06850b2ab2510a830f36fafb808a035ea9f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFoundryApronBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFoundryIndustrialBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFoundryApronBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FoundryIndustrial release');
 assert.equal(manifest.previousFixtureCount,2831);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2831);
}

import {restoreFoundryApronBytes} from './foundry-apron-invariants';
