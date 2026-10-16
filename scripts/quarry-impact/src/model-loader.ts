import {readPackedResponse} from './packed-response';
import {GLTFLoader as OriginalGLTFLoader,type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import packedModels from './packed-models.json';

/** The same GLTF parser/Draco decoder, fed losslessly packed transport bytes.
 * Older browsers and CPU asset tests retain the original local GLB path. */
export class GLTFLoader extends OriginalGLTFLoader {
  override async loadAsync(file:string,onProgress?:(event:ProgressEvent)=>void):Promise<GLTF> {
    if(typeof window==='undefined'||typeof DecompressionStream==='undefined')return super.loadAsync(file,onProgress);
    const original=new URL(file,location.href),name=original.pathname.split('/').pop()!;
    const packed=(packedModels as Record<string,string>)[name];
    if(!packed||original.origin!==location.origin)return super.loadAsync(file,onProgress);
    const source=new URL('packed/'+packed,original);
    const response=await fetch(source);
    if(response.status===404)return super.loadAsync(file,onProgress);
    if(!response.ok||!response.body)throw new Error('Model unavailable: '+name);
    const bytes=await readPackedResponse(response),magic=new Uint8Array(bytes,0,Math.min(4,bytes.byteLength));
    if(magic.length!==4||magic[0]!==0x67||magic[1]!==0x6c||magic[2]!==0x54||magic[3]!==0x46)throw new Error('Invalid packed model: '+name);
    return this.parseAsync(bytes,new URL('./',source).href);
  }
}
