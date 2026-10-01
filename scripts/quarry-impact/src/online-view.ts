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
  private repairs = new Map<number, number>();
  private lastTick = -1;
  private lastLiveryRevision=-1;
  private lastFx = 0;
  private initialized = false;
  private appliedDamage = new Set<number>();
  constructor(private scene:T.Scene, private world:R.World, private fx:Effects, private sound:Sound,
    private getCars:()=>Vehicle[], private setCars:(cars:Vehicle[])=>void) {this.network.addEventListener('liveries',()=>{if(this.network.snapshot)this.applyLiveries(this.network.snapshot);});}

  reset() { this.repairs.clear(); this.appliedDamage.clear(); this.lastTick=-1; this.lastLiveryRevision=-1; this.initialized=false; }
  disconnect() { this.active=false; this.network.disconnect(); this.reset(); }

  receive(s:Snapshot) {
    const old=this.getCars();
    const rebuild=!this.initialized || s.cars.some(c=>c.dents!==undefined) || s.tick<this.lastTick || s.cars.length!==old.length ||
      s.cars.some(c=>old.find(v=>v.id===c.id)?.kind!==c.kind||!sameOnlineSetup(old.find(v=>v.id===c.id)?.setup,c.setup,c.kind));
    if(rebuild) {
      this.lastLiveryRevision=-1;
      this.sound.clearCars(); old.forEach(c=>c.dispose()); this.fx.reset(); this.repairs.clear(); this.appliedDamage.clear();
      const cars=s.cars.map(c=>{
        const v=new Vehicle(c.id,c.kind,DEFINITIONS[c.kind].color,this.scene,this.world,this.fx,c.setup?{...c.setup,livery:[]}:undefined);
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
      c.hit(point,direction,hit.damage/c.specification.damageScale,s.elapsed,hit.tick<0);
      if(this.network.connected && s.tick-hit.tick<8) {
        this.sound.shot(hit.damage>15?'impact-heavy':hit.damage>5?'impact-medium':'impact-light',point,Math.min(.8,.25+hit.damage/30));
        if(hit.damage>7)this.sound.shot('glass',point,.15);
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
      c.input=at.input; c.surface=at.surface;
      c.slip=at.slip;
      c.remoteGrounded=at.wheels.some(w=>w.contact);
      for(const material of c.brakeLights)material.emissiveIntensity=at.input.brake>.05||at.input.handbrake?3.5:.8;
      if(at.components){
        c.wreckParts.wheelDamage.set(at.components.wheelDamage);
        c.wreckParts.wheelShift.forEach((v,i)=>v.copy(at.components!.wheelShift[i]));
      }
      c.wheels.forEach((w,i)=>{
        w.position.y=-c.model.position.y-.12-(at.wheels[i]?.suspension??.36);
        const corner=wheelResponse(c.wreckParts.wheelDamage[i],i%2?1:-1,at.speed);
        w.rotation.set(0,(i<2?at.steering:0)+corner.toe,0);
        w.rotateX(-(at.wheels[i]?.rotation??0));
      });
    }
    this.lastFx+=dt;
    if(this.lastFx>.07) {
      this.lastFx=0;
      for(const c of this.getCars()) {
        if(c.health<42) this.fx.emit(c.current.clone().addScaledVector(c.forward,1.45).add(new T.Vector3(0,.05,0)),1,2,.3);
        if(c.surface==='gravel' && Math.abs(c.speed)>3) for(const i of [2,3]) {
          const p=c.wheels[i].getWorldPosition(new T.Vector3());p.y-=.3;this.fx.emit(p,1,0,Math.abs(c.speed)*.04);
        }
      }
    }
  }
}
