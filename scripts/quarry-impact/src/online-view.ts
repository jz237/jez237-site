import {puddleDepth,type Puddle} from './puddle-splashes';
import {tyreFeedback} from './tyre-feedback';
import {isImpactMaterial} from './impact-material';
import {getRaceCourse,type RaceCourse} from './race-course';
import {withWreckBatch} from './wreck-batch';
import {vehicleSuspensionRestLength} from './vehicle-physics';
import {sameOnlineSetup} from './online-setup';
import {wheelResponse} from './wheel-physics';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { QuarryNetwork, type Snapshot } from './network';
import { Vehicle } from './vehicle';
import { Effects } from './effects';
import { Sound } from './audio';
import { DEFINITIONS } from './rules';

/** Only the server advances event rules and car physics in an online room. */
export class OnlineView {
  readonly network = new QuarryNetwork();
  active = false;
  onLocalImpact:(damage:number)=>void=()=>{};
  private repairs = new Map<number, number>();
  private lastTick = -1;
  private lastLiveryRevision=-1;
  private lastFx = 0;
  private initialized = false;
  private appliedDamage = new Set<number>();
  constructor(private scene:T.Scene, private world:R.World, private fx:Effects, private sound:Sound,
    private getCars:()=>Vehicle[], private setCars:(cars:Vehicle[])=>void) {this.network.addEventListener('liveries',()=>{if(this.network.snapshot)this.applyLiveries(this.network.snapshot);});}

  private course:RaceCourse=getRaceCourse();
  private waters:Puddle[]=[];
  setWorld(world:R.World,course:RaceCourse=getRaceCourse(),waters:Puddle[]=[]){this.waters=waters;if(this.world!==world||this.course!==course){this.world=world;this.course=course;this.reset();}}

  reset() { this.repairs.clear(); this.appliedDamage.clear(); this.lastTick=-1; this.lastLiveryRevision=-1; this.initialized=false; }
  disconnect() { this.active=false; this.network.disconnect(); this.reset(); }

  receive(s:Snapshot){return withWreckBatch(()=>this.receiveNow(s));}
  private receiveNow(s:Snapshot){
    const old=this.getCars();
    const rebuild=!this.initialized || s.cars.some(c=>c.dents!==undefined) || s.tick<this.lastTick || s.cars.length!==old.length ||
      s.cars.some(c=>old.find(v=>v.id===c.id)?.kind!==c.kind||!sameOnlineSetup(old.find(v=>v.id===c.id)?.setup,c.setup,c.kind));
    if(rebuild) {
      this.lastLiveryRevision=-1;
      this.sound.clearCars(); old.forEach(c=>c.dispose()); this.fx.reset(); this.repairs.clear(); this.appliedDamage.clear();
      const cars=s.cars.map(c=>{
        const v=new Vehicle(c.id,c.kind,DEFINITIONS[c.kind].color,this.scene,this.world,this.fx,c.setup?{...c.setup,livery:[]}:undefined,this.course);
        v.body.setBodyType(R.RigidBodyType.KinematicPositionBased,true);
        return v;
      }).sort((a,b)=>a.id===this.network.id?-1:b.id===this.network.id?1:a.id-b.id);
      this.setCars(cars); this.sound.attach(cars); this.initialized=true;
    }
    this.applyLiveries(s);
    this.lastTick=s.tick;
    for(const c of this.getCars()) {
      const at=s.cars.find(v=>v.id===c.id); if(!at)continue;
      if(this.repairs.get(c.id)!==at.repair) { c.repair(); this.repairs.set(c.id,at.repair); }
      c.current.copy(at.p); c.currentQ.copy(at.q); c.root.position.copy(at.p); c.root.quaternion.copy(at.q);
      c.velocity.copy(at.v);
    }
    const history=s.cars.flatMap(c=>(c.dents??[]).map(d=>({...d,car:c.id,tick:-1000})));
    for(const hit of [...history,...this.network.drainDamage()]) {
      const c=this.getCars().find(v=>v.id===hit.car); if(!c)continue;
      if(this.appliedDamage.has(hit.id) || hit.repair!==this.repairs.get(c.id))continue;
      this.appliedDamage.add(hit.id);
      const point=new T.Vector3().copy(hit.localPoint).applyQuaternion(c.currentQ).add(c.current);
      const direction=new T.Vector3().copy(hit.localDirection).applyQuaternion(c.currentQ);
      // Apply before authoritative condition so the collision which disables a car still deforms it.
      if(hit.scar)c.scar(point,direction);
      else c.hit(point,direction,hit.damage/c.specification.damageScale,s.elapsed,hit.tick<0);
      if(!hit.scar && this.network.connected && s.tick-hit.tick<8) {
        if(hit.car===this.network.id&&hit.tick>=0&&hit.tick<=s.tick)this.onLocalImpact(hit.damage);
        this.sound.impact(hit.damage,point,c.impactEffects.glass,c.impactEffects.debris,'material'in hit&&isImpactMaterial(hit.material)?hit.material:undefined);
      }
    }
    const repeated=new Set(s.damage.map(d=>d.id));
    for(const id of this.appliedDamage)if(!repeated.has(id))this.appliedDamage.delete(id);
    this.apply(s,0);
  }

  private applyLiveries(s:Snapshot){
    const frame=this.network.liveries;if(!frame||frame.revision!==s.liveryRevision||this.lastLiveryRevision===frame.revision)return;
    for(const car of this.getCars()){const row=frame.cars.find(v=>v.id===car.id&&v.kind===car.kind);car.setup.livery=structuredClone(row?.layers??[]);car.livery.set(car.setup.livery);}
    this.lastLiveryRevision=frame.revision;
  }
  apply(s:Snapshot,dt:number) {
    for(const c of this.getCars()) {
      const at=s.cars.find(v=>v.id===c.id); if(!at)continue;
      c.previous.copy(at.p); c.current.copy(at.p); c.previousQ.copy(at.q); c.currentQ.copy(at.q);
      c.root.position.copy(at.p); c.root.quaternion.copy(at.q);
      c.body.setTranslation(at.p,true); c.body.setRotation(at.q,true);
      c.body.setLinvel(at.v,true); c.body.setAngvel(at.av,true);
      c.velocity.copy(at.v); c.forward.set(0,0,1).applyQuaternion(c.currentQ); c.right.set(1,0,0).applyQuaternion(c.currentQ);
      for(const key of ['health','inflicted','damageLeft','damageRight','steering','speed','rpm','gear','passed','nextCheckpoint','lap','finished','finishTime','penalty'] as const) {
        (c as any)[key]=at[key];
      }
      // Legacy rooms report only general health; do not invent authoritative
      // engine condition from incomplete visual hit packets.
      c.engineDamage=at.components?.engineDamage;
      c.engineStall=at.engineStall;
      c.transmission=at.transmission?{...at.transmission}:undefined;
      c.tyreDamage=at.components?.tyreDamage?.slice();
      c.structuralDamage=at.components?.structure?.slice();
      c.structure.update(c.structuralDamage,c.health);
      c.input=at.input; c.surface=at.surface;
      c.slip=at.slip;
      c.remoteGrounded=at.wheels.some(w=>w.contact);
      c.remoteWheelAngles=at.wheels.map(w=>w.rotation);
      c.wheelSlips.splice(0,4,...at.wheels.map(w=>w.slip??at.slip));
      for(const material of c.brakeLights)material.emissiveIntensity=at.input.brake>.05||at.input.handbrake?3.5:.8;
      if(at.components){
        c.wreckParts.wheelDamage.set(at.components.wheelDamage);
        c.wreckParts.wheelShift.forEach((v,i)=>v.copy(at.components!.wheelShift[i]));
      }
      c.wheels.forEach((w,i)=>{
        w.position.y=-c.model.position.y-.12-(at.wheels[i]?.suspension??vehicleSuspensionRestLength(c.kind));
        const corner=wheelResponse(c.wreckParts.wheelDamage[i],i%2?1:-1,at.speed);
        w.rotation.set(0,(i<2?at.steering:0)+corner.toe,0);
        w.rotateX(-(at.wheels[i]?.rotation??0));
      });
      c.syncSuspension();
      c.syncTyres();
      c.waters=this.waters;
      c.remoteContactPoints=at.wheels.map((wheel,i)=>{
        if(!wheel.contact)return null;
        const p=c.wheels[i].getWorldPosition(new T.Vector3()),plane=wheel.patch?.plane;
        if(plane){const n=new T.Vector3(plane[0],plane[1],plane[2]),length=n.lengthSq();if(length>1e-8)p.addScaledVector(n,-(n.dot(p)+plane[3])/length);else return null;}
        else p.y=this.course.height(p.x,p.z);
        return p;
      });
      const wet=c.remoteContactPoints.map(p=>!!p&&this.waters.some(w=>puddleDepth(w,p.x,p.y,p.z)>0));
      c.surfaceFinish.advance(dt,c.speed,c.surface!=='asphalt',wet,at.wheels.map(w=>w.contact));
      c.tireContacts.forEach((contact,i)=>{
        const wheel=at.wheels[i],patch=wheel?.patch;
        contact.active.value=patch&&wheel.contact?1:0;contact.load.value=patch?.load??0;
        if(patch)contact.plane.value.fromArray(patch.plane);
        contact.dirt.value=i%2?c.surfaceFinish.coating.value.w:c.surfaceFinish.coating.value.z;
      });
    }
    this.lastFx+=dt;
    if(this.lastFx>.07) {
      this.lastFx=0;
      for(const c of this.getCars()) {
        if(c.health<42) this.fx.emit(c.current.clone().addScaledVector(c.forward,1.45).add(new T.Vector3(0,.05,0)),1,2,.3);
        const state=s.cars.find(v=>v.id===c.id);
        for(let i=0;i<4;i++){
          const p=c.remoteContactPoints?.[i];if(!p)continue;
          const wet=this.waters.some(w=>puddleDepth(w,p.x,p.y,p.z)>0);
          const feedback=tyreFeedback(c.surface,c.speed,c.wheelSlips[i],c.input.handbrake,i,!!state?.wheels[i]?.contact,wet);
          if(!feedback.count&&!feedback.skid)continue;
          if(feedback.count)this.fx.emit(p,feedback.count,feedback.type,feedback.force);
          if(feedback.skid&&c.surface==='asphalt')this.fx.mark(p,Math.atan2(c.forward.x,c.forward.z),feedback.markLength);
        }
      }
    }
  }
}
