import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SPARK_LIGHT,sparkFlash,SparkLight} from '../src/spark-light';
test('a burst of sparks flashes brighter the more sparks, a few none',()=>{
  assert.equal(sparkFlash(SPARK_LIGHT.min-1),0);assert.equal(sparkFlash(NaN),0);assert.equal(sparkFlash(SPARK_LIGHT.full),SPARK_LIGHT.intensity);assert.equal(sparkFlash(99),SPARK_LIGHT.intensity);
  assert.ok(sparkFlash(SPARK_LIGHT.min)>0&&sparkFlash(SPARK_LIGHT.min)<sparkFlash(SPARK_LIGHT.full));
});
test('one light, always there and dark between flashes: it jumps to a burst, flashes and dies away',()=>{
  const scene=new T.Scene(),spark=new SparkLight(scene);
  assert.ok(scene.children.filter(o=>o instanceof T.PointLight).length===1&&spark.light.intensity===0,'one light, dark');
  spark.flash(new T.Vector3(3,0,-2),SPARK_LIGHT.full);assert.ok(spark.light.intensity===SPARK_LIGHT.intensity&&spark.light.position.equals(new T.Vector3(3,SPARK_LIGHT.lift,-2)),'at the burst, just off the floor');
  spark.flash(new T.Vector3(9,0,9),SPARK_LIGHT.min);assert.ok(spark.light.position.x===3,'a weaker burst does not outshine it');
  spark.step(SPARK_LIGHT.fade/2);assert.ok(spark.light.intensity<SPARK_LIGHT.intensity&&spark.light.intensity>0,'dying away');
  spark.step(SPARK_LIGHT.fade*2);assert.equal(spark.light.intensity,0,'gone');assert.ok(scene.children.includes(spark.light),'but still there');
  spark.flash(new T.Vector3(),2);assert.equal(spark.flashes,1,'too few sparks to light anything');spark.flash(new T.Vector3(),20);spark.reset();assert.equal(spark.light.intensity,0);
});
test('the effects report every burst of sparks, and main lights them offline',()=>{
  const effects=readFileSync(new URL('../src/effects.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(effects.includes('    if(type===1&&count>0)this.onSparks?.(p,count);'),'sparks only');
  assert.ok(main.includes('fx.onSparks = (at, count) => { if (!online?.active) sparkLight.flash(at, count); };'),'offline');
  assert.ok(main.includes("sparkLight.step(state==='paused'||state==='inspect'?0:dt);")&&main.includes('exhaustFlames.reset();sparkLight.reset();'),'stepped, cleared');
});
