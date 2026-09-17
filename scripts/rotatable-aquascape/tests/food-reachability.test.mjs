import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {foodApproach,FoodReachability} from '../lib/FoodReachability.ts';
import {createAngel,advanceAngel} from '../lib/AngelfishMotion.ts';
import {thinkFish,createFishBrain} from '../lib/FishBrain.ts';
import {Corydoras,coryForward,coryMouth} from '../lib/Corydoras.ts';
const v=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
test('food approach checks turning space and the body corridor, not just the morsel',()=>{
 const from=v(-1,2,0),food=v(1,2,0),wall=p=>Math.abs(p.x)>.12;
 assert.equal(foodApproach(from,food,0,0,.3,wall),false);
 assert.equal(foodApproach(from,v(-1,2,1),0,0,.3,wall),true);
 assert.equal(foodApproach(from,food,Math.PI,0,.3,(_p,y)=>Math.abs(y-Math.PI)<.1),false);
 let visits=0;assert.equal(foodApproach(v(0,.4,0),v(1,.425,0),0,0,.15,p=>{visits++;return p.y>=.4},()=>.4),true);assert.ok(visits>5);
});
test('food perception is bounded, refreshes changed paths, and does not retain stale scenery forever',()=>{
 const cache=new FoodReachability(),from=v(),to=v(1);let checks=0,open=false;const check=()=>{checks++;return open};
 assert.equal(cache.test(1,0,from,to,check),false);open=true;
 for(let i=0;i<100;i++)cache.test(1,.01,from,to,check);assert.equal(checks,1);
 assert.equal(cache.test(2,.01,from,to,check),false);assert.equal(checks,1);
 assert.equal(cache.test(2,.2,from,to,check),true);assert.equal(cache.test(1,.9,from,to,check),true);
 assert.equal(cache.test(1,1.1,v(.6),to,check),true);assert.equal(checks,4);
});
test('angels and tetras choose an accessible second morsel and drop one that becomes blocked',()=>{
 const angel=createAngel(0);angel.position.set(0,3,0);const food=[{id:1,position:v(.6,3,0)},{id:2,position:v(1.4,3,0)}];let allowed=2;
 const senses={food,other:[],daylight:1,clear:()=>true,reachable:f=>f.id===allowed};advanceAngel(angel,.05,senses);assert.equal(angel.target,2);allowed=0;advanceAngel(angel,.05,senses);assert.equal(angel.target,null);
 const brain=createFishBrain();const fishSenses={food:[{id:1,x:60,y:0},{id:2,x:100,y:0}],neighbors:[],daylight:1,reachable:f=>f.id===allowed};allowed=2;thinkFish(brain,.05,0,0,0,fishSenses);assert.equal(brain.intent.target.id,2);allowed=0;thinkFish(brain,.05,0,0,0,fishSenses);assert.notEqual(brain.intent.kind,'feed');
});
test('cories pass over a blocked pellet and trigger one visible bite only at their actual mouth',()=>{
 const rock={center:v(0,.55,0),radius:.22},life=new Corydoras(new T.Scene(),()=>.4,[rock],undefined,1),a=life.animals[0];a.position.set(-1,.432,0);a.yaw=0;a.pitch=0;a.picking=undefined;a.route=[];a.mode='browsing';a.remaining=60;
 let eaten=0;life.feed(()=>{eaten++;assert.ok(coryMouth(a.position,coryForward(a),a.size,a.pitch).distanceTo(open.position)<.086);});for(const p of life.pellets.splice(2))p.mesh.removeFromParent();const [blocked,open]=life.pellets;blocked.position.set(.5,.425,0);open.position.set(-1,.425,1.7);let choseOpen=false;
 for(let i=0;i<300&&eaten===0;i++){life.update(.025,i*.025);choseOpen ||= a.mode==='feeding'&&a.target.distanceTo(v(-1,.432,1.7))<.01;}
 assert.ok(choseOpen);assert.equal(eaten,1);assert.ok(life.pellets.includes(blocked));assert.ok(life.models.respiration.getY(0)>1,'feeding mouth opening is stronger than respiration');
});
