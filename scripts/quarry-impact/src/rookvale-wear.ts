import * as T from 'three';
/** World-aligned yard wear: broad gravel variation, service wheel tracks and old spills.
 * Visual only; racing and open-waypoint surfaces retain their physical properties. */
export const ROOKVALE_WEAR_SIZE=[1024,840] as const;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
function noise(x:number,z:number){
 const ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz,sx=fx*fx*(3-2*fx),sz=fz*fz*(3-2*fz);
 const hash=(a:number,b:number)=>{let h=Math.imul(a,374761393)^Math.imul(b,668265263)^7191;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;};
 return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix,iz),hash(ix+1,iz),sx),T.MathUtils.lerp(hash(ix,iz+1),hash(ix+1,iz+1),sx),sz);
}
export function rookvaleWearAt(x:number,z:number){
 const grain=noise(x/7,z/7),broad=noise(x/32,z/32),large=noise(x/95,z/95);
 const variation=clamp(grain*.25+broad*.5+large*.25);
 // Parallel forklift/service tyre paths follow the outer apron, with broken use patterns.
 const strip=(distance:number)=>1-T.MathUtils.smoothstep(distance,.18,.6);
 let tracks=0;
 for(const sign of [-1,1])for(const offset of [-.85,.85]){
  tracks=Math.max(tracks,strip(Math.abs(x-(sign*190+offset)))*(1-T.MathUtils.smoothstep(Math.abs(z),105,145)));
  tracks=Math.max(tracks,strip(Math.abs(z-(sign*145+offset)))*(1-T.MathUtils.smoothstep(Math.abs(x),140,185)));
 }
 tracks*=T.MathUtils.smoothstep(noise(x/3,z/3),.25,.7)*.8;
 // Stains cluster at warehouse approaches, not regularly across the whole venue.
 let oil=0;
 for(const bay of [-150,-90,-30,30,90,150]){
  const dx=(x-bay-3*Math.sin(bay))/7,dz=(z-151)/3.5;
  const edge=1-Math.sqrt(dx*dx+dz*dz)+.25*(grain-.5);
  oil=Math.max(oil,T.MathUtils.smoothstep(edge,0,.65)*(.45+grain*.5));
 }
 return{variation,tracks,oil};
}
export function createRookvaleWearTexture(){
 const [width,height]=ROOKVALE_WEAR_SIZE,data=new Uint8Array(width*height*4);
 for(let row=0;row<height;row++)for(let col=0;col<width;col++){
  const x=((col+.5)/width-.5)*440,z=(.5-(row+.5)/height)*360,p=rookvaleWearAt(x,z),i=(row*width+col)*4;
  data[i]=Math.round(p.variation*255);data[i+1]=Math.round(p.tracks*255);data[i+2]=Math.round(p.oil*255);data[i+3]=255;
 }
 const texture=new T.DataTexture(data,width,height);texture.name='rookvale-yard-wear';texture.flipY=false;texture.minFilter=texture.magFilter=T.LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;return texture;
}
