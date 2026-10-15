// Numeric contact planes are independent of the high resolution scenery.
// Bin them once so terrain sampling and twelve hull probes stay inexpensive.
export function facetedSurface(id,triangles,{kind='ice',...options}={}){
 const faces=triangles.map(vertices=>{
  const [a,b,c]=vertices,dx=b[0]-a[0],dz=b[2]-a[2],ex=c[0]-a[0],ez=c[2]-a[2],det=dx*ez-dz*ex;
  if(Math.abs(det)<1e-9)throw new Error('Degenerate surface '+id);
  const sx=((b[1]-a[1])*ez-(c[1]-a[1])*dz)/det,sz=(dx*(c[1]-a[1])-ex*(b[1]-a[1]))/det;
  return {vertices,a,dx,dz,ex,ez,det,sx,sz,minX:Math.min(a[0],b[0],c[0]),maxX:Math.max(a[0],b[0],c[0]),minZ:Math.min(a[2],b[2],c[2]),maxZ:Math.max(a[2],b[2],c[2])};
 });
 const bins=new Map(),size=12;
 for(const face of faces)for(let x=Math.floor(face.minX/size);x<=Math.floor(face.maxX/size);x++)for(let z=Math.floor(face.minZ/size);z<=Math.floor(face.maxZ/size);z++){
  const key=x+','+z;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(face);
 }
 function sample(x,z){let hit=null;
  for(const f of bins.get(Math.floor(x/size)+','+Math.floor(z/size))||[]){
   const px=x-f.a[0],pz=z-f.a[2],u=(px*f.ez-pz*f.ex)/f.det,v=(f.dx*pz-f.dz*px)/f.det;
   if(u< -1e-7||v< -1e-7||u+v>1+1e-7)continue;
   const height=f.a[1]+f.sx*px+f.sz*pz;if(!hit||height>hit.height)hit={height,sx:f.sx,sz:f.sz};
  }
  return hit;
 }
 return {id,kind,...options,triangles,sample,heightAt(x,z){return sample(x,z)?.height??null;}};
}

export function surfaceSample(surface,x,z){
 if(surface.sample)return surface.sample(x,z);
 return {height:surface.height,sx:0,sz:0};
}

// Independently tessellated scenery follows the same planes. This creates
// metre-scale detail without importing the original game's rendered mesh.
export function surfaceMeshPositions(triangles,maxEdge=1.5){
 const vertices=[];
 for(const [a,b,c] of triangles){
  const distance=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]);
  const n=Math.max(1,Math.min(64,Math.ceil(Math.max(distance(a,b),distance(a,c),distance(b,c))/maxEdge)));
  const point=(i,j)=>a.map((v,k)=>v+(b[k]-v)*i/n+(c[k]-v)*j/n);
  for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){
   vertices.push(...point(i,j),...point(i+1,j),...point(i,j+1));
   if(j<n-i-1)vertices.push(...point(i+1,j),...point(i+1,j+1),...point(i,j+1));
  }
 }
 return new Float32Array(vertices);
}
