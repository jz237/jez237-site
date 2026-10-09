import {restoreCoastForestBytes} from './coast-forest-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/driveline/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDrivelinePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Driveline baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDrivelineBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCoastForestBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDrivelinePrevious(file);
}
export function verifyDrivelineRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ef7d7a3e77da3f768790e8c8791675ee6451f557');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCoastForestBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDrivelineBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCoastForestBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Driveline release');
 assert.equal(manifest.previousFixtureCount,1857);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1857);
}
