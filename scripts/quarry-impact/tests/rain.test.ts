import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {surfaceGrip,setWetness,currentWetness} from '../src/driving-surface';
import {createRain,RAIN_DROPS} from '../src/rain';
import {LIGHTING_PRESETS,LIGHTING_CHOICES} from '../src/lighting-presets';
import {DrivingBrain} from '../src/driving-brain';
test('wet roads lose grip (tarmac most) and dry coefficients stay exact',()=>{
 setWetness(0);assert.equal(surfaceGrip('asphalt'),3.2);assert.equal(surfaceGrip('gravel'),2.4);assert.equal(surfaceGrip('mud'),1.9);
 setWetness(1);assert.ok(Math.abs(surfaceGrip('asphalt')-3.2*.82)<1e-9);assert.ok(Math.abs(surfaceGrip('gravel')-2.4*.9)<1e-9);
 setWetness(7);assert.equal(currentWetness(),1);setWetness(Number.NaN);assert.equal(currentWetness(),0);
});
test('rain streaks surround the camera, fall and stay hidden until active',()=>{
 const scene=new T.Scene(),rain=createRain(scene),camera=new T.PerspectiveCamera();camera.position.set(100,5,-40);
 const lines=scene.getObjectByName('rain') as T.LineSegments;assert.equal(lines.visible,false);assert.equal(lines.geometry.attributes.position.count,RAIN_DROPS*2);
 rain.update(camera,.1);assert.ok(Array.from(lines.geometry.attributes.position.array as Float32Array).every(v=>v===0),'inactive rain does no work');
 rain.setActive(true);rain.update(camera,.1);const p=lines.geometry.attributes.position.array as Float32Array;
 for(let i=0;i<p.length;i+=3){assert.ok(Math.abs(p[i]-100)<=29&&Math.abs(p[i+2]+40)<=29&&p[i+1]>-12&&p[i+1]<22);}
 const y0=p[1];rain.update(camera,.05);assert.notEqual(p[1],y0);rain.dispose();assert.equal(scene.getObjectByName('rain'),undefined);
});
test('rain is a dark overcast mood in the lighting choices',()=>{
 assert.equal(LIGHTING_PRESETS.rain.overcastSky,true);assert.ok(LIGHTING_PRESETS.rain.fog>LIGHTING_PRESETS.overcast.fog);assert.equal(LIGHTING_CHOICES.rain,'Rain · wet roads');
});
test('AI eases off in the wet',()=>{
 const brain=()=>new DrivingBrain();const car:any={id:1,kind:'coupe',current:{x:0,y:0,z:-118},velocity:{x:0,y:0,z:0},forward:{x:1,y:0,z:0},right:{x:0,y:0,z:-1},speed:0,health:100,finished:false,nextCheckpoint:1,surface:'asphalt'};
 const cps=[{x:-50,z:-118},{x:0,z:-118},{x:50,z:-118},{x:100,z:-118}];
 setWetness(0);const dry=brain().update(car,[car],'race',1/60,undefined,cps);setWetness(1);const wet=brain().update(car,[car],'race',1/60,undefined,cps);setWetness(0);
 assert.ok(wet.throttle<=dry.throttle);
});
