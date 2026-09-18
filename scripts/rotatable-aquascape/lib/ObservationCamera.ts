import * as T from 'three';
export type ObservationSubject={id:string;kind:'angels'|'school'|'shrimp'|'cory';point:T.Vector3;radius:number};
const order=['overview','angels','school','shrimp','cory'] as const;
const labels={overview:'A small world',angels:'Angelfish · graceful gliding',school:'Cardinals · life in a school',shrimp:'Cherry shrimp · among the leaves',cory:'Corydoras · exploring the floor'};
/** Camera-only director. Subjects and simulation timing are never changed. */
export class ObservationCamera{
 active=false;label=labels.overview;private elapsed=0;private shot=-1;private subject:string|null=null;private checkIn=0;
 private destination=new T.Vector3();private focus=new T.Vector3(0,2.75,0);
 start(){this.active=true;this.elapsed=0;this.shot=-1;this.subject=null;this.checkIn=0;}
 stop(){this.active=false;}
 update(dt:number,camera:T.PerspectiveCamera,target:T.Vector3,subjects:ObservationSubject[],visible:(point:T.Vector3,from:T.Vector3)=>boolean,overviewFov:number,reduced=false){
  if(!this.active||dt<=0)return;
  dt=Math.min(dt,.05);this.elapsed+=dt;this.checkIn-=dt;
  const shot=reduced?0:Math.floor(this.elapsed/18)%order.length;
  const kind=order[shot];
  if(shot!==this.shot){
   this.shot=shot;this.subject=null;
   // Prefer frontmost subjects. Occluded specimens never force a close-up.
   for(const s of subjects.filter(s=>s.kind===kind).sort((a,b)=>b.point.z-a.point.z)){
    const from=this.framing(s,camera.aspect);if(visible(s.point,from)){this.subject=s.id;break;}
   }
  }
  let s=subjects.find(s=>s.id===this.subject);
  if(s&&this.checkIn<=0){this.checkIn=2;if(!visible(s.point,this.framing(s,camera.aspect))){this.subject=null;s=undefined;}}
  if(s){this.focus.copy(s.point);this.destination.copy(this.framing(s,camera.aspect));this.label=labels[s.kind];}
  else{this.focus.set(0,2.75,0);const angle=reduced?0:.10*Math.sin(this.elapsed*.045);this.destination.set(Math.sin(angle)*21.5,4.6,Math.cos(angle)*21.5);this.label=labels.overview;}
  const ease=1-Math.exp(-dt*.32);
  // Limit both translation and focus speed so changing subjects cannot snap.
  const move=this.destination.clone().sub(camera.position).multiplyScalar(ease).clampLength(0,dt*1.6);
  camera.position.add(move);
  target.add(this.focus.clone().sub(target).multiplyScalar(ease).clampLength(0,dt*.6));
  camera.fov=T.MathUtils.lerp(camera.fov,s?37:overviewFov,ease);camera.updateProjectionMatrix();camera.lookAt(target);
 }
 private framing(s:ObservationSubject,aspect:number){
  const distance=Math.max(s.kind==='school'?7:3.1,s.radius*3/Math.max(.45,Math.min(1,aspect)));
  return new T.Vector3(T.MathUtils.clamp(s.point.x+.45,-4.2,4.2),Math.max(.85,s.point.y+.45),Math.max(3.5,s.point.z+distance));
 }
}
