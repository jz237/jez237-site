import * as T from 'three';
import {toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';

const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
const roofHalf=.639,rollStart=.579;
// This ellipse meets the shallow centre crown with the same first derivative,
// then turns vertically into the side header at the original roof edge.
const slope=.4/rollStart,q=(slope*(roofHalf-rollStart)/.8)/(1-slope*(roofHalf-rollStart)/.8),axis=(roofHalf-rollStart)/(1-q),centre=roofHalf-axis,amplitude=.8/Math.sqrt(1-q*q);
const crown=(x:number)=>Math.abs(x)<=rollStart?1-.2*(x/rollStart)**2:amplitude*Math.sqrt(Math.max(0,1-((Math.abs(x)-centre)/axis)**2));
const roofHeight=(t:number)=>.012*t+.0295*Math.sin(Math.PI*t);
const roofColumns=[-.639,-.636,-.628,-.614,-.595,-.579,-.45,-.27,0,.27,.45,.579,.595,.614,.628,.636,.639].map(x=>(x/roofHalf+1)/2);
// The outer and inner gasket edges retain the original aperture. Its landing
// stays above the painted return (inset .026) before descending to the glass.
// Matching inset + radius keeps the landing concentric through each corner.
const gasketProfile=[[.024,.037,.001],[.028,.033,.001],[.035,.030,-.010]];

export function ternRoofSurface(u:number,t:number){
 const x=(u*2-1)*roofHalf;return v(x,1.478+roofHeight(t)*crown(x),mix(-1.02,.094,t));
}

/** The bow vanishes at the original sill edge and four aperture corners.
 * The front cowl, side glazing and hatch hinge therefore keep their datums. */
export function ternScreenBow(x:number,y:number,front:boolean){
 const t=T.MathUtils.clamp((y-1.02)/.41,0,1),half=mix(front?.769:.737,.631,t);
 const wrap=front?T.MathUtils.smoothstep(t,.28,1):t;
 return (front?.018:-.010)*wrap*Math.max(0,1-(x/half)**2);
}
export function ternHeaderSurface(u:number,t:number,front:boolean){
 const s=u*2-1,x=s*mix(.631,roofHalf,t),top=1.478+(front?roofHeight(1)*crown(s*roofHalf):0),q=1-t;
 const lowZ=front?.12:-1.04,highZ=front?.094:-1.02,bow=ternScreenBow(s*.631,1.43,front);
 const start=lowZ+bow,control=front?start-.019*.5/.41:start+.026,near=front?.100:-1.026;
 const roofSlope=(front?.012-.0295*Math.PI:.012+.0295*Math.PI)*crown(s*roofHalf)/1.114;
 const nearY=top-roofSlope*(highZ-near);
 return v(x,q*q*q*1.43+3*q*q*t*(front?1.449:1.445)+3*q*t*t*nearY+t*t*t*top,
  q*q*q*start+3*q*q*t*control+3*q*t*t*near+t*t*t*highZ);
}
export function ternSideHeaderSurface(u:number,t:number,side:number,quarter:boolean){
 const x=side*mix(.631,roofHalf,t*t*(3-2*t)),y=mix(1.43,1.478,t);
 const z=quarter?mix(mix(-1.04,-1.02,t),-.72,u):mix(-.70,mix(.12,.094,t),u);
 return v(x,y,z);
}

/** Long-edge stations follow the shallow wrap; frame, gasket, trim and pane
 * are generated from one aperture rather than independently bent strips. */
export function ternScreen(front:boolean){
 const lowerHalf=front?.769:.737,sign=front?1:-1,normal=front?v(0,.5,.41).normalize():v(0,.72,-.41).normalize();
 const width=lowerHalf+.631,height=Math.hypot(lowerHalf-.631,.41,front?.5:.72);
 const contour=(inset:number,radius:number)=>{
  const points:T.Vector2[]=[],a=.5-inset/width,b=.5-inset/height,rx=radius/width,ry=radius/height;
  for(let c=0;c<4;c++){
   const sx=c===0||c===3?1:-1,sy=c<2?1:-1;
   for(let i=0;i<=3;i++){const angle=(c*90+i*30)*Math.PI/180;points.push(new T.Vector2(.5+sx*(a-rx)+Math.cos(angle)*rx,.5+sy*(b-ry)+Math.sin(angle)*ry));}
   if(c===0||c===2){const from=points.at(-1)!,to=new T.Vector2(.5-sx*(a-rx),from.y);for(let i=1;i<=8;i++)points.push(from.clone().lerp(to,i/9));}
  }
  return points;
 };
 const point=(p:T.Vector2,depth:number)=>{
  const x=sign*(p.x*2-1)*mix(lowerHalf,.631,p.y),y=mix(1.02,1.43,p.y),z=mix(front?.62:-1.76,front?.12:-1.04,p.y);
  return v(x,y,z+ternScreenBow(x,y,front)).addScaledVector(normal,depth);
 };
 const geometry=(rows:{points:T.Vector2[];depth:number}[],fill=false,creased=false)=>{
  const positions:number[]=[],uv:number[]=[],indices:number[]=[],count=rows[0].points.length;
  for(const row of rows)for(const p of row.points){positions.push(...point(p,row.depth).toArray());uv.push(p.x,p.y);}
  for(let r=0;r<rows.length-1;r++)for(let i=0;i<count;i++){const a=r*count+i,b=r*count+(i+1)%count;indices.push(a,b,b+count,a,b+count,a+count);}
  if(fill){const centre=positions.length/3;positions.push(...point(new T.Vector2(.5,.5),-.006).toArray());uv.push(.5,.5);const first=(rows.length-1)*count;for(let i=0;i<count;i++)indices.push(first+i,first+(i+1)%count,centre);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=creased?toCreasedNormals(g,Math.PI/3):g.toNonIndexed();g.dispose();return flat;
 };
 const ring=(profile:number[][])=>geometry(profile.map(([inset,radius,depth])=>({points:contour(inset,radius),depth})),false,profile.length>2),aperture=contour(.035,.030);
 return{
  frame:ring([[0,.002,0],[.026,.035,0],[.026,.035,-.023],[0,.002,-.023],[0,.002,0]]),
  seal:ring(gasketProfile),trim:ring([[.019,.042,.0015],[.023,.038,.0015]]),
  glass:geometry([1,.75,.5,.25].map(scale=>({points:aperture.map(p=>p.clone().subScalar(.5).multiplyScalar(scale).addScalar(.5)),depth:-.010+.004*(1-scale*scale)})),true),
 };
}

/** Keep the original side-window silhouette and bilinear aperture exactly;
 * only the gasket section gains a raised landing outside the glass recess. */
export function ternSideSeal(side:number,quarter:boolean){
 const corners=quarter?[v(side*.769,1.02,-.72),v(side*.737,1.02,-1.76),v(side*.631,1.43,-1.04),v(side*.631,1.43,-.72)]:[v(side*.769,1.02,.62),v(side*.769,1.02,-.70),v(side*.631,1.43,-.70),v(side*.631,1.43,.12)];
 const width=(corners[0].distanceTo(corners[1])+corners[3].distanceTo(corners[2]))/2,height=(corners[0].distanceTo(corners[3])+corners[1].distanceTo(corners[2]))/2;
 const normal=corners[1].clone().sub(corners[0]).cross(corners[3].clone().sub(corners[0])).normalize().multiplyScalar(side);
 const positions:number[]=[],uv:number[]=[],indices:number[]=[],count=20;
 for(const [inset,radius,depth]of gasketProfile){
  const a=.5-inset/width,b=.5-inset/height,rx=radius/width,ry=radius/height;
  for(let c=0;c<4;c++)for(let i=0;i<=4;i++){
   const sx=c===0||c===3?1:-1,sy=c<2?1:-1,angle=(c*90+i*22.5)*Math.PI/180;
   const u=.5+sx*(a-rx)+Math.cos(angle)*rx,t=.5+sy*(b-ry)+Math.sin(angle)*ry;
   positions.push(...corners[0].clone().lerp(corners[1],u).lerp(corners[3].clone().lerp(corners[2],u),t).addScaledVector(normal,depth).toArray());uv.push(u,t);
  }
 }
 const tri=(a:number,b:number,c:number)=>indices.push(...(side>0?[a,b,c]:[a,c,b]));
 for(let row=0;row<gasketProfile.length-1;row++)for(let i=0;i<count;i++){const a=row*count+i,b=row*count+(i+1)%count;tri(a,b,b+count);tri(a,b+count,a+count);}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();const result=geometry.toNonIndexed();geometry.dispose();return result;
}

function closedPost(rows:T.Vector3[][],axis:T.Vector3,across:T.Vector3){
 const count=rows[0].length,points=rows.flat(),indices:number[]=[],plane=axis.clone().cross(across).normalize(),area=new T.Vector3();
 for(let i=0;i<count;i++)area.add(rows[0][i].clone().cross(rows[0][(i+1)%count]));
 const tri=(a:number,b:number,c:number)=>indices.push(...(area.dot(axis)>0?[a,b,c]:[a,c,b]));
 for(let row=0;row<rows.length-1;row++)for(let i=0;i<count;i++){const a=row*count+i,b=row*count+(i+1)%count;tri(a,b,b+count);tri(a,b+count,a+count);}
 for(const row of [0,rows.length-1]){
  const flat=rows[row].map(p=>new T.Vector2(p.dot(across),p.dot(plane)));
  for(const [a,b,c]of T.ShapeUtils.triangulateShape(flat,[]))indices.push(...(row===0?[row*count+c,row*count+b,row*count+a]:[row*count+a,row*count+b,row*count+c]));
 }
 // Orient the entire closed section consistently before calculating normals.
 let volume=0;for(let i=0;i<indices.length;i+=3)volume+=points[indices[i]].dot(points[indices[i+1]].clone().cross(points[indices[i+2]]))/6;
 if(volume<0)for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points.flatMap(p=>p.toArray()),3));g.setAttribute('uv',new T.Float32BufferAttribute(points.flatMap((_,i)=>[i%count/count,Math.floor(i/count)/(rows.length-1)]),2));g.setIndex(indices);g.computeVertexNormals();const result=toCreasedNormals(g,Math.PI/3);g.dispose();return result;
}

/** Closed folded sections sit behind the glass pressings. The A/C shoulder
 * joins the side and end apertures; the satin B post has a flat outer face. */
export function ternPillar(side:number,which:'A'|'B'|'C'){
 if(which==='B'){
  const a=v(side*.769,1.02,-.71),b=v(side*.639,1.478,-.71),axis=b.clone().sub(a).normalize(),out=v(side,.130/.458,0).normalize(),across=v(0,0,1);
  const rows=[0,.5,1].map(t=>{const centre=a.clone().lerp(b,t),w=mix(.010,.009,t),d=.024,r=.003;
   return[[-w,-r],[-w+r,0],[w-r,0],[w,-r],[w,-d+r],[w-r,-d],[-w+r,-d],[-w,-d+r]].map(([z,x])=>centre.clone().addScaledVector(across,z).addScaledVector(out,x));
  });return closedPost(rows,axis,across);
 }
 const front=which==='A',a=v(side*(front?.769:.737),1.02,front?.62:-1.76),b=v(side*.631,1.43,front?.12:-1.04),axis=b.clone().sub(a).normalize();
 const out=v(side,(front?.138:.106)/.41,0).normalize(),other=front?v(0,.5,.41).normalize():v(0,.72,-.41).normalize(),factor=front?side:-side;
 const across=other.clone().cross(axis).multiplyScalar(factor).normalize(),back=axis.clone().cross(out).multiplyScalar(factor).normalize(),round=out.clone().add(other).normalize();
 const centres=[a,a.clone().lerp(b,.5),b];if(!front)centres.push(v(side*.639,1.478,-1.02));
 const rows=centres.map((centre,index)=>{const t=index/(centres.length-1),w=front?mix(.028,.024,t):mix(.034,.028,t);
  return[
   across.clone().multiplyScalar(w).addScaledVector(other,-.002),across.clone().multiplyScalar(.004),round.clone().multiplyScalar(.0025),back.clone().multiplyScalar(.004),back.clone().multiplyScalar(w).addScaledVector(out,-.002),back.clone().multiplyScalar(w).addScaledVector(out,-.020),round.clone().multiplyScalar(-.025),across.clone().multiplyScalar(w).addScaledVector(other,-.020),
  ].map(p=>{p.add(centre);p.z+=ternScreenBow(p.x,p.y,front);if(!front)p.addScaledVector(out,-.011).addScaledVector(other,-.003);return p;});
 });return closedPost(rows,axis,across);
}

/** Replace only these existing pressings; retain every material, semantic name
 * and local transform so damage ownership and geometry-derived hinges persist. */
export function refineTernGreenhouse(root:T.Group){
 const replace=(name:string,geometry:T.BufferGeometry)=>{
  const mesh=root.getObjectByName(name) as T.Mesh;mesh.updateMatrix();geometry.applyMatrix4(mesh.matrix.clone().invert());mesh.geometry.dispose();mesh.geometry=geometry;
 };
 const roof=formedVehiclePanel(roofColumns,panelSamples(10),ternRoofSurface,v(0,1,0));
 // At the ellipse tangent the derivative is vertical. Use its exact limiting
 // normal instead of a finite-difference approximation at the perimeter.
 const p=roof.attributes.position,n=roof.attributes.normal;for(let i=0;i<p.count;i++)if(Math.abs(Math.abs(p.getX(i))-roofHalf)<1e-6&&Math.abs(n.getY(i))>.01&&p.getZ(i)>-1.019) n.setXYZ(i,Math.sign(p.getX(i))*Math.sign(n.getY(i)),0,0);
 replace('panel_RoofTern',roof);
 for(const front of [true,false]){
  replace(front?'panel_FrontHeaderTern':'panel_TailgateTernHeader',formedVehiclePanel(roofColumns,panelSamples(4),(u,t)=>ternHeaderSurface(u,t,front),v(0,.5,front?1:-1).normalize()));
  const aperture=ternScreen(front),stem=front?'FrontTern':'TailgateTernRear';replace('panel_'+stem+'Frame',aperture.frame);replace('panel_'+stem+'Seal',aperture.seal);replace('panel_'+stem+'Trim',aperture.trim);replace('glass_'+stem,aperture.glass);
 }
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';for(const which of ['A','B','C']as const)replace('panel_'+which+'pillarTern'+suffix,ternPillar(side,which));
  replace('panel_BodyDoor'+suffix+'TernHeader',formedVehiclePanel(panelSamples(10),panelSamples(4),(u,t)=>ternSideHeaderSurface(u,t,side,false),v(side,0,0)));
  replace('panel_QuarterHeaderTern'+suffix,formedVehiclePanel(panelSamples(7),panelSamples(4),(u,t)=>ternSideHeaderSurface(u,t,side,true),v(side,0,0)));
  replace('panel_BodyDoor'+suffix+'TernSeal',ternSideSeal(side,false));
  replace('panel_QuarterTern'+suffix+'Seal',ternSideSeal(side,true));
 }
}
