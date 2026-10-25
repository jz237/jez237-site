import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {WIND,eventWind,gusting} from '../src/wind';
import {VehicleFire} from '../src/vehicle-fire';
import {createRain} from '../src/rain';
import {derbyFlag,waveFlag} from '../src/derby-flag';
test('each event has its own breeze, stronger in the rain, gusting slowly about it',()=>{
  let n=0;const r=()=>[.25,.5,.9,0][n++%4];
  const a=eventWind(r,false),b=eventWind(r,true);const sa=Math.hypot(a.x,a.z),sb=Math.hypot(b.x,b.z);
  assert.ok(Math.abs(sa-(WIND.min+.5*(WIND.max-WIND.min)))<1e-9&&Math.abs(Math.atan2(a.z,a.x)-Math.PI/2)<1e-9,'from its direction at its speed');
  assert.ok(Math.abs(sb-WIND.min*WIND.rain)<1e-9,'the rain blows harder');
  const out={x:0,z:0};let lo=Infinity,hi=-Infinity;for(let t=0;t<600;t+=.5){gusting({x:2,z:0},t,out);lo=Math.min(lo,out.x);hi=Math.max(hi,out.x);assert.equal(out.z,0);}
  assert.ok(lo>=2*(1-WIND.gust)-1e-9&&hi<=2*(1+WIND.gust)+1e-9&&hi-lo>2*WIND.gust,'gusts both ways within its share');
  assert.deepEqual(gusting({x:1,z:-1},NaN,out),{x:1,z:-1});
});
test('fire smoke leans with the breeze, or the old way in still air; the rain slants with it without a jump',()=>{
  const fire=new VehicleFire(new T.Scene(),()=>{}) as any;
  assert.deepEqual([fire.smokeDrift,fire.plumeDrift,fire.gustBoth],[{x:.5,z:-.2},{x:.4,z:0},false],'the old lean');
  fire.setWind({x:2,z:-1},WIND.fire);assert.ok(Math.abs(fire.smokeDrift.x-2*WIND.fire)<1e-12&&Math.abs(fire.plumeDrift.z+WIND.fire)<1e-12&&fire.gustBoth);
  fire.setWind(null);assert.deepEqual([fire.smokeDrift,fire.plumeDrift,fire.gustBoth],[{x:.5,z:-.2},{x:.4,z:0},false]);
  const scene=new T.Scene(),rain=createRain(scene),cam=new T.PerspectiveCamera(),lines=scene.getObjectByName('rain') as T.LineSegments,pos=()=>(lines.geometry.attributes.position as T.BufferAttribute).array as Float32Array;
  rain.setActive(true);rain.update(cam,1);const before=Float32Array.from(pos());
  const slant=(i:number)=>{const p=pos();return [(p[i*6]-p[i*6+3])/(p[i*6+4]-p[i*6+1]),(p[i*6+2]-p[i*6+5])/(p[i*6+4]-p[i*6+1])];};
  assert.ok(Math.abs(slant(5)[0]+1.6/17)<1e-5&&Math.abs(slant(5)[1]-.9/17)<1e-5,'the old slant');
  rain.setWind({x:3,z:0});rain.update(cam,0);let still=true;for(let i=0;i<300;i++){const k=i*6;still&&=Math.abs(pos()[k]-before[k])<1e-3&&Math.abs(pos()[k+2]-before[k+2])<1e-3;}
  assert.ok(still,'no jump when the breeze changes');assert.ok(Math.abs(slant(5)[0]-3/17)<1e-5&&Math.abs(slant(5)[1])<1e-6,'slanting with it');
  rain.setWind(null);assert.ok(Math.abs(slant(5)[0]-3/17)<1e-5,'until the next frame');rain.update(cam,.01);assert.ok(Math.abs(slant(5)[0]+1.6/17)<1e-5);rain.dispose();
});
test('a parked car\'s flag streams downwind; in still air it hangs as it was',()=>{
  const rest=(derbyFlag(0xff4a12).getObjectByName('flag_cloth') as T.Object3D).rotation.y;
  const run=(wind?:{x:number;z:number})=>{const car=new T.Group(),flag=derbyFlag(0xff4a12);car.add(flag);for(let i=0;i<120;i++)waveFlag(flag,car,1/60,false,wind);return (flag.getObjectByName('flag_cloth') as T.Object3D).rotation.y;};
  assert.ok(Math.abs(run({x:2.5,z:0}))<.25,'with a breeze along +x the cloth points along +x');
  assert.ok(Math.abs(run({x:0,z:-2.5})-Math.PI/2)<.25,'a breeze along -z turns it a quarter round');
  assert.equal(run(),rest,'still air: a parked car leaves its flag as it hangs');
});
test('main gives each offline event a breeze and passes it to the smoke, fire, rain and flags; online stays still',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),fx=readFileSync(new URL('../src/effects.ts',import.meta.url),'utf8');
  assert.ok(main.includes("windy=!online?.active;Object.assign(breezeBase,windy?eventWind(Math.random,eventLighting==='rain'):{x:0,z:0});"));
  assert.ok(main.includes("if(windy&&!online?.active){gusting(breezeBase,clock,breeze);fx.wind.set(breeze.x,breeze.z);vehicleFire?.setWind(breeze,WIND.fire);rain?.setWind(breeze);}")&&main.includes("else if(fx.wind.x||fx.wind.y){fx.wind.set(0,0);vehicleFire?.setWind(null);rain?.setWind(null);}"));
  assert.ok(main.includes("waveFlag(f,c.root,dt,c.health<=0||c.inverted>.3,windy&&!online?.active?breeze:undefined);"));
  assert.ok(fx.includes("if (!solid && (this.wind.x || this.wind.y)) { const k = 1 - Math.exp(-dt * 1.5); p.v.x += (this.wind.x - p.v.x) * k; p.v.z += (this.wind.y - p.v.z) * k; }"),'smoke, steam and vapour drift; sparks and debris do not');
  const declared=main.indexOf('let windy=false;'),started=main.indexOf('async function start(');assert.ok(declared>0&&declared<started,'declared before start() can run');
});
