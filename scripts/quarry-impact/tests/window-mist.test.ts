import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {MIST,mistStep} from '../src/window-mist';
import {finishGlass} from '../src/car-materials';
const run=(level:number,seconds:number,raining:boolean,still:boolean)=>{for(let i=0;i<seconds*60;i++)level=mistStep(level,1/60,raining,still);return level;};
test('a car standing in the rain mists up over half a minute or so, toward the most it holds',()=>{
  const half=run(0,30,true,true);assert.ok(half>.35&&half<MIST.max,'milky in half a minute');assert.ok(run(0,600,true,true)>MIST.max*.99,'toward the most');
  assert.equal(run(0,30,false,true),0,'not in the dry');assert.equal(run(0,30,true,false),0,'not on the move');
});
test('it clears once the car gets going, more slowly out of the rain',()=>{
  const wet=run(.6,5,true,false),dry=run(.6,5,false,false);assert.ok(wet<.3&&dry>wet&&dry<.6,'cleared by the airflow, slower when dry');
  assert.equal(mistStep(.4,NaN,true,true),.4,'no time, no change');assert.equal(mistStep(NaN,1/60,false,false),0);
});
test('the glass shows it milky, thickest low on the pane, and not where it is cracked open',()=>{
  const m=new T.MeshPhysicalMaterial(),g=new T.BoxGeometry(1,.5,.01),state=finishGlass(m,g);assert.equal(state.mist.value,0);
  const shader={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};
  m.onBeforeCompile(shader as any,undefined as any);assert.ok(shader.uniforms.glassMist===state.mist,'its own uniform');
  assert.ok(shader.fragmentShader.includes('float mist=glassMist*(.75+.25*smoothstep(.5,-.1,vGlassPosition.y))*(1.-crack);'),'low on the pane, not through cracks');
  assert.ok(shader.fragmentShader.includes('diffuseColor.a=clamp(diffuseColor.a+mist*.85,0.,.97);'),'milky');assert.equal(m.customProgramCacheKey(),'quarry-laminated-glass-v3');
});
test('main mists the windows of offline cars standing or wrecked in the rain',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("now=mistStep(was,dt,eventLighting==='rain',c.health<=0||Math.abs(c.speed)<MIST.still);if(now===was)continue;mistIn.set(c,now);"),'standing or wrecked, in the rain');
  assert.ok(main.includes('if(st)st.mist.value=g.visible?now:0;'),'smashed-out windows stay clear');
});
