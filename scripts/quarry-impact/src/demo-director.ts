import * as T from 'three';
import type {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import type {Vehicle} from './vehicle';
import {landscapeHeight} from './quarry-layout';
export const DEMO_CAMERAS={director:'Auto director',overview:'Overhead overview',drone:'Follow drone',chase:'Chase camera',hood:'Hood camera',trackside:'Trackside',orbit:'Free orbit'};
export type DemoCamera=keyof typeof DEMO_CAMERAS;
export class DemoDirector {
  view:DemoCamera='director';
  activeView:DemoCamera='drone';
  followed=0;
  manual=false;
  private age=0;
  private cut=0;
  private snap=true;
  private anchor=new T.Vector3();
  private lastTarget=new T.Vector3();
  private shots:DemoCamera[]=['drone','trackside','chase','overview'];
  reset(){this.age=0;this.cut=0;this.snap=true;this.followed=0;this.manual=false;}
  select(view:DemoCamera){if(!(view in DEMO_CAMERAS))return;this.view=view;this.snap=true;this.cut=0;}
  follow(id:number){this.followed=id;this.manual=true;this.snap=true;this.cut=0;}
  cycleCar(cars:Vehicle[],direction=1){const i=Math.max(0,cars.findIndex(c=>c.id===this.followed));this.follow(cars[(i+direction+cars.length)%cars.length].id);}
  cycleView(){const views=Object.keys(DEMO_CAMERAS)as DemoCamera[];this.select(views[(views.indexOf(this.view)+1)%views.length]);}
  update(cars:Vehicle[],camera:T.PerspectiveCamera,orbit:OrbitControls,dt:number,race:boolean){
    if(!cars.length)return;
    this.age+=dt;this.cut-=dt;
    if(this.view==='director'&&this.cut<=0){
      if(!this.manual){
        const candidates=cars.filter(c=>c.health>0&&!c.finished);
        candidates.sort((a,b)=>this.interest(b,cars)-this.interest(a,cars));
        this.followed=(candidates[0]??cars[0]).id;
      }
      this.activeView=this.shots[Math.floor(this.age/9)%this.shots.length];this.cut=9;this.snap=true;
    }else if(this.view!=='director')this.activeView=this.view;
    const car=cars.find(c=>c.id===this.followed)??cars[0],target=car.root.position.clone().add(new T.Vector3(0,.35,0));
    const f=new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion);f.y=0;f.normalize();
    const right=new T.Vector3(f.z,0,-f.x),desired=target.clone();let fov=52;
    orbit.maxDistance=90;orbit.enablePan=false;
    if(this.activeView==='orbit'){
      orbit.enabled=true;
      if(this.snap){camera.position.copy(target).add(new T.Vector3(7,4,8));camera.fov=52;camera.updateProjectionMatrix();}
      else camera.position.add(target.clone().sub(this.lastTarget));
      orbit.target.copy(target);orbit.update();this.lastTarget.copy(target);this.snap=false;return;
    }
    orbit.enabled=false;
    if(this.activeView==='overview'){desired.set(0,race?255:103,race?-35:-.1);target.set(0,0,0);fov=race?56:57;}
    else if(this.activeView==='drone'){desired.addScaledVector(f,-13).addScaledVector(right,5);desired.y+=25;fov=48;}
    else if(this.activeView==='chase'){desired.addScaledVector(f,-8);desired.y+=2.6;target.addScaledVector(f,3);}
    else if(this.activeView==='hood'){desired.addScaledVector(f,1.3);desired.y+=.34;target.addScaledVector(f,24);target.y+=.4;fov=67;}
    else {
      if(this.snap||this.anchor.distanceTo(target)>52){this.anchor.copy(target).addScaledVector(right,13).addScaledVector(f,14);this.anchor.y=landscapeHeight(this.anchor.x,this.anchor.z)+2;}
      desired.copy(this.anchor);fov=T.MathUtils.clamp(35+desired.distanceTo(target)*.5,43,64);
    }
    desired.y=Math.max(desired.y,landscapeHeight(desired.x,desired.z)+.65);
    if(this.snap||this.activeView==='hood')camera.position.copy(desired);else camera.position.lerp(desired,1-Math.exp(-dt*4));
    camera.lookAt(target);camera.fov=fov;camera.updateProjectionMatrix();orbit.target.copy(target);this.lastTarget.copy(target);this.snap=false;
  }
  private interest(c:Vehicle,cars:Vehicle[]){
    const nearest=Math.min(...cars.filter(o=>o!==c&&o.health>0).map(o=>c.current.distanceTo(o.current)),50);
    return Math.min(18,Math.abs(c.speed))*1.3+(35-Math.min(35,nearest))+(c.id===this.followed?7:0)+(c.health<22?5:0);
  }
}
