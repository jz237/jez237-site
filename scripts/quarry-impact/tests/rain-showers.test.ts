import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SHOWERS,showerLevel} from '../src/rain-showers';
import {createRain,RAIN_DROPS} from '../src/rain';
import {lensRate,LENS_RAIN} from '../src/lens-rain';
test('the rain wanders between a light shower and a downpour over a minute or so, each event its own',()=>{
  const levels=Array.from({length:600},(_,i)=>showerLevel(i,.37));
  assert.ok(levels.every(l=>l>=SHOWERS.min-1e-9&&l<=1+1e-9),'within its range');
  assert.ok(Math.max(...levels)-Math.min(...levels)>.45,'really comes and goes');
  assert.ok(levels.every((l,i)=>i===0||Math.abs(l-levels[i-1])<.06),'gradually, not in jumps');
  assert.notEqual(showerLevel(30,.1),showerLevel(30,.6),'another event, other showers');assert.equal(showerLevel(NaN,NaN),showerLevel(0,0));
});
test('the falling rain draws as many streaks as the shower calls for, fainter when light',()=>{
  const scene=new T.Scene(),rain=createRain(scene),lines=scene.getObjectByName('rain') as T.LineSegments,material=lines.material as T.LineBasicMaterial;
  rain.setIntensity(1);assert.ok(rain.drops===RAIN_DROPS&&lines.geometry.drawRange.count===RAIN_DROPS*2);const heavy=material.opacity;
  rain.setIntensity(.4);assert.ok(rain.drops===Math.round(RAIN_DROPS*.4)&&lines.geometry.drawRange.count===rain.drops*2&&material.opacity<heavy);
  rain.setIntensity(NaN);assert.equal(rain.drops,RAIN_DROPS);rain.dispose();
});
test('drops land on the lens as hard as it rains; main drives the rain, its hiss, the lens and the puddles from the shower',()=>{
  assert.ok(Math.abs(lensRate(true,'chase',0,.5)-LENS_RAIN.rate.chase/2)<1e-9&&lensRate(true,'chase',0)===LENS_RAIN.rate.chase);
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("  shower=eventLighting==='rain'&&!online?.active?(showerForce??showerLevel(elapsed,showerSeed)):1;rain?.setIntensity(shower);sound.rainLevel(shower);"),'offline rain only');
  assert.ok(main.indexOf('let showerSeed=0,shower=1')<main.indexOf('async function start('),'declared before start() can run');
  assert.ok(main.includes('  showerSeed=Math.random();\n'),'each event its own');
  const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');assert.ok(audio.includes('h.gain.gain.setTargetAtTime(.16*(.45+.55*l),c.currentTime,1.2);'),'the hiss follows');
});
