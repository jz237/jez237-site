// Dimensions are metres, mass is kg. The painted blueprint is concept art;
// Imperial Star's handling is a reduced seakeeping model, not a certified design.
export const VESSELS={
  schooner:{id:'schooner',name:'Schooner',asset:'schooner',length:52,hullLength:47,beam:9.3,draft:6.65,masts:3,mass:320000,scale:[1,1,1],cameraScale:1,gm:2.1},
  imperial:{id:'imperial',name:'Imperial Star',asset:'imperial-star',length:122,hullLength:105,beam:18.5,draft:7.5,masts:5,mass:5800000,scale:[105/47,7.5/3.15,18.5/9.3],cameraScale:2.2,gm:2.4}
};
export const vessel=VESSELS[new URLSearchParams(globalThis.location?.search||'').get('ship')]||VESSELS.schooner;
export const [SX,SY,SZ]=vessel.scale;
export const imperial=vessel.id==='imperial';
export const DOMAIN=[48*SX,10*SZ];
export const canonicalSheer=x=>2.6+(x>0?.0018:.0007)*x*x;
export function canonicalBeam(x){return x>=-2?4.65*Math.pow(Math.max(0,1-Math.pow(Math.max(0,(x+2)/25.5),2.1)),.7):4.65*(1-.4*Math.pow(Math.min(1,(-2-x)/21.5),2.4));}
export const sheer=x=>canonicalSheer(x/SX)*SY;
export const halfBeam=x=>canonicalBeam(x/SX)*SZ;
export function deckHeight(x,z){
  const b=Math.max(halfBeam(x)*.995,.01),t=Math.max(0,Math.min(1,(-x-29)/6));
  return sheer(x)+.055*SY*(1-z*z/(b*b))+(imperial?3*t*t*(3-2*t):0);
}
export const deckStations=imperial?{Helm:[-43,0,0,-.08],Bow:[43,0,0,-.04],Stern:[-49,3.5,Math.PI,-.05]}:{Helm:[-17.7,0,0,-.1],Bow:[18,0,0,-.03],Stern:[-22.6,2.8,Math.PI,-.05]};
export const glslVec=a=>'vec'+a.length+'('+a.map(x=>Number(x).toFixed(8)).join(',')+')';
export const glslFloat=x=>Number(x).toFixed(8);
