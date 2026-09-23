import * as T from 'three';

// Periodic value noise: no repeated grids of painted circles and no UV seam.
function hash(x:number,y:number){let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function noise(x:number,y:number,period:number){
 const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
 const a=hash(ix%period,iy%period),b=hash((ix+1)%period,iy%period),c=hash(ix%period,(iy+1)%period),d=hash((ix+1)%period,(iy+1)%period);
 return T.MathUtils.lerp(T.MathUtils.lerp(a,b,sx),T.MathUtils.lerp(c,d,sx),sy);
}
function texture(bytes:Uint8Array,size:number,color=false){const t=new T.DataTexture(bytes,size,size,T.RGBAFormat);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;t.needsUpdate=true;return t;}
export function limestoneMaps(size=512){
 const heights=new Float32Array(size*size),albedo=new Uint8Array(size*size*4),normal=new Uint8Array(size*size*4),roughness=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size,v=y/size,macro=noise(u*7,v*7,7),grain=noise(u*83,v*83,83),pore=noise(u*37+noise(u*9,v*9,9)*2,v*37,37);
  const h=.6+macro*.12+grain*.16-Math.pow(Math.max(0,(pore-.51)/.49),1.5)*.54;
  const i=(y*size+x)*4;heights[y*size+x]=h;
  const cover=noise(u*13+.6,v*13+.2,13),detail=noise(u*151,v*151,151),cavity=T.MathUtils.clamp(.58+h*.64,.45,1),speck=.82+detail*.25;
  // Chalk, old coralline crust and olive biofilm coexist on the same rock.
  const crust=T.MathUtils.smoothstep(cover,.43,.71),algae=1-T.MathUtils.smoothstep(cover,.19,.43);
  const c=[109,104,88].map((v,k)=>T.MathUtils.lerp(T.MathUtils.lerp(v,[98,101,68][k],algae*.65),[86,63,91][k],crust*.82));
  const edge=T.MathUtils.smoothstep(cover,.49,.62);
  for(let k=0;k<3;k++)albedo[i+k]=c[k]*cavity*speck*(1+edge*.08);
  albedo[i+3]=255;roughness[i]=roughness[i+1]=roughness[i+2]=210+grain*38;roughness[i+3]=255;
 }
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const dx=(heights[y*size+(x+1)%size]-heights[y*size+(x+size-1)%size])*2.9,dy=(heights[((y+1)%size)*size+x]-heights[((y+size-1)%size)*size+x])*2.9,l=Math.hypot(dx,dy,1),i=(y*size+x)*4;
  normal[i]=(-dx/l*.5+.5)*255;normal[i+1]=(-dy/l*.5+.5)*255;normal[i+2]=(1/l*.5+.5)*255;normal[i+3]=255;
 }
 const maps={map:texture(albedo,size,true),normalMap:texture(normal,size),roughnessMap:texture(roughness,size)};for(const t of Object.values(maps))t.repeat.set(3,2);return maps;
}
