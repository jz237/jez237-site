import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ironfield/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readIronfieldPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Ironfield baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreIronfieldBytes(file:string,bytes:Buffer){
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readIronfieldPrevious(file);
}
export function verifyIronfieldRevision(){
 const manifest=revision();
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreIronfieldBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' stays unchanged during the Ironfield course revision');
 const director=readFileSync(new URL('../src/demo-director.ts',import.meta.url)).toString()
  .replace(',private groundHeight:(x:number,z:number)=>number=landscapeHeight','').replaceAll('this.groundHeight','landscapeHeight');
 assert.equal(director,readIronfieldPrevious('src/demo-director.ts').toString(),'Demo orientation, recovery, framing and hold logic stay byte-exact outside the ground sampler');
 const block=(text:string)=>text.split('function updateCamera(dt: number) {')[1].split('function frame(now: number) {')[0];
 const main=readFileSync(new URL('../src/main.ts',import.meta.url)).toString(),ground='Math.max(scenerySurfaceHeight(desired.x, desired.z), quarryExtensionHeight(desired.x, desired.z) ?? -Infinity, quarryWestWallHeight(desired.x, desired.z) ?? -Infinity)';
 assert.equal(block(main).replace('activeVenue===quarryVenue?'+ground+':activeVenue.course.height(desired.x,desired.z)',ground),block(readIronfieldPrevious('src/main.ts').toString()),'Main camera behavior stays byte-exact outside course terrain selection');
 assert.equal(main.replaceAll('\r\n','').includes('\n'),false,'Main keeps CRLF line endings');
}
