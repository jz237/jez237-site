type SurfaceData={positions:Float32Array;indices:Uint32Array};
type Triangle={x0:number;y0:number;z0:number;x1:number;y1:number;z1:number;x2:number;y2:number;z2:number;det:number};

/** An XZ spatial index for exact triangle seating and padded scatter exclusion. */
export function createSurfaceSampler(data:SurfaceData,cellSize=8){
  if(!Number.isFinite(cellSize)||cellSize<=0)throw new RangeError('Surface index cell size must be positive and finite');
  const cells=new Map<string,Triangle[]>(),triangles:Triangle[]=[];
  const key=(x:number,z:number)=>Math.floor(x/cellSize)+','+Math.floor(z/cellSize);
  for(let i=0;i<data.indices.length;i+=3){
    const [a,b,c]=[data.indices[i]*3,data.indices[i+1]*3,data.indices[i+2]*3],p=data.positions;
    const t={x0:p[a],y0:p[a+1],z0:p[a+2],x1:p[b],y1:p[b+1],z1:p[b+2],x2:p[c],y2:p[c+1],z2:p[c+2],det:0};
    t.det=(t.z1-t.z2)*(t.x0-t.x2)+(t.x2-t.x1)*(t.z0-t.z2);
    if(Math.abs(t.det)<1e-10)continue;
    triangles.push(t);
    const minX=Math.floor(Math.min(t.x0,t.x1,t.x2)/cellSize),maxX=Math.floor(Math.max(t.x0,t.x1,t.x2)/cellSize);
    const minZ=Math.floor(Math.min(t.z0,t.z1,t.z2)/cellSize),maxZ=Math.floor(Math.max(t.z0,t.z1,t.z2)/cellSize);
    for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++){
      const id=x+','+z,list=cells.get(id);if(list)list.push(t);else cells.set(id,[t]);
    }
  }
  const weights=(t:Triangle,x:number,z:number)=>{
    const a=((t.z1-t.z2)*(x-t.x2)+(t.x2-t.x1)*(z-t.z2))/t.det;
    const b=((t.z2-t.z0)*(x-t.x2)+(t.x0-t.x2)*(z-t.z2))/t.det;
    return [a,b,1-a-b];
  };
  const inside=(w:number[])=>w.every(n=>n>=-1e-7&&n<=1+1e-7);
  const height=(x:number,z:number):number|undefined=>{
    if(!Number.isFinite(x)||!Number.isFinite(z))return undefined;
    let found:number|undefined;
    for(const t of cells.get(key(x,z))??[]){const w=weights(t,x,z);if(inside(w)){const y=w[0]*t.y0+w[1]*t.y1+w[2]*t.y2;found=found===undefined?y:Math.max(found,y);}}
    return found;
  };
  const edgeDistanceSquared=(x:number,z:number,ax:number,az:number,bx:number,bz:number)=>{
    const dx=bx-ax,dz=bz-az,length=dx*dx+dz*dz,t=length?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/length)):0;
    return (x-ax-t*dx)**2+(z-az-t*dz)**2;
  };
  const overlaps=(x:number,z:number,padding=0)=>{
    if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(padding))return false;
    if(padding<=0)return height(x,z)!==undefined;
    const seen=new Set<Triangle>(),radiusSquared=padding*padding;
    for(let ix=Math.floor((x-padding)/cellSize);ix<=Math.floor((x+padding)/cellSize);ix++)
      for(let iz=Math.floor((z-padding)/cellSize);iz<=Math.floor((z+padding)/cellSize);iz++)
        for(const t of cells.get(ix+','+iz)??[]){
          if(seen.has(t))continue;seen.add(t);
          if(inside(weights(t,x,z))||Math.min(edgeDistanceSquared(x,z,t.x0,t.z0,t.x1,t.z1),edgeDistanceSquared(x,z,t.x1,t.z1,t.x2,t.z2),edgeDistanceSquared(x,z,t.x2,t.z2,t.x0,t.z0))<=radiusSquared)return true;
        }
    return false;
  };
  return {height,overlaps,triangleCount:triangles.length};
}
