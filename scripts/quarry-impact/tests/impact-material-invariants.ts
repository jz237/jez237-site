import {restoreQuarryImpactMaterialBytes} from './quarry-impact-material-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/impact-material/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readImpactMaterialPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ImpactMaterial baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreImpactMaterialBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreQuarryImpactMaterialBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readImpactMaterialPrevious(file);
}
export function verifyImpactMaterialRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5187ce256070ca8a2445c2b83f31db4c2e734231');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreQuarryImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreImpactMaterialBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreQuarryImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ImpactMaterial release');
 assert.equal(manifest.previousFixtureCount,3548);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3548);
}
