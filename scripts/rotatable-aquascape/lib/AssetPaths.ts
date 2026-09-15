import {DefaultLoadingManager,type LoadingManager} from 'three';
import manifest from './LoadAssetManifest.json' with {type:'json'};
/** Hashed paths make long-lived browser caching safe across future updates. */
export function assetURL(path:string){return (manifest as Record<string,string>)[path]??path;}
export function resolveAssetURL(path:string,base:string){
 const root=new URL('.',base),url=new URL(path,base);
 if(url.origin!==root.origin||!url.pathname.startsWith(root.pathname))return path;
 const key='./'+url.pathname.slice(root.pathname.length);
 return (manifest as Record<string,string>)[key]??path;
}
/** GLTFLoader retains the original model base, so its relative images and
 * buffers resolve through the same manifest as the model itself. */
export function installAssetPaths(manager:LoadingManager=DefaultLoadingManager,base=document.baseURI){manager.setURLModifier(path=>resolveAssetURL(path,base));}
