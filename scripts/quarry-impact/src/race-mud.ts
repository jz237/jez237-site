import * as T from 'three';
/** Original seamless churned-earth maps. Visual grooves do not alter tyre physics. */
export function createRaceMudTextures(size=256){
 const wrap=(v:number,n:number)=>((v%n)+n)%n;
 const hash=(x:number,y:number)=>{let n=Math.imul(x+1741,374761393)^Math.imul(y+913,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;};
 const smooth=(t:number)=>t*t*(3-2*t);
 const noise=(u:number,v:number,cells:number)=>{const x=u*cells,y=v*cells,ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy),at=(dx:number,dy:number)=>hash(wrap(ix+dx,cells),wrap(iy+dy,cells));return T.MathUtils.lerp(T.MathUtils.lerp(at(0,0),at(1,0),fx),T.MathUtils.lerp(at(0,1),at(1,1),fx),fy);};
 const heights=new Float32Array(size*size),wetness=new Float32Array(size*size),diffuse=new Uint8Array(size*size*4),normal=new Uint8Array(size*size*4),roughness=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size,v=y/size,i=y*size+x,clods=noise(u,v,32)*.55+noise(u,v,64)*.3+noise(u,v,128)*.15;
  const bend=Math.sin(v*Math.PI*4)*.24+Math.sin(v*Math.PI*10)*.09;
  const groove=Math.pow(.5+.5*Math.cos((u*9+v*2+bend)*Math.PI*2),14);
  const cross=Math.pow(.5+.5*Math.cos((u*4-v*7)*Math.PI*2),22)*.25;
  const wet=T.MathUtils.smoothstep(noise(u,v,17)*.7+noise(u,v,7)*.3+groove*.08,.25,.8);wetness[i]=wet;
  heights[i]=clods*(1-wet*.55)-groove*.12-cross*.08+noise(u,v,8)*.2;
  const grain=(hash(x,y)-.5)*9,light=(clods-.5)*22-groove*5;
  const dry=[102,73,48],damp=[82,56,36];
  for(let c=0;c<3;c++)diffuse[i*4+c]=Math.max(0,Math.min(255,T.MathUtils.lerp(dry[c],damp[c],wet)+light+grain));
  diffuse[i*4+3]=255;const r=Math.round(T.MathUtils.lerp(.94,.58,wet)*255);roughness.set([r,r,r,255],i*4);
 }
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const at=(xx:number,yy:number)=>heights[wrap(yy,size)*size+wrap(xx,size)],i=(y*size+x)*4;
  const n=new T.Vector3((at(x-1,y)-at(x+1,y))*.85,(at(x,y-1)-at(x,y+1))*.85,1).normalize();
  normal.set([Math.round((n.x*.5+.5)*255),Math.round((n.y*.5+.5)*255),Math.round((n.z*.5+.5)*255),255],i);
 }
 const texture=(data:Uint8Array,name:string,color=false)=>{const t=new T.DataTexture(data,size,size);t.name='race-mud-'+name;t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;t.needsUpdate=true;return t;};
 const maps={diffuse:texture(diffuse,'diffuse',true),normal:texture(normal,'normal'),roughness:texture(roughness,'roughness')};
 let disposed=false;return{...maps,dispose(){if(disposed)return;disposed=true;Object.values(maps).forEach(t=>t.dispose());}};
}
