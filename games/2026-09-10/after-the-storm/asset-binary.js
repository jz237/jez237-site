import {packedAssets} from './packed-assets.js';

// Compress only transport, never vertices/normals. Streaming inflation keeps
// download size small without introducing model quantization or a decoder WASM.
export async function loadBinary(path,{fetcher=fetch,Inflater=globalThis.DecompressionStream}={}){
 const entry=packedAssets[path];
 if(entry&&Inflater){
  try{
   const response=await fetcher(new URL('./'+entry.url,import.meta.url));
   if(!response.ok||!response.body)throw Error('Packed asset unavailable');
   const data=await new Response(response.body.pipeThrough(new Inflater('gzip'))).arrayBuffer();
   if(data.byteLength!==entry.bytes)throw Error('Packed asset length mismatch');
   return data;
  }catch(error){console.warn('Retrying original model asset:',path,error.message);}
 }
 const response=await fetcher(new URL('./'+path,import.meta.url));
 if(!response.ok)throw Error('Model asset unavailable: '+path);
 const data=await response.arrayBuffer();
 if(entry&&data.byteLength!==entry.bytes)throw Error('Model asset length mismatch: '+path);
 return data;
}
