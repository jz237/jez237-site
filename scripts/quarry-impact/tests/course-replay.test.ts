import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {decodeReplay,encodeReplay,replayFile,readReplayFile,replayCourseId,replayCarStride,ReplayRecorder,type ReplayDocument} from '../src/replay-data';
import {ReplayLibrary,defaultReplayName} from '../src/replay-library';
import {ReplayStudio} from '../src/replay-studio';
import {landscapeHeight} from '../src/quarry-layout';
// Independently encoded with the committed7f62f79 codec before course changes.
// Real car/wheel quaternions, tyre planes, a hit and two props exercise both layouts.
const historical =
[
 {
  "tyreModel": null,
  "bytes": 1050,
  "sha256": "d84480336a704c8b57c2efe60282725908fb27760ba524f2c0276845dc070f86",
  "base64": "UUlSMeIBAAB7Im1ldGEiOnsidmVyc2lvbiI6MSwibW9kZSI6InJhY2UiLCJyZXZlcnNlIjpmYWxzZSwiY2FycyI6W3siaWQiOjAsImtpbmQiOiJ0ZXJuIiwic2V0dXAiOnsibGl2ZXJ5IjpbXSwicGFpbnQiOjEwMTc3ODQ4LCJ0cmltIjoyMTA2NjY1LCJlbmdpbmUiOjAsInRpcmVzIjowLCJhcm1vciI6MCwidHVuZSI6eyJnZWFyaW5nIjowLCJzdXNwZW5zaW9uIjowLCJkaWZmZXJlbnRpYWwiOjAsImJyYWtlQmlhcyI6MCwic3RlZXJpbmciOjB9fX1dLCJwcm9wcyI6MiwiY3JlYXRlZCI6IjIwMjYtMTAtMDJUMTc6MDA6MDBaIn0sInRpbWVzIjpbMCwxXSwiZXZlbnRzIjpbeyJraW5kIjoiaGl0IiwiY2FyIjowLCJ0aW1lIjowLjUsInBvc2UiOlsyLDEuMjUsLTQsMCwwLDAsMV0sInBvaW50IjpbMC42OSwtMC40OCwxLjE4XSwiZGlyZWN0aW9uIjpbLTEsMCwwXSwiZGFtYWdlIjoyMCwiaGVhbHRoIjo5NSwicGFpbnQiOjExNTUwNzUyfV0sImxpbWl0ZWQiOmZhbHNlfQAAAEAAAKA/AACAwAAAAAAAAAAAAAAAAAAAgD8AAEBAAAAAAAAAAAAAAEBAAADhRAAAgD/NzEw+AACWQtejML97FK4+PQqXPwAAAAAAAAAAAAAAAAAAgD8AAAAA16MwP3sUrj49Cpc/AAAAAAAAAAAAAAAAAACAPwAAAADXozC/exSuPj0Kl78AAAAAAAAAAAAAAAAAAIA/AAAAANejMD97FK4+PQqXvwAAAAAAAAAAAAAAAAAAgD8AAAAAzczMPc3MTD6amZk+zczMPgAAAD+amRk/AACAPwAAAAAAAAAAAAAwQQAAAD8AAEBBAAAAAAAAAAAAAAAAAACAPwAAkEEAAAA/AACYQQAAAAAAAAAAAAAAAAAAgD8AAEBAAACgPwAAgMAAAAAAAAAAAAAAAAAAAIA/AABAQAAAAAAAAAAAAABAQAAA4UQAAIA/zcxMPgAAlkLXozC/exSuPj0Klz8AAAAAAAAAAAAAAAAAAIA/AAAAQNejMD97FK4+PQqXPwAAAAAAAAAAAAAAAAAAgD8AAABA16Mwv3sUrj49Cpe/AAAAAAAAAAAAAAAAAACAPwAAAEDXozA/exSuPj0Kl78AAAAAAAAAAAAAAAAAAIA/AAAAQM3MzD3NzEw+mpmZPs3MzD4AAAA/mpkZPwAAgD8AAIA/AACAPwAAQEEAAAA/AABAQQAAAAAAAAAAAAAAAAAAgD8AAJBBAAAAPwAAkEEAAAAAAAAAAAAAAAAAAIA/"
 },
 {
  "tyreModel": 1,
  "bytes": 1256,
  "sha256": "526e4e1bdd459ce4c205471d4234f21acaf5869a2b907356a3e609bbb0b59096",
  "base64": "UUlSMfABAAB7Im1ldGEiOnsidmVyc2lvbiI6MSwibW9kZSI6InJhY2UiLCJyZXZlcnNlIjpmYWxzZSwiY2FycyI6W3siaWQiOjAsImtpbmQiOiJ0ZXJuIiwic2V0dXAiOnsibGl2ZXJ5IjpbXSwicGFpbnQiOjEwMTc3ODQ4LCJ0cmltIjoyMTA2NjY1LCJlbmdpbmUiOjAsInRpcmVzIjowLCJhcm1vciI6MCwidHVuZSI6eyJnZWFyaW5nIjowLCJzdXNwZW5zaW9uIjowLCJkaWZmZXJlbnRpYWwiOjAsImJyYWtlQmlhcyI6MCwic3RlZXJpbmciOjB9fX1dLCJwcm9wcyI6MiwiY3JlYXRlZCI6IjIwMjYtMTAtMDJUMTc6MDA6MDBaIiwidHlyZU1vZGVsIjoxfSwidGltZXMiOlswLDFdLCJldmVudHMiOlt7ImtpbmQiOiJoaXQiLCJjYXIiOjAsInRpbWUiOjAuNSwicG9zZSI6WzIsMS4yNSwtNCwwLDAsMCwxXSwicG9pbnQiOlswLjY5LC0wLjQ4LDEuMThdLCJkaXJlY3Rpb24iOlstMSwwLDBdLCJkYW1hZ2UiOjIwLCJoZWFsdGgiOjk1LCJwYWludCI6MTE1NTA3NTJ9XSwibGltaXRlZCI6ZmFsc2V9AAAAQAAAoD8AAIDAAAAAAAAAAAAAAAAAAACAPwAAQEAAAAAAAAAAAAAAQEAAAOFEAACAP83MTD4AAJZC16Mwv3sUrj49Cpc/AAAAAAAAAAAAAAAAAACAPwAAAADXozA/exSuPj0Klz8AAAAAAAAAAAAAAAAAAIA/AAAAANejML97FK4+PQqXvwAAAAAAAAAAAAAAAAAAgD8AAAAA16MwP3sUrj49Cpe/AAAAAAAAAAAAAAAAAACAPwAAAADNzMw9zcxMPpqZmT7NzMw+AAAAP5qZGT8AAIA/AAAAAAAAAAAAAAAAAACAPwAAAACPwvW8mpmZPwAAgD8AAAAAAACAPwAAAACPwvW8mpmZPwAAgD8AAAAAAACAPwAAAACPwvW8mpmZPwAAgD8AAAAAAACAPwAAAACPwvW8mpmZPwAAgD8AADBBAAAAPwAAQEEAAAAAAAAAAAAAAAAAAIA/AACQQQAAAD8AAJhBAAAAAAAAAAAAAAAAAACAPwAAQEAAAKA/AACAwAAAAAAAAAAAAAAAAAAAgD8AAEBAAAAAAAAAAAAAAEBAAADhRAAAgD/NzEw+AACWQtejML97FK4+PQqXPwAAAAAAAAAAAAAAAAAAgD8AAABA16MwP3sUrj49Cpc/AAAAAAAAAAAAAAAAAACAPwAAAEDXozC/exSuPj0Kl78AAAAAAAAAAAAAAAAAAIA/AAAAQNejMD97FK4+PQqXvwAAAAAAAAAAAAAAAAAAgD8AAABAzczMPc3MTD6amZk+zczMPgAAAD+amRk/AACAPwAAgD8AAIA/AAAAAAAAgD8AAAAAj8L1vJqZmT8AAIA/AAAAAAAAgD8AAAAAj8L1vJqZmT8AAIA/AAAAAAAAgD8AAAAAj8L1vJqZmT8AAIA/AAAAAAAAgD8AAAAAj8L1vJqZmT8AAIA/AABAQQAAAD8AAEBBAAAAAAAAAAAAAAAAAACAPwAAkEEAAAA/AACQQQAAAAAAAAAAAAAAAAAAgD8="
 }
] as const;

const sha=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const oldBytes=(i:number)=>Uint8Array.from(Buffer.from(historical[i].base64,'base64'));
const oldDoc=(i=1)=>decodeReplay(oldBytes(i));
const ironfield=()=>{const doc=oldDoc();doc.meta.courseId='ironfield-figure-eight-v1';return doc;};
const compress=async(bytes:Uint8Array)=>new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).blob();

test('published omitted-course QIR1 bytes and compressed library identities stay unchanged at both car strides',async()=>{
 for(const [i,row]of historical.entries()){
  const bytes=oldBytes(i),doc=decodeReplay(bytes);assert.equal(sha(bytes),row.sha256);
  assert.equal(replayCourseId(doc.meta),'quarry-v1');assert.equal(Object.hasOwn(doc.meta,'courseId'),false);assert.equal(replayCarStride(doc.meta),row.tyreModel===1?80:56);
  assert.deepEqual(encodeReplay(doc),bytes,'Current codec exactly reproduces published raw bytes');
  const original=await compress(bytes),saved=await replayFile(doc);assert.deepEqual(new Uint8Array(await saved.arrayBuffer()),new Uint8Array(await original.arrayBuffer()),'Existing content-addressed library ID cannot change');
  const read=await readReplayFile(new File([original],'published.qir'));assert.deepEqual(read,doc);assert.deepEqual(encodeReplay(read),bytes);
  assert.equal(read.frames[1].values[replayCarStride(read.meta)],12,'Prop data retains its original offset');
  assert.equal(read.frames[1].values[replayCarStride(read.meta)+9],18,'Second prop position remains independent');
 }
});

test('explicit known courses round-trip without changing packed poses, tyre contacts, props or event history',async()=>{
 for(const courseId of ['quarry-v1','ironfield-figure-eight-v1'] as const)for(const reverse of [false,true]){
  const original=oldDoc(),doc=oldDoc();doc.meta.courseId=courseId;doc.meta.reverse=reverse;
  const recorder=new ReplayRecorder(doc.meta);assert.equal(recorder.stride,94);
  const loaded=await readReplayFile(new File([await replayFile(doc)],'course.qir'));assert.equal(replayCourseId(loaded.meta),courseId);assert.equal(loaded.meta.reverse,reverse);
  assert.deepEqual(loaded.frames,original.frames);assert.deepEqual(loaded.events,original.events);assert.equal(loaded.meta.tyreModel,1);
  assert.deepEqual(encodeReplay(loaded),encodeReplay(doc));
 }
 for(const mode of ['race','derby','playground'] as const){const doc=oldDoc();doc.meta.mode=mode;assert.equal(replayCourseId(doc.meta),'quarry-v1');doc.meta.courseId='quarry-v1';assert.doesNotThrow(()=>decodeReplay(encodeReplay(doc)));}
});

test('unknown and non-race Ironfield recordings reject before recorder, studio or library mutation',async()=>{
 const invalid:ReplayDocument[]=[];
 for(const courseId of [null,'','quarry-v2','ironfield-figure-eight-v2','__proto__','toString','../ironfield','https://example.com/world.glb',0,{},[]]){const doc=oldDoc();(doc.meta as any).courseId=courseId;invalid.push(doc);}
 for(const mode of ['derby','playground'] as const){const doc=ironfield();doc.meta.mode=mode;invalid.push(doc);}
 let opened=0;const library=new ReplayLibrary({open(){opened++;throw Error('Must not open storage');}} as any);
 for(const doc of invalid){
  const before=structuredClone(doc),ui={innerHTML:'retained live UI'} as HTMLElement;let sought=0;
  assert.throws(()=>replayCourseId(doc.meta),/course|circuit races/);assert.throws(()=>new ReplayRecorder(doc.meta),/course|circuit races/);
  assert.throws(()=>decodeReplay(encodeReplay(doc)),/course|circuit races/);
  await assert.rejects(readReplayFile(new File([await replayFile(doc)],'unsupported.qir')),/course|circuit races/);
  await assert.rejects(library.save(doc),/course|circuit races/);
  await assert.rejects(library.import(new File([await replayFile(doc)],'unsupported.qir')),/course|circuit races/);
  assert.throws(()=>new ReplayStudio(ui,[],doc,()=>{sought++;},()=>{}),/course|circuit races/);
  assert.equal(ui.innerHTML,'retained live UI');assert.equal(sought,0);assert.deepEqual(doc,before);
 }
 assert.equal(opened,0,'Invalid direct saves and imports cannot even open a transaction');
});

/** External storage double for metadata/payload contract checks, not an IndexedDB
 * conformance test. Real browser atomicity/quota coverage stays in the library suite. */
function storageBoundary(){
 const stores={entries:new Map<string,any>(),recordings:new Map<string,any>()},opens:{name:string;version:number}[]=[];
 const factory={open(name:string,version:number){
  opens.push({name,version});const open:any={};queueMicrotask(()=>{open.result={close(){},transaction(){
   let pending=0,done=false;const tx:any={};
   const request=(run:()=>unknown)=>{pending++;const q:any={};queueMicrotask(()=>{q.result=run();q.onsuccess?.();pending--;queueMicrotask(()=>{if(!pending&&!done){done=true;tx.oncomplete?.();}});});return q;};
   tx.objectStore=(name:keyof typeof stores)=>({getAll:()=>request(()=>[...stores[name].values()].map(v=>structuredClone(v))),get:(key:string)=>request(()=>structuredClone(stores[name].get(key))),put:(value:any,key?:string)=>request(()=>{stores[name].set(key??value.id,structuredClone(value));}),delete:(key:string)=>request(()=>stores[name].delete(key))});return tx;
  }};open.onsuccess?.();});return open;
 }} as unknown as IDBFactory;
 return{factory,stores,opens};
}

test('library preserves old payload hashes and v1 entries while new recordings retain their distinct course summary',async()=>{
 const memory=storageBoundary(),library=new ReplayLibrary(memory.factory),doc=oldDoc(),bytes=await compress(oldBytes(1)),oldId=sha(new Uint8Array(await bytes.arrayBuffer()));
 const oldEntry=await library.save(doc);assert.equal(oldEntry.id,oldId);assert.equal(Object.hasOwn(oldEntry,'courseId'),false);assert.equal(oldEntry.name,'Race · 2026-10-02 17:00:00');
 const candidate=ironfield(),entry=await library.save(candidate);assert.equal(entry.courseId,'ironfield-figure-eight-v1');assert.notEqual(entry.id,oldId);assert.match(defaultReplayName(candidate),/^Ironfield Raceway · Race/);
 const reopened=new ReplayLibrary(memory.factory),again=await reopened.import(new File([bytes],'legacy.qir'));assert.equal(again.id,oldId);assert.equal((await reopened.list()).length,2);
 assert.deepEqual(await reopened.load(entry.id),candidate);assert.deepEqual(await reopened.load(oldId),doc);
 await reopened.rename(oldId,'Retained Quarry');assert.equal((await reopened.list()).find(e=>e.id===oldId)!.courseId,undefined);assert.deepEqual(new Uint8Array(await (await reopened.file(oldId)).arrayBuffer()),new Uint8Array(await bytes.arrayBuffer()));
 assert.ok(memory.opens.every(o=>o.name==='quarry-impact-replays-v1'&&o.version===1),'No database migration or new namespace');
 const before=structuredClone([...memory.stores.entries]);const rejected=ironfield();(rejected.meta as any).courseId='unknown';await assert.rejects(reopened.save(rejected),/course/);assert.deepEqual([...memory.stores.entries],before);
});

// The studio's DOM bindings are stubbed; camera math uses actual Three.js objects.
function studioUi(){const nodes=new Map<string,any>();return{innerHTML:'',querySelector(selector:string){if(!nodes.has(selector))nodes.set(selector,{value:'',textContent:'',style:{},hidden:false,classList:{toggle(){}}});return nodes.get(selector);},querySelectorAll(){return[];}} as unknown as HTMLElement;}
test('studio chase uses the supplied venue ground while omitted terrain retains the exact Quarry camera pose',()=>{
 const root=new T.Group();root.position.set(30,1,-10);root.quaternion.setFromAxisAngle(new T.Vector3(0,1,0),.47);const cars=[{id:0,kind:'tern',root}] as any;
 const make=(height?:((x:number,z:number)=>number))=>{const studio=new ReplayStudio(studioUi(),cars,null,()=>{},()=>{},1,undefined,height);studio.view='chase';return studio;};
 const render=(studio:ReplayStudio)=>{const camera=new T.PerspectiveCamera(52,16/9,.1,850),orbit={target:new T.Vector3(),update(){},enabled:false},renderer={toneMappingExposure:1};studio.updateCamera(camera,orbit as any,renderer as any);return camera;};
 const original=render(make()),explicit=render(make(landscapeHeight));assert.deepEqual(original.position.toArray(),explicit.position.toArray());assert.deepEqual(original.quaternion.toArray(),explicit.quaternion.toArray());
 const sampled:number[][]=[],other=render(make((x,z)=>{sampled.push([x,z]);return 20;}));assert.equal(sampled.length,1);assert.deepEqual(sampled[0],[other.position.x,other.position.z]);assert.equal(other.position.y,20.65);assert.notEqual(other.position.y,original.position.y);
 assert.deepEqual(root.position.toArray(),[30,1,-10],'Camera sampling never changes the live vehicle');assert.ok(other.quaternion.toArray().every(Number.isFinite));
});
