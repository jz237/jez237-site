import * as T from 'three';
import type {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import type {Vehicle} from './vehicle';
import {landscapeHeight} from './quarry-layout';
import {LEGACY_ARENA,type ArenaLayout} from './derby-arena';
import {DEFINITIONS} from './rules';
import {clearCameraView,unobstructedDemoPosition} from './demo-camera-visibility';
export const DEMO_CAMERAS={director:'Auto director',overview:'Overhead overview',drone:'Follow drone',chase:'Chase camera',hood:'Hood camera',trackside:'Trackside',orbit:'Free orbit'};
export type DemoCamera=keyof typeof DEMO_CAMERAS;
const clamp=T.MathUtils.clamp;
export class DemoDirector {
  constructor(public arena:ArenaLayout=LEGACY_ARENA,private obstruction?:(from:T.Vector3,to:T.Vector3,car:Vehicle)=>number|null,private groundHeight:(x:number,z:number)=>number=landscapeHeight){}
  view:DemoCamera='director';
  activeView:DemoCamera='drone';
  followed=0;
  manual=false;
  private cut=0;
  private shotAge=0;
  private lostAge=0;
  private subjectOffset=new T.Vector3();
  private initialized=false;
  private snap=true;
  private anchor=new T.Vector3();
  private avoidanceOffset:T.Vector3|null=null;
  private lastTarget=new T.Vector3();
  private lastPosition=new T.Vector3();
  private lastSubject=new T.Vector3();
  private lastSubjectId=-1;
  private aim=new T.Vector3();
  private lookYaw=0;
  private lookPitch=0;
  private heading=new T.Vector3(0,0,1);
  private health=new Map<number,number>();
  private recentDamage=new Map<number,number>();
  reset(){this.cut=0;this.shotAge=0;this.lostAge=0;this.subjectOffset.set(0,0,0);this.lastSubjectId=-1;this.initialized=false;this.snap=true;this.followed=0;this.manual=false;this.health.clear();this.recentDamage.clear();this.avoidanceOffset=null;}
  select(view:DemoCamera){if(!Object.hasOwn(DEMO_CAMERAS,view))return;this.view=view;this.snap=true;this.cut=0;}
  follow(id:number){this.followed=id;this.manual=true;this.snap=true;this.cut=0;}
  cycleCar(cars:Vehicle[],direction=1){if(!cars.length)return;const i=Math.max(0,cars.findIndex(c=>c.id===this.followed));this.follow(cars[(i+direction+cars.length)%cars.length].id);}
  cycleView(){const views=Object.keys(DEMO_CAMERAS)as DemoCamera[];this.select(views[(views.indexOf(this.view)+1)%views.length]);}
  update(cars:Vehicle[],camera:T.PerspectiveCamera,orbit:OrbitControls,dt:number,race:boolean){
    if(!cars.length||!Number.isFinite(dt)||dt<0)return;
    this.shotAge+=dt;this.cut-=dt;
    for(const c of cars){
      const previous=this.health.get(c.id)??c.health,damage=Math.max(0,previous-c.health);
      this.recentDamage.set(c.id,Math.min(40,(this.recentDamage.get(c.id)??0)*Math.exp(-dt/3)+damage));this.health.set(c.id,c.health);
    }
    const active=cars.filter(c=>c.health>0&&!c.finished);
    const selectable=cars.filter(c=>!c.finished&&(c.health>0||(this.recentDamage.get(c.id)??0)>12)),ranked=[...selectable].sort((a,b)=>this.interest(b,cars)-this.interest(a,cars));
    const candidate=ranked[0]??cars.find(c=>c.id===this.followed)??cars[0];
    // Automatic viewing holds one stable drone composition. Health changes
    // never trigger a cut; even a lost subject gets time to settle on screen.
    const lostSubject=!this.manual&&selectable.length>0&&!selectable.some(c=>c.id===this.followed);
    this.lostAge=lostSubject?this.lostAge+dt:0;
    if(this.cut<=0||lostSubject&&this.lostAge>=8){
      const oldCar=this.followed;
      if(!this.manual)this.followed=candidate.id;
      if(this.view==='director')this.activeView='drone';
      if(this.initialized&&oldCar!==this.followed){
        // Blend the rig's world-space subject, rather than translating it by
        // the entire distance to a newly selected car in one frame.
        this.subjectOffset.copy(this.lastPosition).sub(cars.find(c=>c.id===this.followed)!.root.position);
        this.snap=false;
      }
      this.cut=20;this.shotAge=0;this.lostAge=0;
    }
    if(this.view!=='director')this.activeView=this.view;
    const car=cars.find(c=>c.id===this.followed)??cars[0];
    // Recovery and respawn can move the same car by an entire track section.
    // Treat that discontinuity like a subject handoff, without moving the rig
    // while its look target is still at the previous location.
    const motionDt=Math.min(dt,.05);
    if(this.initialized&&!this.snap&&car.id===this.lastSubjectId&&
      car.root.position.distanceTo(this.lastSubject)>Math.max(4,Math.abs(car.speed)*motionDt*3+1)){
      this.subjectOffset.copy(this.lastPosition).sub(car.root.position);
      this.avoidanceOffset=null;
    }
    this.lastSubject.copy(car.root.position);this.lastSubjectId=car.id;
    this.subjectOffset.multiplyScalar(Math.exp(-motionDt*.85));
    const position=car.root.position.clone().add(this.subjectOffset),target=position.clone().add(new T.Vector3(0,.25,0));
    const f=new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion);f.y=0;
    if(f.lengthSq()<.001)f.copy(this.heading);else f.normalize();
    if(this.snap)this.heading.copy(f);
    else if(this.activeView==='chase'){
      const yaw=Math.atan2(this.heading.x,this.heading.z),goal=Math.atan2(f.x,f.z);
      const turn=Math.atan2(Math.sin(goal-yaw),Math.cos(goal-yaw));
      const step=clamp(turn*(1-Math.exp(-motionDt*1.5)),-motionDt*Math.PI/6,motionDt*Math.PI/6);
      this.heading.set(Math.sin(yaw+step),0,Math.cos(yaw+step));
    }
    if(this.heading.lengthSq()<.001)this.heading.copy(f);else this.heading.normalize();
    const right=new T.Vector3(this.heading.z,0,-this.heading.x),desired=target.clone();let fov=52;
    orbit.maxDistance=90;orbit.enablePan=false;
    if(this.activeView==='orbit'){
      orbit.enabled=true;
      if(this.snap){camera.position.copy(target).add(new T.Vector3(7,4,8));camera.fov=52;camera.updateProjectionMatrix();}
      else camera.position.add(target.clone().sub(this.lastTarget));
      orbit.target.copy(target);orbit.update();this.lastTarget.copy(target);this.lastPosition.copy(position);this.snap=false;this.initialized=true;return;
    }
    orbit.enabled=false;
    const definition=DEFINITIONS[car.kind],subjectPoints:T.Vector3[]=[];
    if(this.obstruction)for(const x of [-(definition?.halfWidth??1),definition?.halfWidth??1])for(const y of [-.4,.7])for(const z of [-(definition?.halfLength??2.6),definition?.halfLength??2.6])subjectPoints.push(new T.Vector3(x,y,z).applyQuaternion(car.root.quaternion).add(position));
    const neighbour=this.view==='director'?undefined:active.filter(c=>c!==car&&c.root.position.distanceTo(position)<14).sort((a,b)=>a.root.position.distanceToSquared(position)-b.root.position.distanceToSquared(position))[0];
    if(this.activeView==='overview'){
      desired.set(race?0:this.arena.x,race?255:this.arena.radius*2.2,race?-35:this.arena.z-.1);target.set(race?0:this.arena.x,0,race?0:this.arena.z);fov=race?56:57;
    }else if(this.activeView==='drone'){
      if(neighbour)target.lerp(neighbour.root.position.clone().add(new T.Vector3(0,.25,0)),.38);
      const spread=neighbour?position.distanceTo(neighbour.root.position):0;
      desired.copy(target).addScaledVector(this.heading,-10-spread*.15).addScaledVector(right,5);desired.y+=7+spread*.2;fov=50;
    }else if(this.activeView==='chase'){
      desired.addScaledVector(this.heading,-9-Math.min(30,Math.abs(car.speed))*.05);desired.y+=3.3;
      target.addScaledVector(this.heading,1.1);fov=55;
    }else if(this.activeView==='hood'){
      desired.addScaledVector(f,1.3);desired.y+=.44;target.addScaledVector(f,24);target.y+=.5;fov=67;
    }else{
      if(this.snap||this.anchor.distanceTo(target)>70){
        this.anchor.copy(target).addScaledVector(right,12).addScaledVector(this.heading,clamp(Math.abs(car.speed)*.6,10,20));this.anchor.y=this.groundHeight(this.anchor.x,this.anchor.z)+2.5;
      }
      desired.copy(this.anchor);fov=clamp(62-desired.distanceTo(target)*.7,30,54);
    }
    if(this.activeView!=='hood'&&this.activeView!=='overview'){
      // Clear terrain along the whole sight line, not just under the camera.
      for(let i=2;i<=10;i++){const t=i/10,x=T.MathUtils.lerp(target.x,desired.x,t),z=T.MathUtils.lerp(target.z,desired.z,t);desired.y=Math.max(desired.y,target.y+(this.groundHeight(x,z)+.65-target.y)/t);}
    }
    desired.y=Math.max(desired.y,this.groundHeight(desired.x,desired.z)+.65);
    if(this.snap)this.avoidanceOffset=null;
    if(this.obstruction&&this.activeView!=='hood'&&this.activeView!=='overview'){
      const focus=position.clone().add(new T.Vector3(0,.35,0)),probe=(a:T.Vector3,b:T.Vector3)=>this.obstruction!(a,b,car);
      if(!clearCameraView(focus,desired,probe,subjectPoints)){
        const held=this.avoidanceOffset?focus.clone().add(this.avoidanceOffset):null;
        desired.copy(held&&clearCameraView(focus,held,probe,subjectPoints)?held:unobstructedDemoPosition(focus,desired,probe,this.groundHeight,subjectPoints));
        this.avoidanceOffset=desired.clone().sub(focus);target.copy(focus);
      }else this.avoidanceOffset=null;
    }
    if(this.snap||this.activeView==='hood'){camera.position.copy(desired);this.aim.copy(target);}
    else{
      // Translate the rig with its subject before smoothing its relative motion.
      // This avoids a speed-dependent lag that pushed the car out of the frame.
      if(this.activeView==='drone'||this.activeView==='chase')camera.position.add(position.clone().sub(this.lastPosition));
      this.aim.lerp(target,1-Math.exp(-motionDt*10));
      if(this.activeView==='drone'||this.activeView==='chase'){
        // Travel around the subject when visibility requires the other side.
        // A straight chord passes through the overhead lookAt singularity.
        const from=new T.Spherical().setFromVector3(camera.position.clone().sub(this.aim)),to=new T.Spherical().setFromVector3(desired.clone().sub(this.aim));
        const yaw=Math.atan2(Math.sin(to.theta-from.theta),Math.cos(to.theta-from.theta)),pitch=to.phi-from.phi;
        const blend=Math.min(1-Math.exp(-motionDt*5),motionDt*Math.PI/6/Math.max(1e-9,Math.abs(yaw)+Math.abs(pitch)));
        from.theta+=yaw*blend;from.phi+=pitch*blend;from.radius=T.MathUtils.lerp(from.radius,to.radius,1-Math.exp(-motionDt*5));
        camera.position.copy(this.aim).add(new T.Vector3().setFromSpherical(from));
      }else camera.position.lerp(desired,1-Math.exp(-motionDt*5));
    }
    camera.position.y=Math.max(camera.position.y,this.groundHeight(camera.position.x,camera.position.z)+.65);
    let aligned=true;
    if(this.activeView==='hood'||this.activeView==='overview')camera.lookAt(this.aim);
    else{
      const direction=this.aim.clone().sub(camera.position),horizontal=Math.hypot(direction.x,direction.z);
      // Retain azimuth close to vertical. Evolving yaw and pitch separately
      // keeps the horizon level; quaternion slerp can bank between two views.
      const yaw=horizontal>Math.max(.05,Math.abs(direction.y)*.03)?Math.atan2(-direction.x,-direction.z):this.lookYaw;
      const pitch=clamp(Math.atan2(direction.y,horizontal),-Math.PI/2+.01,Math.PI/2-.01);
      const dy=Math.atan2(Math.sin(yaw-this.lookYaw),Math.cos(yaw-this.lookYaw)),dp=pitch-this.lookPitch;
      const blend=this.snap?1:Math.min(1,motionDt*Math.PI/6/Math.max(1e-9,Math.abs(dy)+Math.abs(dp)));
      this.lookYaw+=dy*blend;this.lookPitch+=dp*blend;
      camera.quaternion.setFromEuler(new T.Euler(this.lookPitch,this.lookYaw,0,'YXZ'));
      aligned=(Math.abs(dy)+Math.abs(dp))*(1-blend)<.01;
    }
    camera.fov=fov;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
    // During a deliberate slow turn, zooming cannot fix an off-axis subject.
    // Repeated framing attempts would otherwise multiply the distance away.
    if(aligned&&this.subjectOffset.lengthSq()<.25&&(this.activeView==='chase'||this.activeView==='drone'))this.fitSubjects(camera,[car,...(this.activeView==='drone'&&neighbour?[neighbour]:[])]);
    // The obstruction resolver supplies a clear destination before smoothing.
    // A temporary sight-line obstruction must not trigger a second, hard cut.
    orbit.target.copy(this.aim);this.lastTarget.copy(target);this.lastPosition.copy(position);this.snap=false;this.initialized=true;
  }
  private fitSubjects(camera:T.PerspectiveCamera,cars:Vehicle[]){
    const points:T.Vector3[]=[];
    for(const car of cars){const d=DEFINITIONS[car.kind],width=d?.halfWidth??1,length=d?.halfLength??2.6;
      for(const x of [-width,width])for(const y of [-.55,.9])for(const z of [-length,length])points.push(new T.Vector3(x,y,z).applyQuaternion(car.root.quaternion).add(car.root.position));
    }
    // Keep body corners clear of screen edges and the demo toolbar, including
    // narrow windows. Move along the viewing ray without changing composition.
    for(let i=0;i<10;i++){
      if(points.every(p=>{const v=p.clone().project(camera);return Math.abs(v.x)<.86&&v.y>-.82&&v.y<.52&&v.z>-1&&v.z<1;}))return;
      camera.position.sub(this.aim).multiplyScalar(1.15).add(this.aim);camera.updateMatrixWorld(true);
    }
  }
  private interest(c:Vehicle,cars:Vehicle[]){
    const nearest=Math.min(...cars.filter(o=>o!==c&&o.health>0&&!o.finished).map(o=>c.current.distanceTo(o.current)),50);
    return Math.min(18,Math.abs(c.speed))*1.3+(35-Math.min(35,nearest))+(c.id===this.followed?7:0)+(c.health<22?5:0)+(this.recentDamage.get(c.id)??0)*2;
  }
}
