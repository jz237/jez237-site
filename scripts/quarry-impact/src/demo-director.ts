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
  constructor(private arena:ArenaLayout=LEGACY_ARENA,private obstruction?:(from:T.Vector3,to:T.Vector3,car:Vehicle)=>number|null){}
  view:DemoCamera='director';
  activeView:DemoCamera='drone';
  followed=0;
  manual=false;
  private cut=0;
  private shotAge=0;
  private shotIndex=0;
  private snap=true;
  private anchor=new T.Vector3();
  private avoidanceOffset:T.Vector3|null=null;
  private lastTarget=new T.Vector3();
  private lastPosition=new T.Vector3();
  private aim=new T.Vector3();
  private heading=new T.Vector3(0,0,1);
  private health=new Map<number,number>();
  private recentDamage=new Map<number,number>();
  private shots:DemoCamera[]=['drone','trackside','chase'];
  reset(){this.cut=0;this.shotAge=0;this.shotIndex=0;this.snap=true;this.followed=0;this.manual=false;this.health.clear();this.recentDamage.clear();this.avoidanceOffset=null;}
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
    // Give an impact a few seconds on screen; never override a manual subject.
    const impactCut=!this.manual&&this.view==='director'&&this.shotAge>=3&&candidate.id!==this.followed&&(this.recentDamage.get(candidate.id)??0)>12;
    const lostSubject=!this.manual&&selectable.length>0&&!selectable.some(c=>c.id===this.followed);
    if(this.cut<=0||impactCut||lostSubject){
      const oldCar=this.followed,oldView=this.activeView;
      if(!this.manual)this.followed=candidate.id;
      if(this.view==='director'){this.activeView=this.shots[this.shotIndex++%this.shots.length];this.snap=true;}
      this.snap ||= oldCar!==this.followed||oldView!==this.activeView;
      this.cut=this.activeView==='trackside'?6:9;this.shotAge=0;
    }
    if(this.view!=='director')this.activeView=this.view;
    const car=cars.find(c=>c.id===this.followed)??cars[0],position=car.root.position,target=position.clone().add(new T.Vector3(0,.25,0));
    const f=new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion);f.y=0;
    if(f.lengthSq()<.001)f.copy(this.heading);else f.normalize();
    if(this.snap)this.heading.copy(f);else this.heading.lerp(f,1-Math.exp(-dt*5));
    if(this.heading.lengthSq()<.001)this.heading.copy(f);else this.heading.normalize();
    const right=new T.Vector3(this.heading.z,0,-this.heading.x),desired=target.clone();let fov=52;
    orbit.maxDistance=90;orbit.enablePan=false;
    if(this.activeView==='orbit'){
      orbit.enabled=true;
      if(this.snap){camera.position.copy(target).add(new T.Vector3(7,4,8));camera.fov=52;camera.updateProjectionMatrix();}
      else camera.position.add(target.clone().sub(this.lastTarget));
      orbit.target.copy(target);orbit.update();this.lastTarget.copy(target);this.lastPosition.copy(position);this.snap=false;return;
    }
    orbit.enabled=false;
    const definition=DEFINITIONS[car.kind],subjectPoints:T.Vector3[]=[];
    if(this.obstruction)for(const x of [-(definition?.halfWidth??1),definition?.halfWidth??1])for(const y of [-.4,.7])for(const z of [-(definition?.halfLength??2.6),definition?.halfLength??2.6])subjectPoints.push(new T.Vector3(x,y,z).applyQuaternion(car.root.quaternion).add(position));
    const neighbour=active.filter(c=>c!==car&&c.root.position.distanceTo(position)<14).sort((a,b)=>a.root.position.distanceToSquared(position)-b.root.position.distanceToSquared(position))[0];
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
      if(this.snap||this.anchor.distanceTo(target)>42||this.anchor.distanceTo(target)<6){
        this.anchor.copy(target).addScaledVector(right,12).addScaledVector(this.heading,clamp(Math.abs(car.speed)*.6,10,20));this.anchor.y=landscapeHeight(this.anchor.x,this.anchor.z)+2.5;
        this.snap=true;
      }
      desired.copy(this.anchor);fov=clamp(62-desired.distanceTo(target)*.7,30,54);
    }
    if(this.activeView!=='hood'&&this.activeView!=='overview'){
      // Clear terrain along the whole sight line, not just under the camera.
      for(let i=2;i<=10;i++){const t=i/10,x=T.MathUtils.lerp(target.x,desired.x,t),z=T.MathUtils.lerp(target.z,desired.z,t);desired.y=Math.max(desired.y,target.y+(landscapeHeight(x,z)+.65-target.y)/t);}
    }
    desired.y=Math.max(desired.y,landscapeHeight(desired.x,desired.z)+.65);
    if(this.snap)this.avoidanceOffset=null;
    if(this.obstruction&&this.activeView!=='hood'&&this.activeView!=='overview'){
      const focus=position.clone().add(new T.Vector3(0,.35,0)),probe=(a:T.Vector3,b:T.Vector3)=>this.obstruction!(a,b,car);
      if(!clearCameraView(focus,desired,probe,subjectPoints)){
        const held=this.avoidanceOffset?focus.clone().add(this.avoidanceOffset):null;
        desired.copy(held&&clearCameraView(focus,held,probe,subjectPoints)?held:unobstructedDemoPosition(focus,desired,probe,landscapeHeight,subjectPoints));
        this.avoidanceOffset=desired.clone().sub(focus);target.copy(focus);
      }else this.avoidanceOffset=null;
    }
    if(this.snap||this.activeView==='hood'){camera.position.copy(desired);this.aim.copy(target);}
    else{
      // Translate the rig with its subject before smoothing its relative motion.
      // This avoids a speed-dependent lag that pushed the car out of the frame.
      if(this.activeView==='drone'||this.activeView==='chase')camera.position.add(position.clone().sub(this.lastPosition));
      camera.position.lerp(desired,1-Math.exp(-dt*5));this.aim.lerp(target,1-Math.exp(-dt*10));
    }
    camera.position.y=Math.max(camera.position.y,landscapeHeight(camera.position.x,camera.position.z)+.65);
    camera.lookAt(this.aim);camera.fov=fov;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
    if(this.activeView==='chase'||this.activeView==='drone')this.fitSubjects(camera,[car,...(this.activeView==='drone'&&neighbour?[neighbour]:[])]);
    if(this.obstruction&&this.activeView!=='hood'){
      const focus=position.clone().add(new T.Vector3(0,.35,0)),probe=(a:T.Vector3,b:T.Vector3)=>this.obstruction!(a,b,car);
      if(!clearCameraView(focus,camera.position,probe,subjectPoints)){
        // An obstructed shot cuts to the next clear angle; interpolating through
        // the obstacle would briefly put the camera inside its geometry.
        camera.position.copy(unobstructedDemoPosition(focus,camera.position,probe,landscapeHeight,subjectPoints));
        this.aim.copy(focus);camera.lookAt(this.aim);camera.updateMatrixWorld(true);
        if(this.activeView==='chase'||this.activeView==='drone')this.fitSubjects(camera,[car]);
        if(!clearCameraView(focus,camera.position,probe,subjectPoints)){
          camera.position.copy(unobstructedDemoPosition(focus,camera.position,probe,landscapeHeight,subjectPoints));camera.lookAt(this.aim);camera.updateMatrixWorld(true);
        }
        this.avoidanceOffset=camera.position.clone().sub(focus);
        if(this.activeView==='trackside')this.anchor.copy(camera.position);
      }
    }
    orbit.target.copy(this.aim);this.lastTarget.copy(target);this.lastPosition.copy(position);this.snap=false;
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
