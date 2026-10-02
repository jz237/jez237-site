import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {CarKind} from './rules';
import {vehicleArmorLayout,type ArmorRegion,type ArmorVec} from './vehicle-armor-spec';

const cache=new Map<string,T.Group>(),up=new T.Vector3(0,1,0),vector=(p:ArmorVec)=>new T.Vector3(p.x,p.y,p.z);
const steel=new T.MeshPhysicalMaterial({name:'Reinforcement forged steel',color:0x343b39,metalness:.73,roughness:.44,clearcoat:.12,clearcoatRoughness:.36});
const bolts=new T.MeshPhysicalMaterial({name:'Reinforcement zinc fasteners',color:0x89928d,metalness:.83,roughness:.38});

function fabricate(kind:CarKind,level:number){
 const layout=vehicleArmorLayout(kind,level),root=new T.Group();root.name='ReinforcementKit';root.userData.armorLevel=layout.level;
 for(const region of ['front','rear','left','right']as ArmorRegion[]){
  const metal:T.BufferGeometry[]=[],hardware:T.BufferGeometry[]=[];
  for(const beam of layout.beams.filter(b=>b.region===region)){
   const a=vector(beam.a),b=vector(beam.b),g=new T.CylinderGeometry(beam.radius,beam.radius,a.distanceTo(b),8,Math.max(1,Math.ceil(a.distanceTo(b)/.22)));
   g.applyQuaternion(new T.Quaternion().setFromUnitVectors(up,b.clone().sub(a).normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);metal.push(g.toNonIndexed());g.dispose();
  }
  for(const plate of layout.plates.filter(p=>p.region===region)){
   const {centre:p,size:s}=plate,g=new T.BoxGeometry(s.x,s.y,s.z,1,1,1);g.translate(p.x,p.y,p.z);metal.push(g.toNonIndexed());g.dispose();
   const side=region==='left'?-1:1,end=region==='rear'?-1:1;
   for(const offset of [-1,1]){
    const bolt=new T.CylinderGeometry(.011,.011,.014,6,1),washer=new T.CylinderGeometry(.016,.016,.004,8,1);
    if(region==='left'||region==='right'){
     bolt.rotateZ(Math.PI/2);washer.rotateZ(Math.PI/2);bolt.translate(p.x+side*(s.x/2+.008),p.y,p.z+offset*.036);washer.translate(p.x+side*(s.x/2+.002),p.y,p.z+offset*.036);
    }else{
     bolt.rotateX(Math.PI/2);washer.rotateX(Math.PI/2);bolt.translate(p.x+offset*.036,p.y,p.z+end*(s.z/2+.008));washer.translate(p.x+offset*.036,p.y,p.z+end*(s.z/2+.002));
    }
    hardware.push(bolt.toNonIndexed(),washer.toNonIndexed());bolt.dispose();washer.dispose();
   }
  }
  for(const [geometries,material,label]of [[metal,steel,'steel'],[hardware,bolts,'fasteners']]as const){
   if(!geometries.length)continue;const geometry=mergeGeometries(geometries)!;geometries.forEach(g=>g.dispose());const mesh=new T.Mesh(geometry,material);mesh.name='panel_Reinforcement_'+region+'_'+label;mesh.castShadow=label==='steel';mesh.receiveShadow=true;mesh.userData.constructionRole='rail';mesh.userData.armorRegion=region;root.add(mesh);
  }
 }
 return root;
}

/** Called before cloneCar's material/panel cloning. Cached source buffers stay
 * immutable; the normal car path gives each installed kit its own damage state. */
export function attachVehicleArmor(root:T.Group,kind:CarKind,level:number){
 if(!Number.isFinite(level)||level<.5)return;
 const normalized=Math.min(3,Math.max(0,Math.round(level)));if(!normalized||root.getObjectByName('ReinforcementKit'))return;
 const key=kind+':'+normalized;let template=cache.get(key);if(!template){template=fabricate(kind,normalized);cache.set(key,template);}root.add(template.clone(true));
}
