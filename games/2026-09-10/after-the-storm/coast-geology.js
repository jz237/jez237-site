const fract=x=>x-Math.floor(x),mix=(a,b,t)=>a+(b-a)*t;
export function geologyNoise(x,z,seed=0){
 const ix=Math.floor(x),iz=Math.floor(z);let u=fract(x),v=fract(z);u=u*u*(3-2*u);v=v*v*(3-2*v);
 const h=(a,b)=>fract(Math.sin(a*127.1+b*311.7+seed*19.31)*43758.5453);
 return mix(mix(h(ix,iz),h(ix+1,iz),u),mix(h(ix,iz+1),h(ix+1,iz+1),u),v);
}
// Domain-warped ridges and gullies break the silhouette at several scales.
// This is scenery outside the racing terrain; it never changes collision depth.
export function islandElevation(u,v,seed,height=120){
 const n=(x,z)=>geologyNoise(x,z,seed),radius=Math.hypot(u,v);
 const rim=1-radius+(n(u*5+9,v*5)-.5)*.11;
 if(rim<=0)return -12;
 const x=u+(n(u*2+31,v*2)-.5)*.30,z=v+(n(u*2,v*2+47)-.5)*.30;
 const crest=Math.exp(-((x+.14)**2*1.8+(z-.05)**2*3.5));
 let ridges=0,weight=.55,scale=2.8;
 for(let i=0;i<4;i++){const ridge=1-Math.abs(n(x*scale+i*17,z*scale+i*9)*2-1);ridges+=ridge*ridge*weight;weight*=.28;scale*=2.03;}
 const flank=Math.max(0,1-radius*radius)**.62;
 return -12+height*flank*(.24+crest*.43+ridges*.44);
}
