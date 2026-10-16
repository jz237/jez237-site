import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/foundry-apron/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFoundryApronPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FoundryApron baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFoundryApronBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreArenaGroundDetailBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFoundryApronPrevious(file);
}
export function verifyFoundryApronRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'730e1d18ff5ad25effacf3698fad0b4ebc76e2d1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreArenaGroundDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFoundryApronBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreArenaGroundDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FoundryApron release');
 assert.equal(manifest.previousFixtureCount,2840);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2840);
}

import {restoreArenaGroundDetailBytes} from './arena-ground-detail-invariants';
