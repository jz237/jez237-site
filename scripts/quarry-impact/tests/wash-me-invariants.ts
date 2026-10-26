import {restoreBlisteredPaintBytes} from './blistered-paint-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wash-me/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWashMePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WashMe baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWashMeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBlisteredPaintBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWashMePrevious(file);
}
export function verifyWashMeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c3500dddd6caffff3da25b110ee4b14d803179b1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBlisteredPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWashMeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBlisteredPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WashMe release');
 assert.equal(manifest.previousFixtureCount,9051);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9051);
}
