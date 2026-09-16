import * as T from './vendor/three.module.js';
import {assetURL,fetchAsset} from './asset-store.js';

// Decode the same image bytes through the same Three.js ImageLoader. Revoking
// the temporary URL after decode releases its backing buffer, not the texture.
export async function loadTexture(path){
 const response=await fetchAsset(assetURL(path));
 if(!response.ok)throw Error('Texture unavailable: '+path);
 const objectURL=URL.createObjectURL(await response.blob());
 try{return await new T.TextureLoader().loadAsync(objectURL);}
 finally{URL.revokeObjectURL(objectURL);}
}
