// Finite-difference wave equation on a moving 72 m patch. Solid cell faces use
// zero normal flow, reflecting waves; the outer edge absorbs outgoing energy.
// Rendering samples these exact heights, not an independent decorative solver.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export let activeLocalWater=null;
export function setLocalWater(field){activeLocalWater=field||null;}
export function createLocalWater(solid,{size=96,cell=.75}={}){const damping=Float32Array.from({length:size*size},(_,k)=>Math.exp(-1/60*(.62+Math.max(0,1-Math.min(k%size,Math.floor(k/size),size-1-k%size,size-1-Math.floor(k/size))/7)*8)));return {damping,size,cell,x:NaN,z:NaN,h:new Float32Array(size*size),v:new Float32Array(size*size),mask:new Uint8Array(size*size),scratchH:new Float32Array(size*size),scratchV:new Float32Array(size*size),scratchMask:new Uint8Array(size*size),solid,elapsed:0,sourceTime:0,version:0,energy:0};}
export function moveLocalWater(f,x,z){
 const n=f.size,c=f.cell,nx=Math.floor(x/c)-Math.floor(n/2),nz=Math.floor(z/c)-Math.floor(n/2),ox=Math.round(f.x/c),oz=Math.round(f.z/c);
 if(nx===ox&&nz===oz)return;
 const sx=nx-ox,sz=nz-oz,valid=Number.isFinite(f.x)&&Math.abs(sx)<n&&Math.abs(sz)<n;
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){const k=j*n+i,a=i+sx,b=j+sz,keep=valid&&a>=0&&a<n&&b>=0&&b<n,old=b*n+a;
  f.scratchH[k]=keep?f.h[old]:0;f.scratchV[k]=keep?f.v[old]:0;
  f.scratchMask[k]=keep?f.mask[old]:f.solid((nx+i)*c,(nz+j)*c)?1:0;
 }
 [f.h,f.scratchH]=[f.scratchH,f.h];[f.v,f.scratchV]=[f.scratchV,f.v];[f.mask,f.scratchMask]=[f.scratchMask,f.mask];f.x=nx*c;f.z=nz*c;f.version++;
}
export function disturbLocalWater(f,x,z,impulse,radius=1.1){
 const n=f.size,c=f.cell,cx=(x-f.x)/c,cz=(z-f.z)/c,r=Math.ceil(radius*2/c);
 for(let j=Math.max(1,Math.floor(cz-r));j<Math.min(n-1,cz+r);j++)for(let i=Math.max(1,Math.floor(cx-r));i<Math.min(n-1,cx+r);i++){
  const k=j*n+i;if(f.mask[k])continue;const d=((i-cx)**2+(j-cz)**2)*c*c/(radius*radius);
  // A zero-mean displacement impulse avoids steadily raising the local sea.
  f.v[k]+=impulse*(1-d*.5)*Math.exp(-d*.5);
 }
}
export function sampleLocalWater(f,x,z){if(!f||!Number.isFinite(f.x))return 0;const u=(x-f.x)/f.cell,v=(z-f.z)/f.cell,i=Math.floor(u),j=Math.floor(v),n=f.size;if(i<0||j<0||i>=n-1||j>=n-1)return 0;const a=u-i,b=v-j,k=j*n+i;return (f.h[k]*(1-a)+f.h[k+1]*a)*(1-b)+(f.h[k+n]*(1-a)+f.h[k+n+1]*a)*b;}
export const localWaterHeight=(x,z)=>sampleLocalWater(activeLocalWater,x,z);
export function stepLocalWater(f,dt){if(dt<=0||!Number.isFinite(f.x))return;f.elapsed+=Math.min(dt,.1);const n=f.size,c2=16/(f.cell*f.cell),step=1/60;
 while(f.elapsed>=step){let energy=0;for(let j=0;j<n;j++)for(let i=0;i<n;i++){const k=j*n+i,h=f.h[k];if(f.mask[k]||i===0||j===0||i===n-1||j===n-1){f.scratchV[k]=0;continue;}
   const lap=(f.mask[k-1]?h:f.h[k-1])+(f.mask[k+1]?h:f.h[k+1])+(f.mask[k-n]?h:f.h[k-n])+(f.mask[k+n]?h:f.h[k+n])-h*4;
   const damp=f.damping[k];
   f.scratchV[k]=clamp((f.v[k]+lap*c2*step)*damp,-2,2);
  }
  for(let k=0;k<n*n;k++){f.v[k]=f.scratchV[k];f.h[k]=f.mask[k]?0:clamp(f.h[k]+f.v[k]*step,-.32,.32);energy+=f.h[k]*f.h[k];}f.energy=energy;f.elapsed-=step;f.version++;
 }
}
export function driveLocalWater(f,racers,dt){if(dt<=0)return;moveLocalWater(f,racers[0].x,racers[0].z);f.sourceTime+=dt;
 if(f.sourceTime>=.1){f.sourceTime%=.1;for(const [index,r] of racers.entries()){const h=r.hydro;if(r.speed<4||h.wet<.1||r.onIce)continue;const fx=Math.sin(r.heading),fz=Math.cos(r.heading),power=Math.min(1.4,r.speed/20)*h.wet;
   disturbLocalWater(f,r.x-fx*2.5,r.z-fz*2.5,power*.8,1.1);
   const last=f.landings??=(new Map());if(h.landingId!==(last.get(index)||0)){last.set(index,h.landingId);disturbLocalWater(f,r.x,r.z,Math.min(2,h.impact*.15),1.6);}
  }}stepLocalWater(f,dt);
}
