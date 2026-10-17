import {restoreOnlineImpactMaterialBytes} from './online-impact-material-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/quarry-impact-material/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readQuarryImpactMaterialPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No QuarryImpactMaterial baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreQuarryImpactMaterialBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineImpactMaterialBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readQuarryImpactMaterialPrevious(file);
}
export function verifyQuarryImpactMaterialRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'763b92cee5c9c7f395bdf5936d22d198a51ded55');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreQuarryImpactMaterialBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the QuarryImpactMaterial release');
 assert.equal(manifest.previousFixtureCount,3561);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3561);
}
