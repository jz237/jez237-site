import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/standings/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStandingsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Standings baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStandingsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOpponentSetsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStandingsPrevious(file);
}
export function verifyStandingsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0e52c344ad56e8ebdd4bd48d8d60a2f76fc60f65');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOpponentSetsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStandingsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOpponentSetsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Standings release');
 assert.equal(manifest.previousFixtureCount,2572);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2572);
}

import {restoreOpponentSetsBytes} from './opponent-sets-invariants';
