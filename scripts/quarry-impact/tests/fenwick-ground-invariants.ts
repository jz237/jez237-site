import {restoreImpactMaterialBytes} from './impact-material-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-ground/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickGroundPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickGround baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickGroundBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreImpactMaterialBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickGroundPrevious(file);
}
export function verifyFenwickGroundRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'82fc353e8d42ca5449bc745e462826d71dbf0ace');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickGroundBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickGround release');
 assert.equal(manifest.previousFixtureCount,3539);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3539);
}
