/** Reconnect state belongs to a server as well as a room; room codes are not global. */
export function onlineSessionKey(endpoint:string,room:string){
 const url=new URL(endpoint);url.hash='';url.pathname=url.pathname.replace(/\/+$/,'');
 return 'quarry-room-v2:'+JSON.stringify([url.href,room.toUpperCase()]);
}
export const ONLINE_ENDPOINT_KEY='quarry-online-endpoint-v1';
export function validOnlineEndpoint(endpoint:string){
 try{const url=new URL(endpoint);return url.protocol==='wss:'||url.protocol==='ws:'&&['localhost','127.0.0.1'].includes(url.hostname);}catch{return false;}
}
export function rememberedOnlineEndpoint(storage:Pick<Storage,'getItem'>,fallback:string){
 try{const endpoint=storage.getItem(ONLINE_ENDPOINT_KEY);return endpoint&&validOnlineEndpoint(endpoint)?endpoint:fallback;}catch{return fallback;}
}
