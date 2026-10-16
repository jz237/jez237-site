import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/garage-design/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGarageDesignPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GarageDesign baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGarageDesignBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreControlSaveBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGarageDesignPrevious(file);
}
export function verifyGarageDesignRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'21935c82c0addb62fb080daf9f8dee39d1589d5b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreControlSaveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGarageDesignBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreControlSaveBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GarageDesign release');
 assert.equal(manifest.previousFixtureCount,2745);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2745);
}

import {restoreControlSaveBytes} from './control-save-invariants';
