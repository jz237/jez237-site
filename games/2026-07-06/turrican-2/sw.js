// Retire the old Turrican-only offline cache after the Crystal HD upgrade.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys()) if(key.startsWith('turrican2-')) await caches.delete(key);
 await self.registration.unregister();
 await self.clients.claim();
})()));
