import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {DEFINITIONS} from '../src/rules';
import {SOOT,TIPS,exhaustTips,fitSoot,sootStep,startingSoot} from '../src/exhaust-soot';
const panel=(name:string,w:number,h:number,at:[number,number,number])=>{const g=new T.BoxGeometry(w,h,.04).translate(...at);g.setAttribute('wreckPosition',g.attributes.position.clone());const m=new T.Mesh(g,new T.MeshStandardMaterial());m.name=name;return m;};
test('an old banger arrives sooted, more the older; a young car clean',()=>{
  assert.equal(startingSoot(0),0);assert.equal(startingSoot(SOOT.age-.01),0);assert.equal(startingSoot(SOOT.age),SOOT.start[0]);assert.ok(Math.abs(startingSoot(1)-SOOT.start[1])<1e-12);
  assert.ok(startingSoot(.5)>startingSoot(.3)&&startingSoot(.7)>startingSoot(.5));assert.equal(startingSoot(NaN),0);
});
test('driving soots it further: flat out, each oil-burning puff, a crushed pipe under throttle — never past 1',()=>{
  assert.ok(Math.abs(sootStep(0,1,.1,0,false)-SOOT.flat*.1)<1e-12,'flat out');assert.equal(sootStep(0,SOOT.full-.01,.1,0,false),0,'part throttle');
  assert.ok(Math.abs(sootStep(0,0,.1,3,false)-3*SOOT.puff)<1e-12,'puffs');assert.ok(Math.abs(sootStep(0,.5,.1,0,true)-SOOT.crushed*.1)<1e-12,'crushed pipe');assert.equal(sootStep(0,0,.1,0,true),0,'crushed but lifted');
  assert.equal(sootStep(.999,1,.25,5,true),1,'at most 1');assert.ok(Math.abs(sootStep(0,1,9,0,false)-SOOT.flat*.25)<1e-12,'a long step is capped');
  assert.equal(sootStep(.4,NaN,NaN,NaN,false),.4);assert.equal(sootStep(NaN,1,.1,0,false),SOOT.flat*.1);
});
test('every car has its tailpipes measured, at the back, at most two',()=>{
  for(const kind of Object.keys(DEFINITIONS)){const tips=TIPS[kind];assert.ok(tips&&tips.length>=1&&tips.length<=2,kind);for(const t of tips)assert.ok(t[2]<0&&Math.abs(t[0])<1.1&&t[1]>0&&t[1]<.6,kind);}
});
test('the tips come into the car’s frame from its model’s, or the fallback for a model not measured',()=>{
  const root=new T.Group(),model=new T.Group();model.position.set(0,-.8,.1);root.add(model);root.position.set(5,0,5);root.rotation.y=1;
  const tips=exhaustTips('muscle',model,root,new T.Vector3(9,9,9));
  assert.equal(tips.length,2);assert.ok(Math.abs(tips[0].x+.42)<1e-9&&Math.abs(tips[0].y-(.42-.8))<1e-9&&Math.abs(tips[0].z-(-2.41+.1))<1e-9);
  const none=exhaustTips('no-such-car',model,root,new T.Vector3(-.35,-.25,-2));assert.ok(none.length===1&&none[0].equals(new T.Vector3(-.35,-.25,-2)));
});
test('the stain lies on the rear panels near the tips (not the interior), each sharing its panel’s geometry and one soot level',()=>{
  const root=new T.Group(),back=panel('panel_bumper_rear',1.6,.3,[0,-.2,-2.3]),tailgate=panel('panel_Tailgate',1.4,.6,[0,.3,-2.25]),front=panel('panel_bumper_front',1.6,.3,[0,-.2,2.3]),inside=panel('panel_inner_Interior',1,.3,[0,-.2,-2.2]);
  root.add(back,tailgate,front,inside);root.updateMatrixWorld(true);
  const level=fitSoot(root,[back,tailgate,front,inside],[new T.Vector3(.42,-.3,-2.4)]);assert.ok(level!==null);
  const stain=(p:T.Mesh)=>p.children.find(c=>c.name==='exhaust_soot') as T.Mesh|undefined;
  assert.ok(!!stain(back)&&!!stain(tailgate)&&!stain(front)&&!stain(inside),'rear panels only');
  assert.ok(stain(back)!.geometry===back.geometry&&(stain(back)!.material as T.ShaderMaterial).uniforms.soot===(stain(tailgate)!.material as T.ShaderMaterial).uniforms.soot,'one level for the car');
  level!.value=.6;assert.equal((stain(back)!.material as T.ShaderMaterial).uniforms.soot.value,.6);
  assert.equal(fitSoot(root,[front],[new T.Vector3(.42,-.3,-2.4)]),null,'nothing near');
});
test('main soots every offline car from its model’s tips, old rivals from the start, builds it as they drive, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage){const level=fitSoot(car.root,car.panels,exhaustTips(type,car.model,car.root,new T.Vector3(isRearEngineKind(type)?.35:-.35,-.25,-DEFINITIONS[type].halfLength)));if(level){level.value=startingSoot(i===0?0:startingRust(car.id));soots.set(car,level);}}'));
  assert.ok(main.includes("if(state==='playing')for(const c of cars){const level=soots.get(c);if(!level||c.health<=0||c.exhaustGone)continue;const puffs=oilBurners.get(c)?.puffs??0;level.value=sootStep(level.value,c.input.throttle,dt,puffs-(sootPuffs.get(c)??0),!!c.exhaustCrushed);sootPuffs.set(c,puffs);}"));
  assert.ok(main.includes('soot: (id = 0, level?: number) =>'));
});
