import * as T from 'three';
import {toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';

type RoadKind='tern'|'marten';
const tau=Math.PI*2;
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);

/** Indexed construction keeps the circular seams welded while normals are
 * calculated. Exported meshes are independent triangles, like the car skins. */
function shell(points:T.Vector3[],indices:number[],crease?:number){
 let volume=0;for(let i=0;i<indices.length;i+=3)volume+=points[indices[i]].dot(points[indices[i+1]].clone().cross(points[indices[i+2]]))/6;
 if(volume<0)for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(points.flatMap(p=>p.toArray()),3));
 geometry.setAttribute('uv',new T.Float32BufferAttribute(points.flatMap(p=>[p.x/.192+.5,Math.atan2(p.z,p.y)/tau+.5]),2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const result=crease===undefined?geometry.toNonIndexed():toCreasedNormals(geometry,crease);geometry.dispose();return result;
}
function lathe(profile:number[][],segments:number){
 const points:T.Vector3[]=[],indices:number[]=[];
 for(const [r,x]of profile)for(let i=0;i<segments;i++){const a=i*tau/segments;points.push(v(x,Math.cos(a)*r,Math.sin(a)*r));}
 for(let j=0;j<profile.length;j++)for(let i=0;i<segments;i++){
  const a=j*segments+i,b=j*segments+(i+1)%segments,c=((j+1)%profile.length)*segments+i,d=((j+1)%profile.length)*segments+(i+1)%segments;indices.push(a,b,d,a,d,c);
 }
 return shell(points,indices);
}

/** Two continuous drainage grooves and 32 shallow diagonal tread cuts are
 * actual rubber geometry. The broad sidewalls use 32 stations; only the tread
 * needs the three samples per station that describe each narrow cut. */
function roadTyre(){
 const profile=[
  [.168,-.084],[.247,-.096],[.291,-.086],[.311,-.065],
  [.320,-.030],[.315,-.025],[.320,-.020],[.320,.020],[.315,.025],[.320,.030],
  [.311,.065],[.291,.086],[.247,.096],[.168,.084],
 ];
 const points:T.Vector3[]=[],indices:number[]=[],rings:{start:number;count:number}[]=[];
 for(const [r,x]of profile){
  const count=Math.abs(x)<.04?96:32;rings.push({start:points.length,count});
  for(let i=0;i<count;i++){
   const step=count===96?Math.floor(i/3):i,part=count===96?i%3:0;
   const angle=step*tau/32+(part===1?.018:part===2?tau/32-.018:0)+x*.18;
   const cut=part===0?.0028*(1-T.MathUtils.smoothstep(Math.abs(x),.04,.065)):0;
   points.push(v(x,Math.cos(angle)*(r-cut),Math.sin(angle)*(r-cut)));
  }
 }
 for(let ring=0;ring<rings.length;ring++){
  const a=rings[ring],b=rings[(ring+1)%rings.length];let i=0,j=0;
  while(i<a.count||j<b.count){
   const ai=a.start+i%a.count,bj=b.start+j%b.count,an=a.start+(i+1)%a.count,bn=b.start+(j+1)%b.count;
   const nextA=(i+1)/a.count,nextB=(j+1)/b.count;
   if(Math.abs(nextA-nextB)<1e-8){indices.push(ai,an,bn,ai,bn,bj);i++;j++;}
   else if(nextA<nextB){indices.push(ai,an,bj);i++;}else{indices.push(ai,bn,bj);j++;}
  }
 }
 return shell(points,indices);
}

function circle(radius:number,count:number,centre=new T.Vector2(),clockwise=false){
 return Array.from({length:count},(_,i)=>{const angle=(clockwise?-1:1)*i*tau/count;return new T.Vector2(centre.x+Math.cos(angle)*radius,centre.y+Math.sin(angle)*radius);});
}
function dishDepth(radius:number,kind:RoadKind){
 // The vent band is planar, between two smoothly rolled concentric sections.
 // Keeping the curvature out of arbitrary hole triangulation prevents dents
 // being implied by the tessellation of a pristine pressed-steel face.
 return .053+(kind==='tern'?.025:.010)*(1-T.MathUtils.smoothstep(radius,kind==='tern'?.071:.063,.103))
  +.023*T.MathUtils.smoothstep(radius,.151,.174);
}

/** Real perforations join controlled concentric pressings. Each curved band
 * has explicit radial samples; only planar patches use general triangulation.
 * The front/back normals follow the pressing, independently of cap diagonals. */
function pressedDish(kind:RoadKind){
 const outer=circle(.174,24),bore=circle(kind==='tern'?.022:.063,16,new T.Vector2(),true),vents=kind==='tern'?8:10;
 const ventHoles:T.Vector2[][]=[],lugHoles:T.Vector2[][]=[],lugCentres:T.Vector2[]=[];
 for(let i=0;i<vents;i++){
  const a=(i+.5)*tau/vents,centre=new T.Vector2(Math.cos(a)*.132,Math.sin(a)*.132),tangent=kind==='tern'?.024:.013;
  ventHoles.push(Array.from({length:12},(_,j)=>{const b=-j*tau/12,dr=Math.cos(b)*.013,dt=Math.sin(b)*tangent;return new T.Vector2(centre.x+Math.cos(a)*dr-Math.sin(a)*dt,centre.y+Math.sin(a)*dr+Math.cos(a)*dt);}));
 }
 if(kind==='tern')for(let i=0;i<4;i++){const a=i*tau/4,centre=new T.Vector2(Math.cos(a)*.051,Math.sin(a)*.051);lugCentres.push(centre);lugHoles.push(circle(.0165,8,centre,true));}
 const flat:T.Vector2[]=[],lookup=new Map<string,number>(),faces:{indices:number[];lug?:number}[]=[],boundaries:number[][]=[];
 const pointKey=(p:T.Vector2)=>Math.round(p.x*1e10)+','+Math.round(p.y*1e10);
 const indexFor=(p:T.Vector2)=>{const key=pointKey(p),old=lookup.get(key);if(old!==undefined)return old;const index=flat.length;flat.push(p);lookup.set(key,index);return index;};
 const patch=(contour:T.Vector2[],holes:T.Vector2[][])=>{const map=[...contour,...holes.flat()].map(indexFor);faces.push(...T.ShapeUtils.triangulateShape(contour,holes).map(face=>({indices:face.map(i=>map[i])})));};
 const band=(outer:T.Vector2[],inner:T.Vector2[])=>{
  const a=outer.map(indexFor),b=inner.map(indexFor);let i=0,j=0;
  while(i<a.length||j<b.length){
   const ai=a[i%a.length],bj=b[j%b.length],an=a[(i+1)%a.length],bn=b[(j+1)%b.length],nextA=(i+1)/a.length,nextB=(j+1)/b.length;
   if(Math.abs(nextA-nextB)<1e-8){faces.push({indices:[ai,an,bn]},{indices:[ai,bn,bj]});i++;j++;}
   else if(nextA<nextB){faces.push({indices:[ai,an,bj]});i++;}else{faces.push({indices:[ai,bn,bj]});j++;}
  }
 };
 const ring=(radius:number)=>circle(radius,24),reverse=(points:T.Vector2[])=>[...points].reverse();
 const innerVent=ring(.103),outerVent=ring(.151),outerRoll=ring(.1625);
 band(outer,outerRoll);band(outerRoll,outerVent);patch(outerVent,[reverse(innerVent),...ventHoles]);
 if(kind==='tern'){
  const hub=ring(.071),shoulder=ring(.087);band(innerVent,shoulder);band(shoulder,hub);patch(hub,[bore,...lugHoles]);
 }else{const shoulder=ring(.083);band(innerVent,shoulder);band(shoulder,circle(.063,16));}
 for(const loop of [outer,bore,...ventHoles,...lugHoles])boundaries.push(loop.map(indexFor));
 const front=flat.map(p=>v(dishDepth(p.length(),kind),p.x,p.y));
 // Each countersink is part of the same sheet, terminating in an actual hole.
 for(const [i,centre]of lugCentres.entries()){
  const boundary=boundaries[2+vents+i],inner:number[]=[];
  for(const index of boundary){const p=flat[index].clone().sub(centre).normalize().multiplyScalar(.0085).add(centre);inner.push(front.length);front.push(v(dishDepth(p.length(),kind)-.010,p.x,p.y));}
  for(let j=0;j<boundary.length;j++){const a=boundary[j],b=boundary[(j+1)%boundary.length],c=inner[j],d=inner[(j+1)%inner.length];faces.push({indices:[a,c,d],lug:i},{indices:[a,d,b],lug:i});}boundaries[2+vents+i]=inner;
 }
 const points=[...front,...front.map(p=>p.clone().add(v(-.005,0,0)))],indices:number[]=[],normals:T.Vector3[]=[],count=front.length;
 const surfaceNormal=(index:number,lug?:number)=>{
  const p=front[index],r=Math.hypot(p.y,p.z),epsilon=1e-5,slope=(dishDepth(r+epsilon,kind)-dishDepth(r-epsilon,kind))/(2*epsilon),n=v(1,-slope*p.y/r,-slope*p.z/r);
  if(lug!==undefined){const centre=lugCentres[lug],dy=p.y-centre.x,dz=p.z-centre.y,d=Math.hypot(dy,dz);n.y-=1.25*dy/d;n.z-=1.25*dz/d;}
  return n.normalize();
 };
 for(const face of faces){let [a,b,c]=face.indices;const cross=(front[b].y-front[a].y)*(front[c].z-front[a].z)-(front[b].z-front[a].z)*(front[c].y-front[a].y);if(cross<0)[b,c]=[c,b];indices.push(a,b,c,a+count,c+count,b+count);for(const index of [a,b,c])normals.push(surfaceNormal(index,face.lug));for(const index of [a,c,b])normals.push(surfaceNormal(index,face.lug).negate());}
 for(const boundary of boundaries)for(let i=0;i<boundary.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length];indices.push(a,a+count,b+count,a,b+count,b);}
 const geometry=shell(points,indices,.75),normal=geometry.attributes.normal;
 for(const [i,n]of normals.entries())normal.setXYZ(i,n.x,n.y,n.z);return geometry;
}

function cylinder(radius:number,length:number,segments:number,x:number){
 const geometry=new T.CylinderGeometry(radius,radius,length,segments).toNonIndexed();geometry.rotateZ(-Math.PI/2);geometry.translate(x,0,0);return geometry;
}

function domedCap(){
 const profile=[[.033,.100],[.063,.087],[.076,.069],[.070,.064],[.032,.094]],points:T.Vector3[]=[],indices:number[]=[],segments=32;
 for(const [r,x]of profile)for(let i=0;i<segments;i++){const a=i*tau/segments;points.push(v(x,Math.cos(a)*r,Math.sin(a)*r));}
 for(let ring=0;ring<profile.length-1;ring++)for(let i=0;i<segments;i++){
  const a=ring*segments+i,b=ring*segments+(i+1)%segments;indices.push(a,b,b+segments,a,b+segments,a+segments);
 }
 const front=points.length,back=front+1;points.push(v(.103,0,0),v(.097,0,0));
 for(let i=0;i<segments;i++){indices.push(front,(i+1)%segments,i);const last=(profile.length-1)*segments;indices.push(back,last+i,last+(i+1)%segments);}
 return shell(points,indices);
}

/** Original period road wheels. Materials are private to these assemblies so
 * body weathering cannot alter a wheel, and every rubber surface shares the
 * legacy Tire material hook used by contact deformation and tyre shadows. */
export function addRoadWheels(root:T.Group,kind:RoadKind){
 const title=kind==='tern'?'Tern':'Marten';
 const mat=(name:string,color:number,roughness:number,metalness=0)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const tire=mat('Tire '+title,0x292827,.94),pressed=mat(title+' Pressed Enamel',kind==='tern'?0x919690:0xa6a99f,.48,.58),steel=mat(title+' Running Gear Steel',0x343b3b,.66,.55),bright=mat(title+' Brushed Chrome',0xaeb5b3,.28,.86);
 const tyre=roadTyre(),dish=pressedDish(kind),barrel=lathe([
  [.167,-.065],[.181,-.075],[.190,-.071],[.181,-.056],[.178,.058],[.188,.073],[.190,.078],[.187,.085],[.179,.085],[.168,.066],
 ],32),drum=cylinder(.114,.037,20,-.051);
 const cap=kind==='marten'?domedCap():cylinder(.020,.025,16,dishDepth(0,kind)+.009);
 for(const [i,corner]of ['FL','FR','RL','RR'].entries()){
  const side=i%2?1:-1,wheel=new T.Group();wheel.name='wheel_'+corner;wheel.position.set(side*(kind==='tern'?.690:.665),.3400195,(i<2?1:-1)*(kind==='tern'?1.18:1.14));root.add(wheel);
  const add=(label:string,source:T.BufferGeometry,material:T.Material,mirror=true)=>{const geometry=source.clone();if(side<0&&mirror)geometry.rotateY(Math.PI);const mesh=new T.Mesh(geometry,material);mesh.name=label+'_'+corner;mesh.castShadow=mesh.receiveShadow=true;wheel.add(mesh);};
  add('Tire_'+title+'_Carcass',tyre,tire,false);add('Wheel_'+title+'_Barrel',barrel,pressed);add('Wheel_'+title+'_PressedDish',dish,pressed);add('Wheel_'+title+'_BrakeDrum',drum,steel);add('Wheel_'+title+(kind==='marten'?'_DomedCap':'_CentreCap'),cap,bright);
  if(kind==='tern')for(let lug=0;lug<4;lug++){
   const angle=lug*tau/4,bolt=cylinder(.0065,.012,6,dishDepth(.051,kind)-.009);bolt.translate(0,Math.cos(angle)*.051,Math.sin(angle)*.051);add('Wheel_'+title+'_RecessedLug'+lug,bolt,steel);bolt.dispose();
  }
 }
 for(const geometry of [tyre,dish,barrel,drum,cap])geometry.dispose();
}
