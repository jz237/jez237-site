import test from 'node:test';
import assert from 'node:assert/strict';
import {LearningModel} from '../lib/LearningModel.ts';
import {lessons,lessonNames} from '../lib/LearningContent.ts';
test('balanced comparison has identical readings through day and night',()=>{
 const m=new LearningModel();m.reset();m.step(24);assert.deepEqual(m.state,m.baseline);assert.equal(m.state.hours.toFixed(1),'24.0');assert.ok(m.history.length>80);
});
test('interventions produce distinct causal results against the same control',()=>{
 const food=new LearningModel();food.reset('food');food.step(12);assert.ok(food.state.ammonia>food.baseline.ammonia);assert.ok(food.state.oxygen<food.baseline.oxygen);
 const carbon=new LearningModel();carbon.reset('carbon');carbon.step(4);assert.ok(carbon.state.co2<carbon.baseline.co2);
 const flow=new LearningModel();flow.reset('flow');flow.step(12);assert.ok(flow.state.ammonia>flow.baseline.ammonia);
});
test('pause freezes experiments; resets isolate state and bound chart memory',()=>{
 const m=new LearningModel();m.reset('food');const before=structuredClone(m.state);m.tick(.1);assert.deepEqual(m.state,before);
 m.running=true;m.tick(.1);assert.ok(m.state.hours>0);for(let i=0;i<80;i++)m.step(24);assert.ok(m.history.length<=193);assert.ok(Object.values(m.state).every(Number.isFinite));
 m.reset('balanced');assert.deepEqual(m.state,m.baseline);m.state.waste=4;assert.notEqual(m.state.waste,m.baseline.waste);assert.equal(m.running,false);
});
test('all eight lessons have reachable steps with finite scene anchors and explanations',()=>{
 assert.equal(Object.keys(lessonNames).length,8);for(const id of Object.keys(lessonNames)){assert.ok(lessons[id].length);for(const step of lessons[id]){assert.ok(step.title&&step.text&&step.detail);assert.equal(step.point.length,3);assert.ok(step.point.every(Number.isFinite));}}
});


test('CO2 injection follows the simulated light timer and supply control',()=>{
 const m=new LearningModel();m.reset();assert.equal(m.injectingCO2,true);m.environment.co2=0;assert.equal(m.injectingCO2,false);
 m.environment.co2=24;m.step(6);assert.equal(m.injectingCO2,false);const co2=m.state.co2;m.step(6);assert.ok(m.state.co2<co2);m.step(12);assert.equal(m.injectingCO2,true);
});

test('six-hour challenge answers agree with the model and food is isolated from control',()=>{
 const m=new LearningModel();m.reset('flow');m.environment.flow=0;m.step(6);assert.ok(m.state.oxygen<m.baseline.oxygen);
 m.reset('carbon');m.step(6);assert.ok(m.state.co2<m.baseline.co2);
 m.reset('food');m.step(6);assert.ok(m.state.ammonia>m.baseline.ammonia);
 const baseline=structuredClone(m.baseline),waste=m.state.waste;m.addFood();assert.equal(m.state.waste,waste+.5);assert.deepEqual(m.baseline,baseline);
});
