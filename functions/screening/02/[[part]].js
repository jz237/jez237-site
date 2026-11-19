import selection from '../_lib/screen02.json';

const base = '/screening/02/';
const cookie = '__Secure-JezScreen02';
const grantSeconds = 7200;
const header = {
  'Cache-Control': 'private, no-store, no-transform, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
  Vary: 'Cookie, Authorization',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
};
const locked = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><title>Private screening · Jez237</title><link rel="stylesheet" href="/screening/watch.css?v=2"><script src="/screening/unlock.js?v=2" defer></script></head><body><main class="entry"><h1>Private screening</h1><p id="status" role="status">Open the complete private link you received to watch this film.</p><button type="button" id="retry" hidden>Try again</button><noscript><p>Enable JavaScript to open your private link.</p></noscript></main></body></html>`;

const keyDigest = Uint8Array.from(selection.keyDigest.match(/../g), hex => parseInt(hex,16));
const encoder = new TextEncoder();

function decode(value) {
  return Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')), char=>char.charCodeAt(0));
}
function encode(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function blank(status, extra={}) {
  return new Response(null,{status,headers:{...header,...extra}});
}
async function keyFrom(value) {
  if (!value || !/^[A-Za-z0-9_-]{43}$/.test(value)) return null;
  const raw = decode(value);
  const digest = await crypto.subtle.digest('SHA-256',raw);
  return crypto.subtle.timingSafeEqual(keyDigest,digest) ? raw : null;
}
function cookieValue(request) {
  const field = (request.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookie+'='));
  return field?.slice(cookie.length+1);
}
function mediaKey(env, use) {
  return crypto.subtle.importKey('raw',decode(env.SCREEN01_MEDIA_TICKETS_V1),'AES-GCM',false,[use]);
}
function grantScope(route, iv) {
  return {name:'AES-GCM',iv,additionalData:encoder.encode(base.slice(1)+route)};
}
async function grant(env, route, raw) {
  const payload = new Uint8Array(36);
  new DataView(payload.buffer).setUint32(0,Math.floor(Date.now()/1000)+grantSeconds);
  payload.set(raw,4);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const packet = await crypto.subtle.encrypt(grantScope(route,iv),await mediaKey(env,'encrypt'),payload);
  const full = new Uint8Array(12+packet.byteLength);
  full.set(iv);full.set(new Uint8Array(packet),12);
  return base+route+'?p='+encode(full);
}
async function acceptGrant(env, route, value) {
  if (!value || !/^[A-Za-z0-9_-]{86}$/.test(value)) return null;
  try {
    const packet=decode(value);
    const payload=await crypto.subtle.decrypt(grantScope(route,packet.subarray(0,12)),await mediaKey(env,'decrypt'),packet.subarray(12));
    const now=Math.floor(Date.now()/1000);
    const expiry=new DataView(payload).getUint32(0);
    if (payload.byteLength!==36 || expiry<=now || expiry>now+grantSeconds) return null;
    return new Uint8Array(payload,4);
  } catch {return null}
}

function byteRange(value,size) {
  if (!value) return {lo:0,hi:size-1,partial:false};
  const match=/^bytes=(\d*)-(\d*)$/i.exec(value);
  if (!match || (!match[1]&&!match[2])) return null;
  const start=Number(match[1]),end=Number(match[2]);
  if (!Number.isSafeInteger(start)||!Number.isSafeInteger(end)) return null;
  const lo=match[1]?start:Math.max(0,size-end);
  const hi=match[1]&&match[2]?Math.min(end,size-1):size-1;
  return lo<size&&hi>=lo?{lo,hi,partial:true}:null;
}

async function archiveFile(raw, file, method, range) {
  const suffix=encoder.encode('/reel/02b/read');
  const input=new Uint8Array(raw.length+suffix.length);
  input.set(raw);input.set(suffix,raw.length);
  const verifier=new Uint8Array(await crypto.subtle.digest('SHA-256',input));
  const headers=new Headers({'X-Screen-Source':Array.from(verifier,b=>b.toString(16).padStart(2,'0')).join('')});
  if(range)headers.set('Range',range);
  return fetch(selection.archive+file,{method,headers,redirect:'manual'});
}

async function openSmall(asset,key,raw) {
  if(asset.bytes>selection.blockSize)throw new Error('Protected asset exceeds its expected limit');
  const iv=new Uint8Array(12);
  iv.set(decode(asset.nonce));
  const source=await archiveFile(raw,asset.file,'GET');
  if(source.status!==200)throw new Error('Protected page is unavailable');
  const encrypted=await source.arrayBuffer();
  if(encrypted.byteLength!==asset.bytes+16)throw new Error('Unexpected asset length');
  return crypto.subtle.decrypt({name:'AES-GCM',iv},key,encrypted);
}

async function segment(request,version,part,raw) {
  const stream=selection.streams[version];
  if(!/^(0|[1-9][0-9]?)$/.test(part||''))return blank(404);
  const size=stream.lengths[Number(part)];
  if(!size)return blank(404);
  const span=byteRange(request.headers.get('Range'),size);
  if(!span)return blank(416,{'Content-Range':'bytes */'+size});
  const {lo,hi,partial}=span;
  const headers={...header,'Content-Type':'video/mp2t','Accept-Ranges':'bytes','Content-Length':String(hi-lo+1)};
  if(partial)headers['Content-Range']='bytes '+lo+'-'+hi+'/'+size;
  const status=partial?206:200;
  if(request.method==='HEAD')return new Response(null,{status,headers});
  const file=version+'-'+part.padStart(2,'0')+'.bin';
  const origin=await archiveFile(raw,file,'GET',partial?'bytes='+lo+'-'+hi:undefined);
  if(origin.status===status && (!partial || origin.headers.get('Content-Range')===headers['Content-Range']))
    return new Response(origin.body,{status,headers});
  // Some asset edges send the entire small part for an otherwise valid range.
  if(partial && origin.status===200){
    const bytes=await origin.arrayBuffer();
    if(bytes.byteLength===size)return new Response(bytes.slice(lo,hi+1),{status,headers});
  }
  return blank(503,{'Retry-After':'5'});
}
async function playlist(env,version,raw) {
  const key=await grant(env,'key',raw);
  const uri=await grant(env,version+'.ts',raw);
  return selection.streams[version].playlist.replaceAll('"screening-key"','"'+key+'"')
    .replace(/part-([0-9]+)\.ts/g,(_entry,i)=>uri+'&i='+i);
}
async function streamKey(raw) {
  const suffix=encoder.encode('/hls-screening/02/v1');
  const input=new Uint8Array(raw.length+suffix.length);
  input.set(raw);input.set(suffix,raw.length);
  return (await crypto.subtle.digest('SHA-256',input)).slice(0,16);
}

export async function onRequest(ctx) {
  const {request,env}=ctx;
  const url=new URL(request.url);
  if(url.pathname!==base.slice(0,-1)&&!url.pathname.startsWith(base))return blank(404);
  const route=url.pathname.slice(base.length);
  if(route==='unlock'){
    if(request.method!=='POST')return blank(405,{Allow:'POST'});
    if(request.headers.get('Origin')!==url.origin)return blank(403);
    const token=/^Bearer ([A-Za-z0-9_-]{43})$/.exec(request.headers.get('Authorization')||'')?.[1];
    if(!(await keyFrom(token)))return blank(403);
    return blank(204,{'Set-Cookie':cookie+'='+token+'; Path='+base+'; Secure; HttpOnly; SameSite=Lax'});
  }
  if(!['GET','HEAD'].includes(request.method))return blank(405,{Allow:'GET, HEAD'});
  const hls=/^(hd|uhd)\.(m3u8|ts)$/.exec(route);
  if(route && !hls && !['key','poster.jpg'].includes(route))return blank(404);
  let raw=await keyFrom(cookieValue(request));
  if(!raw && (hls || route==='key'))raw=await acceptGrant(env,route,url.searchParams.get('p'));
  if(!raw){
    if(route)return blank(404);
    return new Response(request.method==='HEAD'?null:locked,{headers:{...header,'Content-Type':'text/html; charset=utf-8'}});
  }
  try {
    if(route==='key'){
      return new Response(request.method==='HEAD'?null:await streamKey(raw),{headers:{...header,'Content-Type':'application/octet-stream'}});
    }
    if(hls){
      if(hls[2]==='ts')return await segment(request,hls[1],url.searchParams.get('i'),raw);
      const body=request.method==='HEAD'?null:await playlist(env,hls[1],raw);
      return new Response(body,{headers:{...header,'Content-Type':'application/vnd.apple.mpegurl'}});
    }
    const assetKey=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
    if(route==='poster.jpg'){
      const body=request.method==='HEAD'?null:await openSmall(selection.assets.poster,assetKey,raw);
      return new Response(body,{headers:{...header,'Content-Type':'image/jpeg'}});
    }
    const headers={...header,'Content-Type':'text/html; charset=utf-8'};
    if(request.method==='HEAD')return new Response(null,{headers});
    const card=await openSmall(selection.assets.card,assetKey,raw);
    const fourK=url.searchParams.get('quality')==='4k';
    const source=await grant(env,fourK?'uhd.m3u8':'hd.m3u8',raw);
    const html=new TextDecoder().decode(card).replaceAll('[[VIDEO]]',source).replaceAll('[[SIZE]]',fourK?'4K UHD':'1080p')
      .replaceAll('[[SWITCH_URL]]',base+(fourK?'':'?quality=4k')).replaceAll('[[SWITCH_LABEL]]',fourK?'Switch to 1080p':'Watch in 4K');
    return new Response(html,{headers});
  }catch{return blank(503,{'Retry-After':'5'})}
}
