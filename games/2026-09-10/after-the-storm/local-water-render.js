import * as T from './vendor/three.module.js';
import {activeLocalWater} from './local-water.js';
const empty=new T.DataTexture(new Float32Array(4),1,1,T.RGBAFormat,T.FloatType);empty.needsUpdate=true;
export const localWaterUniforms={localWaterMap:{value:empty},localWaterOrigin:{value:new T.Vector2()},localWaterSize:{value:new T.Vector2(1,1)},localWaterCell:{value:.75},localWaterEnabled:{value:0}};
let texture=null,pixels=null,lastField=null,lastVersion=-1;
export function syncLocalWater(){const f=activeLocalWater;localWaterUniforms.localWaterEnabled.value=f&&Number.isFinite(f.x)?1:0;if(!f)return;
 if(!texture||texture.image.width!==f.size){texture?.dispose();pixels=new Float32Array(f.size*f.size*4);texture=new T.DataTexture(pixels,f.size,f.size,T.RGBAFormat,T.FloatType);texture.minFilter=texture.magFilter=T.NearestFilter;localWaterUniforms.localWaterMap.value=texture;}
 if(lastField!==f||lastVersion!==f.version){for(let i=0;i<f.h.length;i++){pixels[i*4]=f.h[i];pixels[i*4+1]=f.mask[i];}texture.needsUpdate=true;lastField=f;lastVersion=f.version;}
 localWaterUniforms.localWaterOrigin.value.set(f.x,f.z);localWaterUniforms.localWaterCell.value=f.cell;localWaterUniforms.localWaterSize.value.set(f.size,f.size);
}
export const localWaterGLSL=`uniform sampler2D localWaterMap;uniform vec2 localWaterOrigin,localWaterSize;uniform float localWaterCell,localWaterEnabled;
float localWaterHeight(vec2 p){if(localWaterEnabled<.5)return 0.;vec2 cell=(p-localWaterOrigin)/localWaterCell,i=floor(cell),f=fract(cell);if(min(i.x,i.y)<0.||max(i.x,i.y)>=localWaterSize.x-1.)return 0.;
 vec2 uv=(i+.5)/localWaterSize,d=1./localWaterSize;
 return mix(mix(texture2D(localWaterMap,uv).r,texture2D(localWaterMap,uv+vec2(d.x,0.)).r,f.x),mix(texture2D(localWaterMap,uv+vec2(0.,d.y)).r,texture2D(localWaterMap,uv+d).r,f.x),f.y);}
vec3 localWaterSurface(vec2 p){float e=localWaterCell;return vec3(localWaterHeight(p),(localWaterHeight(p+vec2(e,0.))-localWaterHeight(p-vec2(e,0.)))/(2.*e),(localWaterHeight(p+vec2(0.,e))-localWaterHeight(p-vec2(0.,e)))/(2.*e));}`;
