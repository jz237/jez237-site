import {restoreFuelStarveBytes} from './fuel-starve-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/inverted-leak/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readInvertedLeakPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No InvertedLeak baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreInvertedLeakBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFuelStarveBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readInvertedLeakPrevious(file);
}
export function verifyInvertedLeakRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'40bc1ba1d0fd83cd27bbfd620cd7461d0fb87e28');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFuelStarveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreInvertedLeakBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFuelStarveBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the InvertedLeak release');
 assert.equal(manifest.previousFixtureCount,5626);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5626);
}
