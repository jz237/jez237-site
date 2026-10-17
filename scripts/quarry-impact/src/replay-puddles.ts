import * as T from 'three';
import {PuddleSplashes,type Puddle,type SplashSource} from './puddle-splashes';
import {REPLAY_STRIDE,replayBracket,replayCarStride,type ReplayDocument} from './replay-data';
/** Bounded historical reconstruction, with no physics queries or live car writes. */
export class ReplayPuddles{
 readonly effects:PuddleSplashes;
 private seed=1;private tick=-1;private stride:number;
 private parents:T.Matrix4[][];private sources:SplashSource[];
 constructor(private doc:ReplayDocument,scene:T.Scene,private waters:Puddle[],cars:readonly {root:T.Object3D;wheels:T.Object3D[]}[]){
  this.stride=replayCarStride(doc.meta);
  this.effects=new PuddleSplashes(scene,()=>{this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;});
  this.parents=cars.map(c=>{c.root.updateWorldMatrix(true,true);const inverse=c.root.matrixWorld.clone().invert();return c.wheels.map(w=>new T.Matrix4().multiplyMatrices(inverse,w.parent!.matrixWorld));});
  this.sources=doc.meta.cars.map(c=>({id:c.id,velocity:new T.Vector3(),right:new T.Vector3(),health:0,remoteContactPoints:[null,null,null,null]}));
 }
 update(time:number){
  const tick=Math.floor(time*30);if(tick===this.tick)return;this.tick=tick;
  this.effects.reset();this.seed=12345;
  if(this.doc.meta.tyreModel!==1||!this.waters.length)return;
  const first=Math.ceil(this.doc.frames[0].time*30),end=Math.min(tick,Math.floor(this.doc.frames.at(-1)!.time*30));
  const p=new T.Vector3(),q=new T.Quaternion(),qb=new T.Quaternion(),n=new T.Vector3(),origin=new T.Vector3();
  // Spray lives at most1.05s and ripples1.1s. Rebuild only that visible window.
  for(let frame=Math.max(first,end-33);frame<=end;frame++){
   const {a,b,alpha}=replayBracket(this.doc.frames,frame/30),av=a.values,bv=b.values;
   this.sources.forEach((car,i)=>{
    const o=i*this.stride,t=av[o+54]===bv[o+54]?alpha:0,mix=(k:number)=>av[o+k]+(bv[o+k]-av[o+k])*t;
    origin.set(mix(0),mix(1),mix(2));q.fromArray(av,o+3).slerp(qb.fromArray(bv,o+3),t).normalize();
    car.velocity.set(mix(7),mix(8),mix(9));car.right.set(1,0,0).applyQuaternion(q);car.health=av[o+14];
    for(let wheel=0;wheel<4;wheel++){
     const k=REPLAY_STRIDE+wheel*6;
     if(av[o+k+5]!==1){car.remoteContactPoints![wheel]=null;continue;}
     const blend=av[o+k+5]===bv[o+k+5]?t:0,plane=(axis:number)=>av[o+k+axis]+(bv[o+k+axis]-av[o+k+axis])*blend;
     n.set(plane(0),plane(1),plane(2));const length=n.lengthSq();if(length<1e-8){car.remoteContactPoints![wheel]=null;continue;}
     const w=15+wheel*8;p.set(mix(w),mix(w+1),mix(w+2)).applyMatrix4(this.parents[i][wheel]).applyQuaternion(q).add(origin);
     p.addScaledVector(n,-(n.dot(p)+plane(3))/length);car.remoteContactPoints![wheel]=(car.remoteContactPoints![wheel]??new T.Vector3()).copy(p);
    }
   });
   this.effects.update(this.sources,this.waters,1/30,true,frame===end);
  }
 }
 dispose(){for(const mesh of [this.effects.spray,this.effects.rings]){mesh.removeFromParent();mesh.geometry.dispose();mesh.material.dispose();}}
}
