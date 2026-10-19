import * as T from 'three';
/** Fictional trackside sponsors painted on barrier faces. */
export const BARRIER_SPONSORS=[
 ['HALDEN','TYRES','#f2e6c4','#1d3550'],['COPPERLINE','MOTOR OIL','#1b1b1b','#e2a43a'],['BLACKRIDGE','MOTOR CLUB','#f3ecd8','#7a2d27'],['SPARKWRIGHT','PLUGS & LEADS','#ffffff','#2c6e49'],
 ['TURNBULL','TOWING · 24 HRS','#1a1a1a','#f0c419'],['GRAVELLE','COFFEE','#f6efe3','#4a2f22'],['QUARRY IMPACT','BANGER SERIES','#f4e4b8','#20262b'],['NORTHGATE','MOTOR FACTORS','#ffffff','#b23a2e'],
 ['ROLLWELL','BEARINGS','#e8eef2','#2a4c7a'],['FENMOOR','PIES','#fff4dc','#6a4a1c'],['OAKSHAW','SCRAP METAL','#e9e9e3','#3d4045'],['KESTREL','RADIATORS','#ffffff','#1f6f8b'],
 ['DUNMERE','BREAKERS','#f2d8a6','#5a2f22'],['MARSDEN','BATTERIES','#1c1c1c','#d9d2bf'],['WRENFORD','GARAGE','#f7f1e1','#3f6b3a'],['HARROW','HAULAGE','#fbe9a8','#22313d'],
] as const;
let atlas:T.CanvasTexture|null=null;
/** Two columns × eight rows of 512×128 boards; built once and shared by every venue. */
function sponsorAtlas(){
 if(atlas||typeof document==='undefined')return atlas;
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const ctx=canvas.getContext('2d');if(!ctx)return null;
 BARRIER_SPONSORS.forEach(([name,line,ink,ground],i)=>{
  const x=(i%2)*512,y=Math.floor(i/2)*128;
  ctx.fillStyle=ground;ctx.fillRect(x,y,512,128);ctx.strokeStyle=ink;ctx.globalAlpha=.55;ctx.lineWidth=5;ctx.strokeRect(x+9,y+9,494,110);ctx.globalAlpha=1;
  ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='alphabetic';
  let size=62;ctx.font=`bold ${size}px sans-serif`;while(ctx.measureText(name).width>450&&size>30){size-=2;ctx.font=`bold ${size}px sans-serif`;}
  ctx.fillText(name,x+256,y+72);ctx.font='bold 26px sans-serif';ctx.fillText(line,x+256,y+107);
 });
 atlas=new T.CanvasTexture(canvas);atlas.colorSpace=T.SRGBColorSpace;atlas.anisotropy=8;atlas.generateMipmaps=true;return atlas;
}
/** A copy of the barrier's stripe material whose long faces carry one sponsor board per
 * box: board inset on the face, sponsor chosen by instance and venue seed. Geometry, solid
 * records and collision are unchanged. Without a DOM (tests) the copy is a plain clone. */
export function barrierBoardMaterial(stripe:T.MeshStandardMaterial,seed=0){
 const material=stripe.clone();material.name=(stripe.name||'stripe')+'_boards';
 const map=sponsorAtlas();if(!map)return material;
 material.onBeforeCompile=shader=>{
  shader.uniforms.boardAtlas={value:map};shader.uniforms.boardSeed={value:seed};
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vBoardUv;\nvarying float vBoardFace;\nvarying float vBoardIndex;')
   .replace('#include <begin_vertex>','#include <begin_vertex>\nvBoardUv=uv;vBoardFace=step(.5,abs(normal.x));\n#ifdef USE_INSTANCING\nvBoardIndex=float(gl_InstanceID);\n#else\nvBoardIndex=0.;\n#endif');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D boardAtlas;\nuniform float boardSeed;\nvarying vec2 vBoardUv;\nvarying float vBoardFace;\nvarying float vBoardIndex;')
   .replace('#include <map_fragment>',`#include <map_fragment>
{
 vec2 b=(vBoardUv-vec2(.06,.30))/vec2(.88,.52);
 float inside=vBoardFace*step(0.,b.x)*step(b.x,1.)*step(0.,b.y)*step(b.y,1.);
 if(inside>.5){
  float k=mod(floor(vBoardIndex+boardSeed),16.);
  vec2 cell=vec2(mod(k,2.),7.-floor(k/2.));
  vec4 board=texture2D(boardAtlas,(cell+b)/vec2(2.,8.));
  diffuseColor.rgb=board.rgb;
 }
}`);
 };
 material.customProgramCacheKey=()=>'barrier-boards-v1';
 return material;
}
/** Stable per-venue offset so neighbouring circuits do not repeat the same sponsor order. */
export const boardSeed=(id:string)=>{let h=7;for(const c of id)h=(h*31+c.charCodeAt(0))%9973;return h%16;};
/** Adds a `boards` finish beside a world's existing `stripe` material. */
export function withBarrierBoards<M extends {stripe:T.MeshStandardMaterial}>(materials:M,seed=0):M&{boards:T.MeshStandardMaterial}{return {...materials,boards:barrierBoardMaterial(materials.stripe,seed)};}
/** As withBarrierBoards, for venues whose barrier finish has another name (yellow, ochre…). */
export function withBarrierBoardsOf<M extends Record<K,T.MeshStandardMaterial>,K extends keyof M>(materials:M,key:K,seed=0):M&{boards:T.MeshStandardMaterial}{return {...materials,boards:barrierBoardMaterial(materials[key],seed)};}
