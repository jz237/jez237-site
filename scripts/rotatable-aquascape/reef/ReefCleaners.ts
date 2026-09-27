import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import anatomy from './assets/invertebrates/cleaner-shrimp.json' with {type:'json'};

type Surface={point:T.Vector3;normal:T.Vector3};
export type CleanerSurface=(x:number,z:number)=>Surface|null;
type Visitor={position:T.Vector3;velocity:T.Vector3;species:string};
type Joint={bone:T.Bone;rest:T.Quaternion};
type Foot={bones:T.Bone[];rest:T.Vector3[];world:T.Vector3;start:T.Vector3;target:T.Vector3;step:number;pair:number;side:number};
type Cleaner={root:T.Group;model:T.Object3D;joints:Map<string,Joint>;feet:Foot[];home:T.Vector3;up:T.Vector3;phase:number;clock:number;attention:number;mode:string;nextStep:number;nextLeg:number;steps:number};
const Y=new T.Vector3(0,1,0);
export const cleanerNote={title:'Pacific cleaner shrimp · a pair',description:'Two adult Lysmata amboinensis share a rock cleaning station. Look for the white dorsal stripe, red bands, jointed legs, paired eyes and six visible antenna filaments. Their antennae sweep independently; approaching fish prompt a gentle invitation dance. Tiny claws and mouthparts pick and groom between visits. A pair reflects their natural social pattern, not a universal stocking formula. Christmas tree worms were omitted because the golden butterflyfish feeds on worms and other attached invertebrates.'};
export async function loadCleanerModel(){return (await new GLTFLoader().loadAsync(new URL('./assets/invertebrates/cleaner-shrimp.glb',import.meta.url).href)).scene;}

/** Small station-bound decapods. Feet remain on actual rock between individual
 * articulated steps. No fish steering, hunger, schooling or food is overwritten.
 * Display rhythms are qualitative, not measured species locomotion values. */
export class ReefCleaners{
 readonly animals:Cleaner[]=[];readonly notes:T.Object3D[]=[];
 readonly obstacles:{center:T.Vector3;radius:number}[]=[];
 private surface:CleanerSurface;
 constructor(scene:T.Scene,template:T.Object3D,surface:CleanerSurface){
  this.surface=surface;
  const choices=[[-2.72,1.84,.35],[-2.18,1.80,2.55]];
  for(let i=0;i<choices.length;i++){
   const [x,z,yaw]=choices[i];let hit=surface(x,z);
   if(!hit)throw new Error('Cleaner station must attach to live rock');
   const root=new T.Group();root.name=`Pacific cleaner shrimp ${i+1}`;root.position.copy(hit.point);root.scale.setScalar(i?.29:.31);
   root.quaternion.setFromUnitVectors(Y,hit.normal).multiply(new T.Quaternion().setFromAxisAngle(Y,yaw));root.userData.note=cleanerNote;
   const model=clone(template);root.add(model);scene.add(root);root.updateMatrixWorld(true);
   const joints=new Map<string,Joint>();
   model.traverse(o=>{if(o instanceof T.Bone)joints.set(o.name,{bone:o,rest:o.quaternion.clone()});
    if(o instanceof T.SkinnedMesh){o.frustumCulled=false;o.castShadow=false;o.receiveShadow=true;const mat=(o.material as T.MeshStandardMaterial).clone();mat.color.setScalar(.75);mat.roughness=.43;mat.envMapIntensity=.22;o.material=mat;}
   });
   const feet:Foot[]=anatomy.legs.map(l=>{
    const rest=l.points.map(p=>new T.Vector3(...p as [number,number,number]));
    const world=root.localToWorld(rest[3].clone()),support=surface(world.x,world.z);
    if(support&&Math.abs(support.point.y-world.y)<.15)world.copy(support.point);
    return {bones:l.bones.map(n=>joints.get(n)!.bone),rest,world,start:world.clone(),target:world.clone(),step:1,pair:l.pair,side:l.side};
   });
   this.animals.push({root,model,joints,feet,home:hit.point.clone(),up:hit.normal.clone(),phase:1.7+i*3.1,clock:0,attention:0,mode:'grooming',nextStep:1+i*1.1,nextLeg:i*3,steps:0});this.notes.push(root);
   for(const x of [-.55,-.22,.15])this.obstacles.push({center:root.localToWorld(new T.Vector3(x,.24,0)),radius:root.scale.x*.23});
  }
  this.pose(0,[],false);
 }
 private rotate(a:Cleaner,name:string,x:number,y:number,z:number){const j=a.joints.get(name);if(j)j.bone.quaternion.copy(j.rest).multiply(new T.Quaternion().setFromEuler(new T.Euler(x,y,z)));}
 update(dt:number,visitors:Visitor[],night=false){if(dt<=0)return;this.pose(Math.min(dt,.05),visitors,night);}
 private pose(dt:number,visitors:Visitor[],night:boolean){
  for(const a of this.animals){
   a.clock+=dt;const t=a.clock,p=a.phase;
   const near=visitors.some(f=>f.position.distanceTo(a.home)<1.3&&f.velocity.length()<1.4);
   a.attention=T.MathUtils.damp(a.attention,near?1:0,2.2,dt);
   a.mode=a.attention>.35?'inviting nearby fish':night?'quiet antenna sweeps':'grooming';
   const wave=t*(night?.72:1)+p;
   this.rotate(a,'body',.018*Math.sin(wave*1.3),.008*Math.sin(wave*.9),a.attention*.048*Math.sin(wave*4.4));
   for(let n=0;n<6;n++)for(let k=0;k<8;k++){
    const gain=.012+k*.004,phase=wave*(.82+n*.071)-k*.55+n*1.73;
    this.rotate(a,`antenna_${n}_${k}`,Math.sin(phase)*gain,Math.sin(phase*.63+p)*gain*.65,Math.cos(phase*.87)*gain*(1+a.attention*.6));
   }
   for(let k=0;k<6;k++)this.rotate(a,`abdomen_${k}`,0,Math.sin(wave*.72-k*.4)*.006,Math.sin(wave*.57)*.006);
   for(let k=-2;k<=2;k++)this.rotate(a,`tail_${k}`,Math.sin(wave*.9+k)*.015,0,Math.sin(wave*.63)*.01);
   for(let s=0;s<2;s++){
    this.rotate(a,`maxilliped_${s}`,Math.sin(wave*(6.2+s*.6))*.10,0,Math.sin(wave*4.2+s*2)*.1);
    this.rotate(a,`eye_${s?1:-1}`,0,Math.sin(wave*.45+s)*.045,0);
    for(let k=0;k<5;k++)this.rotate(a,`pleopod_${k}_${s}`,Math.sin(wave*4.1-k*.85+s*.7)*.14,0,0);
   }
   a.root.updateMatrixWorld(true);
   // One leg at a time repositions or picks, while the other nine stay planted.
   if(dt>0&&t>=a.nextStep){
    const foot=a.feet[a.nextLeg%10];a.nextLeg=(a.nextLeg+3)%10;a.nextStep=t+(night?2.5:1.05)+.4*Math.sin(p+t*.2);
    const nominal=a.root.localToWorld(foot.rest[3].clone());nominal.x+=.01*Math.sin(t*.7+p);nominal.z+=.009*Math.cos(t*.9+p);
    const support=this.surface(nominal.x,nominal.z);
    if(support&&support.point.distanceTo(foot.world)<.09){foot.start.copy(foot.world);foot.target.copy(support.point);foot.step=0;a.steps++;}
   }
   for(const foot of a.feet){
    if(foot.step<1){foot.step=Math.min(1,foot.step+dt*1.7);const u=foot.step*foot.step*(3-2*foot.step);foot.world.lerpVectors(foot.start,foot.target,u).addScaledVector(a.up,Math.sin(foot.step*Math.PI)*.015);}
    const hip=foot.bones[0].getWorldPosition(new T.Vector3());
    const knee=a.root.localToWorld(foot.rest[1].clone()),ankle=a.root.localToWorld(foot.rest[2].clone());
    const nominal=a.root.localToWorld(foot.rest[3].clone()),delta=foot.world.clone().sub(nominal);
    knee.addScaledVector(delta,.24);ankle.addScaledVector(delta,.67);
    // Keep all segment heads coincident after solving their absolute directions.
    const points=[hip,knee,ankle,foot.world];
    for(let k=0;k<3;k++){
     const bone=foot.bones[k],parent=bone.parent!;parent.updateWorldMatrix(true,false);
     const from=parent.worldToLocal(points[k].clone()),to=parent.worldToLocal(points[k+1].clone());
     const direction=to.sub(from),length=direction.length();
     bone.position.copy(from);bone.quaternion.setFromUnitVectors(Y,direction.normalize());
     // A small telescoping correction follows uneven rock without detached joints.
     const bindLength=foot.rest[k].distanceTo(foot.rest[k+1]);
     bone.scale.y=length/bindLength;bone.updateWorldMatrix(false,true);
    }
   }
   a.root.updateMatrixWorld(true);
  }
 }
 snapshot(){return {count:this.animals.length,animals:this.animals.map(a=>({time:a.clock,mode:a.mode,attention:a.attention,steps:a.steps,position:a.root.position.toArray(),antennae:Array.from(a.joints).filter(([name])=>name.startsWith('antenna_')).map(([,j])=>j.bone.quaternion.toArray()),feet:a.feet.map(f=>({position:f.world.toArray(),stepping:f.step<1}))}))};}
}

export function cleanerRockSurface(rock:T.Mesh):CleanerSurface{
 const ray=new T.Raycaster();rock.updateWorldMatrix(true,false);
 return (x,z)=>{ray.set(new T.Vector3(x,2.1,z),new T.Vector3(0,-1,0));ray.far=2;
  const hit=ray.intersectObject(rock,false).find(h=>h.face&&h.face.normal.y>.12);
  return hit?.face?{point:hit.point.clone(),normal:hit.face.normal.clone().transformDirection(rock.matrixWorld)}:null;
 };
}
