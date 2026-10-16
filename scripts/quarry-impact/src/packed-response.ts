/** Fetch transparently decodes HTTP Content-Encoding. Static .gz assets may
 * instead arrive as raw gzip; both transports must yield the same asset bytes. */
export async function readPackedResponse(response:Response):Promise<ArrayBuffer>{
 const bytes=await response.arrayBuffer();
 if(/\bgzip\b/i.test(response.headers.get('content-encoding')??''))return bytes;
 const magic=new Uint8Array(bytes,0,Math.min(2,bytes.byteLength));
 return magic.length===2&&magic[0]===0x1f&&magic[1]===0x8b
  ?new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():bytes;
}
