import {readReplayFile,replayFile,replayCourseId,type ReplayDocument} from './replay-data';
import {COURSE_NAMES,type CourseId} from './course-id';
import type {Mode} from './rules';
export const LIBRARY_LIMIT=50,LIBRARY_BYTES=256*1024*1024;
export type ReplayEntry={id:string;name:string;created:string;saved:number;duration:number;mode:Mode;cars:number;bytes:number;limited:boolean;courseId?:CourseId};
export const replayName=(name:string)=>name.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,80)||'Untitled replay';
export const defaultReplayName=(doc:ReplayDocument)=>`${doc.meta.courseId&&doc.meta.courseId!=='quarry-v1'?COURSE_NAMES[doc.meta.courseId]+' · ':''}${doc.meta.mode==='race'?'Race':doc.meta.mode==='derby'?'Derby':'Playground'} · ${doc.meta.created.slice(0,19).replace('T',' ')}`;
const storageError=(error:unknown)=>new Error(error instanceof DOMException&&error.name==='QuotaExceededError'?'Browser storage is full. Export or delete a saved replay, then try again.':error instanceof Error?error.message:'Replay storage is unavailable. Export a .qir file instead.');
/** Metadata and compressed recordings commit together. Serialized write transactions
 * enforce the limits across tabs; existing recordings are never silently evicted. */
export class ReplayLibrary {
 constructor(private factory:IDBFactory|undefined=globalThis.indexedDB,private database='quarry-impact-replays-v1',private limit=LIBRARY_LIMIT,private byteLimit=LIBRARY_BYTES){}
 private open():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
  if(!this.factory){reject(new Error('Replay storage is unavailable. Export a .qir file instead.'));return;}
  let abandoned=false;const request=this.factory.open(this.database,1);
  request.onupgradeneeded=()=>{request.result.createObjectStore('entries',{keyPath:'id'});request.result.createObjectStore('recordings');};
  request.onblocked=()=>{abandoned=true;reject(new Error('Close other Quarry Impact tabs, then try the replay library again.'));};
  request.onerror=()=>reject(storageError(request.error));request.onsuccess=()=>{if(abandoned)request.result.close();else{request.result.onversionchange=()=>request.result.close();resolve(request.result);}};
 });}
 private async transaction<T>(mode:IDBTransactionMode,run:(tx:IDBTransaction,set:(value:T)=>void,fail:(error:Error)=>void)=>void):Promise<T>{
  const db=await this.open();return new Promise<T>((resolve,reject)=>{
   let result:T,error:Error|undefined;let tx:IDBTransaction;
   try{tx=db.transaction(['entries','recordings'],mode);}catch(e){db.close();reject(storageError(e));return;}
   tx.oncomplete=()=>{db.close();resolve(result);};tx.onabort=()=>{db.close();reject(error??storageError(tx.error));};
   const fail=(e:Error)=>{error=e;tx.abort();};
   try{run(tx,v=>result=v,fail);}catch(e){fail(storageError(e));}
  });
 }
 async list():Promise<ReplayEntry[]>{return this.transaction('readonly',(tx,set)=>{const q=tx.objectStore('entries').getAll();q.onsuccess=()=>set((q.result as ReplayEntry[]).sort((a,b)=>b.saved-a.saved||a.id.localeCompare(b.id)));});}
 async save(doc:ReplayDocument,name=defaultReplayName(doc)):Promise<ReplayEntry>{
  replayCourseId(doc.meta);
  if(doc.frames.length<2)throw Error('Record at least two frames before saving a replay.');
  const blob=await replayFile(doc);if(blob.size>64*1024*1024)throw Error('This recording exceeds the 64 MB replay-file limit.');
  const id=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),n=>n.toString(16).padStart(2,'0')).join('');
  const entry:ReplayEntry={id,name:replayName(name),created:doc.meta.created,saved:Date.now(),duration:doc.frames.at(-1)!.time,mode:doc.meta.mode,cars:doc.meta.cars.length,bytes:blob.size,limited:doc.limited,...(doc.meta.courseId===undefined?{}:{courseId:doc.meta.courseId})};
  return this.transaction('readwrite',(tx,set,fail)=>{const store=tx.objectStore('entries'),q=store.getAll();q.onsuccess=()=>{
   const others=(q.result as ReplayEntry[]).filter(e=>e.id!==id);
   if(others.length>=this.limit||others.reduce((n,e)=>n+e.bytes,0)+entry.bytes>this.byteLimit){fail(new Error('Replay library is full. Export or delete a recording before saving another.'));return;}
   store.put(entry);tx.objectStore('recordings').put(blob,id);set(entry);
  };});
 }
 async import(file:File,name=file.name.replace(/\.qir$/i,'')){return this.save(await readReplayFile(file),name);}
 async file(id:string):Promise<Blob>{return this.transaction('readonly',(tx,set,fail)=>{const q=tx.objectStore('recordings').get(id);q.onsuccess=()=>q.result instanceof Blob?set(q.result):fail(new Error('That replay is no longer in this library.'));});}
 async load(id:string){return readReplayFile(new File([await this.file(id)],'saved.qir'));}
 async rename(id:string,name:string):Promise<void>{return this.transaction('readwrite',(tx,set,fail)=>{const store=tx.objectStore('entries'),q=store.get(id);q.onsuccess=()=>{if(!q.result){fail(new Error('That replay is no longer in this library.'));return;}store.put({...q.result,name:replayName(name)});set(undefined);};});}
 async remove(id:string):Promise<void>{return this.transaction('readwrite',(tx,set)=>{tx.objectStore('entries').delete(id);tx.objectStore('recordings').delete(id);set(undefined);});}
}
export const replayLibrary=new ReplayLibrary();
