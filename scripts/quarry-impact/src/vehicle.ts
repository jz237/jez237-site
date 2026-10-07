import {cancelWreckNormals} from './wreck-batch';
import {markCollision} from './collision-scars';
import {BuggySuspension} from './buggy-suspension';
import {applyComponentImpact} from './component-damage';
import {tyreFailure,vehicleFlatTyreRadius} from './tyre-condition';
import {vehicleChassisHalfExtents,vehicleSuspensionRestLength,vehicleSuspensionTravel} from './vehicle-physics';
import {isClassicKind,classicWheelHalfTrack,vehicleWheelRadius} from './classic-vehicle-specs';
import {createVehiclePhysics,stepVehiclePhysics,rotateVehicleVector} from './vehicle-physics';
import {LiveryPaint} from './livery-paint';
import type {VisualEvent} from './replay-data';
import {ImpactResponse} from './impact-response';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { cloneCar } from './assets';
import {
  DEFINITIONS,
  clamp,
  surfaceAt,
  type CarKind,
} from './rules';
import { Effects } from './effects';
import { landscapeHeight } from './quarry-layout';
import type { GlassState } from './car-materials';
import { repairCoupePanel } from './coupe-realism';
import { dentGeometry, repairWreckGeometry } from './wreck-geometry';
import { WreckFinish } from './wreck-finish';
import { WreckAttachments } from './wreck-attachments';
import {bodyworkDentDamage} from './bodywork-response';
import {puddleDepth,type Puddle} from './puddle-splashes';
import {wheelResponse,TireContact} from './wheel-mechanics';
import {VehicleSurface} from './vehicle-surface';
import { normalizeSetup, setupPhysics, stockSetup, type Setup } from './garage';
export type VehicleGround = {height:(x:number,z:number)=>number;surface:(x:number,z:number)=>'asphalt'|'gravel'};
export type Input = {
  throttle: number;
  steer: number;
  brake: number;
  handbrake: boolean;
};
export class Vehicle {
  readonly suspension?:BuggySuspension;
  syncSuspension(){this.suspension?.update();}
  onVisualEvent?: (event:VisualEvent)=>void;
  private visualPose(){return [...this.current.toArray(),...this.currentQ.toArray()];}
  body: R.RigidBody;
  collider: R.Collider;
  roof: R.Collider;
  controller: R.DynamicRayCastVehicleController;
  root = new T.Group();
  model: T.Group;
  readonly wreckFinish: WreckFinish;
  readonly wreckParts: WreckAttachments;
  readonly tireContacts:TireContact[];
  /** Replays and network views supply wheel poses without stepping a controller. */
  syncTyres(){
    this.tireContacts.forEach((contact,i)=>{
      const damage=this.tyreDamage?.[i];
      contact.setCondition(damage===undefined?undefined:{failure:tyreFailure(damage),radius:wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),damage,vehicleFlatTyreRadius(this.kind)).radius,baseRadius:wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),0,vehicleFlatTyreRadius(this.kind)).radius});
    });
  }
  readonly paintColor:T.Color;
  readonly livery:LiveryPaint;
  readonly surfaceFinish:VehicleSurface;
  private wetWheels=[false,false,false,false];
  private groundedWheels=[false,false,false,false];
  scraping=0;
  wheels: T.Object3D[] = [];
  panels: T.Mesh[] = [];
  readonly impactResponse = new ImpactResponse();
  impactEffects = {glass:false,debris:false};
  glass: T.Mesh[] = [];
  brakeLights = new Set<T.MeshStandardMaterial>();
  health = 100;
  /** Undefined only for an older online authority without component condition. */
  engineDamage:number|undefined = 0;
  /** Missing on legacy snapshots/replays: do not infer flats from bent wheels. */
  tyreDamage:number[]|undefined = [0,0,0,0];
  inflicted = 0;
  speed = 0;
  rpm = 850;
  gear = 1;
  oldGear = 1;
  steering = 0;
  input: Input = { throttle: 0, steer: 0, brake: 0, handbrake: false };
  slip = 0;
  remoteGrounded?: boolean;
  surface:'asphalt'|'gravel' = 'gravel';
  damageLeft = 0;
  damageRight = 0;
  readonly damageZones={front:0,rear:0,left:0,right:0,roof:0};
  arenaSurface?:{x:number;z:number;radius:number};
  waters:Puddle[]=[];
  stuck = 0;
  reverse = 0;
  target = 0;
  nextCheckpoint = 1;
  checkpointDistance = Infinity;
  passed = 0;
  lap = 1;
  finished = false;
  finishTime = 0;
  penalty = 0;
  lastHit = -100;
  lastDamage = 0;
  impactSerial = 0;
  lastFx = 0;
  rollTime = 0;
  offTrackTime = 0;
  previous = new T.Vector3();
  previousQ = new T.Quaternion();
  current = new T.Vector3();
  currentQ = new T.Quaternion();
  velocity = new T.Vector3();
  forward = new T.Vector3();
  right = new T.Vector3();
  wheelSpin = 0;
  aiPhase: number;
  readonly setup: Setup;
  readonly specification: ReturnType<typeof setupPhysics>;
  constructor(
    public id: number,
    public kind: CarKind,
    color: number,
    public scene: T.Scene,
    public world: R.World,
    public fx: Effects,
    setup?: Setup,
    readonly ground:VehicleGround = {height:landscapeHeight,surface:surfaceAt},
  ) {
    this.setup = normalizeSetup(setup ?? stockSetup(kind), kind);
    this.specification = setupPhysics(kind, this.setup);
    const def = {...DEFINITIONS[kind], mass:this.specification.mass};
    this.aiPhase = id * 1.79;
    this.model = cloneCar(kind, color, this.setup.armor);
    this.paintColor=new T.Color(color);
    this.root.add(this.model);
    scene.add(this.root);
    const physical=createVehiclePhysics(R,world,kind,def.mass,this.setup.armor);
    this.body=physical.body;this.collider=physical.collider;this.roof=physical.roof;this.controller=physical.controller;
    for(const name of ['FL','FR','RL','RR'])this.wheels.push(this.model.getObjectByName('wheel_'+name)!);
    this.model.traverse((o) => {
      if (o instanceof T.Mesh) {
        if (o.name.startsWith('panel_')) this.panels.push(o);
        if (o.name.startsWith('glass_')) this.glass.push(o);
        const mat = o.material as T.MeshStandardMaterial;
        if (mat.name.includes('Brakelight')) this.brakeLights.add(mat);
      }
    });
    this.wreckFinish = new WreckFinish(this.model,def.halfLength,kind==='marten'?new T.Vector3(0,.84,-1.56):kind==='buggy'?new T.Vector3(0,.67,-1.4):undefined);
    this.wreckParts = new WreckAttachments(this.model,this.wheels,def.halfWidth,vehicleWheelRadius(kind));
    if(kind==='buggy')this.suspension=new BuggySuspension(this.model);
    this.tireContacts=this.wheels.map(w=>new TireContact(w,kind,vehicleWheelRadius(kind)));
    this.surfaceFinish=new VehicleSurface(this.model,id);
    this.livery=new LiveryPaint(this.model);this.livery.set(this.setup.livery);
    if(setup)this.setPaint(this.setup.paint,this.setup.trim);
  }
  setPaint(paint: number, trim: number) {
    this.paintColor.setHex(paint);
    this.model.traverse(o=>{
      if(!(o instanceof T.Mesh))return;
      for(const m of Array.isArray(o.material)?o.material:[o.material]) {
        if(m instanceof T.MeshStandardMaterial && m.name.startsWith('paint'))m.color.setHex(m.name.includes('Paint 2')?trim:paint);
      }
    });
  }
  place(x: number, z: number, yaw: number, repair = false) {
    const p = { x, y: this.ground.height(x, z) + 0.89, z };
    const q = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw);
    this.body.setTranslation(p, true);
    this.body.setRotation(q, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.previous.copy(p);
    this.current.copy(p);
    this.previousQ.copy(q);
    this.currentQ.copy(q);
    this.root.position.copy(p);
    this.root.quaternion.copy(q);
    this.rollTime = 0;
    this.stuck = 0;
    this.onVisualEvent?.({kind:'jump',pose:this.visualPose()});
    if (repair) this.repair();
  }
  repair() {
    this.onVisualEvent?.({kind:'repair',pose:this.visualPose()});
    this.wreckFinish.reset();
    this.wreckParts.reset();
    this.suspension?.reset();
    this.surfaceFinish.reset();
    this.impactResponse.reset();
    this.impactEffects = {glass:false,debris:false};
    this.health = 100;
    this.engineDamage = 0;
    this.tyreDamage = [0,0,0,0];
    this.tireContacts.forEach(contact=>contact.reset());
    this.damageLeft = this.damageRight = 0;
    for(const zone of Object.keys(this.damageZones)as (keyof typeof this.damageZones)[])this.damageZones[zone]=0;
    this.lastHit = -100;
    this.lastDamage = 0;
    this.scraping=0;
    this.impactSerial = 0;
    for(let i=0;i<4;i++){
      const d=DEFINITIONS[this.kind];
      this.controller.setWheelChassisConnectionPointCs(i,{x:isClassicKind(this.kind)?(i%2?1:-1)*classicWheelHalfTrack(this.kind):(i%2?1:-1)*(d.halfWidth-.04),y:-.12,z:(i<2?1:-1)*d.wheelbase/2});
      this.controller.setWheelSuspensionRestLength(i,vehicleSuspensionRestLength(this.kind));this.controller.setWheelMaxSuspensionTravel(i,vehicleSuspensionTravel(this.kind));this.controller.setWheelRadius(i,vehicleWheelRadius(this.kind));
      this.controller.setWheelMaxSuspensionForce(i,13000);this.controller.setWheelSuspensionStiffness(i,30);
      this.controller.setWheelSideFrictionStiffness(i,1.1);this.controller.setWheelAxleCs(i,{x:-1,y:0,z:0});
      this.controller.setWheelSteering(i,0);this.controller.setWheelBrake(i,0);
    }
    this.roof.setEnabled(true);
    this.collider.setHalfExtents(vehicleChassisHalfExtents(this.kind));
    for (const p of this.panels) {
      cancelWreckNormals(p);
      p.visible = true;
      p.userData.damage = 0;
      (p.geometry.attributes.position.array as Float32Array).set(
        p.userData.original,
      );
      p.geometry.attributes.position.needsUpdate = true;
      if (p.userData.originalNormals) {
        (p.geometry.attributes.normal.array as Float32Array).set(p.userData.originalNormals);
        p.geometry.attributes.normal.needsUpdate = true;
      } else p.geometry.computeVertexNormals();
      p.geometry.computeBoundingBox();p.geometry.computeBoundingSphere();
      const wear = p.geometry.attributes.impactWear;
      if (wear) { (wear.array as Float32Array).fill(0); wear.needsUpdate = true; }
      repairCoupePanel(p);
      p.userData.engineShift?.set(0,0,0);
      if(p.geometry.attributes.transferPaint){(p.geometry.attributes.transferPaint.array as Float32Array).fill(0);p.geometry.attributes.transferPaint.needsUpdate=true;}
      p.geometry.deleteAttribute('color');
      (p.material as T.MeshStandardMaterial).vertexColors = false;
      (p.material as T.Material).needsUpdate = true;
    }
    for (const g of this.glass) {
      repairWreckGeometry(g);
      g.visible = true;
      g.userData.damage = 0;
      (g.material as T.MeshStandardMaterial).opacity = isClassicKind(this.kind) ? .55 : this.kind === 'coupe' ? .24 : .28;
      const state = (g.material as T.Material).userData.glassState as GlassState | undefined;
      if (state) state.damage.value = 0;
    }
  }
  preStep(dt: number) {
    this.previous.copy(this.body.translation());
    this.previousQ.copy(this.body.rotation());
    this.velocity.copy(this.body.linvel());
    this.forward.set(0, 0, 1).applyQuaternion(this.previousQ);
    this.right.set(1, 0, 0).applyQuaternion(this.previousQ);
    this.speed = this.velocity.dot(this.forward);
    const lateral = this.velocity.dot(this.right);
    this.slip = Math.abs(lateral);
    this.surface = this.ground.surface(this.previous.x, this.previous.z);
    if(this.arenaSurface&&Math.hypot(this.previous.x-this.arenaSurface.x,this.previous.z-this.arenaSurface.z)<this.arenaSurface.radius)this.surface='gravel';
    this.oldGear=this.gear;
    stepVehiclePhysics(this.body,this.controller,this.kind,this.specification,this,dt,this.wreckParts.wheelDamage,this.wreckParts.wheelShift,this.engineDamage,this.tyreDamage);
  }
  postStep(dt: number, time: number) {
    this.current.copy(this.body.translation());
    this.currentQ.copy(this.body.rotation());
    const up = new T.Vector3(0, 1, 0).applyQuaternion(this.currentQ);
    this.rollTime = up.y < 0.2 ? this.rollTime + dt : 0;
    this.root.position.copy(this.current);
    this.root.quaternion.copy(this.currentQ);
    for(let i=0;i<4;i++){
      const point=this.controller.wheelContactPoint(i);
      this.groundedWheels[i]=this.controller.wheelIsInContact(i);
      this.wetWheels[i]=!!point&&this.groundedWheels[i]&&this.waters.some(w=>puddleDepth(w,point.x,point.y,point.z)>0);
    }
    this.surfaceFinish.advance(dt,this.speed,this.surface==='gravel',this.wetWheels,this.groundedWheels);
    if (time - this.lastFx > 0.06) {
      this.lastFx = time;
      this.scraping=0;
      for (let i = 0; i < 4; i++) {
        const point = this.controller.wheelContactPoint(i);
        if (!point || !this.controller.wheelIsInContact(i)) continue;
        const p = new T.Vector3().copy(point);
        const wet=this.surfaceFinish.water[i],yaw=Math.atan2(this.forward.x,this.forward.z);
        if(wet>.035&&Math.abs(this.speed)>.5&&!this.wetWheels[i]&&Math.abs(p.y-this.ground.height(p.x,p.z))<.15)this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.07,wet,0);
        if(this.wetWheels[i])continue;
        if (Math.abs(this.speed) > 3 && this.surface === 'gravel')
          this.fx.emit(p, 1, 0, Math.abs(this.speed) * 0.04);
        if (this.slip > 2 || this.input.handbrake) {
          if (this.surface === 'asphalt')
            this.fx.mark(
              p,
              Math.atan2(this.forward.x, this.forward.z),
              Math.max(0.2, Math.abs(this.speed) * 0.09),
            );
          else this.fx.emit(p, 2, 0, 1);
          if(this.surface==='gravel')this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.07,Math.min(.65,this.slip*.06),1);
        }
      }
      if(this.wreckParts.assemblies.some(a=>a.name.includes('bumper')&&a.loose>.55))this.model.updateWorldMatrix(true,true);
      for(const a of this.wreckParts.assemblies){
        if(!a.name.includes('bumper')||a.loose<.55||!a.members.some(m=>m.mesh.visible))continue;
        const p=a.bounds.getCenter(new T.Vector3());p.y=a.bounds.min.y-a.loose*.19;p.x+=a.side*this.wreckPartsWidth();p.applyMatrix4(this.model.matrixWorld);
        const ground=this.ground.height(p.x,p.z);
        if(p.y>ground+.07||Math.abs(this.speed)<1)continue;
        this.scraping=Math.min(1,a.loose*Math.abs(this.speed)/12);p.y=ground;
        this.fx.evidence?.add(p,Math.atan2(this.forward.x,this.forward.z),Math.abs(this.speed)*.08,this.scraping,2);
        if(this.scraping>.25)this.fx.emit(p,1,1,.8);
      }
    }
  }
  render(alpha: number) {
    this.root.position.lerpVectors(this.previous, this.current, alpha);
    this.root.quaternion.slerpQuaternions(this.previousQ, this.currentQ, alpha);
    for (const material of this.brakeLights) material.emissiveIntensity = this.input.brake > .05 || this.input.handbrake ? 3.5 : .8;
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      if (!w) continue;
      w.position.y =
        -this.model.position.y - 0.12 - (this.controller.wheelSuspensionLength(i) ?? vehicleSuspensionRestLength(this.kind));
      const tyre=this.tyreDamage?.[i],corner=wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),tyre,vehicleFlatTyreRadius(this.kind));
      w.rotation.set(0,(i<2?this.steering:0)+corner.toe,0);
      w.rotateX(-(this.controller.wheelRotation(i) ?? 0));
      const coating=this.surfaceFinish.coating.value;
      this.tireContacts[i].update(this.controller,i,this.specification.mass,this.wreckParts.wheelDamage[i],i%2?coating.w:coating.z,tyre===undefined?undefined:{failure:tyreFailure(tyre),radius:corner.radius,baseRadius:wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),0,vehicleFlatTyreRadius(this.kind)).radius});
    }
    this.syncSuspension();
  }
  private wreckPartsWidth(){return DEFINITIONS[this.kind].halfWidth*.62;}
  scar(point:T.Vector3,direction:T.Vector3,otherPaint?:T.Color){
    this.root.updateMatrixWorld(true);
    const contact=this.model.worldToLocal(point.clone()),axis=direction.clone().transformDirection(this.model.matrixWorld.clone().invert());
    if(!markCollision(this.panels,contact,axis,this.surfaceFinish,otherPaint))return false;
    if(this.onVisualEvent){const inverse=this.root.quaternion.clone().invert();this.onVisualEvent({kind:'hit',pose:[...this.root.position.toArray(),...this.root.quaternion.toArray()],point:point.clone().sub(this.root.position).applyQuaternion(inverse).toArray(),direction:direction.clone().applyQuaternion(inverse).toArray(),damage:0,health:this.health,scar:true,...(otherPaint?{paint:otherPaint.getHex()}:{})});}
    return true;
  }
  hit(point: T.Vector3, direction: T.Vector3, damage: number, time: number, quiet = false,otherPaint?:T.Color) {
    damage *= this.specification.damageScale;
    this.impactEffects = {glass:false,debris:false};
    if (damage < 0.1 || this.health <= 0) return;
    if(this.onVisualEvent){const inverse=this.root.quaternion.clone().invert();this.onVisualEvent({kind:'hit',pose:[...this.root.position.toArray(),...this.root.quaternion.toArray()],point:point.clone().sub(this.root.position).applyQuaternion(inverse).toArray(),direction:direction.clone().applyQuaternion(inverse).toArray(),damage:damage/this.specification.damageScale,health:this.health,...(otherPaint?{paint:otherPaint.getHex()}:{})});}
    this.health = Math.max(0, this.health - damage);
    this.lastHit = time;
    this.lastDamage = damage;
    this.impactSerial++;
    if (!quiet) this.impactResponse.kick(direction,damage,direction.dot(this.right),direction.dot(this.forward));
    this.root.updateMatrixWorld(true);
    // Use the same quaternion arithmetic as the authority for mechanical damage.
    // Matrix inversion differences can accumulate into different wheel forces.
    // The rendered pose also supports replay hits while its body is disabled.
    const q=this.root.quaternion,p=this.root.position,inverse={x:-q.x,y:-q.y,z:-q.z,w:q.w};
    const local=rotateVehicleVector({x:point.x-p.x,y:point.y-p.y,z:point.z-p.z},inverse);
    const components={engineDamage:this.engineDamage,tyreDamage:this.tyreDamage,wheelDamage:Array.from(this.wreckParts.wheelDamage),wheelShift:this.wreckParts.wheelShift.map(v=>({x:v.x,y:v.y,z:v.z}))};
    applyComponentImpact(components,this.kind,local,rotateVehicleVector(direction,inverse),damage);
    if (local.x < 0) this.damageLeft += damage;
    else this.damageRight += damage;
    const contact = this.model.worldToLocal(point.clone());
    const zone=contact.y>(this.kind==='van'?1.76:1.35)?'roof':contact.z>DEFINITIONS[this.kind].halfLength*.35?'front':contact.z<-DEFINITIONS[this.kind].halfLength*.35?'rear':contact.x<0?'left':'right';
    this.damageZones[zone]+=damage;
    const dentDamage=bodyworkDentDamage(damage);
    const impactDirection = direction.clone().transformDirection(this.model.matrixWorld.clone().invert());
    const assemblies = new Map<string, { panels: T.Mesh[]; damage: number; weight: number }>();
    for (const panel of this.panels) {
      if (!panel.visible) continue;
      const maximum = dentGeometry(panel, contact, impactDirection, dentDamage);
      panel.userData.damage = (panel.userData.damage || 0) + dentDamage * maximum;
      if(maximum>0)this.surfaceFinish.transfer(panel,contact,damage,otherPaint);
      const assembly = panel.userData.detachAssembly as string | null;
      if (assembly) {
        if (!assemblies.has(assembly)) assemblies.set(assembly, { panels: [], damage: 0, weight: 0 });
        const group = assemblies.get(assembly)!;
        group.panels.push(panel);
        group.damage = Math.max(group.damage, panel.userData.damage);
        group.weight = Math.max(group.weight, maximum);
      }
    }
    // Finish deforming every member before releasing any of them. Grilles,
    // mirror inserts and bonnet vents cannot remain suspended over a wreck.
    for (const [name, group] of assemblies) {
      const threshold = name === 'hood' ? 48 : name.startsWith('mirror') ? 22 : name==='rear-bumper' ? 28 : 32;
      if (group.damage <= threshold || damage <= 7 || group.weight <= .18) continue;
      for (const panel of group.panels) {
        if (quiet) panel.visible = false;
        else this.fx.detach(panel, this.velocity.clone().multiplyScalar(.65));
      }
      if (!quiet) this.impactEffects.debris = true;
    }
    for (const glass of this.glass) {
      if (!glass.visible) continue;
      dentGeometry(glass, contact, impactDirection, dentDamage);
      const bounds = new T.Box3().setFromObject(glass);
      const distance = bounds.distanceToPoint(point);
      if (distance < 1.25 && damage > 3) {
        const before = glass.userData.damage || 0;
        glass.userData.damage = before + damage * (1 - distance / 1.25);
        if (before < 7 && glass.userData.damage >= 7 || before <= 24 && glass.userData.damage > 24) this.impactEffects.glass = true;
        const mat = glass.material as T.MeshPhysicalMaterial;
        const state = mat.userData.glassState as GlassState | undefined;
        if (state) {
          state.damage.value = Math.min(1, glass.userData.damage / 24);
          state.impact.value.copy(glass.worldToLocal(point.clone()));
        }
        const laminated = /Windshield|Rearwindow/.test(glass.name);
        // Laminated screens retain their shattered sheet. Tempered side glass
        // cracks first, then releases fragments on a second substantial blow.
        if (!laminated && glass.userData.damage > 24) glass.visible = false;
        if (!quiet) this.fx.emit(bounds.getCenter(new T.Vector3()), Math.ceil(damage * .55), 3, 1.7);
      }
    }
    this.wreckParts.hit(contact,impactDirection,dentDamage);
    this.engineDamage=components.engineDamage;
    this.tyreDamage=components.tyreDamage;
    this.wreckParts.wheelDamage.set(components.wheelDamage);
    components.wheelShift.forEach((v,i)=>this.wreckParts.wheelShift[i].copy(v));
    this.collider.setHalfExtents(vehicleChassisHalfExtents(this.kind,this.health));
    if (!quiet) {
      this.fx.impact?.(point, direction, damage);
    }
  }
  dispose() {
    this.livery.dispose();
    this.tireContacts.forEach(contact=>contact.dispose());
    this.world.removeVehicleController(this.controller);
    this.world.removeRigidBody(this.body);
    this.root.removeFromParent();
    const materials = new Set<T.Material>();
    this.model.traverse((o) => {
      if (o instanceof T.Mesh) {
        cancelWreckNormals(o);
        if (/^(panel_|glass_)/.test(o.name)) o.geometry.dispose();
        materials.add(o.material as T.Material);
      }
    });
    for (const material of materials) material.dispose();
  }
}
