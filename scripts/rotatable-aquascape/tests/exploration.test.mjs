import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {PlantPicker,trackFish} from '../lib/Exploration.ts';
import {challenges} from '../lib/LearningChallenges.ts';
import {LearningModel} from '../lib/LearningModel.ts';
import {createFishBrain,thinkFish,rememberPlant} from '../lib/FishBrain.ts';
import {createTetraSwim,advanceTetraSwim} from '../lib/TetraSwimming.ts';
import {createSchoolRoute,advanceSchoolRoute} from '../lib/SchoolRoute.ts';
test('plant picking returns the closest intersected leaf with its botanical form',()=>{
 const scene=new T.Scene(),leaves=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({side:T.DoubleSide}),2);leaves.userData.plantSpecies='sword';
 leaves.setMatrixAt(0,new T.Matrix4().makeTranslation(0,0,-2));leaves.setMatrixAt(1,new T.Matrix4().makeTranslation(0,0,1));scene.add(leaves);scene.updateMatrixWorld();
 const picker=new PlantPicker(scene),hit=picker.pick(new T.Raycaster(new T.Vector3(0,0,4),new T.Vector3(0,0,-1)));
 assert.equal(hit.info.species,'sword');assert.ok(Math.abs(hit.distance-3)<1e-6);assert.ok(Math.abs(hit.info.point.z-1)<1e-6);
 assert.equal(picker.pick(new T.Raycaster(new T.Vector3(4,0,4),new T.Vector3(0,0,-1))),null);
});
test('follow camera keeps its viewing offset and eases toward a moving fish',()=>{
 const camera=new T.PerspectiveCamera(),target=new T.Vector3(0,2,0);camera.position.set(0,3,8);const offset=camera.position.clone().sub(target),fish=new T.Vector3(3,4,-1);
 for(let i=0;i<180;i++){trackFish(camera,target,fish,1/60);assert.ok(camera.position.clone().sub(target).distanceTo(offset)<1e-10);}
 assert.ok(target.distanceTo(fish)<.01);const before=camera.position.clone();trackFish(camera,target,new T.Vector3(20,0,0),0);assert.deepEqual(camera.position,before);
});
test('all prediction challenges give the stated outcome after the same six-hour interval',()=>{
 for(const [id,c] of Object.entries(challenges)){const m=new LearningModel();m.reset(c.experiment);if(id==='filter')m.environment.flow=0;m.step(6);assert.equal(m.state.hours,m.baseline.hours);assert.ok(Math.abs(m.state.hours-6)<1e-10);if(id==='feeding')assert.ok(m.state[c.metric]>m.baseline[c.metric]);else assert.ok(m.state[c.metric]<m.baseline[c.metric]);}
});
test('cardinal browsing uses nearby planting, remembers it, and gives visible food priority',()=>{
 const brain=createFishBrain(),patch={id:-101,x:1040,y:350,z:.5},senses={food:[],neighbors:[],daylight:1,browseSites:[patch]};
 let browsed=false;for(let i=0;i<30;i++){brain.decisionIn=0;if(thinkFish(brain,.1,1000,350,15,senses,.5).kind==='browse'){browsed=true;break;}}assert.ok(browsed);assert.equal(brain.intent.target.id,patch.id);
 const food={id:42,x:1060,y:345,z:.5};assert.equal(thinkFish(brain,.1,1000,350,15,{...senses,food:[food]},.5).kind,'feed');
 rememberPlant(brain,patch.x,patch.y);for(let i=0;i<30;i++){brain.decisionIn=0;assert.notEqual(thinkFish(brain,.1,1000,350,15,senses,.5).kind,'browse');}
});
test('propulsion and coasting vary independently while pause freezes both clocks',()=>{
 const fish=[createTetraSwim(19),createTetraSwim(237)];let different=0,cycles=0,previous=fish[0].powerStroke;
 for(let i=0;i<600;i++){for(const s of fish)advanceTetraSwim(s,1/60,false,false,{food:[],neighbors:[],daylight:1});if(fish[0].powerStroke!==fish[1].powerStroke)different++;if(fish[0].powerStroke!==previous){cycles++;previous=fish[0].powerStroke;}}
 assert.ok(different>100);assert.ok(cycles>10);const before=structuredClone(fish[0]);advanceTetraSwim(fish[0],0);assert.deepEqual(fish[0],before);
});
test('regrouping intervals vary instead of repeating one fixed period',()=>{
 const route=createSchoolRoute(),durations=[];let previous=route.loose,at=0;
 for(let i=0;i<3000;i++){advanceSchoolRoute(route,.1,[]);if(route.loose!==previous){durations.push(i-at);at=i;previous=route.loose;}}
 assert.ok(durations.length>8);assert.ok(new Set(durations).size>5);
});

test('a cardinal reaches planted patches, pauses briefly, then resumes travel',()=>{
 const s=createTetraSwim(237);s.x=900;s.y=350;s.z=.5;s.brain.hunger=.3;
 const sites=[{id:-101,x:980,y:360,z:.55},{id:-102,x:1100,y:350,z:.7},{id:-103,x:850,y:380,z:.3}];let visits=0,travel=0;
 for(let i=0;i<180*60;i++){advanceTetraSwim(s,1/60,false,false,{food:[],neighbors:[],daylight:1,browseSites:sites});if(s.browsing&&s.behavior==='inspecting')visits++;if(!s.browsing&&s.speed>12)travel++;assert.ok(Number.isFinite(s.x+s.y+s.z));}
 assert.ok(visits>30,'must reach and inspect a real supplied patch');assert.ok(travel>300,'must resume swimming after browsing');
});
