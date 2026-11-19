// Private, encrypted origin objects on a pinned deployment of this Pages project.
const digest = Uint8Array.from('35f1c68b5ef897b6c99840d9e83c9f96d682bf172c2d38f83ab9c795e29f381c'.match(/../g), s=>parseInt(s,16));
const headers = {'Cache-Control':'private, no-store, no-transform','CDN-Cache-Control':'no-store','X-Robots-Tag':'noindex, noarchive','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
export async function onRequest({request,env}) {
  const token=request.headers.get('X-Screen-Source') || '';
  const path=new URL(request.url).pathname;
  if(!/^\/screening\/02\/reel\/(?:(?:hd|uhd)-\d\d|card|poster)\.bin$/.test(path) ||
      !['GET','HEAD'].includes(request.method) || !/^[\da-f]{64}$/.test(token))return new Response(null,{status:404,headers});
  const data=Uint8Array.from(token.match(/../g),s=>parseInt(s,16));
  if(!crypto.subtle.timingSafeEqual(digest,await crypto.subtle.digest('SHA-256',data)))return new Response(null,{status:404,headers});
  const select=new Headers();
  if(request.headers.has('Range'))select.set('Range',request.headers.get('Range'));
  const file=await env.ASSETS.fetch(new Request(request.url,{method:request.method,headers:select}));
  if(![200,206].includes(file.status) || file.headers.get('Content-Type')?.includes('text/html'))return new Response(null,{status:404,headers});
  const out=new Headers({...headers,'Content-Type':'application/octet-stream','Accept-Ranges':'bytes'});
  for(const field of ['Content-Length','Content-Range'])if(file.headers.has(field))out.set(field,file.headers.get(field));
  return new Response(file.body,{status:file.status,headers:out});
}
