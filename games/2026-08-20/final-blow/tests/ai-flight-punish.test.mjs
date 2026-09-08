import test from 'node:test';
import assert from 'node:assert/strict';
import {whiffedThrowPunish,selectRecoveryPunish,visibleOpponentObservation} from '../engine/ai.mjs';
import {projectileIntent,projectileHeightAt} from '../engine/ai-projectiles.mjs';
import {getKitMoveProfile} from '../engine/fighter-kits.mjs';

test('missed grabs are punishable only after the last active frame and before recovery ends',()=>{
 const observed={frame:100,attacking:true,attackLevel:'throw',attackFrame:8,attackActiveEndFrame:8,attackTotalFrames:40};
 assert.equal(whiffedThrowPunish(observed,100),false);
 assert.equal(whiffedThrowPunish(observed,101),true);
 assert.equal(whiffedThrowPunish(observed,131),true);
 assert.equal(whiffedThrowPunish(observed,132),false);
 assert.equal(whiffedThrowPunish(observed,200),false);
 assert.equal(whiffedThrowPunish({...observed,grabbing:true},110),false);
 for(const id of ['jez','benny','alan','ali','commissioner','cyraxx','deathblow','devil','donald','post']){
  assert.equal(selectRecoveryPunish(id,80,2),null);
  assert.equal(selectRecoveryPunish(id,800,30),null);
  const punish=selectRecoveryPunish(id,80,30);assert.ok(punish);
  const move=getKitMoveProfile(id,punish.action,{limb:punish.limb});
  assert.ok(move.range>=80&&move.startupFrames+2<=30);
 }
});
test('rising objects do not invite a jump into their flight path',()=>{
 const self={id:'jez',x:500,y:600,grounded:true};
 const shot={x:750,y:550,vx:-600,width:40,height:30,lifeFrames:100,level:'low'};
 const observed=projectiles=>({frame:100,x:1000,projectiles});
 assert.equal(projectileIntent(self,observed([shot]),100,.2).reason,'projectile-jump');
 assert.notEqual(projectileIntent(self,observed([{...shot,vy:-900}]),100,.2)?.reason,'projectile-jump');
 assert.equal(projectileIntent(self,observed([{...shot,y:100}]),100,.2),null,'a shot passing well above the body is no immediate threat');
 assert.equal(projectileHeightAt({...shot,vy:-200,gravity:1000},.4),550);
});
test('flight observations retain independent visible velocity and gravity samples',()=>{
 const shot={ownerSide:1,x:500,y:400,vx:-300,vy:-200,gravity:900,width:40,height:30,lifeFrames:100};
 const observed=visibleOpponentObservation({side:1},10,[shot,{...shot,ownerSide:0}]);
 assert.equal(observed.projectiles.length,1);shot.vy=999;
 assert.equal(observed.projectiles[0].vy,-200);assert.equal(observed.projectiles[0].gravity,900);
});
