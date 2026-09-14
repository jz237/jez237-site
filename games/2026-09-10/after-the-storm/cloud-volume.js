import * as T from './vendor/three.module.js';
// Periodic 3D density lattice: hardware filtering makes extra ray samples cheap.
const n=32,data=new Uint8Array(n*n*n);let seed=8731;
for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed>>>24;}
export const cloudVolume=new T.Data3DTexture(data,n,n,n);
cloudVolume.format=T.RedFormat;cloudVolume.type=T.UnsignedByteType;
cloudVolume.minFilter=cloudVolume.magFilter=T.LinearFilter;
cloudVolume.wrapS=cloudVolume.wrapT=cloudVolume.wrapR=T.RepeatWrapping;
cloudVolume.unpackAlignment=1;cloudVolume.needsUpdate=true;
