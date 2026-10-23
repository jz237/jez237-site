import * as T from './vendor/three.module.js';
import {adoptGL} from './open-sea-gl.js';
import {OceanSim} from './open-sea-ocean.js';
import {OPEN_SEA_SHOAL} from './open-sea-field.js';

// Experimental open sea: the Open Sea demo's GPU FFT ocean (five Tessendorf
// cascades, JONSWAP wind sea plus swell, choppy displacement, Lagrangian
// whitecap foam) driving the game's water mesh. The simulation shares three.js's
// WebGL2 context; three.js state is reset after each simulation pass.

// GLSL shared by the water vertex and fragment stages. Cascades 0-2 are sampled
// unwarped so the CPU physics mirror (open-sea-spectrum.js) sees the same waves;
// the two finest cascades get the demo's low-frequency warp to hide tiling.
// Follows coastalDepthGLSL: shallow water calms the waves as the CPU mirror does.
export const openSeaOceanGLSL=/* glsl */`
uniform highp sampler2DArray fftDisp;
uniform highp sampler2DArray fftSlope;
uniform highp sampler2DArray fftFoam;
uniform int fftActive;
uniform int fftCount;
uniform vec4 fftScale[5];
uniform vec2 fftOff[5];
uniform float fftFoamGain;
float fftHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float fftNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(fftHash(i),fftHash(i+vec2(1,0)),f.x),mix(fftHash(i+vec2(0,1)),fftHash(i+vec2(1,1)),f.x),f.y);}
vec2 fftUV(int i,vec2 g){
 vec4 c=fftScale[i];
 vec2 uv=fftOff[i]+vec2(c.y*g.x+c.z*g.y,-c.z*g.x+c.y*g.y)*c.x;
 if(i>=3){float sc=i==3?130.:60.,amp=i==3?20.:9.;
  vec2 w=vec2(fftNoise(g/sc),fftNoise(g/sc+17.3))*2.-1.;uv+=w*amp*c.x;}
 return uv;
}
float fftShoal(vec2 g){return coastalDepthActive<.5?1.:smoothstep(${OPEN_SEA_SHOAL[0].toFixed(2)},${OPEN_SEA_SHOAL[1].toFixed(2)},seaLevel-coastalBed(g).x);}
vec2 fftToWorld(vec2 v,int i){vec4 c=fftScale[i];return vec2(c.y*v.x-c.z*v.y,c.z*v.x+c.y*v.y);}
// xyz: horizontal displacement and height; w: Jacobian - 1 (compression).
vec4 fftDisplacement(vec2 g){
 vec4 D=vec4(0.);
 for(int i=0;i<5;i++){if(i>=fftCount)break;
  vec4 d=textureLod(fftDisp,vec3(fftUV(i,g),float(i)),0.);vec2 w=fftToWorld(d.xz,i);D+=vec4(w.x,d.y,w.y,d.w);}
 return D*fftShoal(g);
}
// Height gradient over the Lagrangian grid, summed across cascades.
vec2 fftSlopeLod(vec2 g,float first){
 vec2 S=vec2(0.);
 for(int i=0;i<5;i++){if(i>=fftCount)break;if(float(i)<first)continue;
  vec4 s=texture(fftSlope,vec3(fftUV(i,g),float(i)));S+=fftToWorld(s.xy,i);}
 return S*fftShoal(g);
}
float fftFoamAt(vec2 g){
 float f=0.;
 for(int i=1;i<4;i++){if(i>=fftCount)break;f=max(f,texture(fftFoam,vec3(fftUV(i,g),float(i))).x);}
 return f*fftFoamGain*fftShoal(g);
}
`;

// Singleton uniforms: every water material spreads them through ocean.js's
// shared set, so the controller only ever writes their values.
export const openSeaUniforms={fftActive:{value:0},fftCount:{value:0},fftDisp:{value:null},fftSlope:{value:null},fftFoam:{value:null},
 fftScale:{value:Array.from({length:5},()=>new T.Vector4(1,1,0,1))},fftOff:{value:Array.from({length:5},()=>new T.Vector2())},fftFoamGain:{value:1.4}};

// three.js leaves its last texture's unpack flags set (a canvas label's flipY, for
// one), and WebGL 2 rejects array-buffer 3D uploads under them; its resetState()
// does not touch them. Every three.js upload sets its own flags again.
function neutralUnpack(gl){
 gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);
 for(const p of [gl.UNPACK_ROW_LENGTH,gl.UNPACK_IMAGE_HEIGHT,gl.UNPACK_SKIP_PIXELS,gl.UNPACK_SKIP_ROWS,gl.UNPACK_SKIP_IMAGES])gl.pixelStorei(p,0);
}
/** Owns the FFT simulation and the three.js uniforms that expose it. */
export function createOpenSeaWater(renderer,{seaState=3.5,windDirection=.55,cascades=5,size=256}={}){
 // resetState() returns the context to WebGL defaults (no culling, scissor or
 // blending) before the simulation's passes, and three.js's caches after them.
 const gl=adoptGL(renderer.getContext());renderer.resetState();neutralUnpack(gl);
 const sim=new OceanSim({N:size,cascades});
 sim.setSea(seaState,windDirection);sim.cur={...sim.target};sim.dirty=true;
 renderer.resetState();
 const wrap=raw=>{const t=new T.DataArrayTexture(null,raw.w,raw.h,raw.layers);t.minFilter=T.LinearMipmapLinearFilter;t.magFilter=T.LinearFilter;
  t.wrapS=t.wrapT=T.RepeatWrapping;const p=renderer.properties.get(t);p.__webglTexture=raw.tex;p.__webglInit=true;return t;};
 const disp=wrap(sim.disp),slope=wrap(sim.slope),foam=sim.foam.map(wrap);
 const {scale,off}=sim.cascadeUniforms(0,0),u=openSeaUniforms;
 u.fftCount.value=sim.count;u.fftDisp.value=disp;u.fftSlope.value=slope;u.fftFoam.value=foam[sim.foamIdx];
 for(let i=0;i<sim.count;i++){u.fftScale.value[i].fromArray(scale,i*4);u.fftOff.value[i].fromArray(off,i*2);}
 let disposed=false;
 return {sim,gl,
  /** Show or hide the FFT surface in every water material. */
  setActive(on){u.fftActive.value=on&&!disposed?1:0;},
  get seaState(){return sim.target.s;},
  /** Change the sea at once (no build-up), matching a fresh physics field. */
  setSea(state,dir=windDirection){sim.setSea(state,dir);sim.cur={...sim.target};sim.dirty=true;},
  /** Advance the GPU ocean; three.js state is restored afterwards. */
  update(dt){
   if(disposed)throw new Error('Open sea water is disposed');
   renderer.resetState();neutralUnpack(gl);sim.update(Math.max(0,Math.min(dt,.1)));renderer.resetState();
   u.fftFoam.value=foam[sim.foamIdx];
  },
  /** Diagnostic: one cascade's displacement texels (x, height, z, J-1), row-major from v=0. */
  readDisplacement(layer){
   renderer.resetState();const fb=gl.createFramebuffer(),n=sim.N,out=new Float32Array(n*n*4);gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
   gl.framebufferTextureLayer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,sim.disp.tex,0,layer);gl.readPixels(0,0,n,n,gl.RGBA,gl.FLOAT,out);
   gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.deleteFramebuffer(fb);renderer.resetState();return out;
  },
  dispose(){if(disposed)return;disposed=true;u.fftActive.value=0;for(const t of [disp,slope,...foam])renderer.properties.remove(t);}
 };
}
