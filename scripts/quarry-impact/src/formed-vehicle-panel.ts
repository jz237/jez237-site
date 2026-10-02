import * as T from 'three';

/** A closed sheet with separately shaded outer skin, inner skin and edge
 * returns. Explicit sample rows can follow a stamped body line exactly. */
export function formedVehiclePanel(
  columns: readonly number[], rows: readonly number[],
  surface: (u:number,v:number)=>T.Vector3,
  outward:T.Vector3, thickness=.018,
){
  const positions:number[]=[],normals:number[]=[],uvs:number[]=[];
  const point=(u:number,v:number,inner=false)=>surface(u,v).addScaledVector(outward,inner?-thickness:0);
  const normal=(u:number,v:number)=>{
    const step=.0001;
    const du=surface(Math.min(1,u+step),v).sub(surface(Math.max(0,u-step),v));
    const dv=surface(u,Math.min(1,v+step)).sub(surface(u,Math.max(0,v-step)));
    const n=du.cross(dv).normalize();return n.dot(outward)<0?n.negate():n;
  };
  const quad=(p:T.Vector3[],uv:T.Vector2[],n:T.Vector3[])=>{
    const forward=p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0])).dot(n[0])>0;
    for(const i of forward?[0,1,2,0,2,3]:[0,2,1,0,3,2]){
      positions.push(...p[i].toArray());normals.push(...n[i].toArray());uvs.push(...uv[i].toArray());
    }
  };
  for(let y=0;y<rows.length-1;y++)for(let x=0;x<columns.length-1;x++){
    const uv=[new T.Vector2(columns[x],rows[y]),new T.Vector2(columns[x+1],rows[y]),new T.Vector2(columns[x+1],rows[y+1]),new T.Vector2(columns[x],rows[y+1])];
    const n=uv.map(p=>normal(p.x,p.y));
    quad(uv.map(p=>point(p.x,p.y)),uv,n);
    quad(uv.map(p=>point(p.x,p.y,true)),uv,n.map(p=>p.clone().negate()));
  }
  const edge=(a:T.Vector2,b:T.Vector2)=>{
    const p=[point(a.x,a.y),point(b.x,b.y),point(b.x,b.y,true),point(a.x,a.y,true)];
    const n=p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0])).normalize();
    quad(p,[a,b,b,a],[n,n,n,n]);
  };
  // Clockwise when seen from outside, so the extruded perimeter faces point
  // out of the closed sheet rather than into it.
  const a=surface(.501,.5).sub(surface(.5,.5)),b=surface(.5,.501).sub(surface(.5,.5));
  const perimeter:T.Vector2[]=[...columns.map(u=>new T.Vector2(u,0)),...rows.slice(1).map(v=>new T.Vector2(1,v)),...columns.slice(0,-1).reverse().map(u=>new T.Vector2(u,1)),...rows.slice(1,-1).reverse().map(v=>new T.Vector2(0,v))];
  if(a.cross(b).dot(outward)>0)perimeter.reverse();
  for(let i=0;i<perimeter.length;i++)edge(perimeter[i],perimeter[(i+1)%perimeter.length]);
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));return g;
}

export const panelSamples=(segments:number)=>Array.from({length:segments+1},(_,i)=>i/segments);

/** Concentric rounded contours put vertices on each edge of a shallow
 * stamping, avoiding irregular highlight bands from an undersampled inset. */
export function stampedVehiclePanel(surface:(u:number,v:number)=>T.Vector3,outward:T.Vector3,width:number,height:number,inset=.07,depth=.009,thickness=.018){
  const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
  const contour=(margin:number,radius:number,square=false)=>{
    const a=.5-margin/width,b=.5-margin/height,rx=radius/width,ry=radius/height,result:T.Vector2[]=[];
    for(let corner=0;corner<4;corner++)for(let i=0;i<=4;i++){
      const sx=corner===0||corner===3?1:-1,sy=corner<2?1:-1,angle=(corner*90+i*22.5)*Math.PI/180;
      const factor=square?1/Math.max(Math.abs(Math.cos(angle)),Math.abs(Math.sin(angle))):1;
      result.push(new T.Vector2(.5+sx*(a-rx)+Math.cos(angle)*rx*factor,.5+sy*(b-ry)+Math.sin(angle)*ry*factor));
    }
    return result;
  };
  const profiles=[{inset:0,radius:.065,depth:0,square:true},{inset,radius:.065,depth:0},{inset:inset+.018,radius:.057,depth:-depth*.5},{inset:inset+.038,radius:.050,depth:-depth}];
  const points=profiles.map(p=>contour(p.inset,p.radius,'square' in p&&p.square)),count=points[0].length;
  for(const [i,row]of points.entries())for(const uv of row){positions.push(...surface(uv.x,uv.y).addScaledVector(outward,profiles[i].depth).toArray());uvs.push(uv.x,uv.y);}
  const forward=surface(.501,.5).sub(surface(.5,.5)).cross(surface(.5,.501).sub(surface(.5,.5))).dot(outward)>0;
  const tri=(a:number,b:number,c:number)=>indices.push(...(forward?[a,b,c]:[a,c,b]));
  for(let row=0;row<profiles.length-1;row++)for(let i=0;i<count;i++){const a=row*count+i,b=row*count+(i+1)%count;tri(a,b,b+count);tri(a,b+count,a+count);}
  const centre=positions.length/3;positions.push(...surface(.5,.5).addScaledVector(outward,-depth).toArray());uvs.push(.5,.5);
  for(let i=0;i<count;i++)tri((profiles.length-1)*count+i,(profiles.length-1)*count+(i+1)%count,centre);
  const outer=new T.BufferGeometry();outer.setAttribute('position',new T.Float32BufferAttribute(positions,3));outer.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));outer.setIndex(indices);outer.computeVertexNormals();
  const flat=outer.toNonIndexed();outer.dispose();
  const p=Array.from(flat.attributes.position.array),n=Array.from(flat.attributes.normal.array),uv=Array.from(flat.attributes.uv.array);flat.dispose();
  const face=(a:T.Vector3,b:T.Vector3,c:T.Vector3,A:T.Vector2,B:T.Vector2,C:T.Vector2)=>{const normal=b.clone().sub(a).cross(c.clone().sub(a)).normalize();p.push(...a.toArray(),...b.toArray(),...c.toArray());n.push(...normal.toArray(),...normal.toArray(),...normal.toArray());uv.push(...A.toArray(),...B.toArray(),...C.toArray());};
  const innerCentre=surface(.5,.5).addScaledVector(outward,-thickness),centreUV=new T.Vector2(.5,.5);
  for(let i=0;i<count;i++){
    const a=points[0][i],b=points[0][(i+1)%count],A=surface(a.x,a.y),B=surface(b.x,b.y),Ai=A.clone().addScaledVector(outward,-thickness),Bi=B.clone().addScaledVector(outward,-thickness);
    if(forward){face(Bi,Ai,innerCentre,b,a,centreUV);face(B,A,Ai,b,a,a);face(B,Ai,Bi,b,a,b);}
    else{face(Ai,Bi,innerCentre,a,b,centreUV);face(A,B,Bi,a,b,b);face(A,Bi,Ai,a,b,a);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(n,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return g;
}
