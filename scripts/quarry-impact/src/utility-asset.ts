import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {buildMuscleAsset,MUSCLE_TEXTURES} from './muscle-asset';
import {partitionSurface} from './surface-partition';
import {addClassicPanelBackings} from './classic-panel-backings';
import {addClassicBayClosures,addMuscleEngineBay} from './classic-engine-bay';

// Preserve the rear arch's original round profile. Put the additional bed
// length ahead of and behind the wheel opening, rather than stretching it.
const rearTailScale=.41172/((2.4243-1.84)**2);
const rear=(z:number)=>{
 if(z>=-.82)return z;
 if(z>-.95){const t=(-z-.82)/.13;return z-.23*t*t*(3-2*t);}
 if(z>=-1.84)return z-.23;
 return z-.23-rearTailScale*(-z-1.84)**2;
};
const rearDerivative=(z:number)=>{
 if(z>=-.82)return 1;
 if(z>-.95){const t=(-z-.82)/.13;return 1+.23/.13*6*t*(1-t);}
 return z>=-1.84?1:1+2*rearTailScale*(-z-1.84);
};
/** Original coupe-utility conversion of the attributed BrightRetro donor.
 * Cut the cabin and cargo opening before extending the rear quarter; do not
 * stretch the passenger compartment or tires with the longer load bed. */
export function buildUtilityAsset(obj:string,textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={}){
 const donor=buildMuscleAsset(obj,textures),root=new T.Group();root.name='IRONVALE UTILITY candidate';
 root.userData.attribution='Body derived from Muscle Car 3D Model by BrightRetro, CC-BY 3.0; original coupe utility conversion for Quarry Impact';
 const paint=new T.MeshPhysicalMaterial({name:'paint Utility Body',color:0x537c8a,metalness:.48,roughness:.28,clearcoat:1,clearcoatRoughness:.12});
 const bed=new T.MeshStandardMaterial({name:'Utility Bed Coating',color:0x293532,roughness:.87,metalness:.15});
 const steel=new T.MeshStandardMaterial({name:'Utility Chassis Steel',color:0x303a38,roughness:.66,metalness:.65});
 const chrome=new T.MeshStandardMaterial({name:'Utility Rail Trim',color:0xb6beba,roughness:.32,metalness:.85});
 const vinyl=new T.MeshStandardMaterial({name:'Interior Utility Vinyl',color:0x292825,roughness:.9});
 const glass=new T.MeshPhysicalMaterial({name:'Classic Glass',color:0x293b43,transparent:true,opacity:.55,roughness:.08,metalness:.15,side:T.DoubleSide,depthWrite:false});
 const mesh=(name:string,g:T.BufferGeometry,material:T.Material)=>{const geometry=g.index?g.toNonIndexed():g;if(geometry!==g)g.dispose();const m=new T.Mesh(geometry,material);m.name=name;m.castShadow=m.receiveShadow=true;root.add(m);return m;};
 const box=(name:string,size:[number,number,number],at:[number,number,number],material:T.Material)=>{const m=mesh(name,new T.BoxGeometry(...size),material);m.position.set(...at);return m;};
 let serial=0;
 for(const child of [...donor.children]){
  if(child.name.startsWith('wheel_')){child.position.z=rear(child.position.z);child.scale.set(1,.375/.3400195,.375/.3400195);root.add(child);continue;}
  if(!(child instanceof T.Mesh))continue;
  const material=child.material as T.Material,isPaint=material.name.startsWith('paint');
  if(/^glass_(Rear|Quarter)/.test(child.name)){child.geometry.dispose();continue;}
  const interior=material.name.startsWith('Interior');
  for(const part of partitionSurface(child.geometry,[[2,-.82],[2,-.85],[2,-.89],[2,-.92],[2,-.95],[2,-1.84],[2,-2.05],[2,-2.25],[1,1.01],[0,-.70],[0,.70],[1,.60]],p=>{
   if(p.z<-.82){
    if(material.name==='Classic Brakelight')return null;
    if(p.y>1.01)return null;
    if(interior)return null;
    if(Math.abs(p.x)<.70&&p.y>.60&&p.z> -2.22)return null;
   }
   return child.name;
  })){
   const positions=part.geometry.getAttribute('position'),normals=part.geometry.getAttribute('normal');
   for(let i=0;i<positions.count;i++){const z=positions.getZ(i);positions.setZ(i,rear(z));if(z<-.82){const n=new T.Vector3(normals.getX(i),normals.getY(i),normals.getZ(i)/rearDerivative(z)).normalize();normals.setXYZ(i,n.x,n.y,n.z);}}
   mesh(part.name+'_'+serial++,part.geometry,isPaint?paint:material);
  }
  child.geometry.dispose();
 }
 const pane=(name:string,corners:[T.Vector3,T.Vector3,T.Vector3,T.Vector3],material:T.Material)=>{
  const p:number[]=[],uv:number[]=[],indices:number[]=[],steps=6;
  for(let y=0;y<=steps;y++)for(let x=0;x<=steps;x++){const u=x/steps,v=y/steps,point=corners[0].clone().lerp(corners[1],u).lerp(corners[3].clone().lerp(corners[2],u),v);p.push(...point.toArray());uv.push(u,v);}
  for(let y=0;y<steps;y++)for(let x=0;x<steps;x++){const a=y*(steps+1)+x;indices.push(a,a+1,a+steps+2,a,a+steps+2,a+steps+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(name,g,material);
 };
 const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
 // Closed rear cabin, with a shallow rake and a separate central rear window.
 const cab=(x:number,y:number)=>V(x,y,-.91+(y-1.01)*.20);
 pane('panel_CabRearLower',[cab(.735,1.01),cab(-.735,1.01),cab(-.70,1.15),cab(.70,1.15)],paint);
 pane('panel_CabRearUpper',[cab(.655,1.34),cab(-.655,1.34),cab(-.62,1.45),cab(.62,1.45)],paint);
 for(const s of [-1,1]){
  const corners=[cab(s*.50,1.15),cab(s*.70,1.15),cab(s*.655,1.34),cab(s*.50,1.34)]as[T.Vector3,T.Vector3,T.Vector3,T.Vector3];if(s>0)corners.reverse();pane('panel_CabRearPillar'+s,corners,paint);
  box('panel_CabLowerClosure'+s,[.045,.43,.13],[s*.722,.805,-.855],paint);
  // Join the cut donor roof to the raked rear wall with actual side returns.
  // Without these, the cabin has daylight seams at its lower rear corners.
  const edge=[cab(s*.735,1.01),cab(s*.70,1.15),cab(s*.655,1.34),cab(s*.62,1.45)];
  for(let i=0;i<edge.length-1;i++){
   const a=edge[i],b=edge[i+1],corners=[a.clone(),b.clone(),V(b.x,b.y,-.82),V(a.x,a.y,-.82)]as[T.Vector3,T.Vector3,T.Vector3,T.Vector3];
   if(s<0)corners.reverse();pane('panel_CabRearReturn'+s+'_'+i,corners,paint);
  }
 }
 pane('glass_Rear',[cab(.50,1.15),cab(-.50,1.15),cab(-.50,1.34),cab(.50,1.34)],glass);
 box('Interior Utility cabin back',[1.40,.48,.06],[0,.81,-.845],vinyl);
 box('panel_BedHeadwall',[1.39,.43,.06],[0,.805,-.95],paint);
 box('panel_BedFloor',[1.40,.055,1.97],[0,.605,-1.96],bed);
 for(let i=0;i<11;i++){const rib=mesh('panel_BedFloorRib'+i,new RoundedBoxGeometry(.036,.014,1.90,2,.006),bed);rib.position.set(-.60+i*.12,.641,-1.96);}
 for(const side of [-1,1]){
  box('panel_BedInnerSide'+side,[.055,.37,2.01],[side*.715,.815,-1.96],paint);
  const rail=mesh('panel_BedRail'+side,new RoundedBoxGeometry(.125,.055,2.16,3,.024),paint);rail.position.set(side*.758,1.016,-1.95);
  const trim=mesh('panel_BedRailTrim'+side,new RoundedBoxGeometry(.037,.012,2.05,2,.006),chrome);trim.position.set(side*.76,1.05,-1.95);
  const arch=mesh('panel_BedWheelhouse'+side,new T.CylinderGeometry(.46,.46,.29,20,1,false,0,Math.PI),bed);arch.rotation.z=Math.PI/2;arch.position.set(side*.61,.34,rear(-1.395));
  box('panel_BodyDoor'+(side<0?'L':'R')+'Interior',[.035,.31,1.28],[side*.77,.75,-.05],vinyl);
 }
 box('panel_TailgateInner',[1.38,.35,.065],[0,.815,-2.97],paint);
 const cap=mesh('panel_TailgateTop',new RoundedBoxGeometry(1.49,.055,.09,3,.02),paint);cap.position.set(0,1.012,-2.98);
 box('panel_TailgateHandle',[.22,.045,.025],[0,.86,-3.018],chrome);
 const lamp=new T.MeshStandardMaterial({name:'Classic Brakelight',color:0x8d1510,emissive:0xcc1b12,emissiveIntensity:.35,roughness:.3,metalness:.15});
 const seal=new T.MeshStandardMaterial({name:'Utility Window Seal',color:0x151b18,roughness:.8});
 for(const side of [-1,1]){
  const housing=mesh('panel_TailLampHousing'+side,new RoundedBoxGeometry(.105,.26,.028,3,.016),chrome);housing.position.set(side*.775,.815,-3.025);
  const lens=mesh('panel_TailLampLens'+side,new RoundedBoxGeometry(.075,.222,.020,3,.01),lamp);lens.position.set(side*.775,.815,-3.045);
  for(const y of [1.15,1.34]){const frame=mesh('panel_RearWindowSeal'+side+y,new RoundedBoxGeometry(.52,.020,.014,2,.006),seal);frame.position.copy(cab(side*.26,y));frame.position.z-=.006;}
  const upright=mesh('panel_RearWindowSealSide'+side,new RoundedBoxGeometry(.020,.205,.014,2,.006),seal);upright.position.copy(cab(side*.5,1.245));upright.position.z-=.006;upright.rotation.x=Math.atan(.20);
 }

 addMuscleEngineBay(root,steel);addClassicBayClosures(root);addClassicPanelBackings(root);
 // Shift the complete body to its measured axle midpoint; keep stock-sized
 // tires circular and use the actual longer wheelbase for future integration.
 const front=root.getObjectByName('wheel_FL')!.position.z,back=root.getObjectByName('wheel_RL')!.position.z,mid=(front+back)/2;
 for(const child of root.children)child.position.z-=mid;
 root.userData.wheelbase=front-back;root.userData.modelOffset=.8200195;root.updateMatrixWorld(true);return root;
}
