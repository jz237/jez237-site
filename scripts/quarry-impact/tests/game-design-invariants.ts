import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/game-design/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGameDesignPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GameDesign baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGameDesignBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSteeringNineBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGameDesignPrevious(file);
}
export function verifyGameDesignRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3d2fd02626869ec004e3fc3372ffd20c928b5f3b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSteeringNineBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGameDesignBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSteeringNineBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GameDesign release');
 assert.equal(manifest.previousFixtureCount,2762);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2762);
}

import {restoreSteeringNineBytes} from './steering-nine-invariants';
