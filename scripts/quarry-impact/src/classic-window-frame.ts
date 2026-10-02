import * as T from 'three';

type Contour={inset:number;radius:number;depth:number};

/** A rounded aperture cut into a closed sheet-metal surround. The pane, seal
 * and brightwork share the aperture so there are no square glass corners or
 * daylight seams between independently authored strips. */
export function classicWindowFrame(corners:T.Vector3[],side:number){
 const width=(corners[0].distanceTo(corners[1])+corners[3].distanceTo(corners[2]))/2;
 const height=(corners[0].distanceTo(corners[3])+corners[1].distanceTo(corners[2]))/2;
 const normal=corners[1].clone().sub(corners[0]).cross(corners[3].clone().sub(corners[0])).normalize().multiplyScalar(side);
 const contour=({inset,radius}:Contour)=>{
  const points:T.Vector2[]=[],a=.5-inset/width,b=.5-inset/height,rx=radius/width,ry=radius/height;
  for(let c=0;c<4;c++)for(let i=0;i<=4;i++){
   const sx=c===0||c===3?1:-1,sy=c<2?1:-1,angle=(c*90+i*22.5)*Math.PI/180;
   points.push(new T.Vector2(.5+sx*(a-rx)+Math.cos(angle)*rx,.5+sy*(b-ry)+Math.sin(angle)*ry));
  }
  return points;
 };
 const point=(p:T.Vector2,depth:number)=>corners[0].clone().lerp(corners[1],p.x)
  .lerp(corners[3].clone().lerp(corners[2],p.x),p.y)
  .addScaledVector(normal,depth);
 const geometry=(rows:{points:T.Vector2[];depth:number}[],fill=false,centreDepth?:number)=>{
  const positions:number[]=[],uv:number[]=[],indices:number[]=[],count=rows[0].points.length;
  for(const row of rows)for(const p of row.points){positions.push(...point(p,row.depth).toArray());uv.push(p.x,p.y);}
  const tri=(a:number,b:number,c:number)=>indices.push(...(side>0?[a,b,c]:[a,c,b]));
  for(let r=0;r<rows.length-1;r++)for(let i=0;i<count;i++){
   const a=r*count+i,b=r*count+(i+1)%count,c=b+count,d=a+count;tri(a,b,c);tri(a,c,d);
  }
  if(fill){const centre=positions.length/3;positions.push(...point(new T.Vector2(.5,.5),centreDepth??rows.at(-1)!.depth).toArray());uv.push(.5,.5);
   const first=(rows.length-1)*count;for(let i=0;i<count;i++)tri(first+i,first+(i+1)%count,centre);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=g.toNonIndexed();g.dispose();return flat;
 };
 const rings=(profile:Contour[])=>geometry(profile.map(c=>({points:contour(c),depth:c.depth})));
 const outer={inset:0,radius:.002,depth:0},inner={inset:.026,radius:.035,depth:0};
 const aperture=contour({inset:.035,radius:.030,depth:0});
 return{
  frame:rings([outer,inner,{...inner,depth:-.023},{...outer,depth:-.023},outer]),
  seal:rings([{inset:.024,radius:.037,depth:.001},{inset:.035,radius:.030,depth:-.010}]),
  trim:rings([{inset:.019,radius:.042,depth:.0015},{inset:.023,radius:.038,depth:.0015}]),
  glass:geometry([1,.75,.5,.25].map(scale=>({points:aperture.map(p=>p.clone().subScalar(.5).multiplyScalar(scale).addScalar(.5)),depth:-.010+.004*(1-scale*scale)})),true,-.006),
 };
}
