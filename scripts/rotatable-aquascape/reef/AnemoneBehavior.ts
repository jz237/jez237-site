import * as T from 'three';
import {tissueFlow} from './AnemoneFlow.ts';
import type {Food} from './ReefFish.ts';

export type AnemoneStrand={tip:T.Vector3;phase:number;arc:number;scale:number;angle:number};
export type AnemoneHost={center:T.Vector3;scale:number;strands:AnemoneStrand[]};
/** Contact-driven capture, shortened local tentacles and gradual recovery.
 * Transfer is accelerated for observation; see qa/anemone-research-20260923.md. */
export class AnemoneBehavior{
 readonly hosts:AnemoneHost[];
 readonly anchors:{value:T.Vector4[]};
 readonly feeding={value:Array.from({length:3},()=>new T.Vector4())};
 readonly morsels=new T.InstancedMesh(new T.SphereGeometry(.024,8,6),new T.MeshStandardMaterial({color:'#d29c65',roughness:.85}),3);
 private states=Array.from({length:3},()=>({at:-100,start:new T.Vector3(),active:false}));
 private nextContact=0;private captured=0;private swallowed=0;private dummy=new T.Object3D();private tip=new T.Vector3();
 constructor(hosts:AnemoneHost[]){this.hosts=hosts;this.anchors={value:hosts.map(h=>new T.Vector4(h.center.x,h.center.y,h.center.z,h.scale))};this.morsels.count=0;this.morsels.frustumCulled=false;this.morsels.name='Food carried by anemone tentacles';}
 tipAt(host:number,strand:AnemoneStrand,time:number,out:T.Vector3){
  const f=tissueFlow(time,1,strand.phase),scale=Math.min(strand.scale,strand.arc*.85),hostData=this.hosts[host],feed=this.feeding.value[host];
  const weight=T.MathUtils.smoothstep(Math.cos(strand.angle)*feed.y+Math.sin(strand.angle)*feed.z,.05,.8),fold=feed.x*weight;
  out.copy(strand.tip);out.x+=f[0]*scale;out.z+=f[1]*scale;return out.lerp(hostData.center,fold);
 }
 update(time:number,foods:Food[]){
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
 snapshot(){return {captured:this.captured,swallowed:this.swallowed,carried:this.morsels.count,fold:this.feeding.value.map(f=>f.x)};}
}
