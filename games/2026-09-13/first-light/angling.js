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
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const CAST={elevation:.62,minSpeed:7,maxSpeed:22,chargeSeconds:1.3};
function lureMesh(lure){
 const g=new T.Group();const mat=new T.MeshPhysicalMaterial({color:lure.color,roughness:.35,clearcoat:.6,clearcoatRoughness:.2});
 if(lure.id==='walker'){const m=new T.Mesh(new T.CapsuleGeometry(lure.radius,lure.length-lure.radius*2,4,10),mat);m.rotation.x=Math.PI/2;g.add(m);const eye=new T.Mesh(new T.SphereGeometry(.004,6,6),new T.MeshBasicMaterial({color:0x111111}));eye.position.set(.009,.004,lure.length/2-.02);g.add(eye);}
 else if(lure.id==='worm'){const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,-.09),new T.Vector3(.01,.008,-.03),new T.Vector3(-.008,0,.03),new T.Vector3(.012,-.006,.09)]);const m=new T.Mesh(new T.TubeGeometry(curve,14,lure.radius,7,false),mat);g.add(m);const weight=new T.Mesh(new T.ConeGeometry(.007,.016,10),new T.MeshStandardMaterial({color:0x333333,metalness:.6,roughness:.4}));weight.rotation.x=-Math.PI/2;weight.position.z=-.1;g.add(weight);}
 else{const body=new T.Mesh(new T.BoxGeometry(.028,.03,lure.length),mat);g.add(body);const lip=new T.Mesh(new T.BoxGeometry(.024,.003,.022),new T.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.5,roughness:.1}));lip.position.set(0,-.012,lure.length/2+.008);lip.rotation.x=-.5;g.add(lip);}
 for(const side of [-1,1]){const hook=new T.Mesh(new T.TorusGeometry(.006,.0012,6,10,Math.PI*1.5),new T.MeshStandardMaterial({color:0x777777,metalness:.8,roughness:.3}));hook.position.set(0,-.012,side*lure.length*.25);g.add(hook);}
 g.traverse(m=>{if(m.isMesh){m.castShadow=false;}});return g;
}
export function makeAngling(scene,kayak,env){
 const state={rigIndex:0,phase:'idle',power:0,charging:false,reeling:0,twitchClock:0,twitchSide:1,castCount:0,label:'idle',flight:null,retrieveSpeed:0,rodYaw:0,rodPitch:0,castAnim:0,twitchAnim:0,inWater:false};
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
 let rig=RIGS[0],parts=rigParts(rig),chain=weakestLink(rig);let lureObj=lureMesh(parts.lure);scene.add(lureObj);
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
 function reelIn(){state.phase='idle';state.inWater=false;line.lineOut=1.2;}
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
   classifyClock+=dt;if(classifyClock>=.25){classifyClock=0;state.label=classify(rec,time,parts.lure,{inWater:true,onBottom:line.lureOnBottom});}
   if(line.lineOut<=1.35&&Math.hypot(lp.x-t.x,lp.z-t.z)<1.6)reelIn();
  }else{state.label='idle';state.reeling=0;}
  // --- rod pose: idle low, cocked back while charging, whipped forward on release, tracking the lure while fishing, bending with tension
  let targetPitch=-.24,targetYaw=-.34;
  if(state.phase==='charging')targetPitch=-1.9+state.power*.25,targetYaw=-.7;
  else if(state.castAnim>0)targetPitch=-.12-state.castAnim*.45;
  else if(state.phase==='retrieve'||state.phase==='flight'){const lp=state.flight||lurePosition(line);tmp.set(lp.x-kayak.state.x,0,lp.z-kayak.state.z);const yawWorld=Math.atan2(tmp.x,tmp.z);let rel=yawWorld-kayak.state.heading;rel=Math.atan2(Math.sin(rel),Math.cos(rel));targetYaw=clamp(rel-.15,-1.2,.8);targetPitch=-.2-line.tension*.25;}
  const k=1-Math.exp(-dt*(state.phase==='charging'?4:9));state.rodPitch+=(targetPitch-state.rodPitch)*k;state.rodYaw+=(targetYaw-state.rodYaw)*k;
  rodRoot.rotation.set(state.rodPitch,state.rodYaw,0,'YXZ');
  const bend=(state.phase==='retrieve'?line.tension*.09:0)+state.twitchAnim*.05+(state.phase==='charging'?.02:0)+state.castAnim*.06;
  for(let i=0;i<NSEG;i++){const s=(i+1)/NSEG;segs[i].rotation.x=bend*s*s*1.6;}
  // --- lure and ribbon
  if(state.phase==='flight'){const f=state.flight;lureObj.position.set(f.x,f.y,f.z);tmp.set(f.vx,f.vy,f.vz);if(tmp.lengthSq()>1e-4){lureObj.lookAt(tmp2.copy(lureObj.position).add(tmp));}}
  else if(state.phase==='retrieve'){const lp=lurePosition(line),lv=lureVelocity(line,Math.max(dt,.004));lureObj.position.set(lp.x,lp.y,lp.z);tmp.set(lv.x,lv.y*.3,lv.z);if(tmp.lengthSq()>.02)lureObj.lookAt(tmp2.copy(lureObj.position).add(tmp));else{tmp.set(t.x-lp.x,0,t.z-lp.z);if(tmp.lengthSq()>.01)lureObj.lookAt(tmp2.copy(lureObj.position).add(tmp));}
   if(parts.lure.action==='wobble'&&input.reeling)lureObj.rotation.z=Math.sin(time*38)*.5;if(parts.lure.action==='walk'&&!line.lureOnBottom)lureObj.rotation.z=0;}
  else{lureObj.position.set(t.x,t.y-.28,t.z);lureObj.rotation.set(-1.2,kayak.state.heading,0);}
  lureObj.visible=true;
  const camPos=camera.position;const linePts=state.phase==='idle'?[[t.x,t.y,t.z],[t.x,t.y-.28,t.z]]:null;
  for(let i=0;i<N;i++){let x,y,z;if(linePts){const s=i/(N-1);x=linePts[0][0]+(linePts[1][0]-linePts[0][0])*s;y=linePts[0][1]+(linePts[1][1]-linePts[0][1])*s;z=linePts[0][2];}else{x=line.x[i];y=line.y[i];z=line.z[i];}
   const j=Math.min(N-1,i+1),i0=Math.max(0,i-1);const sx=(linePts?0:line.x[j]-line.x[i0]),sy=(linePts?-1:line.y[j]-line.y[i0]),sz=(linePts?0:line.z[j]-line.z[i0]);
   tmp.set(sx,sy,sz).normalize();tmp2.set(camPos.x-x,camPos.y-y,camPos.z-z);const dist=tmp2.length();tmp2.normalize();const right=tmp.cross(tmp2).normalize();const w=.0005+dist*.0013;
   rpos[i*6]=x+right.x*w;rpos[i*6+1]=y+right.y*w;rpos[i*6+2]=z+right.z*w;rpos[i*6+3]=x-right.x*w;rpos[i*6+4]=y-right.y*w;rpos[i*6+5]=z-right.z*w;}
  ribbonGeo.attributes.position.needsUpdate=true;ribbon.material.opacity=state.phase==='idle'?.6:.85;
 }
 setRig(0);
 return {state,line,rig:()=>rig,parts:()=>parts,chain:()=>chain,describe:()=>describeRig(rig),setRig,nextRig:()=>setRig(state.rigIndex+1),beginCharge,release,twitch,reelIn,update,tipPosition:()=>worldTip().clone(),
  lure:()=>state.phase==='flight'?{...state.flight}:lurePosition(line),
  snapshot:()=>({phase:state.phase,rig:rig.id,lure:parts.lure.id,power:+state.power.toFixed(2),lineOut:+line.lineOut.toFixed(2),tension:+line.tension.toFixed(2),lureDepth:+line.lureDepth.toFixed(2),onBottom:line.lureOnBottom,technique:state.label,casts:state.castCount,reeling:state.reeling,lure_pos:(()=>{const p=state.phase==='flight'?state.flight:lurePosition(line);return [+p.x.toFixed(2),+p.y.toFixed(2),+p.z.toFixed(2)];})()})};
}
