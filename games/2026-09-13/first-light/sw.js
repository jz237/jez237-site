// First Light service worker. The game shell (index, styles, modules, vendor) is network-first so a
// new version lands the moment it deploys, with the cache as the offline fallback. Media (the
// terrain textures, the fish, Ray's voice) is cache-first once seen, in its own capped cache, so a
// second morning on the lake starts fast and works on the dock with no signal. Bump CACHE with
// the game version (tests/pwa.test.mjs checks they match).
const VERSION='0.40.3';
const CACHE='first-light-shell-'+VERSION;
const MEDIA='first-light-media-v1';
const MEDIA_MAX_ENTRIES=600;
const PRECACHE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!==MEDIA).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
async function trimMedia(){const c=await caches.open(MEDIA);const keys=await c.keys();if(keys.length<=MEDIA_MAX_ENTRIES)return;for(const k of keys.slice(0,keys.length-MEDIA_MAX_ENTRIES))await c.delete(k);}
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==location.origin)return;
 const isMedia=/\/assets\/(terrain|fish|voice|lakes|ambient)\//.test(url.pathname)||/icon-\d+\.png$/.test(url.pathname);
 if(isMedia){e.respondWith(caches.open(MEDIA).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok){c.put(e.request,res.clone());trimMedia();}return res;}))));return;}
 // the shell: network first, cache when offline; the versioned query strings mean a fresh index brings fresh modules
 e.respondWith(fetch(e.request).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(e.request,res.clone()));return res;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||caches.match('./index.html'))));
});
