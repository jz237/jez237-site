import * as T from 'three';

export const martenBodyWidth=(y:number,z:number)=>{
 const t=T.MathUtils.clamp((y-.375)/.65,0,1);
 return T.MathUtils.lerp(.711,.741,t)+.058*Math.sin(t*Math.PI)-.054*T.MathUtils.smoothstep(Math.abs(z),1.52,1.96);
};
/** The nose wraps back at its outer corners instead of ending in a square wall. */
export const martenNoseZ=(x:number)=>2.014-.145*(Math.abs(x)/.735)**8;
export const martenBonnetLip=(x:number)=>.805+.030*(x/.652)**2;
export const martenFrontWingZ=(x:number,z:number)=>z+(martenNoseZ(x)-1.96)*T.MathUtils.smoothstep(z,1.54,1.96);

/** Shared vertical strips follow the rounded corners. Clipping both skins and
 * all returns at identical stations preserves closed apertures; analytic normals
 * keep broad pressings smooth without blending them into the cut edges. */
export function martenFrontPressing(){
 const shape=new T.Shape(),ys=[.327,.375,.4366,.5774,.705,.815];
 shape.moveTo(-martenBodyWidth(ys[0],1.96)-.004,ys[0]);
 for(const y of ys)shape.lineTo(martenBodyWidth(y,1.96)+.004,y);
 for(const t of [1/3,2/3,1])shape.lineTo(T.MathUtils.lerp(martenBodyWidth(.815,1.96),.652,t),.815+.02*Math.sin(t*Math.PI/2));
 for(let i=1;i<=16;i++){const x=T.MathUtils.lerp(.652,-.652,i/16);shape.lineTo(x,martenBonnetLip(x));}
 for(const t of [2/3,1/3])shape.lineTo(-T.MathUtils.lerp(martenBodyWidth(.815,1.96),.652,t),.815+.02*Math.sin(t*Math.PI/2));
 for(const y of [...ys].reverse())shape.lineTo(-martenBodyWidth(y,1.96)-.004,y);shape.closePath();
 for(const side of [-1,1]){const h=new T.Path();h.absellipse(side*.510,.678,.115,.115,0,Math.PI*2,true);shape.holes.push(h);}
 const source=new T.ExtrudeGeometry(shape,{depth:.022,bevelEnabled:false,curveSegments:9}),p=source.attributes.position,uv=source.attributes.uv,n=source.attributes.normal;
 type Vertex={p:T.Vector3;uv:T.Vector2;n:T.Vector3};
 const clip=(polygon:Vertex[],axis:'x'|'y',boundary:number,keepAbove:boolean)=>{
  const result:Vertex[]=[];
  for(let i=0;i<polygon.length;i++){
   const a=polygon[i],b=polygon[(i+1)%polygon.length],A=keepAbove?a.p[axis]>=boundary:a.p[axis]<=boundary,B=keepAbove?b.p[axis]>=boundary:b.p[axis]<=boundary;
   if(A)result.push(a);
   if(A!==B){const t=(boundary-a.p[axis])/(b.p[axis]-a.p[axis]);result.push({p:a.p.clone().lerp(b.p,t).setComponent(axis==='x'?0:1,boundary),uv:a.uv.clone().lerp(b.uv,t),n:a.n.clone().lerp(b.n,t)});}
  }
  return result.filter((a,i)=>a.p.distanceToSquared(result[(i+result.length-1)%result.length].p)>1e-20);
 };
 const half=[.40,.55,.615,.66,.695,.73,.76],xs=[...half.map(x=>-x).reverse(),...half],positions:number[]=[],normals:number[]=[],uvs:number[]=[];
 for(let i=0;i<p.count;i+=3){
  const triangle=Array.from({length:3},(_,j)=>({p:new T.Vector3().fromBufferAttribute(p,i+j),uv:new T.Vector2(uv.getX(i+j),uv.getY(i+j)),n:new T.Vector3().fromBufferAttribute(n,i+j)}));
  for(let x=0;x<xs.length-1;x++){
   const strip=clip(clip(triangle,'x',xs[x],true),'x',xs[x+1],false);if(strip.length<3)continue;
   for(const lower of [false,true]){
    const polygon=clip(strip,'y',.375,!lower);if(polygon.length<3)continue;
    for(let j=1;j<polygon.length-1;j++){
     const tri=[polygon[0],polygon[j],polygon[j+1]];if(tri[1].p.clone().sub(tri[0].p).cross(tri[2].p.clone().sub(tri[0].p)).lengthSq()<1e-18)continue;
     for(const vertex of tri){const q=vertex.p,dx=-.145*8*Math.sign(q.x)*Math.abs(q.x)**7/.735**8,dy=lower?.06/.048:0;
      positions.push(q.x,q.y,martenNoseZ(q.x)+q.z-.022-.06*T.MathUtils.clamp((.375-q.y)/.048,0,1));
      const normal=vertex.n.clone();normal.set(normal.x-dx*normal.z,normal.y-dy*normal.z,normal.z).normalize();normals.push(...normal.toArray());uvs.push(vertex.uv.x,vertex.uv.y);
     }
    }
   }
  }
 }
 source.dispose();
 // Clipping can leave micron-scale slivers where an original edge lands on a cut
 // plane. Weld positions only: the cap and edge-return normals stay distinct.
 const cells=new Map<string,number[]>(),points:T.Vector3[]=[],parents:number[]=[],epsilon=1e-5;
 const find=(i:number):number=>parents[i]===i?i:(parents[i]=find(parents[i]));
 for(let i=0;i<positions.length;i+=3){const q=new T.Vector3(positions[i],positions[i+1],positions[i+2]),cell=q.toArray().map(x=>Math.floor(x/epsilon)),id=points.length;points.push(q);parents.push(id);
  for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)for(const other of cells.get([cell[0]+x,cell[1]+y,cell[2]+z].join(','))??[])if(points[other].distanceToSquared(q)<epsilon**2){const a=find(id),b=find(other);parents[Math.max(a,b)]=Math.min(a,b);}
  const key=cell.join(',');if(!cells.has(key))cells.set(key,[]);cells.get(key)!.push(id);
 }
 const canonical=points.map((_,i)=>points[find(i)]);
 const clean:number[]=[],normal:number[]=[],tex:number[]=[],seen=new Set<string>();
 for(let i=0;i<canonical.length;i+=3){const tri=canonical.slice(i,i+3),key=tri.map(p=>p.toArray().join(',')).sort().join('|');if(seen.has(key)||tri[1].clone().sub(tri[0]).cross(tri[2].clone().sub(tri[0])).lengthSq()<1e-18)continue;seen.add(key);
  for(let j=0;j<3;j++){clean.push(...tri[j].toArray());normal.push(...normals.slice((i+j)*3,(i+j)*3+3));tex.push(...uvs.slice((i+j)*2,(i+j)*2+2));}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(clean,3));g.setAttribute('normal',new T.Float32BufferAttribute(normal,3));g.setAttribute('uv',new T.Float32BufferAttribute(tex,2));return g;
}
