import * as T from './vendor/three.module.js';
import {coastalDepth,DEPTH_SIZE} from './coastal-depth.js';
const texture=new T.DataTexture(coastalDepth.data,DEPTH_SIZE,DEPTH_SIZE,T.RedFormat,T.FloatType);
texture.minFilter=texture.magFilter=T.NearestFilter;texture.needsUpdate=true;
export const coastalDepthUniforms={coastalDepthMap:{value:texture},coastalDepthActive:{value:0}};
let version=-1;
export function syncCoastalDepth(){
 coastalDepthUniforms.coastalDepthActive.value=coastalDepth.active?1:0;
 if(version!==coastalDepth.version){version=coastalDepth.version;texture.needsUpdate=true;}
}
