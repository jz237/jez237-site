import * as T from 'three';

function hash(x:number,y:number){let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function noise(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix,iy),hash(ix+1,iy),sx),T.MathUtils.lerp(hash(ix,iy+1),hash(ix+1,iy+1),sx),sy);}
/** Small reusable PBR maps synthesized once, not expensive per-pixel noise every frame.
 * These are authored material maps, guided by the GPT Image macro reference. */
export function grazerMaps(kind:'chitin'|'shell'|'flesh'){
 const width=kind==='flesh'?512:1024,height=512,color=new Uint8Array(width*height*4),surface=new Uint8Array(width*height*4);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const u=x/width,v=y/height,broad=noise(u*15,v*11),grain=noise(u*170,v*120),fine=hash(x,y);let r:number,g:number,b:number,h:number,rough:number;
  if(kind==='chitin'){
   const colonies=T.MathUtils.smoothstep(.5*broad+.5*noise(u*59,v*43),.30,.70),cell=Math.max(0,(grain-.59)*3),fleck=fine>.978?.32:0;
   r=104+colonies*74+cell*32+fleck*75;g=13+colonies*16+cell*51+fleck*80;b=10+colonies*10+cell*35+fleck*65;
   // Sparse branching pale lines resemble unpigmented chitin, without painted cartoon seams.
   const vein=Math.abs(Math.sin(u*103+noise(u*20,v*13)*8+v*15));if(vein<.03&&grain>.48){r+=23;g+=29;b+=21;}
   h=128+(grain-.5)*34;rough=135+(1-colonies)*30;
  }else if(kind==='shell'){
   const amber=.6*broad+.4*noise(u*46,v*29),spots=T.MathUtils.smoothstep(grain,.58,.77),line=Math.sin(u*TAU*260+noise(u*7,v*14)*2),stria=Math.pow(Math.max(0,line),12),worn=T.MathUtils.smoothstep(noise(u*66,v*48),.69,.84);
   r=77+amber*87-spots*37+stria*35+worn*30;g=41+amber*58-spots*30+stria*27+worn*28;b=18+amber*32-spots*14+stria*18+worn*24;h=128+line*16+grain*12;rough=137+grain*35-stria*16;
  }else{
   const cells=T.MathUtils.smoothstep(grain,.51,.64),edge=Math.abs(Math.sin(v*TAU));r=66+broad*22+cells*63;g=60+broad*15+cells*54;b=49+broad*12+cells*42;h=128+cells*34+fine*5;rough=145+edge*20-cells*18;
  }
  const i=(y*width+x)*4;color[i]=r;color[i+1]=g;color[i+2]=b;color[i+3]=255;surface[i]=h;surface[i+1]=rough;surface[i+2]=0;surface[i+3]=255;
 }
 const make=(data:Uint8Array,srgb=false)=>{const t=new T.DataTexture(data,width,height);t.colorSpace=srgb?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;};return {map:make(color,true),surface:make(surface)};
}
const TAU=Math.PI*2;
export function grazerMaterials(atlas?:T.Texture){
 const textures:T.Texture[]=[];
 const maps=(kind:'chitin'|'shell'|'flesh',column:number)=>{
  if(!atlas){const m=grazerMaps(kind);textures.push(m.map,m.surface);return {map:m.map,bump:m.surface};}
  // Sample one equal-width panel of the GPT Image atlas; no flattened animal images.
  let map:T.Texture;const atlasImage=atlas.image as HTMLImageElement|undefined;
  if(typeof document!=='undefined'&&atlasImage?.width){
   // Each panel becomes a reusable material tile, so microtexture scale is independent
   // of anatomy and mipmaps cannot bleed a neighboring material into an edge.
   const image=atlasImage,canvas=document.createElement('canvas');canvas.width=Math.floor(image.width/3);canvas.height=image.height;
   canvas.getContext('2d')!.drawImage(image,column*image.width/3,0,image.width/3,image.height,0,0,canvas.width,canvas.height);
   map=new T.CanvasTexture(canvas);map.wrapS=map.wrapT=T.RepeatWrapping;if(kind==='flesh')map.repeat.set(4,4);if(kind==='shell')map.repeat.set(3,1);
  }else{map=atlas.clone();map.repeat.set(1/3-.0018,1);map.offset.set(column/3+.0009,0);}
  map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;map.needsUpdate=true;
  const bump=map.clone();bump.colorSpace=T.NoColorSpace;bump.needsUpdate=true;textures.push(map,bump);return {map,bump};
 };
 const chitin=maps('chitin',1),shellMap=maps('shell',0),fleshMap=maps('flesh',2);
 const skin=new T.MeshPhysicalMaterial({color:0xcaa69b,map:chitin.map,bumpMap:chitin.bump,bumpScale:.00022,roughness:.49,ior:1.20,specularIntensity:.55});
 const plateSkin=skin.clone();
 plateSkin.onBeforeCompile=shader=>{shader.vertexShader='attribute float plateOffset;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>',`#include <uv_vertex>
#ifdef USE_MAP
vMapUv=(mapTransform*vec3(uv.x*.077+plateOffset,uv.y,1.)).xy;
#endif
#ifdef USE_BUMPMAP
vBumpMapUv=(bumpMapTransform*vec3(uv.x*.077+plateOffset,uv.y,1.)).xy;
#endif
`);};plateSkin.customProgramCacheKey=()=> 'continuous-shrimp-plate-pigment-v1';
 const membrane=skin.clone();membrane.color.set(0xd8b7a2);membrane.transparent=true;membrane.opacity=.38;membrane.depthWrite=false;membrane.side=T.DoubleSide;membrane.forceSinglePass=true;membrane.bumpScale=.00008;
 const joint=new T.MeshPhysicalMaterial({color:0x947b67,roughness:.55,ior:1.15,specularIntensity:.5});
 const flesh=new T.MeshPhysicalMaterial({map:fleshMap.map,bumpMap:fleshMap.bump,bumpScale:.00016,roughness:.49,ior:1.16,specularIntensity:.6});
 const shell=new T.MeshPhysicalMaterial({color:0xc6b59c,map:shellMap.map,bumpMap:shellMap.bump,bumpScale:.00032,roughness:.43,ior:1.25,specularIntensity:.65});
 const dark=new T.MeshPhysicalMaterial({color:0x070909,roughness:.27,ior:1.25,specularIntensity:.8});
 return {skin,plateSkin,membrane,joint,flesh,shell,dark,textures};
}
