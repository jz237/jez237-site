import * as T from 'three';
/** Seamless corallite tissue maps, generated locally once. Fine tissue structure
 * lives in shared textures rather than thousands of extra per-frame objects. */
export function coralSurfaceMaps(){
 const n=512,cells=8,height=new Float32Array(n*n),diffuse=new Uint8Array(n*n*4),normal=new Uint8Array(n*n*4),rough=new Uint8Array(n*n*4);
 const hash=(x:number,y:number)=>{let a=Math.imul((x+cells)%cells+71,374761393)^Math.imul((y+cells)%cells+19,668265263);a=Math.imul(a^(a>>>13),1274126177);return ((a^(a>>>16))>>>0)/4294967295;};
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const gx=x/n*cells,gy=y/n*cells,ix=Math.floor(gx),iy=Math.floor(gy);let nearest=10,phase=0;
  for(let cy=iy-1;cy<=iy+1;cy++)for(let cx=ix-1;cx<=ix+1;cx++){const h=hash(cx,cy),dx=gx-cx-.5-(h-.5)*.62,dy=gy-cy-.5-(hash(cx+3,cy+1)-.5)*.62;const d=Math.hypot(dx,dy)*(.9+h*.8);if(d<nearest){nearest=d;phase=Math.atan2(dy,dx)+h*6.28;}}
  const rim=Math.exp(-Math.pow((nearest-.29)/.068,2)),pit=Math.exp(-Math.pow(nearest/.18,2)),septa=Math.cos(phase*12)*Math.exp(-Math.pow((nearest-.18)/.12,2)),grain=Math.sin(x*2.73+y*1.79)*Math.sin(y*2.27-x*.81);
  const h=.4+rim*.31-pit*.2+septa*.033+grain*.022,id=y*n+x,k=id*4;
  height[id]=h;const tone=203+rim*20-pit*32+septa*12+grain*7;
  diffuse.set([tone,tone*.98,tone*.93,255],k);const rr=207+pit*20+grain*5;rough.set([rr,rr,rr,255],k);
 }
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const dx=(height[y*n+(x+1)%n]-height[y*n+(x+n-1)%n])*5,dy=(height[((y+1)%n)*n+x]-height[((y+n-1)%n)*n+x])*5,v=new T.Vector3(-dx,-dy,1).normalize();normal.set([(v.x*.5+.5)*255,(v.y*.5+.5)*255,(v.z*.5+.5)*255,255],(y*n+x)*4);
 }
 const texture=(data:Uint8Array,color=false)=>{const t=new T.DataTexture(data,n,n);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;t.needsUpdate=true;return t;};
 return {map:texture(diffuse,true),normalMap:texture(normal),roughnessMap:texture(rough)};
}
