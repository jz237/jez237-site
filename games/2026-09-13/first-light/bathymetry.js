// The lake bed as data: an RG16-encoded height texture (the exact encoding the water shaders decode),
// shore distance for every cell (openness in blue for water, bank distance in alpha for land), and CPU
// sampling that shares the analytic cove so physics and pixels agree.
import {coveHeight} from './lake-shape.js';
export const TERRAIN_SPAN=600;
// height = -16 + (R*256+G)/257*100 with R,G in 0..1, i.e. 0.0015 m steps over -16..84 m.
export function encodeHeight(h){const n=Math.max(0,Math.min(257,(h+16)/100*257))*255;const r=Math.min(255,Math.floor(n/256)),g=Math.max(0,Math.min(255,Math.round(n-r*256)));return [r,g];}
export function decodeHeight(r,g){return -16+(r/255*256+g/255)/257*100;}
export function buildTerrainData(res=512,span=TERRAIN_SPAN,heightFn=coveHeight){
 const heights=new Float32Array(res*res),data=new Uint8Array(res*res*4),cell=span/res;
 for(let j=0;j<res;j++)for(let i=0;i<res;i++){const x=(i/(res-1)-.5)*span,z=(j/(res-1)-.5)*span;heights[j*res+i]=heightFn(x,z);}
 // Chamfer distance (metres) from every cell to the waterline, capped at 255 m, on both sides of it.
 const INF=1e9,dist=new Float32Array(res*res);
 for(let j=0;j<res;j++)for(let i=0;i<res;i++){const k=j*res+i,land=heights[k]>=0;let shore=false;
  for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const ii=i+di,jj=j+dj;if(ii<0||jj<0||ii>=res||jj>=res)continue;if((heights[jj*res+ii]>=0)!==land)shore=true;}
  dist[k]=shore?0:INF;}
 const relax=(k,n,cost)=>{if(dist[n]+cost<dist[k])dist[k]=dist[n]+cost;};
 for(let j=0;j<res;j++)for(let i=0;i<res;i++){const k=j*res+i;if(i>0)relax(k,k-1,1);if(j>0){relax(k,k-res,1);if(i>0)relax(k,k-res-1,1.414);if(i<res-1)relax(k,k-res+1,1.414);}}
 for(let j=res-1;j>=0;j--)for(let i=res-1;i>=0;i--){const k=j*res+i;if(i<res-1)relax(k,k+1,1);if(j<res-1){relax(k,k+res,1);if(i<res-1)relax(k,k+res+1,1.414);if(i>0)relax(k,k+res-1,1.414);}}
 const openness=new Float32Array(res*res),shoreDist=new Float32Array(res*res);
 for(let k=0;k<res*res;k++){const m=Math.min(255,dist[k]>=INF?255:dist[k]*cell),land=heights[k]>=0;shoreDist[k]=m;openness[k]=land?0:m;const [r,g]=encodeHeight(heights[k]);data[k*4]=r;data[k*4+1]=g;data[k*4+2]=land?0:Math.round(m);data[k*4+3]=land?Math.round(m):255;}
 return {res,span,heights,openness,shoreDist,data,cell};
}
export function sampleGrid(grid,x,z){
 const {res,span}=grid,fx=(x/span+.5)*(res-1),fz=(z/span+.5)*(res-1);
 const i=Math.max(0,Math.min(res-2,Math.floor(fx))),j=Math.max(0,Math.min(res-2,Math.floor(fz))),tx=Math.max(0,Math.min(1,fx-i)),tz=Math.max(0,Math.min(1,fz-j));
 const a=grid[j*res+i],b=grid[j*res+i+1],c=grid[(j+1)*res+i],d=grid[(j+1)*res+i+1];
 return (a*(1-tx)+b*tx)*(1-tz)+(c*(1-tx)+d*tx)*tz;
}
export function makeBathymetry(res=512){
 const t=buildTerrainData(res);
 const open=Object.assign(t.openness,{res:t.res,span:t.span}),shore=Object.assign(t.shoreDist,{res:t.res,span:t.span});
 return {...t,height:(x,z)=>coveHeight(x,z),depth:(x,z)=>Math.max(0,-coveHeight(x,z)),openness:(x,z)=>sampleGrid(open,x,z),shoreDistance:(x,z)=>sampleGrid(shore,x,z)};
}
