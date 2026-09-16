import {terrainWorkerURL} from './worker-version.js';
import {terrainIdentity,terrainKey} from './terrain-data.js';

export function createTerrainPreparation({makeWorker=()=>new Worker(new URL(terrainWorkerURL,import.meta.url),{type:'module'}),limit=2}={}){
 const cache=new Map(),pending=new Set();let worker=null,failed=false;
 const stats={hits:0,misses:0,prepared:0,workerMs:0,cached:0,failed:false};
 function prepare(course){
  const key=terrainKey(course);if(failed||cache.has(key)||pending.has(key))return;
  try{
   if(!worker){worker=makeWorker();worker.onerror=()=>{failed=stats.failed=true;pending.clear();worker.terminate();};worker.onmessage=({data})=>{
    pending.delete(data.key);if(data.error)return;
    cache.delete(data.key);cache.set(data.key,data);while(cache.size>limit)cache.delete(cache.keys().next().value);
    stats.prepared++;stats.workerMs=+data.ms.toFixed(1);stats.cached=cache.size;
   };}
   pending.add(key);worker.postMessage({...terrainIdentity(course),key});
  }catch{failed=stats.failed=true;pending.clear();worker?.terminate();}
 }
 function get(course){const key=terrainKey(course),data=cache.get(key);if(data){stats.hits++;cache.delete(key);cache.set(key,data);}else stats.misses++;return data||null;}
 return {prepare,get,stats};
}
export const terrainPreparation=createTerrainPreparation();
// Begins while photographic assets and models are downloading/decoding.
if(typeof Worker!=='undefined')terrainPreparation.prepare({id:'greyhaven',difficulty:0});
