// The rod in your hands, the cast, the line and the lure. A charge-and-release cast throws the lure
// on a ballistic arc with drag and wind; splashdown stamps the surface; the line is a Verlet chain
// from the bending rod tip; reeling shortens it, twitches flick it, and each lure behaves as its
// kind does (a walker zigzags on top, a worm hops along the bottom, a squarebill dives on the
// retrieve and floats up at rest). The technique recognizer names what you are doing.
import * as T from './vendor/three.module.js';
import {RIGS,rigParts,weakestLink,describeRig} from './tackle.js';
import {createLine,resetLine,setLure,stepLine,layLine,lurePosition,lureVelocity} from './line.js';
import {createRecognizer,recordSample,recordTwitch,classify} from './technique.js';
import {addImpact} from './surface-impulses.js';
import {createFight,stepFight} from './fight.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const CAST={elevation:.62,minSpeed:7,maxSpeed:22,chargeSeconds:1.3};
function lureMesh(lure){
 const g=new T.Group();const mat=new T.MeshPhysicalMaterial({color:lure.color,roughness:.35,clearcoat:.6,clearcoatRoughness:.2});
 if(lure.id==='walker'){const m=new T.Mesh(new T.CapsuleGeometry(lure.radius,lure.length-lure.radius*2,4,10),mat);m.rotation.x=Math.PI/2;g.add(m);const eye=new T.Mesh(new T.SphereGeometry(.004,6,6),new T.MeshBasicMaterial({color:0x111111}));eye.position.set(.009,.004,lure.length/2-.02);g.add(eye);}
 else if(lure.id==='worm'){const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,-.09),new T.Vector3(.01,.008,-.03),new T.Vector3(-.008,0,.03),new T.Vector3(.012,-.006,.09)]);const m=new T.Mesh(new T.TubeGeometry(curve,14,lure.radius,7,false),mat);g.add(m);const weight=new T.Mesh(new T.ConeGeometry(.007,.016,10),new T.MeshStandardMaterial({color:0x333333,metalness:.6,roughness:.4}));weight.rotation.x=-Math.PI/2;weight.position.z=-.1;g.add(weight);}
 else if(lure.id==='bucktail'){const wire=new T.Mesh(new T.CylinderGeometry(.0015,.0015,lure.length,6),new T.MeshStandardMaterial({color:0x999999,metalness:.9,roughness:.3}));wire.rotation.x=Math.PI/2;g.add(wire);
  const bladeMat=new T.MeshStandardMaterial({color:0xd9a441,metalness:1,roughness:.25});for(const [z,s] of [[lure.length*.32,1],[lure.length*.12,.85]]){const blade=new T.Mesh(new T.SphereGeometry(.02*s,12,8),bladeMat);blade.scale.set(.8,.12,1.3);blade.position.set(.012,.004,z);blade.rotation.z=.5;g.add(blade);}
  const skirt=new T.Mesh(new T.ConeGeometry(.02,.1,12,1,true),new T.MeshStandardMaterial({color:0x1e1e22,roughness:.95,side:T.DoubleSide}));skirt.rotation.x=-Math.PI/2;skirt.position.z=-lure.length*.28;g.add(skirt);const hair=new T.Mesh(new T.ConeGeometry(.012,.11,10,1,true),new T.MeshStandardMaterial({color:0xc85a1e,roughness:.95,side:T.DoubleSide}));hair.rotation.x=-Math.PI/2;hair.position.z=-lure.length*.30;g.add(hair);}
 else{const body=new T.Mesh(new T.BoxGeometry(.028,.03,lure.length),mat);g.add(body);const lip=new T.Mesh(new T.BoxGeometry(.024,.003,.022),new T.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.5,roughness:.1}));lip.position.set(0,-.012,lure.length/2+.008);lip.rotation.x=-.5;g.add(lip);}
 for(const side of [-1,1]){const hook=new T.Mesh(new T.TorusGeometry(.006,.0012,6,10,Math.PI*1.5),new T.MeshStandardMaterial({color:0x777777,metalness:.8,roughness:.3}));hook.position.set(0,-.012,side*lure.length*.25);g.add(hook);}
 g.traverse(m=>{if(m.isMesh){m.castShadow=false;}});return g;
}
// a slip float: red over white, sits on the surface above the bait and goes under on a take
function makeFloat(){const g=new T.Group();const top=new T.Mesh(new T.ConeGeometry(.018,.032,10),new T.MeshStandardMaterial({color:0xe02a1a,roughness:.5}));top.position.y=.016;const bot=new T.Mesh(new T.ConeGeometry(.018,.032,10),new T.MeshStandardMaterial({color:0xf2efe6,roughness:.5}));bot.rotation.x=Math.PI;bot.position.y=-.016;g.add(top,bot);return g;}
export function makeAngling(scene,kayak,env){
 const state={rigIndex:0,phase:'idle',biteFish:null,biteAt:0,fight:null,fightFish:null,events:[],fightSeconds:0,power:0,charging:false,reeling:0,twitchClock:0,twitchSide:1,castCount:0,label:'idle',flight:null,retrieveSpeed:0,rodYaw:0,rodPitch:0,castAnim:0,twitchAnim:0,inWater:false};
 const line=createLine(24),rec=createRecognizer();let sampleClock=0,classifyClock=0;
 // --- rod: nine tapered segments on nested pivots so tension can bend it
 const rodRoot=new T.Group();kayak.group.add(rodRoot);rodRoot.position.set(-.36,.34,.30);
 const rodMat=new T.MeshStandardMaterial({color:0x26262b,roughness:.35,metalness:.25}),gripMat=new T.MeshStandardMaterial({color:0x4a3a2c,roughness:.9});
 const grip=new T.Mesh(new T.CylinderGeometry(.012,.014,.30,10),gripMat);grip.rotation.x=Math.PI/2;grip.position.z=.13;rodRoot.add(grip);
 const reelMesh=new T.Mesh(new T.BoxGeometry(.045,.05,.065),rodMat);reelMesh.position.set(0,-.04,.34);rodRoot.add(reelMesh);
 const NSEG=9,rodLen=2.0,segLen=rodLen/NSEG,segs=[];let parent=rodRoot;
 for(let i=0;i<NSEG;i++){const pivot=new T.Group();pivot.position.z=i===0?.28:segLen;parent.add(pivot);const r0=.0055*(1-i/NSEG)+.0014,r1=.0055*(1-(i+1)/NSEG)+.0014;const m=new T.Mesh(new T.CylinderGeometry(r1,r0,segLen,8),rodMat);m.rotation.x=Math.PI/2;m.position.z=segLen/2;pivot.add(m);if(i%2===1){const guide=new T.Mesh(new T.TorusGeometry(.006-i*.0004,.0008,5,10),rodMat);guide.position.set(0,-.007,segLen/2);pivot.add(guide);}segs.push(pivot);parent=pivot;}
 const tipObj=new T.Object3D();tipObj.position.z=segLen;parent.add(tipObj);
 // --- lure and line
 let rig=RIGS[0],parts=rigParts(rig),chain=weakestLink(rig);let lureObj=lureMesh(parts.lure);scene.add(lureObj);const floatObj=makeFloat();floatObj.visible=false;scene.add(floatObj);
 const N=line.n,ribbonGeo=new T.BufferGeometry();const rpos=new Float32Array(N*2*3);ribbonGeo.setAttribute('position',new T.BufferAttribute(rpos,3));const idx=[];for(let i=0;i<N-1;i++){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d);}ribbonGeo.setIndex(idx);
 const ribbon=new T.Mesh(ribbonGeo,new T.MeshBasicMaterial({color:0xe6eae4,side:T.DoubleSide,transparent:true,opacity:.85}));ribbon.frustumCulled=false;scene.add(ribbon);
 const tip=new T.Vector3(),tmp=new T.Vector3(),tmp2=new T.Vector3(),camDir=new T.Vector3();
 function setRig(i){state.rigIndex=(i+RIGS.length)%RIGS.length;rig=RIGS[state.rigIndex];parts=rigParts(rig);chain=weakestLink(rig);scene.remove(lureObj);lureObj=lureMesh(parts.lure);scene.add(lureObj);state.phase='idle';state.flight=null;line.lineOut=1.2;}
 function worldTip(){kayak.group.updateMatrixWorld(true);tipObj.getWorldPosition(tip);return tip;}
 function beginCharge(){if(state.phase!=='idle')return false;state.phase='charging';state.power=0;return true;}
 function release(camera){if(state.phase!=='charging')return;const power=clamp(state.power,.08,1);camera.getWorldDirection(camDir);const yaw=Math.atan2(camDir.x,camDir.z);
  const massFactor=clamp(Math.sqrt(parts.lure.massG/14),.7,1.15);const speed=(CAST.minSpeed+(CAST.maxSpeed-CAST.minSpeed)*power)*chain.castEfficiency*massFactor;
  const t=worldTip();state.flight={x:t.x,y:t.y+.1,z:t.z,vx:Math.sin(yaw)*Math.cos(CAST.elevation)*speed,vy:Math.sin(CAST.elevation)*speed,vz:Math.cos(yaw)*Math.cos(CAST.elevation)*speed,age:0};
  state.phase='flight';state.castAnim=1;state.castCount++;line.lineOut=1.2;resetLine(line,t.x,t.y,t.z);state.inWater=false;}
 function splashdown(time,x,y,z,v){const speed=Math.hypot(v.x,v.y,v.z);addImpact(x,z,time,Math.min(4.5,speed*.6));env.ripple(x,z,speed>6?'splash':'pebble');const t=worldTip();layLine(line,{x:t.x,y:t.y,z:t.z},{x,y,z});const last=N-1;line.px[last]=x-v.x*.01;line.py[last]=y-v.y*.004;line.pz[last]=z-v.z*.01;state.phase='retrieve';state.flight=null;state.inWater=true;}
 function twitch(time){if(state.phase!=='retrieve'||state.twitchClock>0)return false;state.twitchClock=.28;state.twitchAnim=1;recordTwitch(rec,time);const last=N-1,dt=1/60;const t=worldTip();const dx=t.x-line.x[last],dz=t.z-line.z[last],d=Math.hypot(dx,dz)||1;const L=parts.lure;
  let vx=dx/d*1.3,vy=0,vz=dz/d*1.3;
  if(L.action==='walk'){state.twitchSide*=-1;vx+=-dz/d*state.twitchSide*1.1;vz+=dx/d*state.twitchSide*1.1;}
  else if(L.action==='hop'){vy=.9;vx*=.6;vz*=.6;}
  else{vy=-.4;}
  line.px[last]-=vx*dt;line.py[last]-=vy*dt;line.pz[last]-=vz*dt;return true;}
 function reelIn(){state.phase='idle';state.inWater=false;line.lineOut=1.2;state.fight=null;state.fightFish=null;state.biteFish=null;}
 // --- the bite, the set, the fight
 function bite(fish,time){if(state.phase!=='retrieve')return false;state.phase='bite';state.biteFish=fish;state.biteAt=time;const lp=lurePosition(line);if(parts.lure.family==='topwater'){addImpact(lp.x,lp.z,time,4.5);env.ripple(lp.x,lp.z,'boil');}else env.ripple(lp.x,lp.z,'dimple');state.events.push({type:'bite',fish});return true;}
 function setHook(time){if(state.phase!=='bite')return false;const dtb=time-state.biteAt;if(dtb<.12&&parts.lure.family!=='bait'){state.events.push({type:'missed',fish:state.biteFish,reason:'too early'});missed();return false;}return beginFight(time);}
 function missed(){const f=state.biteFish;state.biteFish=null;state.phase='retrieve';return f;}
 function beginFight(time){const fish=state.biteFish;const rig={dragKg:parts.reel.dragKg,weakestKg:chain.weakest.kg,rodPower:parts.rod.power,lineStretch:parts.line.stretch,retrieveMs:parts.reel.retrieveMs,wire:!!parts.line.wire};state.fight=createFight({fish:{length:fish.brain.length,species:fish.brain.species},rig,random:fish.brain.random});state.fightFish=fish;fish.brain.state='HOOKED';state.phase='fight';state.fightSeconds=0;state.biteFish=null;state.events.push({type:'hooked',fish});return true;}
 function mouthOf(fish){const b=fish.brain;return {x:b.x+Math.sin(b.heading)*b.length*.48,y:b.y,z:b.z+Math.cos(b.heading)*b.length*.48};}
 function fightStep(dt,time,input){const ft=state.fight,fish=state.fightFish,b=fish.brain;const t=worldTip();const m0=mouthOf(fish);const dist=Math.hypot(m0.x-t.x,m0.y-t.y,m0.z-t.z);const geom={distToAngler:dist,lineOut:line.lineOut,depth:-b.y};
  const out=stepFight(ft,dt,input,geom);line.lineOut=geom.lineOut;state.fightSeconds+=dt;
  // move the fish: runs are away from the kayak, sometimes straight at it; jumps break the surface
  const ax=b.x-kayak.state.x,az=b.z-kayak.state.z,ad=Math.hypot(ax,az)||1;let dirA=Math.atan2(ax/ad,az/ad);if(Math.cos(out.heading)>.55)dirA+=Math.PI;else dirA+=Math.sin(out.heading)*1.1;
  const sp=out.speed;b.vx+=(Math.sin(dirA)*sp-b.vx)*Math.min(1,dt*3);b.vz+=(Math.cos(dirA)*sp-b.vz)*Math.min(1,dt*3);
  const bed=env.bed(b.x,b.z);const targetY=out.jump>0?out.jump-.05:(ft.state==='RUN'||ft.state==='SULK'?Math.max(bed+.35,-2.2):Math.max(bed+.3,-.6));b.vy+=(clamp((targetY-b.y)*3,-1.5,1.5)-b.vy)*Math.min(1,dt*4);
  b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;if(out.jump<=0)b.y=Math.min(b.y,-.08);b.y=Math.max(b.y,bed+.2);if(b.vx*b.vx+b.vz*b.vz>1e-4)b.heading=Math.atan2(b.vx,b.vz);
  // the line limits the fish to what has been paid out
  const m=mouthOf(fish);const dx=m.x-t.x,dy=m.y-t.y,dz=m.z-t.z,d=Math.hypot(dx,dy,dz);if(d>line.lineOut){const k=line.lineOut/d;b.x=t.x+dx*k-(m.x-b.x);b.z=t.z+dz*k-(m.z-b.z);}
  const m2=mouthOf(fish);const keepOut=line.lineOut;layLine(line,{x:t.x,y:t.y,z:t.z},m2);line.lineOut=keepOut;const d2=Math.hypot(m2.x-t.x,m2.y-t.y,m2.z-t.z);const sag=clamp((line.lineOut-d2)*.45,0,2.2);for(let i=1;i<N-1;i++){const s=i/(N-1);line.y[i]-=Math.sin(s*Math.PI)*sag;}
  line.tension=clamp(ft.tension/chain.weakest.kg,0,1);line.lureDepth=Math.max(0,-b.y);
  if(ft.lost){state.events.push({type:'lost',fish,reason:ft.lost});b.state='FLEE';b.fleeUntil=time+6;reelIn();}
  else if(ft.landed){state.phase='landed';b.state='LANDED';b.vx=b.vy=b.vz=0;state.events.push({type:'landed',fish,seconds:state.fightSeconds});}}
 function releaseFish(time){const fish=state.fightFish;if(fish){const b=fish.brain;b.state='RESTING';b.stateTime=0;b.home={x:kayak.state.x+Math.sin(kayak.state.heading)*4,y:Math.max(env.bed(b.x,b.z)+.5,-1.5),z:kayak.state.z+Math.cos(kayak.state.heading)*4};b.x=b.home.x;b.z=b.home.z;b.y=-.4;b.caught++;env.ripple(b.x,b.z,'boil');state.events.push({type:'released',fish});}reelIn();}
 function drainEvents(){const e=state.events;state.events=[];return e;}
 function update(dt,time,input,camera){
  // input: {charging:boolean, reeling:boolean}
  state.twitchClock=Math.max(0,state.twitchClock-dt);state.castAnim=Math.max(0,state.castAnim-dt*3.2);state.twitchAnim=Math.max(0,state.twitchAnim-dt*6);
  if(state.phase==='charging'){if(!input.charging){release(camera);}else state.power=clamp(state.power+dt/CAST.chargeSeconds,0,1);}
  const t=worldTip();
  if(state.phase==='flight'){const f=state.flight;const k=.012*parts.lure.drag/(parts.lure.massG/14);const speed=Math.hypot(f.vx,f.vy,f.vz);const w=env.windVec();
   f.vx+=(-f.vx*speed*k+w.x*.8)*dt;f.vz+=(-f.vz*speed*k+w.z*.8)*dt;f.vy+=(-9.81-f.vy*speed*k)*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;f.age+=dt;
   line.lineOut=Math.max(line.lineOut,Math.hypot(f.x-t.x,f.y-t.y,f.z-t.z)+.4);
   const bed=env.bed(f.x,f.z),sy=env.surface(f.x,f.z,time);
   if(f.y<=sy&&bed<0){splashdown(time,f.x,sy-.01,f.z,f);}else if(f.y<=bed+.03){f.y=bed+.03;splashdown(time,f.x,f.y,f.z,{x:0,y:0,z:0});}
   else{for(let i=0;i<N;i++){const s=i/(N-1);line.x[i]=line.px[i]=t.x+(f.x-t.x)*s;line.y[i]=line.py[i]=t.y+(f.y-t.y)*s-Math.sin(s*Math.PI)*.35*s;line.z[i]=line.pz[i]=t.z+(f.z-t.z)*s;}}
  }
  if(state.phase==='bite'){if(time-state.biteAt>(parts.lure.family==='bait'?3.2:1.25)){state.events.push({type:'missed',fish:state.biteFish,reason:'spat it'});const f=missed();f.brain.state='REFUSE';f.brain.refuseUntil=time+10;}else{const lp=lurePosition(line);const m=mouthOf(state.biteFish);setLure(line,m.x,Math.min(m.y,-.03),m.z);const t2=worldTip();layLine(line,{x:t2.x,y:t2.y,z:t2.z},{x:m.x,y:Math.min(m.y,-.03),z:m.z});line.tension=.35+Math.sin(time*30)*.15;}}
  if(state.phase==='fight')fightStep(dt,time,input);
  if(state.phase==='landed'){const t2=worldTip();for(let i=0;i<N;i++){line.x[i]=line.px[i]=t2.x;line.y[i]=line.py[i]=t2.y-.05*i/N;line.z[i]=line.pz[i]=t2.z;}}
  if(state.phase==='retrieve'){
   state.reeling=input.reeling?1:0;const reelMs=parts.reel.retrieveMs;
   if(input.reeling)line.lineOut=Math.max(1.3,line.lineOut-reelMs*dt);
   const lp=lurePosition(line),lv=lureVelocity(line,Math.max(dt,.004));
   const under=lp.y<env.surface(lp.x,lp.z,time);
   const diveTarget=parts.lure.buoyancy==='crank'?(input.reeling?parts.lure.diveDepth*clamp(line.lineOut/8,.35,1):0):0;
   const force={x:0,y:0,z:0};
   if(parts.lure.action==='wobble'&&input.reeling&&under){const wob=Math.sin(time*38)*.9;const dx=t.x-lp.x,dz=t.z-lp.z,d=Math.hypot(dx,dz)||1;force.x=-dz/d*wob;force.z=dx/d*wob;}
   stepLine(line,dt,{tip:{x:t.x,y:t.y,z:t.z},surface:(x,z)=>env.surface(x,z,time),bed:env.bed,lineBuoy:parts.line.buoyancy,lure:parts.lure,diveTarget,lureForce:force,wind:env.windVec()});
   state.retrieveSpeed=input.reeling?reelMs:0;
   sampleClock+=dt;if(sampleClock>=.05){sampleClock=0;recordSample(rec,time,input.reeling);}
   classifyClock+=dt;if(classifyClock>=.25){classifyClock=0;state.label=classify(rec,time,parts.lure,{inWater:true,onBottom:line.lureOnBottom,moving:Math.abs(kayak.state.speed)>.4&&line.lineOut>12});}
   if(line.lineOut<=1.35&&Math.hypot(lp.x-t.x,lp.z-t.z)<1.6)reelIn();
  }else{state.label='idle';state.reeling=0;}
  // --- rod pose: idle low, cocked back while charging, whipped forward on release, tracking the lure while fishing, bending with tension
  let targetPitch=-.24,targetYaw=-.34;
  if(state.phase==='charging')targetPitch=-1.9+state.power*.25,targetYaw=-.7;
  else if(state.castAnim>0)targetPitch=-.12-state.castAnim*.45;
  else if(state.phase==='retrieve'||state.phase==='flight'||state.phase==='bite'||state.phase==='fight'){const lp=state.flight||lurePosition(line);tmp.set(lp.x-kayak.state.x,0,lp.z-kayak.state.z);const yawWorld=Math.atan2(tmp.x,tmp.z);let rel=yawWorld-kayak.state.heading;rel=Math.atan2(Math.sin(rel),Math.cos(rel));targetYaw=clamp(rel-.15,-1.2,.8);targetPitch=-.2-line.tension*.25;}
  // a bottom rig goes in the holder while it soaks: rod up, until you pick it up to reel
  if(parts.lure.circle&&(state.phase==='retrieve'||state.phase==='bite')&&!state.reeling)targetPitch=-.95;
  const k=1-Math.exp(-dt*(state.phase==='charging'?4:9));state.rodPitch+=(targetPitch-state.rodPitch)*k;state.rodYaw+=(targetYaw-state.rodYaw)*k;
  rodRoot.rotation.set(state.rodPitch,state.rodYaw,0,'YXZ');
  const bend=((state.phase==='retrieve'||state.phase==='fight'||state.phase==='bite')?line.tension*.11:0)+(input.rodUp!==undefined&&state.phase==='fight'?(input.rodUp-.6)*.03:0)+state.twitchAnim*.05+(state.phase==='charging'?.02:0)+state.castAnim*.06;
  for(let i=0;i<NSEG;i++){const s=(i+1)/NSEG;segs[i].rotation.x=bend*s*s*1.6;}
  // --- lure and ribbon
  floatObj.visible=false;if(parts.lure.floatDepth&&(state.phase==='retrieve'||state.phase==='bite')){const fp=lurePosition(line);floatObj.visible=true;floatObj.position.set(fp.x,env.surface(fp.x,fp.z,time)-(state.phase==='bite'?.16:0)+.01,fp.z);}
  if(state.phase==='flight'){const f=state.flight;lureObj.position.set(f.x,f.y,f.z);tmp.set(f.vx,f.vy,f.vz);if(tmp.lengthSq()>1e-4){lureObj.lookAt(tmp2.copy(lureObj.position).add(tmp));}}
  else if(state.phase==='fight'||state.phase==='bite'){lureObj.visible=false;}
  else if(state.phase==='retrieve'){const lp=lurePosition(line),lv=lureVelocity(line,Math.max(dt,.004));lureObj.position.set(lp.x,lp.y,lp.z);tmp.set(lv.x,lv.y*.3,lv.z);if(tmp.lengthSq()>.02)lureObj.lookAt(tmp2.copy(lureObj.position).add(tmp));else{tmp.set(t.x-lp.x,0,t.z-lp.z);if(tmp.lengthSq()>.01)lureObj.lookAt(tmp2.copy(lureObj.position).add(tmp));}
   if(parts.lure.action==='wobble'&&input.reeling)lureObj.rotation.z=Math.sin(time*38)*.5;if(parts.lure.action==='walk'&&!line.lureOnBottom)lureObj.rotation.z=0;}
  else{lureObj.position.set(t.x,t.y-.28,t.z);lureObj.rotation.set(-1.2,kayak.state.heading,0);}
  if(state.phase!=='fight'&&state.phase!=='bite')lureObj.visible=state.phase!=='landed';
  const camPos=camera.position;const linePts=state.phase==='idle'?[[t.x,t.y,t.z],[t.x,t.y-.28,t.z]]:null;
  for(let i=0;i<N;i++){let x,y,z;if(linePts){const s=i/(N-1);x=linePts[0][0]+(linePts[1][0]-linePts[0][0])*s;y=linePts[0][1]+(linePts[1][1]-linePts[0][1])*s;z=linePts[0][2];}else{x=line.x[i];y=line.y[i];z=line.z[i];}
   const j=Math.min(N-1,i+1),i0=Math.max(0,i-1);const sx=(linePts?0:line.x[j]-line.x[i0]),sy=(linePts?-1:line.y[j]-line.y[i0]),sz=(linePts?0:line.z[j]-line.z[i0]);
   tmp.set(sx,sy,sz).normalize();tmp2.set(camPos.x-x,camPos.y-y,camPos.z-z);const dist=tmp2.length();tmp2.normalize();const right=tmp.cross(tmp2).normalize();const w=.0005+dist*.0013;
   rpos[i*6]=x+right.x*w;rpos[i*6+1]=y+right.y*w;rpos[i*6+2]=z+right.z*w;rpos[i*6+3]=x-right.x*w;rpos[i*6+4]=y-right.y*w;rpos[i*6+5]=z-right.z*w;}
  ribbonGeo.attributes.position.needsUpdate=true;ribbon.material.opacity=state.phase==='idle'?.6:.85;ribbon.visible=state.phase!=='landed';
 }
 setRig(0);
 return {state,line,rig:()=>rig,parts:()=>parts,chain:()=>chain,describe:()=>describeRig(rig),setRig,nextRig:()=>setRig(state.rigIndex+1),beginCharge,release,twitch,reelIn,update,tipPosition:()=>worldTip().clone(),bite,setHook,releaseFish,drainEvents,fight:()=>state.fight?{state:state.fight.state,stamina:+state.fight.stamina.toFixed(2),tension:+state.fight.tension.toFixed(2),hookHold:+state.fight.hookHold.toFixed(2),overload:+state.fight.overload.toFixed(2),pullKg:+state.fight.pull.toFixed(2),seconds:+state.fightSeconds.toFixed(1),lost:state.fight.lost,landed:state.fight.landed,weakestKg:chain.weakest.kg}:null,
  lure:()=>state.phase==='flight'?{...state.flight}:lurePosition(line),
  snapshot:()=>({phase:state.phase,fight:state.fight?state.fight.state:null,rig:rig.id,lure:parts.lure.id,power:+state.power.toFixed(2),lineOut:+line.lineOut.toFixed(2),tension:+line.tension.toFixed(2),lureDepth:+line.lureDepth.toFixed(2),onBottom:line.lureOnBottom,technique:state.label,casts:state.castCount,reeling:state.reeling,lure_pos:(()=>{const p=state.phase==='flight'?state.flight:lurePosition(line);return [+p.x.toFixed(2),+p.y.toFixed(2),+p.z.toFixed(2)];})()})};
}
