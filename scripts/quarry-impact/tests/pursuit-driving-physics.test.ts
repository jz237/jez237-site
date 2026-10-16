import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';import * as T from 'three';
import {templates} from '../src/assets';import {Vehicle} from '../src/vehicle';
import {DrivingBrain} from '../src/driving-brain';import {PursuitDriving} from '../src/pursuit-driving';import {PursuitSession,soloPursuitRules} from '../src/pursuit';
await R.init();const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const w=new T.Group();w.name='wheel_'+name;model.add(w)}templates.set('coupe',model);
for(const overshot of [false,true])test(`normal pursuit controls make physical contact ${overshot?'after overshooting':'from behind'} without arena recentering`,()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const scene=new T.Scene(),fx={emit(){},mark(){},detach(){}} as any,cars=[0,1].map(id=>new Vehicle(id,'coupe',0xffffff,scene,world,fx,undefined,{height:()=>0,surface:()=>'asphalt'}));
 const [runner,chaser]=cars;runner.place(200,218,0);chaser.place(200,overshot?225:200,0);
 const brain=new DrivingBrain(),driver=new PursuitDriving(brain),session=new PursuitSession(soloPursuitRules([0,1],0,60)),route=[{x:200,z:180},{x:200,z:300},{x:250,z:300}];
 let contacted=false,maxZ=200;
 try{
 for(let i=0;i<600;i++){
  runner.input={throttle:0,brake:.15,steer:0,handbrake:false};
  chaser.input=i<90?{throttle:0,brake:1,steer:0,handbrake:false}:driver.update(session,chaser,cars,1/60,i/60,route,()=>({front:30,left:30,right:30,rear:30}),()=>true);
  for(const c of cars)c.preStep(1/60);world.step();for(const c of cars)c.postStep(1/60,i/60);maxZ=Math.max(maxZ,chaser.current.z);
  world.contactPair(chaser.collider,runner.collider,()=>{contacted=true});
 }
 assert.ok(contacted,'Chaser reached and physically contacted the runner using throttle/steering alone');if(!overshot)assert.ok(maxZ>211);assert.ok(chaser.current.x>190,'No recentering towards the quarry arena');
 }finally{cars.forEach(c=>c.dispose());world.free()}
});
