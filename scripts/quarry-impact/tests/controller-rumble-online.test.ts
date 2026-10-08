import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {OnlineView} from '../src/online-view';import {stockSetup} from '../src/garage';
test('online feedback only uses fresh local damage, never history, repeats, scars or other drivers',()=>{
 const setup=stockSetup('coupe'),cars=[0,1].map(id=>({id,kind:'coupe',setup,current:new T.Vector3(),currentQ:new T.Quaternion(),root:new T.Group(),velocity:new T.Vector3(),specification:{damageScale:1},repair(){},hit(){},scar(){}}));
 const view=new OnlineView(null as any,null as any,{}as any,{shot(){}}as any,()=>cars as any,()=>{throw Error('Unexpected rebuild');});
 Object.assign(view,{initialized:true,lastTick:99,repairs:new Map([[0,0],[1,0]]),apply(){},applyLiveries(){}});
 view.network.id=0;view.network.connected=true;const impacts:number[]=[];view.onLocalImpact=damage=>impacts.push(damage);
 const hit=(id:number,car=0,tick=100,scar=false)=>({id,car,tick,scar,damage:12,repair:0,localPoint:{x:0,y:0,z:0},localDirection:{x:1,y:0,z:0}});
 const damage=[hit(1),hit(2,1),hit(3,0,90),hit(4,0,-1000),hit(5,0,100,true),hit(6,0,101)];
 const s:any={tick:100,elapsed:2,cars:cars.map(c=>({id:c.id,kind:c.kind,setup,repair:0,p:{x:0,y:0,z:0},q:{x:0,y:0,z:0,w:1},v:{x:0,y:0,z:0}})),damage};
 (view.network as any).pendingDamage=damage;view.receive(s);assert.deepEqual(impacts,[12]);
 (view.network as any).pendingDamage=damage;view.receive(s);assert.deepEqual(impacts,[12]);
 view.network.connected=false;(view.network as any).pendingDamage=[hit(7)];view.receive(s);assert.deepEqual(impacts,[12]);
});
