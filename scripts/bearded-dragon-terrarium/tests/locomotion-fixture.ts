import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import * as THREE from 'three';
import {LizardModel} from '../lib/LizardModel';
import {LizardRig} from '../lib/LizardRig';
import {Surface} from '../lib/Surface';
import {Nav} from '../lib/Nav';
import {LizardBrain} from '../lib/LizardBrain';

export function model() {
  const base = new URL('../public/lizard/', import.meta.url);
  const data = JSON.parse(readFileSync(new URL('lizard.json', base), 'utf8'));
  const bin = readFileSync(new URL(data.file, base));
  return new LizardModel(data, bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength));
}

/** Actual habitat meshes, including both bowls; geometry only, with coordinates rounded to one micron. */
export function hardscape() {
  const data = JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/habitat-collision.json.gz', import.meta.url))).toString());
  const hard = data.hard.map((h:any) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(h.positions, 3));
    if (h.indices) geometry.setIndex(h.indices);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({side: THREE.DoubleSide}));
    mesh.applyMatrix4(new THREE.Matrix4().fromArray(h.matrix));
    return {mesh, kind:h.kind};
  });
  return {hard,obstacles:data.obstacles};
}

export function habitat() {
  const data=hardscape();
  const surface = new Surface(new THREE.Mesh(), data.hard), nav = new Nav(surface, data.obstacles);
  const lizard = model(), rig = new LizardRig(lizard, surface);
  const brain = new LizardBrain(rig, nav, surface, {nearest:()=>null} as any);
  return {surface, nav, lizard, rig, brain};
}

export class Audit {
  maxSlide=0; maxAnchorError=0; maxJump=0; maxPenetration=0; maxFloat=0; maxLimbError=0;
  steps=0; frames=0; worst:any={}; worstLimb:any={}; worstJump:any={};
  private previous = new Map<any,THREE.Vector3>();
  private body:THREE.Vector3|null=null;
  private previousPose:any=null;
  sample(rig:LizardRig, surface?:Surface) {
    const r=rig as any, model=rig.model;
    const pos=(bone:number)=>new THREE.Vector3().setFromMatrixPosition(model.bones[bone].matrix);
    const current=rig.spinePoints()[3];
    if(this.body&&this.body.distanceTo(current)>this.maxJump){this.maxJump=this.body.distanceTo(current);this.worstJump={frame:this.frames,from:this.body.toArray(),to:current.toArray(),previous:this.previousPose,pose:{...r.accepted}};}
    this.previousPose={...r.accepted};
    this.body=current.clone();this.frames++;
    for(const leg of r.legs) {
      const hand=pos(leg.data.bones.hand), shoulder=pos(leg.data.bones.upper), elbow=pos(leg.data.bones.lower);
      const wrist=new THREE.Vector3(0,.35,0).applyMatrix4(model.bones[leg.data.bones.hand].matrix);
      const limbError=Math.abs(elbow.distanceTo(wrist)-leg.data.lowerLength*.016);
      if(limbError>this.maxLimbError){this.maxLimbError=limbError;this.worstLimb={frame:this.frames,front:leg.front,side:leg.side,swing:leg.swing,distance:shoulder.distanceTo(wrist),reach:leg.reach,pose:r.accepted,modelShoulder:shoulder.toArray(),plannedShoulder:r.shoulder(leg).toArray(),wrist:wrist.toArray(),plannedWrist:leg.planted.clone().addScaledVector(leg.normal,.00752).toArray(),supportError:r.supportError(),wave:r.inputs.wave};}
      if(leg.swing){if(this.previous.has(leg))this.steps++;this.previous.delete(leg);continue;}
      const old=this.previous.get(leg);if(old)this.maxSlide=Math.max(this.maxSlide,old.distanceTo(hand));
      this.previous.set(leg,hand);
      const sole=hand.clone().addScaledVector(leg.normal,-.12*.016);
      this.maxAnchorError=Math.max(this.maxAnchorError,sole.distanceTo(leg.planted));
      if(surface){
        const support=surface.cast(sole.x,sole.z,sole.y+.012,{y:0,normal:new THREE.Vector3()});
        const gap=sole.y-support.y;
        if(gap>this.maxFloat){this.maxFloat=gap;this.worst={frame:this.frames,x:r.inputs.x,z:r.inputs.z,front:leg.front,sole:sole.toArray(),support:support.y};}
        this.maxPenetration=Math.max(this.maxPenetration,-gap);
      }
    }
  }
  report(){return {frames:this.frames,steps:this.steps,slide:this.maxSlide,anchor:this.maxAnchorError,jump:this.maxJump,worstJump:this.worstJump,penetration:this.maxPenetration,float:this.maxFloat,limbError:this.maxLimbError,worst:this.worst,worstLimb:this.worstLimb};}
}

/** Samples the rendered, skinned feet and limbs rather than only their IK targets. */
export class SkinAudit {
  maxPenetration=0; worst:any={}; samples=0;
  private vertices:{id:number;bone:number}[]=[];
  constructor(lizard:LizardModel){
    const g=lizard.mesh.geometry,p=g.attributes.position,ids=g.attributes.skinIndex,w=g.attributes.skinWeight;
    const groups=new Map<number,number[]>();
    for(const l of lizard.data.limbs)for(const b of [l.bones.upper,l.bones.lower,l.bones.hand,...l.bones.digits])groups.set(b,[]);
    for(let i=0;i<p.count;i++)for(let j=0;j<4;j++){const b=ids.getComponent(i,j);if(w.getComponent(i,j)>.7 && groups.has(b))groups.get(b)!.push(i);}
    for(const [bone,all] of groups){
      all.sort((a,b)=>p.getY(a)-p.getY(b));
      const chosen=new Set<number>();for(let i=0;i<12;i++)chosen.add(all[Math.floor(i*all.length/12)]);
      for(const id of chosen)if(id!==undefined)this.vertices.push({id,bone});
    }
  }
  sample(rig:LizardRig,surface:Surface,frame:number){
    const lizard=rig.model,g=lizard.mesh.geometry,p=new THREE.Vector3(),q=new THREE.Vector3(),n=new THREE.Vector3();
    lizard.root.updateMatrixWorld(true);
    for(const {id,bone} of this.vertices){
      p.fromBufferAttribute(g.attributes.position,id);lizard.mesh.applyBoneTransform(id,p);p.applyMatrix4(lizard.mesh.matrixWorld);
      q.copy(p);surface.tailContacts.projectPoint(p,q,0,n.set(0,0,0));const depth=Math.max(0,p.distanceTo(q)-.0005);this.samples++;
      if(depth>this.maxPenetration){
        this.maxPenetration=depth;this.worst={frame,depth,id,bone:lizard.data.bones[bone].name,p:p.toArray(),root:[rig.inputs.x,rig.inputs.z]};
        if(depth>.003){
          const r=rig as any,l=r.legs.find((l:any)=>[l.data.bones.upper,l.data.bones.lower].includes(bone));
          if(l){const S=new THREE.Vector3().setFromMatrixPosition(lizard.bones[l.data.bones.upper].matrix),W=new THREE.Vector3(0,.35,0).applyMatrix4(lizard.bones[l.data.bones.hand].matrix),local=new THREE.Vector3().fromBufferAttribute(g.attributes.position,id).applyMatrix4(lizard.bind[bone].clone().invert()).multiplyScalar(.016),part=bone===l.data.bones.upper?0:1;
            this.worst.contact={swing:l.swing,phase:l.swingT,obstruction:r.limbObstruction(l,S,W,l.bendDirection),supportError:r.supportError(),local:local.toArray(),nearest:Math.min(...l.limbSkin[part].map((v:THREE.Vector3)=>v.distanceTo(local))),S:S.toArray(),W:W.toArray(),E:new THREE.Vector3().setFromMatrixPosition(lizard.bones[l.data.bones.lower].matrix).toArray(),plane:l.bendDirection.toArray()};}
        }
      }
    }
  }
}
