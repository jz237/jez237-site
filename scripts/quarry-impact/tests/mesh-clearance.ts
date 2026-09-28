type Point=[number,number,number];
type Mesh={positions:Float32Array;indices:Uint32Array};
type Triangle={id:number;points:[Point,Point,Point];bounds:[number,number,number,number]};
function triangles(mesh:Mesh):Triangle[]{
  const result:Triangle[]=[];
  for(let i=0;i<mesh.indices.length;i+=3){
    const points=Array.from(mesh.indices.slice(i,i+3),n=>Array.from(mesh.positions.slice(n*3,n*3+3)) as Point) as [Point,Point,Point];
    result.push({id:i/3,points,bounds:[Math.min(...points.map(p=>p[0])),Math.max(...points.map(p=>p[0])),Math.min(...points.map(p=>p[2])),Math.max(...points.map(p=>p[2]))]});
  }
  return result;
}
function height(t:Triangle,x:number,z:number){
  const [a,b,c]=t.points,det=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);
  const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/det;
  const v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/det;
  return u*a[1]+v*b[1]+(1-u-v)*c[1];
}
function overlap(a:Triangle,b:Triangle){
  // Carry the full3D vertex while clipping against each terrain triangle's
  // vertical prism. This also handles vertical faces and folded/overhanging
  // walls, where surface height is not a single-valued function of XZ.
  let polygon:Point[]=a.points.map(p=>[...p]);
  const [p,q,r]=b.points,orientation=Math.sign((q[0]-p[0])*(r[2]-p[2])-(q[2]-p[2])*(r[0]-p[0]));
  for(let edge=0;edge<3&&polygon.length;edge++){
    const from=b.points[edge],to=b.points[(edge+1)%3];
    const distance=(point:Point)=>orientation*((to[0]-from[0])*(point[2]-from[2])-(to[2]-from[2])*(point[0]-from[0]));
    const clipped:Point[]=[];
    for(let i=0;i<polygon.length;i++){
      const start=polygon[i],end=polygon[(i+1)%polygon.length],ds=distance(start),de=distance(end),insideS=ds>=-1e-9,insideE=de>=-1e-9;
      if(insideS)clipped.push(start);
      if(insideS!==insideE){const t=ds/(ds-de);clipped.push(start.map((n,j)=>n+(end[j]-n)*t) as Point);}
    }
    polygon=clipped;
  }
  return polygon;
}

/** Clip each3D surface triangle by every overlapping terrain triangle's
 * vertical prism. Height minus the terrain plane is affine on that polygon,
 * so its minimum lies at a clipped vertex, even for vertical/overhanging faces.
 * No sampling spacing or single-valued surface assumption is involved.
 */
export function exactMinimumClearance(surface:Mesh,base:Mesh){
  const cells=new Map<string,Triangle[]>(),size=8;
  for(const t of triangles(base)){
    const [minX,maxX,minZ,maxZ]=t.bounds;
    for(let x=Math.floor(minX/size);x<=Math.floor(maxX/size);x++)for(let z=Math.floor(minZ/size);z<=Math.floor(maxZ/size);z++){
      const key=x+','+z,found=cells.get(key);if(found)found.push(t);else cells.set(key,[t]);
    }
  }
  let minimum=Infinity,overlapVertices=0,coveredTriangles=0,worst:{triangle:number;baseTriangle:number;point:Point;baseHeight:number}|undefined;
  for(const t of triangles(surface)){
    const [minX,maxX,minZ,maxZ]=t.bounds,candidates=new Set<Triangle>();let covered=false;
    for(let x=Math.floor(minX/size);x<=Math.floor(maxX/size);x++)for(let z=Math.floor(minZ/size);z<=Math.floor(maxZ/size);z++)for(const b of cells.get(x+','+z)??[])candidates.add(b);
    for(const b of candidates){
      if(b.bounds[1]<minX||b.bounds[0]>maxX||b.bounds[3]<minZ||b.bounds[2]>maxZ)continue;
      const polygon=overlap(t,b);if(polygon.length)covered=true;
      for(const [x,y,z] of polygon){
        const by=height(b,x,z),delta=y-by;overlapVertices++;
        if(delta<minimum){minimum=delta;worst={triangle:t.id,baseTriangle:b.id,point:[x,y,z],baseHeight:by};}
      }
    }
    if(covered)coveredTriangles++;
  }
  return {minimum,overlapVertices,coveredTriangles,worst};
}
