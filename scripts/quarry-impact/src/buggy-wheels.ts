import * as T from 'three';
import {mergeGeometries,toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';

type WheelMaterials={tire:T.Material;alloy:T.Material;bright:T.Material;steel:T.Material};
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const profile=[
 [.198,-.118],[.225,-.132],[.270,-.144],[.314,-.145],[.340,-.135],[.356,-.110],[.362,-.075],
 [.362,.075],[.356,.110],[.340,.135],[.314,.145],[.270,.144],[.225,.132],[.198,.118],[.198,-.118],
];

/** Closed indexed construction is converted to independent triangle vertices
 * once, so hard tread/bevel edges and the runtime material merge stay stable. */
function shell(points:T.Vector3[],indices:number[],crease=.55){
 let volume=0;for(let i=0;i<indices.length;i+=3)volume+=points[indices[i]].dot(points[indices[i+1]].clone().cross(points[indices[i+2]]))/6;
 if(volume<0)for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(points.flatMap(p=>p.toArray()),3));
 geometry.setAttribute('uv',new T.Float32BufferAttribute(points.flatMap(p=>[p.x/.30+.5,Math.atan2(p.z,p.y)/(Math.PI*2)+.5]),2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const result=toCreasedNormals(geometry,crease);geometry.dispose();return result;
}
function lathe(points:number[][],segments:number,crease?:number){
 const geometry=new T.LatheGeometry(points.map(([r,x])=>new T.Vector2(r,x)),segments);geometry.rotateZ(-Math.PI/2);
 const result=crease===undefined?geometry.toNonIndexed():toCreasedNormals(geometry,crease);geometry.dispose();return result;
}
function cylinder(radius:number,length:number,segments:number,x:number){
 const geometry=new T.CylinderGeometry(radius,radius,length,segments).toNonIndexed();geometry.rotateZ(-Math.PI/2);geometry.translate(x,0,0);return geometry;
}

/** Sloped shoulder blocks follow the actual crown. The three closed rings
 * supply embedded roots, full-height side walls, and a true inset bevel. */
function treadBlock(polygon:T.Vector2[],angle:number){
 const centre=polygon.reduce((sum,p)=>sum.add(p),new T.Vector2()).multiplyScalar(1/polygon.length),points:T.Vector3[]=[],indices:number[]=[],count=polygon.length;
 for(const ring of [0,1,2])for(const source of polygon){
  const p=source.clone().sub(centre).multiplyScalar(ring===2?.82:1).add(centre);
  const peak=.38-.022*T.MathUtils.smoothstep(Math.abs(p.x),.065,.137),radius=peak-(ring===0?.020:ring===1?.0035:0),a=angle+p.y/.38;
  points.push(v(p.x,Math.cos(a)*radius,Math.sin(a)*radius));
 }
 for(let ring=0;ring<2;ring++)for(let i=0;i<count;i++){const a=ring*count+i,b=ring*count+(i+1)%count;indices.push(a,b,b+count,a,b+count,a+count);}
 const cap=T.ShapeUtils.triangulateShape(polygon,[]);
 for(const [a,b,c]of cap){indices.push(c,b,a,2*count+a,2*count+b,2*count+c);}
 return shell(points,indices,.50);
}
function tread(){
 const parts:T.BufferGeometry[]=[],centre=[[-.039,-.029],[0,-.011],[.039,-.029],[.039,.012],[0,.031],[-.039,.012]].map(([x,y])=>new T.Vector2(x,y));
 for(let station=0;station<20;station++){
  const a=station*Math.PI/10;
  parts.push(treadBlock(centre,a));
  for(const side of [-1,1]){
   const shoulder=[[.068,-.034],[.132,-.010],[.132,.033],[.068,.009]].map(([x,y])=>new T.Vector2(side*x,side*y));
   parts.push(treadBlock(shoulder,a+side*.075));
  }
 }
 const geometry=mergeGeometries(parts)!;parts.forEach(g=>g.dispose());return geometry;
}

/** Eight-sided rounded section follows a concave dish from hub to bead seat.
 * Unlike a flat strip, its crown, side returns and broad outer foot are solid. */
function spoke(angle:number){
 const points:T.Vector3[]=[],indices:number[]=[],sections=[{r:.050,x:.061,w:.031,t:.025},{r:.113,x:.065,w:.033,t:.023},{r:.184,x:.090,w:.052,t:.020}],count=8;
 for(const s of sections){const h=s.t/2,w=s.w/2,b=.004;
  for(const [x,t]of [[-h+b,-w],[h-b,-w],[h,-w+b],[h,w-b],[h-b,w],[-h+b,w],[-h,w-b],[-h,-w+b]])points.push(v(s.x+x,Math.cos(angle)*s.r-Math.sin(angle)*t,Math.sin(angle)*s.r+Math.cos(angle)*t));
 }
 for(let ring=0;ring<2;ring++)for(let i=0;i<count;i++){const a=ring*count+i,b=ring*count+(i+1)%count;indices.push(a,b,b+count,a,b+count,a+count);}
 for(const ring of [0,2])for(let i=1;i<count-1;i++)indices.push(...(ring===0?[ring*count,ring*count+i+1,ring*count+i]:[ring*count,ring*count+i,ring*count+i+1]));
 return shell(points,indices,.70);
}
function hub(){
 const points:T.Vector3[]=[],indices:number[]=[],count=16,rings=[{x:.043,r:.051},{x:.049,r:.059},{x:.075,r:.059},{x:.083,r:.051}];
 for(const ring of rings)for(let i=0;i<count;i++){const a=i*Math.PI*2/count;points.push(v(ring.x,Math.cos(a)*ring.r,Math.sin(a)*ring.r));}
 for(let ring=0;ring<rings.length-1;ring++)for(let i=0;i<count;i++){const a=ring*count+i,b=ring*count+(i+1)%count;indices.push(a,b,b+count,a,b+count,a+count);}
 for(const ring of [0,3]){const centre=points.length;points.push(v(rings[ring].x,0,0));for(let i=0;i<count;i++)indices.push(...(ring===0?[centre,ring*count+(i+1)%count,ring*count+i]:[centre,ring*count+i,ring*count+(i+1)%count]));}
 return shell(points,indices,Math.PI/3);
}

/** Original Ravine wheel assemblies. Keep every physical hardpoint and the
 * measured old metal envelope; only rubber receives pressure deformation. */
export function addBuggyWheels(root:T.Group,materials:WheelMaterials){
 const rubber=lathe(profile,32),blocks=tread(),barrel=lathe([[.179,-.102],[.202,-.109],[.208,-.104],[.195,-.083],[.192,.079],[.205,.090],[.208,.101],[.202,.114],[.181,.104],[.179,-.093],[.179,-.102]],32,Math.PI/3),centre=hub();
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const side=i%2?1:-1,wheel=new T.Group();wheel.name='wheel_'+name;wheel.position.set(side*.85,.40,(i<2?1:-1)*1.20);root.add(wheel);
  const add=(name:string,source:T.BufferGeometry,material:T.Material,mirror=true)=>{const geometry=source.clone();if(side<0&&mirror)geometry.rotateY(Math.PI);const mesh=new T.Mesh(geometry,material);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;wheel.add(mesh);return mesh;};
  add('Tire_Ravine_'+name,rubber,materials.tire,false);add('Tire_Ravine_Tread_'+name,blocks,materials.tire,false);
  add('Wheel_Ravine_Barrel_'+name,barrel,materials.alloy);add('Wheel_Ravine_Hub_'+name,centre,materials.bright);
  const disc=cylinder(.156,.018,16,-.06);add('Wheel_Ravine_BrakeDisc_'+name,disc,materials.steel);disc.dispose();
  for(let j=0;j<6;j++){
   const angle=j*Math.PI/3,s=spoke(angle);add('Wheel_Ravine_Spoke_'+name+j,s,materials.alloy);s.dispose();
   const bolt=cylinder(.0075,.013,6,.089);bolt.translate(0,Math.cos(angle)*.043,Math.sin(angle)*.043);add('Wheel_Ravine_Lug_'+name+j,bolt,materials.steel);bolt.dispose();
  }
 }
 for(const geometry of [rubber,blocks,barrel,centre])geometry.dispose();
}
