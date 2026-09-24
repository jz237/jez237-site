import * as T from 'three';
import {tissueFlow} from './AnemoneFlow.ts';
import type {Food} from './ReefFish.ts';

export type AnemoneStrand={tip:T.Vector3;samples:T.Vector3[];brushIndex:number;phase:number;arc:number;scale:number;angle:number};
export type AnemoneHost={center:T.Vector3;scale:number;strands:AnemoneStrand[]};
export type AnemoneVisitor={position:T.Vector3;velocity:T.Vector3;group:T.Group};
/** Contact-driven capture, shortened local tentacles and gradual recovery.
 * Transfer is accelerated for observation; see qa/anemone-research-20260923.md. */
export class AnemoneBehavior{
 readonly hosts:AnemoneHost[];
 readonly brushData=new Float32Array(541*4);
 readonly brushTexture=new T.DataTexture(this.brushData,541,1,T.RGBAFormat,T.FloatType);
 private brushVelocity=new Float32Array(541*3);
 private brushTime=-1;private brushing=0;private maxBrush=0;
 private brushPoint=new T.Vector3();private brushAxis=new T.Vector3();private brushDelta=new T.Vector3();
 readonly anchors:{value:T.Vector4[]};
 readonly feeding={value:Array.from({length:3},()=>new T.Vector4())};
 readonly morsels=new T.InstancedMesh(new T.SphereGeometry(.024,8,6),new T.MeshStandardMaterial({color:'#d29c65',roughness:.85}),3);
 private states=Array.from({length:3},()=>({at:-100,start:new T.Vector3(),active:false}));
 private nextContact=0;private captured=0;private swallowed=0;private dummy=new T.Object3D();private tip=new T.Vector3();
 constructor(hosts:AnemoneHost[]){this.hosts=hosts;this.anchors={value:hosts.map(h=>new T.Vector4(h.center.x,h.center.y,h.center.z,h.scale))};this.morsels.count=0;this.morsels.frustumCulled=false;this.morsels.name='Food carried by anemone tentacles';this.brushTexture.needsUpdate=true;}
 tipAt(host:number,strand:AnemoneStrand,time:number,out:T.Vector3){
  const f=tissueFlow(time,1,strand.phase),scale=Math.min(strand.scale,strand.arc*.85),hostData=this.hosts[host],feed=this.feeding.value[host];
  const weight=T.MathUtils.smoothstep(Math.cos(strand.angle)*feed.y+Math.sin(strand.angle)*feed.z,.05,.8),fold=feed.x*weight;
  out.copy(strand.tip);out.x+=f[0]*scale;out.z+=f[1]*scale;out.lerp(hostData.center,fold);const i=strand.brushIndex*4;return out.addScaledVector(new T.Vector3(this.brushData[i],this.brushData[i+1],this.brushData[i+2]),1-fold*2.5);
 }
 update(time:number,foods:Food[],visitors:AnemoneVisitor[]=[]){
  this.updateBrushing(time,visitors);
  // No reaction to a feeding button or distant food: only actual canopy contact.
  if(time>=this.nextContact){this.nextContact=time+.09;
   for(let k=0;k<this.hosts.length;k++){const h=this.hosts[k],state=this.states[k];if(time-state.at<24)continue;
    for(const food of foods){if(!food.alive||food.position.distanceToSquared(h.center)>2*h.scale*h.scale)continue;
     let touched=false;
     for(const strand of h.strands){this.tipAt(k,strand,time,this.tip);if(food.position.distanceToSquared(this.tip)<(.055*h.scale+.022)**2){touched=true;break;}}
     if(!touched)continue;
     food.alive=false;state.at=time;state.start.copy(food.position);state.active=true;this.captured++;
     const dx=food.position.x-h.center.x,dz=food.position.z-h.center.z,len=Math.hypot(dx,dz)||1;this.feeding.value[k].set(0,dx/len,dz/len,0);break;
    }
   }
  }
  let count=0;
  for(let k=0;k<this.hosts.length;k++){const state=this.states[k],elapsed=time-state.at,h=this.hosts[k],feed=this.feeding.value[k];
   feed.x=.20*T.MathUtils.smoothstep(elapsed,0,2.5)*(1-T.MathUtils.smoothstep(elapsed,10,24));feed.w=T.MathUtils.smoothstep(elapsed,0,8);
   if(state.active&&elapsed>=8){state.active=false;this.swallowed++;}
   if(!state.active)continue;
   const t=T.MathUtils.smoothstep(elapsed,0,8);this.dummy.position.copy(state.start).lerp(h.center,t);this.dummy.position.y+=Math.sin(t*Math.PI)*.10*h.scale;
   this.dummy.scale.setScalar(1-T.MathUtils.smoothstep(elapsed,6.8,8));this.dummy.updateMatrix();this.morsels.setMatrixAt(count++,this.dummy.matrix);
  }
  this.morsels.count=count;if(count)this.morsels.instanceMatrix.needsUpdate=true;
 }
 private updateBrushing(time:number,visitors:AnemoneVisitor[]){
  if(time===this.brushTime)return;
  const dt=this.brushTime<0?1/60:Math.min(.033,Math.max(0,time-this.brushTime));this.brushTime=time;
  this.brushing=0;this.maxBrush=0;
  for(const h of this.hosts){
   const near=visitors.filter(f=>f.position.distanceToSquared(h.center)<(1.6*h.scale+.4)**2);
   for(const strand of h.strands){
    const index=strand.brushIndex*4,vindex=strand.brushIndex*3,scale=Math.min(strand.scale,strand.arc*.85);
    const limit=Math.min(h.scale,strand.arc)*.18;let tx=0,ty=0,tz=0,best=0;
    for(const fish of near){
     this.brushAxis.set(1,0,0).applyQuaternion(fish.group.quaternion);
     const size=fish.group.scale.x,halfBody=size*.29,skinRadius=size*.19+.032*h.scale;
     for(let j=0;j<3;j++){
      const t=[.4,.7,1][j],e=t*t*(3-2*t),flow=tissueFlow(time,t,strand.phase);
      this.brushPoint.copy(strand.samples[j]);this.brushPoint.x+=flow[0]*t*t*scale;this.brushPoint.z+=flow[1]*t*t*scale;
      const feed=this.feeding.value[this.hosts.indexOf(h)],weight=T.MathUtils.smoothstep(Math.cos(strand.angle)*feed.y+Math.sin(strand.angle)*feed.z,.05,.8);this.brushPoint.lerp(h.center,feed.x*weight*e);
      this.brushDelta.copy(this.brushPoint).sub(fish.position);
      const along=T.MathUtils.clamp(this.brushDelta.dot(this.brushAxis),-halfBody,halfBody);this.brushDelta.addScaledVector(this.brushAxis,-along);
      const distance=this.brushDelta.length(),penetration=skinRadius-distance;
      if(penetration<=best)continue;best=penetration;
      // The touched strand follows the passing body, not a tank-wide pulse.
      // End displacement is bounded relative to arc length so skin cannot invert.
      this.brushDelta.multiplyScalar(1/Math.max(.001,distance));
      const push=Math.min(limit,penetration*1.5/Math.max(.35,e));
      tx=this.brushDelta.x*push+fish.velocity.x*.012;ty=this.brushDelta.y*push;tz=this.brushDelta.z*push+fish.velocity.z*.012;
     }
    }
    if(best>0)this.brushing++;
    const targetLength=Math.hypot(tx,ty,tz),factor=Math.min(1,limit/Math.max(.0001,targetLength));tx*=factor;ty*=factor;tz*=factor;
    const stiffness=best>0?145:32,damping=best>0?22:9;
    for(let axis=0;axis<3;axis++){
     let velocity=this.brushVelocity[vindex+axis];velocity+=(stiffness*((axis===0?tx:axis===1?ty:tz)-this.brushData[index+axis])-damping*velocity)*dt;
     this.brushVelocity[vindex+axis]=velocity;this.brushData[index+axis]+=velocity*dt;
    }
    const length=Math.hypot(this.brushData[index],this.brushData[index+1],this.brushData[index+2]);
    if(length>limit)for(let axis=0;axis<3;axis++){this.brushData[index+axis]*=limit/length;this.brushVelocity[vindex+axis]*=.5;}
    this.maxBrush=Math.max(this.maxBrush,Math.min(length,limit));
   }
  }
  this.brushTexture.needsUpdate=true;
 }
 snapshot(){return {brushing:this.brushing,maxBrush:this.maxBrush,captured:this.captured,swallowed:this.swallowed,carried:this.morsels.count,fold:this.feeding.value.map(f=>f.x)};}
}
