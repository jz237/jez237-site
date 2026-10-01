/** Periodic, coherent billow noise. Avoid independent bright voxel speckles. */
export function fireNoise(size=64){
  let state=917;const random=()=>{state=(Math.imul(state,1664525)+1013904223)|0;return(state>>>0)/4294967296;};
  const layers=[8,16,32].map(n=>({n,values:Float32Array.from({length:n*n*n},random)})),out=new Uint8Array(size**3);
  const smooth=(x:number)=>x*x*(3-2*x),mix=(a:number,b:number,t:number)=>a+(b-a)*t;
  for(let z=0;z<size;z++)for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    let sum=0;layers.forEach(({n,values},i)=>{
      const fx=x/size*n,fy=y/size*n,fz=z/size*n,ix=Math.floor(fx),iy=Math.floor(fy),iz=Math.floor(fz),sx=smooth(fx-ix),sy=smooth(fy-iy),sz=smooth(fz-iz);
      const v=(dx:number,dy:number,dz:number)=>values[((iz+dz)%n*n+(iy+dy)%n)*n+(ix+dx)%n];
      const a=mix(mix(v(0,0,0),v(1,0,0),sx),mix(v(0,1,0),v(1,1,0),sx),sy),b=mix(mix(v(0,0,1),v(1,0,1),sx),mix(v(0,1,1),v(1,1,1),sx),sy);
      sum+=mix(a,b,sz)*[.68,.24,.08][i];
    });out[(z*size+y)*size+x]=Math.round(sum*255);
  }return out;
}
