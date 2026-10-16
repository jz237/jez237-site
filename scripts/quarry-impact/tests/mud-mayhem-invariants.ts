import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/mud-mayhem/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readMudMayhemPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No MudMayhem baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreMudMayhemBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCameraSettingsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readMudMayhemPrevious(file);
}
export function verifyMudMayhemRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'49f3f19652777f995738620846cdc543eefef002');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCameraSettingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreMudMayhemBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCameraSettingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the MudMayhem release');
 assert.equal(manifest.previousFixtureCount,2622);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2622);
}

import {restoreCameraSettingsBytes} from './camera-settings-invariants';
