import * as T from 'three';

type Ring={width:number;height:number;radius:number;depth:number;taper?:number};

// Equal-length perimeter samples let the steel pressing, rubber rebate and
// glazing share an aperture. This is real geometry, including the return lip.
function perimeter(r:Ring){
 const points:T.Vector2[]=[],w=r.width/2,h=r.height/2;
 for(let corner=0;corner<4;corner++){
  const sx=corner===0||corner===3?1:-1,sy=corner<2?1:-1;
  for(let i=0;i<=8;i++){
   const angle=(corner*90+i*90/8)*Math.PI/180;
   const y=sy*(h-r.radius)+Math.sin(angle)*r.radius;
   const x=(sx*(w-r.radius)+Math.cos(angle)*r.radius)*(1-(r.taper??0)*(y/h+1)/2/r.width);
   points.push(new T.Vector2(x,y));
  }
 }
 return points;
}

function pressing(rings:Ring[],map:(x:number,y:number,depth:number)=>T.Vector3,closed=false){
 const positions:number[]=[],uv:number[]=[],indices:number[]=[];
 const count=perimeter(rings[0]).length;
 for(const ring of rings)for(const p of perimeter(ring)){positions.push(...map(p.x,p.y,ring.depth).toArray());uv.push(p.x+.5,p.y+.5);}
 for(let r=0;r<rings.length-1;r++)for(let i=0;i<count;i++){
  const a=r*count+i,b=r*count+(i+1)%count,c=b+count,d=a+count;
  // Outward face is towards the back of the vehicle (-Z).
  indices.push(a,c,b,a,d,c);
 }
 if(closed){const center=positions.length/3;positions.push(...map(0,0,rings.at(-1)!.depth).toArray());uv.push(.5,.5);
  const first=(rings.length-1)*count;for(let i=0;i<count;i++)indices.push(first+i,center,first+(i+1)%count);
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g.toNonIndexed();
}

/** Pressed, slightly crowned rear cab with a recessed rounded window. The
 * outer perimeter retains the donor cut and existing side-return locations. */
export function addUtilityCabPressing(root:T.Group,paint:T.Material,glass:T.Material,seal:T.Material){
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{const mesh=new T.Mesh(g,m);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;};
 const cab=(x:number,y:number,depth:number)=>{
  y+=1.23;
  return new T.Vector3(x,y,-.91+(y-1.01)*.20+depth);
 };
 add('panel_CabRearUpper',pressing([
  {width:1.47,height:.44,radius:.002,depth:0,taper:.23},
  {width:1.39,height:.405,radius:.03,depth:-.011,taper:.21},
  {width:1.205,height:.32,radius:.054,depth:-.017,taper:.105},
  {width:1.16,height:.277,radius:.044,depth:.003,taper:.10},
 ],cab),paint);
 add('panel_RearWindowSeal',pressing([
  {width:1.165,height:.282,radius:.045,depth:.000,taper:.10},
  {width:1.148,height:.265,radius:.042,depth:-.003,taper:.099},
  {width:1.120,height:.237,radius:.034,depth:.009,taper:.097},
 ],cab),seal);
 add('glass_Rear',pressing([
  {width:1.122,height:.239,radius:.034,depth:.010,taper:.097},
  {width:1.08,height:.205,radius:.03,depth:.011,taper:.09},
 ],cab,true),glass).castShadow=false;
}

/** Rear-facing stamped recesses, with a continuous skin rather than boxes
 * stuck over a flat panel. Used for the cargo headwall and outer tailgate. */
export function utilityStampedPanel(width:number,height:number,depth:number){
 return pressing([
  {width,height,radius:.012,depth:0},
  {width:width-.075,height:height-.055,radius:.03,depth:-.003},
  {width:width-.12,height:height-.095,radius:.035,depth},
  {width:width-.18,height:height-.14,radius:.028,depth:depth+.002},
 ],(x,y,z)=>new T.Vector3(x,y,z),true);
}
