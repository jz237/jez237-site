import {assetVersions} from './asset-versions.js';

// Cache only immutable, content-versioned game assets. No page interception,
// service worker, save data, third-party requests, or background downloads.
export function createAssetStore({versions=assetVersions,base=import.meta.url,storage=globalThis.caches,fetcher=globalThis.fetch}={}){
 const stats={hits:0,downloads:0,writes:0,unavailable:0},writes=new Set();
 const url=path=>{const u=new URL('./'+path,base);if(versions[path])u.searchParams.set('v',versions[path]);return u;};
 const allowed=new Set(Object.keys(versions).map(path=>url(path).href));
 const opened=Promise.resolve().then(()=>storage?.open('after-the-storm-assets-v1')).catch(()=>null);
 // One bounded set of current assets. Other games' caches are never touched.
 opened.then(async cache=>{if(!cache)return;try{for(const key of await cache.keys())if(!allowed.has(key.url))await cache.delete(key);}catch{}});
 async function get(input){
  const href=String(input),cache=allowed.has(href)?await opened:null;
  if(cache){try{const hit=await cache.match(href);if(hit?.ok){stats.hits++;return hit;}}catch{stats.unavailable++;}}
  stats.downloads++;const response=await fetcher(input);
  if(cache&&response.ok){
   const write=cache.put(href,response.clone()).then(()=>{stats.writes++;}).catch(()=>{stats.unavailable++;});
   writes.add(write);write.finally(()=>writes.delete(write));
  }
  return response;
 }
 return {url,get,stats,flush:()=>Promise.all([...writes])};
}
export const assetStore=createAssetStore();
export const assetURL=path=>assetStore.url(path);
export const fetchAsset=url=>assetStore.get(url);
