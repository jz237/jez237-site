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
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
};
const locked = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><title>Private screening · Jez237</title><link rel="stylesheet" href="/screening/watch.css"><script src="/screening/unlock.js" defer></script></head><body><main class="entry"><h1>Private screening</h1><p id="status" role="status">Open the complete private link you received to watch this film.</p><button type="button" id="retry" hidden>Try again</button><noscript><p>Enable JavaScript to open your private link.</p></noscript></main></body></html>`;

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

async function packetInput(ctx, asset, lo, hi) {
  const size=selection.blockSize;
  const first=Math.floor(lo/size),last=Math.floor(hi/size);
  const total=asset.bytes+16*Math.ceil(asset.bytes/size);
  const from=first*(size+16);
  const through=Math.min(asset.bytes,(last+1)*size)+(last+1)*16-1;
  const location=new URL(asset.path,ctx.request.url);
  const request=new Request(location,{headers:{Range:'bytes='+from+'-'+through,'User-Agent':'jez237-screening-player'}});
  const origin=asset.remote?await fetch(request):await ctx.env.ASSETS.fetch(request);
  if (origin.status===206) {
    if(origin.headers.get('Content-Range')!==('bytes '+from+'-'+through+'/'+total))throw new Error('Unexpected encrypted range');
  } else if (origin.status!==200 || from!==0 || origin.headers.get('Content-Length')!==String(total)) {
    throw new Error('Encrypted video is unavailable');
  }
  if(!origin.body)throw new Error('Missing encrypted content');
  return {reader:origin.body.getReader(),first,last};
}

async function* plaintext(ctx,asset,key,lo,hi) {
  const {reader,first,last}=await packetInput(ctx,asset,lo,hi);
  const blockSize=selection.blockSize;
  const iv=new Uint8Array(12);
  const ivIndex=new DataView(iv.buffer);
  iv.set(decode(asset.nonce));
  let bytes=new Uint8Array(0),at=0;
  try {
    for(let row=first;row<=last;row++){
      const offset=row*blockSize;
      const length=Math.min(blockSize,asset.bytes-offset);
      const sealed=new Uint8Array(length+16);
      let filled=0;
      while(filled<sealed.length){
        if(at===bytes.length){
          const chunk=await reader.read();
          if(chunk.done)throw new Error('Truncated video');
          bytes=chunk.value;at=0;
        }
        const n=Math.min(sealed.length-filled,bytes.length-at);
        sealed.set(bytes.subarray(at,at+n),filled);
        at+=n;filled+=n;
      }
      ivIndex.setUint32(8,row);
      const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv},key,sealed));
      yield plain.subarray(Math.max(0,lo-offset),Math.min(length,hi-offset+1));
    }
  } finally {await reader.cancel().catch(()=>{})}
}

async function mediaResponse(ctx,asset,key,video) {
  const request=ctx.request;
  const tag='"'+asset.digest+'"';
  const conditional=request.headers.get('If-Range');
  const span=byteRange(conditional && conditional!==tag?null:request.headers.get('Range')?.trim(),asset.bytes);
  if(!span)return blank(416,{'Content-Range':'bytes */'+asset.bytes});
  const {lo,hi,partial}=span;
  const count=hi-lo+1;
  const headers={...header,'Content-Type':video?'video/mp4':'image/jpeg','Accept-Ranges':'bytes',ETag:tag,'Content-Length':String(count)};
  if(partial)headers['Content-Range']='bytes '+lo+'-'+hi+'/'+asset.bytes;
  if(video)headers['Content-Disposition']='inline; filename="film.mp4"';
  const status=partial?206:200;
  if(request.method==='HEAD')return new Response(null,{status,headers});
  const samples=plaintext(ctx,asset,key,lo,hi);
  const first=await samples.next();
  if(first.done)throw new Error('Empty video');
  if(first.value.length===count){
    await samples.return();
    return new Response(first.value,{status,headers});
  }
  const stream=new FixedLengthStream(count);
  const writer=stream.writable.getWriter();
  const pumping=(async()=>{
    try{
      await writer.write(first.value);
      for await (const part of samples)await writer.write(part);
      await writer.close();
    }catch(error){
      await samples.return().catch(()=>{});
      await writer.abort(error).catch(()=>{});
    }
  })();
  ctx.waitUntil(pumping);
  return new Response(stream.readable,{status,headers});
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
  const video=route==='film.mp4'||route==='film-4k.mp4';
  if(route && !video && route!=='poster.jpg')return blank(404);
  let raw=await keyFrom(cookieValue(request));
  if(!raw && video)raw=await acceptGrant(env,route,url.searchParams.get('p'));
  if(!raw){
    if(route)return blank(404);
    return new Response(request.method==='HEAD'?null:locked,{headers:{...header,'Content-Type':'text/html; charset=utf-8'}});
  }
  try {
    const assetKey=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
    if(route){
      const selected=video?(route==='film.mp4'?selection.assets.hd:selection.assets.uhd):selection.assets.poster;
      return await mediaResponse(ctx,selected,assetKey,video);
    }
    const headers={...header,'Content-Type':'text/html; charset=utf-8'};
    if(request.method==='HEAD')return new Response(null,{headers});
    const card=selection.assets.card;
    let html='';
    for await(const packet of plaintext(ctx,card,assetKey,0,card.bytes-1))html+=new TextDecoder().decode(packet);
    const fourK=url.searchParams.get('quality')==='4k';
    const source=await grant(env,fourK?'film-4k.mp4':'film.mp4',raw);
    html=html.replaceAll('[[VIDEO]]',source).replaceAll('[[SIZE]]',fourK?'4K UHD':'1080p')
      .replaceAll('[[SWITCH_URL]]',base+(fourK?'':'?quality=4k')).replaceAll('[[SWITCH_LABEL]]',fourK?'Switch to 1080p':'Watch in 4K');
    return new Response(html,{headers});
  }catch{return blank(503,{'Retry-After':'5'})}
}
