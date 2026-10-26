import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {DANGLE,lampPops,lampTears,swingLamp,LampDangle} from '../src/lamp-dangle';
const settle=(accel:{x:number;z:number},end=1,seconds=3)=>{const s={pitch:DANGLE.hang,pitchV:0,roll:0,rollV:0};for(let i=0;i<seconds*60;i++)swingLamp(s,accel,end,1/60);return s;};
test('a lamp pops out once smashed well past breaking, tears away harder still',()=>{
  assert.ok(!lampPops(DANGLE.pop,true)&&lampPops(DANGLE.pop+1,true)&&!lampPops(DANGLE.pop+1,false)&&!lampPops(NaN,true));
  assert.ok(!lampTears(DANGLE.tear)&&lampTears(DANGLE.tear+1)&&!lampTears(NaN));assert.ok(DANGLE.tear>DANGLE.pop);
});
test('a hanging lamp swings out under braking, back under acceleration, sideways in turns, and settles hanging',()=>{
  const still=settle({x:0,z:0});assert.ok(Math.abs(still.pitch-DANGLE.hang)<1e-6&&Math.abs(still.roll)<1e-6,'at rest it just hangs');
  assert.ok(settle({x:0,z:-12}).pitch>DANGLE.hang+.05,'braking flings a front lamp out');assert.ok(settle({x:0,z:8}).pitch<DANGLE.hang-.03,'pulling away swings it back');
  assert.ok(settle({x:0,z:-12},-1).pitch<DANGLE.hang-.05,'a tail lamp the other way');assert.ok(settle({x:10,z:0}).roll>.05,'cornering swings it to the side');
  const wild=settle({x:1e6,z:-1e6});assert.ok(wild.pitch<=DANGLE.hang+DANGLE.max&&Math.abs(wild.roll)<=DANGLE.max,'never wilder than the limit');
  const bad=settle({x:NaN,z:NaN});assert.ok(Number.isFinite(bad.pitch)&&Number.isFinite(bad.roll));
});
const car=(width=.3)=>{const root=new T.Group(),body=new T.Group(),lens=new T.Mesh(new T.BoxGeometry(width,.08,.04),new T.MeshStandardMaterial({name:'Headlight'}));lens.position.set(.5,.6,2);body.add(lens);root.add(body);root.updateMatrixWorld(true);return {root,body,lens};};
test('the smashed lamp hangs out of its socket on two wires in front of its reflector, then tears away',()=>{
  const {root,body,lens}=car(),torn:T.Mesh[]=[],dangle=new LampDangle(root,[{mesh:lens,end:1}],m=>{torn.push(m);m.visible=false;}),still=new T.Vector3();
  lens.userData.damage=DANGLE.pop-1;dangle.update(still,1/60);assert.equal(dangle.count,0,'only smashed past popping');
  lens.userData.damage=DANGLE.pop+1;for(let i=0;i<60;i++)dangle.update(still,1/60);
  const pivot=lens.parent!;assert.ok(dangle.count===1&&dangle.popped===1&&pivot.name==='dangling_lamp'&&pivot.parent===body,'hung from a pivot on the body');
  assert.equal(body.children.filter(o=>o.name==='lamp_wire').length,2,'two wires');assert.ok(pivot.children.some(o=>o.name==='lamp_housing'),'its reflector housing');
  assert.ok(Math.abs(pivot.position.y-(.6-DANGLE.slack))<1e-6&&pivot.position.z>2.02+DANGLE.out-1e-6,'dropped out of the socket, out in front');
  const at=new T.Vector3();lens.getWorldPosition(at);assert.ok(at.z>2,'out in front of the car');
  lens.userData.damage=DANGLE.tear+1;dangle.update(still,1/60);
  assert.ok(dangle.torn===1&&torn.length===2&&torn[0]===lens&&torn[1].name==='lamp_housing','torn away, housing and all');
  assert.equal(body.children.filter(o=>o.name==='lamp_wire').length,0,'its wires gone');assert.deepEqual(dangle.swings,[]);
});
test('a repaired car has its lamps back in their sockets; a light bar across the car never hangs',()=>{
  const {root,body,lens}=car(),dangle=new LampDangle(root,[{mesh:lens,end:1}],()=>{}),still=new T.Vector3(),before=lens.position.clone();
  lens.userData.damage=DANGLE.pop+5;for(let i=0;i<30;i++)dangle.update(still,1/60);assert.equal(dangle.count,1);
  lens.userData.damage=0;dangle.update(still,1/60);
  assert.ok(dangle.count===0&&lens.parent===body&&lens.position.distanceTo(before)<1e-9,'back where it was');assert.equal(body.children.filter(o=>o.name==='dangling_lamp'||o.name==='lamp_wire').length,0);
  const bar=car(DANGLE.width+.2),wide=new LampDangle(bar.root,[{mesh:bar.lens,end:1}],()=>{});bar.lens.userData.damage=DANGLE.pop+5;for(let i=0;i<5;i++)wide.update(still,1/60);
  assert.ok(wide.count===0&&bar.lens.parent===bar.body,'too wide to hang');
  const again=car(),d2=new LampDangle(again.root,[{mesh:again.lens,end:1}],()=>{});again.lens.userData.damage=DANGLE.pop+5;d2.update(still,1/60);d2.dispose();assert.ok(again.lens.parent===again.body&&d2.count===0,'disposed back in place');
});
test('main hangs smashed lamps on every offline car and swings them each frame of play',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("lampDangles.set(car,new LampDangle(car.root,lamps,mesh=>fx.detach(mesh,car.velocity.clone().multiplyScalar(.65))));")&&main.includes('    if(car.extendedDamage){const lights=carLights.get(car)!,lamps='));
  assert.ok(main.includes("  if(state==='playing'||state==='wrecked'||state==='result'||state==='countdown')for(const c of cars){lampDangles.get(c)?.update(c.velocity,dt);"));
  assert.ok(main.includes('  for (const c of cars){lampDangles.get(c)?.dispose();lampDangles.delete(c);towStraps.get(c)?.dispose();towStraps.delete(c);airbags.get(c)?.dispose();airbags.delete(c);strutPunches.get(c)?.dispose();strutPunches.delete(c);mudFlaps.get(c)?.dispose();mudFlaps.delete(c);carLights.get(c)?.dispose();'));
});
