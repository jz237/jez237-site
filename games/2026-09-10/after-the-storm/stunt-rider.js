import {makeBlenderRider} from './blender-rider.js';
import * as T from './vendor/three.module.js';
// A small articulated rig for poses; every limb is rebuilt between anatomical
// joint positions, keeping hands and feet attached during transitions.
export function makeStuntRider(parent,color,riderIndex=0){
 const detailed=makeBlenderRider(parent,{color,riderIndex});if(detailed){detailed.root.visible=false;return {root:detailed.root,update:(pose,t=0,lean=0,motion={})=>{detailed.root.visible=!!pose;if(pose)detailed.update(pose,t,lean,motion);}};}
const root=new T.Group();parent.add(root);root.visible=false;
 const suit=new T.MeshStandardMaterial({color:0x213b46,roughness:.85}),vest=new T.MeshStandardMaterial({color,roughness:.7}),helmet=new T.MeshPhysicalMaterial({color:0xe8eddf,roughness:.3,clearcoat:1}),rubber=new T.MeshStandardMaterial({color:0x12252b,roughness:.65});
 const sphere=new T.SphereGeometry(1,16,12),cylinder=new T.CylinderGeometry(1,1,1,10);
 function ellipsoid(m,scale){const o=new T.Mesh(sphere,m);o.scale.set(...scale);o.castShadow=true;root.add(o);return o;}
 const torso=ellipsoid(vest,[.29,.34,.21]),hips=ellipsoid(suit,[.23,.18,.20]),head=ellipsoid(helmet,[.19,.22,.21]),visor=ellipsoid(rubber,[.16,.10,.065]);
 const limbs=Array.from({length:8},(_,i)=>{const m=new T.Mesh(cylinder,suit);m.castShadow=true;root.add(m);return m;});const joints=Array.from({length:8},()=>ellipsoid(rubber,[.085,.085,.085]));
 const a=new T.Vector3(),b=new T.Vector3(),delta=new T.Vector3(),up=new T.Vector3(0,1,0);
 function limb(index,start,end,r){a.fromArray(start);b.fromArray(end);delta.subVectors(b,a);const o=limbs[index];o.position.copy(a).add(b).multiplyScalar(.5);o.scale.set(r,delta.length(),r);o.quaternion.setFromUnitVectors(up,delta.normalize());}
 function update(pose,t=0,lean=0){root.visible=!!pose;if(!pose)return;root.rotation.set(0,pose==='backwards'?Math.PI:0,lean*.06);root.position.set(0,0,0);
  let hip=[0,1.12,-.28],chest=[0,1.61,-.09],headP=[0,2.05,.04],shoulders=[[-.25,1.68,-.04],[.25,1.68,-.04]],elbows=[[-.38,1.39,.3],[.38,1.39,.3]],hands=[[-.45,1.12,.73],[.45,1.12,.73]],knees=[[-.39,.77,-.15],[.39,.77,-.15]],feet=[[-.5,.42,-.35],[.5,.42,-.35]];
  if(pose==='handstand'){hip=[0,2.12,.63];chest=[0,1.78,.68];headP=[0,1.37,.73];shoulders=[[-.24,1.67,.68],[.24,1.67,.68]];elbows=[[-.36,1.42,.73],[.36,1.42,.73]];knees=[[-.14,2.66,.44],[.14,2.66,.44]];feet=[[-.16,3.14,.23],[.16,3.14,.23]];}
  if(pose==='backwards'){hands=[[-.38,1.12,.0],[.38,1.12,.0]];elbows=[[-.4,1.4,-.1],[.4,1.4,-.1]];}
  if(pose==='somersault'){const angle=t/1.05*Math.PI*2,c=Math.cos(angle),s=Math.sin(angle);const rotate=p=>{const y=p[1]-1.7,z=p[2]+.25;return [p[0],1.7+y*c-z*s,-.25+y*s+z*c];};hip=rotate(hip);chest=rotate(chest);headP=rotate(headP);shoulders=shoulders.map(rotate);elbows=elbows.map(rotate);hands=hands.map(rotate);knees=knees.map(rotate);feet=feet.map(rotate);torso.rotation.x=angle;head.rotation.x=angle;}else{torso.rotation.x=pose==='handstand'?Math.PI:.12;head.rotation.x=pose==='handstand'?Math.PI:0;}
  torso.position.set(...chest);hips.position.set(...hip);head.position.set(...headP);visor.position.set(headP[0],headP[1]-.03,headP[2]+.19);
  for(let side=0;side<2;side++){const sign=side?1:-1;limb(side*4,shoulders[side],elbows[side],.078);limb(side*4+1,elbows[side],hands[side],.065);limb(side*4+2,[hip[0]+sign*.14,hip[1],hip[2]],knees[side],.10);limb(side*4+3,knees[side],feet[side],.08);joints[side*4].position.set(...elbows[side]);joints[side*4+1].position.set(...hands[side]);joints[side*4+2].position.set(...knees[side]);joints[side*4+3].position.set(...feet[side]);}
 }
 return {root,update};
}
