import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const here=new URL('..',import.meta.url).pathname;
test('the service worker cache is versioned with the game and precaches files that exist',()=>{
 const main=readFileSync(here+'main.js','utf8'),sw=readFileSync(here+'sw.js','utf8');
 const v=main.match(/export const VERSION='([^']+)'/)[1];const swv=sw.match(/const VERSION='([^']+)'/)[1];
 assert.equal(swv,v,'sw.js VERSION must match main.js VERSION');
 const pre=sw.match(/const PRECACHE=\[([^\]]*)\]/)[1].split(',').map(s=>s.trim().replace(/^'\.\//,'').replace(/'$/,'')).filter(s=>s&&s!=="'"&&s!=='');
 for(const f of pre){if(f==='')continue;assert.ok(existsSync(here+f),'precache file exists: '+f);}
 assert.ok(/isMedia/.test(sw)&&/MEDIA_MAX_ENTRIES/.test(sw));
});
test('the manifest names the game, is landscape, standalone, and points at real icons',()=>{
 const m=JSON.parse(readFileSync(here+'manifest.webmanifest','utf8'));
 assert.equal(m.short_name,'First Light');assert.equal(m.display,'standalone');assert.equal(m.orientation,'landscape');assert.equal(m.scope,'./');
 for(const i of m.icons)assert.ok(existsSync(here+i.src),'icon exists: '+i.src);
 const html=readFileSync(here+'index.html','utf8');assert.ok(/rel="manifest"/.test(html)&&/apple-touch-icon/.test(html));
 assert.ok(/serviceWorker/.test(readFileSync(here+'main.js','utf8')));
});
