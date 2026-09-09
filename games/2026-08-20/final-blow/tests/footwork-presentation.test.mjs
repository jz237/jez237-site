import assert from 'node:assert/strict';
import test from 'node:test';
import {createFootworkSelector} from '../engine/painted-footwork.mjs';
import {hitRegion,recoveryProgress,victoryCell} from '../engine/combat-presentation.mjs';
import {strategicIntent} from '../engine/ai-strategy.mjs';
const fighter=()=>({def:{id:'jez'},grounded:true,x:0,vx:150,facing:1});
test('footwork follows distance in both directions and settles after a stop',()=>{
 for(const direction of [1,-1]){
  const select=createFootworkSelector(),f=fighter(),seen=new Set();f.vx*=direction;
  for(let tick=0;tick<60;tick++){f.x=tick*2.5*direction;seen.add(select(f,f,tick,true)?.frame);}
  assert.deepEqual([...seen].sort(),(direction===1?[0,1,2,5]:[0,3,4,5]));
  f.vx=0;assert.equal(select(f,f,60,true).frame,5);assert.equal(select(f,f,67,true),null);
 }
});
test('block recoil, landing and attack contact are separate from gait',()=>{
 const select=createFootworkSelector(),f=fighter();f.vx=0;f.blockstunFrames=15;f.lastImpactTick=0;f.lastHitHeavy=true;
 assert.equal(select(f,f,0,true).frame,8);assert.equal(select(f,f,4,true).frame,8);
 f.crouch=true;assert.equal(select(f,f,5,true).frame,9);
 f.blockstunFrames=0;f.crouch=false;f.grounded=false;select(f,f,6,true);f.grounded=true;assert.equal(select(f,f,7,true).frame,15);
 f.attacking={limb:'kick',activeStartFrame:10,activeEndFrame:15,totalFrames:30};f.attackFrame=12;
 assert.equal(select(f,f,8,true),null);
});
test('a late sheet cannot change an attack already started without it',()=>{
 const select=createFootworkSelector(),f=fighter();f.attacking={limb:'kick',activeStartFrame:10,activeEndFrame:15,totalFrames:30};f.attackFrame=1;
 select(f,f,1,false);f.attackFrame=5;assert.equal(select(f,f,5,true),null);
});
test('reaction uses contact height and low strikes buckle the legs',()=>{
 const v={y:500,height:200};assert.equal(hitRegion({level:'mid'},v,{y:330}),'head');assert.equal(hitRegion({level:'mid'},v,{y:400}),'body');assert.equal(hitRegion({level:'low'},v,{y:450}),'legs');
});
test('miss recovery preserves duration and contact recoil, celebrations settle',()=>{
 assert.equal(recoveryProgress({},0),0);assert.equal(recoveryProgress({},1),1);assert.ok(recoveryProgress({},.2)<.2);
 assert.equal(recoveryProgress({attackConnected:'hit'},.2),.2);
 for(const id of ['jez','benny','alan','ali','commissioner','cyraxx','deathblow','devil','donald','post']){
  const cells=new Set(Array.from({length:31},(_,i)=>victoryCell(id,i/10)));assert.ok(cells.size>=2);assert.equal(victoryCell(id,5),victoryCell(id,20));
 }
});
test('spacing keeps an existing approach through the outer band',()=>{
 const args={id:'jez',self:{x:600,health:100,grounded:true},opponent:{x:795,health:100,grounded:true},frame:100,timeRemaining:90,roll:.5};
 assert.equal(strategicIntent({...args,previousMovement:'advance'}).movement,'advance');
 assert.equal(strategicIntent({...args,previousMovement:'hold'}).movement,'hold');
});
