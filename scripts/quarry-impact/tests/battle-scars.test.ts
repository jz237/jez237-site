import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SCARS,applyScars,bodyPoints,planScars} from '../src/battle-scars';
import {prepareWreckGeometry} from '../src/wreck-geometry';
/** A box body 1.8 x 1.2 x 4.4 m of painted panels (and a chrome one), prepared for wrecking as a car's is. */
function body(){
  const root=new T.Group(),paint=new T.MeshStandardMaterial({name:'paint_Paint 1 Test'});
  const shell=new T.Mesh(new T.BoxGeometry(1.8,1.2,4.4,6,4,12).translate(0,.8,0),paint);shell.name='panel_shell';
  const trim=new T.Mesh(new T.BoxGeometry(.2,.1,.1).translate(.95,.6,2.2),new T.MeshStandardMaterial({name:'Chrome'}));trim.name='panel_trim';
  root.add(shell,trim);prepareWreckGeometry(root);return{root,panels:[shell,trim]};
}
test('only old rivals carry scars, more the older, each car its own',()=>{
  const {panels}=body(),points=bodyPoints(panels);assert.equal(points.length,(panels[0].geometry.attributes.wreckPosition.count)*3,'the painted bodywork only');
  assert.deepEqual(planScars(points,3,SCARS.age-.01),[],'too new');assert.equal(planScars(points,3,SCARS.age).length,SCARS.count[0]);assert.equal(planScars(points,3,1).length,SCARS.count[1]);
  const a=planScars(points,5,.8),b=planScars(points,5,.8);assert.deepEqual(a.map(s=>s.at.toArray()),b.map(s=>s.at.toArray()),'its own, every time');
  assert.deepEqual(planScars([],1,1),[]);assert.deepEqual(planScars(points,NaN,NaN),[]);
});
test('scars land on the bodywork, mostly at the ends where derby cars meet, struck inward',()=>{
  const {panels}=body(),points=bodyPoints(panels);let ends=0,all=0;
  for(let id=0;id<40;id++)for(const s of planScars(points,id,1)){all++;
    assert.ok(Math.abs(Math.abs(s.at.z)-2.2)<1e-6||Math.abs(Math.abs(s.at.x)-.9)<1e-6,'on the shell');
    if(Math.abs(Math.abs(s.at.z)-2.2)<1e-6){ends++;assert.ok(s.direction.z*s.at.z<0,'into the end');}else assert.ok(s.direction.x*s.at.x<0,'into the flank');
    assert.ok(s.blow>=SCARS.blow[0]&&s.blow<=SCARS.blow[1]&&s.at.y>.2&&s.at.y<1.4,'a modest knock, low to mid');}
  assert.ok(Math.abs(ends/all-SCARS.ends)<.12,`ends ${ends}/${all}`);
});
test('the scars dent and smear the bodywork only',()=>{
  const {panels}=body(),scars=planScars(bodyPoints(panels),2,1),shell=panels[0],before=Float32Array.from(shell.geometry.attributes.position.array as Float32Array);
  const smears:number[]=[];const dented=applyScars(panels,scars,(_p,_at,blow,paint)=>{smears.push(blow);assert.ok(paint instanceof T.Color);});
  assert.ok(dented>=1&&smears.length>=scars.length,'dented and smeared');
  const after=shell.geometry.attributes.position.array as Float32Array;let moved=0;for(let i=0;i<after.length;i++)if(Math.abs(after[i]-before[i])>1e-4)moved++;assert.ok(moved>0,'the shape changed');
  assert.equal(shell.userData.damage,0,'no panel damage counted toward knocking it off');
  const hidden=body();hidden.panels.forEach(p=>p.visible=false);assert.equal(applyScars(hidden.panels,scars,()=>{}),0,'not on parts already gone');
});
test('main scars offline rivals (not the player, not the buggy) by their age, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage&&i!==0&&type!=='buggy'){const scars=planScars(bodyPoints(car.panels),car.id,startingRust(car.id));if(scars.length)battleScars.set(car,{scars:scars.length,panels:applyScars(car.panels,scars,(p,at,blow,paint)=>car.surfaceFinish.transfer(p,at,blow,paint))});}"));
  assert.ok(main.includes('scars: (id = 0) =>'));
});
