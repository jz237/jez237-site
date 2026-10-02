import * as T from 'three';
import {toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';

const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;

/** The windscreen wraps across the car; the cowl and roof header use the same
 * section so their metal edges follow the glass instead of leaving gaps. */
export function martenWindscreenBow(x:number,y=1.025){
 const half=y<=1.443?mix(.741,.596,T.MathUtils.clamp((y-1.025)/.418,0,1)):mix(.596,.608,T.MathUtils.clamp((y-1.443)/.035,0,1));
 return .042*Math.max(0,1-(x/half)**2);
}

export function martenRoofSurface(u:number,t:number){
 const x=(u*2-1)*.608,crown=1-(u*2-1)**2;
 return v(x,1.478+crown*(.020*t+.039*Math.sin(t*Math.PI)),mix(-.78,.11,t)+martenWindscreenBow(x,1.478)*T.MathUtils.smoothstep(t,.45,1));
}

/** A rolled front header turns from the raked screen into the crowned roof. */
export function martenFrontHeaderSurface(u:number,t:number){
 const s=u*2-1,x=s*mix(.596,.608,t),top=1.478+.020*(1-s*s),q=1-t;
 const y=q*q*q*1.443+3*q*q*t*1.461+3*q*t*t*(top-.002)+t*t*t*top;
 const z=q*q*q*.14+3*q*q*t*.1193+3*q*t*t*.124+t*t*t*.11;
 return v(x,y,z+martenWindscreenBow(x,mix(1.443,1.478,t)));
}

/** Marten-only front aperture. Extra stations across the long edges let the
 * surround, seal and pane share the windscreen's wrap without flat chord gaps.
 * The other five windows retain the established classic-window geometry. */
export function martenWindscreen(){
 const corners=[v(-.741,1.025,.62),v(.741,1.025,.62),v(.596,1.443,.14),v(-.596,1.443,.14)],normal=v(0,.48,.418).normalize();
 const width=(1.482+1.192)/2,height=corners[0].distanceTo(corners[3]);
 const contour=(inset:number,radius:number)=>{
  const points:T.Vector2[]=[],a=.5-inset/width,b=.5-inset/height,rx=radius/width,ry=radius/height;
  for(let c=0;c<4;c++){
   const sx=c===0||c===3?1:-1,sy=c<2?1:-1;
   for(let i=0;i<=3;i++){const angle=(c*90+i*30)*Math.PI/180;points.push(new T.Vector2(.5+sx*(a-rx)+Math.cos(angle)*rx,.5+sy*(b-ry)+Math.sin(angle)*ry));}
   if(c===0||c===2){const from=points.at(-1)!,to=new T.Vector2(.5-sx*(a-rx),from.y);for(let i=1;i<=6;i++)points.push(from.clone().lerp(to,i/7));}
  }
  return points;
 };
 const point=(p:T.Vector2,depth:number)=>{
  const q=corners[0].clone().lerp(corners[1],p.x).lerp(corners[3].clone().lerp(corners[2],p.x),p.y).addScaledVector(normal,depth);
  q.z+=martenWindscreenBow(q.x,q.y);return q;
 };
 const geometry=(rows:{points:T.Vector2[];depth:number}[],fill=false,creased=false)=>{
  const positions:number[]=[],uv:number[]=[],indices:number[]=[],count=rows[0].points.length;
  for(const row of rows)for(const p of row.points){positions.push(...point(p,row.depth).toArray());uv.push(p.x,p.y);}
  for(let r=0;r<rows.length-1;r++)for(let i=0;i<count;i++){const a=r*count+i,b=r*count+(i+1)%count,c=b+count,d=a+count;indices.push(a,b,c,a,c,d);}
  if(fill){const centre=positions.length/3;positions.push(...point(new T.Vector2(.5,.5),-.006).toArray());uv.push(.5,.5);const first=(rows.length-1)*count;for(let i=0;i<count;i++)indices.push(first+i,first+(i+1)%count,centre);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=creased?toCreasedNormals(g,Math.PI/3):g.toNonIndexed();g.dispose();return flat;
 };
 const ring=(profile:number[][])=>geometry(profile.map(([inset,radius,depth])=>({points:contour(inset,radius),depth})),false,profile.length>2),aperture=contour(.035,.030);
 return{
  frame:ring([[0,.002,0],[.026,.035,0],[.026,.035,-.023],[0,.002,-.023],[0,.002,0]]),
  seal:ring([[.024,.037,.001],[.035,.030,-.010]]),
  trim:ring([[.019,.042,.0015],[.023,.038,.0015]]),
  glass:geometry([1,.75,.5,.25].map(scale=>({points:aperture.map(p=>p.clone().subScalar(.5).multiplyScalar(scale).addScalar(.5)),depth:-.010+.004*(1-scale*scale)})),true),
 };
}

/** Closed folded pillars sit behind the adjoining window pressings. Their
 * small rounded outer shoulder replaces the exposed cylindrical corner bars. */
export function martenPillar(side:number,front:boolean){
 const a=v(side*.741,1.025,front?.62:-.58),b=v(side*(front?.596:.608),front?1.443:1.478,front?.14:-.58),axis=b.clone().sub(a).normalize();
 const out=v(side,front?.145/.418:.133/.453,0).normalize(),other=front?v(0,.48,.418).normalize():v(0,0,1);
 const across=front?other.clone().cross(axis).multiplyScalar(side).normalize():v(0,0,1),back=front?axis.clone().cross(out).multiplyScalar(side).normalize():out.clone().negate();
 const points:number[]=[],uv:number[]=[],indices:number[]=[],count=8;
 for(let row=0;row<3;row++){
  const t=row/2,centre=a.clone().lerp(b,t),w=front?mix(.028,.024,t):mix(.013,.011,t),round=front?out.clone().add(other).normalize():out;
  const section=front?[
   across.clone().multiplyScalar(w).addScaledVector(other,-.002),across.clone().multiplyScalar(.004),round.clone().multiplyScalar(.0025),back.clone().multiplyScalar(.004),back.clone().multiplyScalar(w).addScaledVector(out,-.002),back.clone().multiplyScalar(w).addScaledVector(out,-.020),round.clone().multiplyScalar(-.025),across.clone().multiplyScalar(w).addScaledVector(other,-.020),
  ]:[
   across.clone().multiplyScalar(-w).addScaledVector(out,-.003),across.clone().multiplyScalar(-w+.003),across.clone().multiplyScalar(w-.003),across.clone().multiplyScalar(w).addScaledVector(out,-.003),across.clone().multiplyScalar(w).addScaledVector(out,-.021),across.clone().multiplyScalar(w-.003).addScaledVector(out,-.024),across.clone().multiplyScalar(-w+.003).addScaledVector(out,-.024),across.clone().multiplyScalar(-w).addScaledVector(out,-.021),
  ];
  for(const [i,p]of section.entries()){p.add(centre);if(front)p.z+=martenWindscreenBow(p.x,p.y);points.push(...p.toArray());uv.push(i/count,t);}
 }
 const ringPoints=Array.from({length:count},(_,i)=>v(points[i*3],points[i*3+1],points[i*3+2])),area=new T.Vector3();for(let i=0;i<count;i++)area.add(ringPoints[i].clone().cross(ringPoints[(i+1)%count]));const direction=area.dot(axis);
 const tri=(a:number,b:number,c:number)=>indices.push(...(direction>0?[a,b,c]:[a,c,b]));
 for(let row=0;row<2;row++)for(let i=0;i<count;i++){const a=row*count+i,b=row*count+(i+1)%count;tri(a,b,b+count);tri(a,b+count,a+count);}
 // Separate cap vertices keep the pillar's shoulder normals out of its end face.
 for(const row of [0,2]){const start=points.length/3,planeY=axis.clone().cross(across).normalize(),flat=Array.from({length:count},(_,i)=>{const p=v(points[(row*count+i)*3],points[(row*count+i)*3+1],points[(row*count+i)*3+2]);return new T.Vector2(p.dot(across),p.dot(planeY));});points.push(...points.slice(row*count*3,(row+1)*count*3));uv.push(...uv.slice(row*count*2,(row+1)*count*2));for(const [a,b,c]of T.ShapeUtils.triangulateShape(flat,[]))indices.push(...(row===0?[start+a,start+c,start+b]:[start+a,start+b,start+c]));}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=toCreasedNormals(g,Math.PI/3);g.dispose();return flat;
}
