import {restoreCareerCupsBytes,verifyCareerCupsRevision} from './career-cups-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/adaptive-graphics/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAdaptiveGraphicsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AdaptiveGraphics baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAdaptiveGraphicsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCareerCupsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAdaptiveGraphicsPrevious(file);
}
export function verifyAdaptiveGraphicsRevision(){
 verifyCareerCupsRevision();
 const manifest=revision();assert.equal(manifest.baseline,'b7140b12fbbff496745675cfe61caafbfc2b8e73');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCareerCupsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAdaptiveGraphicsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCareerCupsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AdaptiveGraphics release');
 assert.equal(manifest.previousFixtureCount,1193);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1193);
}
