import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {ConvexHull} from 'three/addons/math/ConvexHull.js';
import {CAR_KINDS} from '../src/rules';import {attachVehicleArmor} from '../src/vehicle-armor';import {vehicleArmorLayout,vehicleArmorCollisionHulls} from '../src/vehicle-armor-spec';import {vehicleWheelRadius} from '../src/classic-vehicle-specs';import {DEFINITIONS} from '../src/rules';
const v=(p:{x:number;y:number;z:number})=>new T.Vector3(p.x,p.y,p.z),key=(p:T.Vector3)=>p.toArray().map(x=>Number(x.toFixed(6))).join(',');
test('stock is untouched and all eleven cars receive distinct, bounded reinforcement packages',()=>{
 for(const kind of CAR_KINDS){const stock=new T.Group(),sentinel=new T.Group();sentinel.name='existing body';stock.add(sentinel);const before=JSON.stringify(stock.toJSON());attachVehicleArmor(stock,kind,0);assert.equal(JSON.stringify(stock.toJSON()),before);let previous=0;
  for(const level of [1,2,3]){const root=new T.Group();attachVehicleArmor(root,kind,level);let vertices=0,meshes=0;const regions=new Set<string>();root.traverse(o=>{if(!(o instanceof T.Mesh))return;meshes++;vertices+=o.geometry.attributes.position.count;regions.add(o.userData.armorRegion);assert.equal(o.userData.constructionRole,'rail');assert.match(o.name,/^panel_Reinforcement_/);assert.ok(!(o.material as T.Material).name.startsWith('paint'));});assert.equal(meshes,level===1?4:8);assert.ok(vertices>previous);previous=vertices;assert.ok(vertices<=10000,`${kind} ${level}: ${vertices}`);assert.deepEqual([...regions].sort(),level===1?['front','rear']:['front','left','rear','right']);attachVehicleArmor(root,kind,level);assert.equal(root.children.length,1,'Repeated attachment must not stack duplicate kits');}
 }
});
test('all fitted beams, pads and fasteners have closed finite outward geometry',()=>{
 for(const kind of CAR_KINDS){const root=new T.Group();attachVehicleArmor(root,kind,3);root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,edges=new Map<string,number>();let volume=0;for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),kind+' '+o.name);
  for(let i=0;i<p.count;i+=3){const points=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j)),cross=points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0]));assert.ok(cross.lengthSq()>1e-18);volume+=points[0].dot(points[1].clone().cross(points[2]))/6;for(let j=0;j<3;j++){assert.ok(cross.dot(new T.Vector3().fromBufferAttribute(n,i+j))>=-1e-10);const edge=[key(points[j]),key(points[(j+1)%3])].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}}
  assert.ok(volume>0);assert.ok([...edges.values()].every(n=>n===2||n===4),`${kind} ${o.name}: closed fabricated pieces; coincident pad/bar edges may share four faces`);
 });}
});
test('side armor clears all wheel envelopes and cargo/cockpit openings remain unfilled',()=>{
 for(const kind of CAR_KINDS){const layout=vehicleArmorLayout(kind,3),axle=DEFINITIONS[kind].wheelbase/2,radius=vehicleWheelRadius(kind);
  for(const beam of layout.beams){assert.ok(v(beam.a).distanceTo(v(beam.b))>1e-5);if(beam.region==='left'||beam.region==='right'){const extent=Math.max(Math.abs(beam.a.z),Math.abs(beam.b.z))+beam.radius;assert.ok(extent<axle-radius-.055,kind+' sidebar stops before the tyre envelope');}}
  for(const plate of layout.plates.filter(p=>p.region==='left'||p.region==='right'))assert.ok(Math.abs(plate.centre.z)+plate.size.z/2<axle-radius-.055,kind+' mounting pads clear tyres');
  if(kind==='van'){for(const beam of layout.beams.filter(b=>b.region==='rear'))assert.ok(Math.max(beam.a.y,beam.b.y)+beam.radius<.48,'Carrier reinforcement stays below barn-door opening');for(const plate of layout.plates.filter(p=>p.region==='rear'))assert.ok(plate.centre.y+plate.size.y/2<.48);}
  if(kind==='buggy'){const kit=new T.Group();attachVehicleArmor(kit,kind,3);assert.equal(new T.Raycaster(new T.Vector3(0,3,0),new T.Vector3(0,-1,0)).intersectObject(kit,true).length,0,'No cage fill or floor slab covers the open cockpit');for(const beam of layout.beams)assert.ok(Math.max(beam.a.y,beam.b.y)+beam.radius<.80,'Reinforcement remains below cockpit/engine intake height');}
 }
});
test('every front/rear beam is visibly supported by a pad and an inboard mounting strut',()=>{
 for(const kind of CAR_KINDS){const layout=vehicleArmorLayout(kind,1);for(const region of ['front','rear']){const mounts=layout.beams.filter(b=>b.region===region&&b.id.includes('-mount-')),pads=layout.plates.filter(p=>p.region===region);assert.equal(mounts.length,2);assert.equal(pads.length,2);for(const mount of mounts){const midpoint=v(mount.a).add(v(mount.b)).multiplyScalar(.5),pad=pads.find(p=>Math.abs(p.centre.x-midpoint.x)<1e-6)!;assert.ok(pad);assert.ok(Math.abs(pad.centre.z-midpoint.z)<.10);assert.ok(Math.abs(mount.a.z-mount.b.z)>.14,'Mounting strut enters the original structure');}}}
});
test('two or four shallow contact envelopes contain the steel without spanning vehicle openings',()=>{
 for(const kind of CAR_KINDS){assert.equal(vehicleArmorCollisionHulls(vehicleArmorLayout(kind,0)).length,0);for(const level of [1,2,3]){
  const layout=vehicleArmorLayout(kind,level),envelopes=vehicleArmorCollisionHulls(layout),root=new T.Group();attachVehicleArmor(root,kind,level);assert.equal(envelopes.length,level===1?2:4);
  for(const {region,points} of envelopes){
   assert.ok(points.every(p=>[p.x,p.y,p.z].every(Number.isFinite)));const vectors=points.map(v),hull=new ConvexHull().setFromPoints(vectors),bounds=new T.Box3().setFromPoints(vectors),mesh=root.getObjectByName('panel_Reinforcement_'+region+'_steel')as T.Mesh,p=mesh.geometry.attributes.position;
   for(let i=0;i<p.count;i++){const vertex=new T.Vector3().fromBufferAttribute(p,i);assert.ok(hull.faces.every(face=>face.distanceToPoint(vertex)<1e-6),`${kind} ${level} ${region}: contact envelope contains authored steel`);}
   if(region==='front'||region==='rear')assert.ok(bounds.max.z-bounds.min.z<.25,'End envelope stays shallow');
   else{assert.ok(bounds.max.x-bounds.min.x<.17,'Side envelope stays beside the sill');assert.ok(region==='left'?bounds.max.x<-.6:bounds.min.x>.6,'Side envelope never bridges the cockpit');}
  }
 }}
});
