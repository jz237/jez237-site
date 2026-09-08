import assert from 'node:assert/strict';
import {createBridgeSelector,BRIDGE_FIGHTERS} from '../engine/painted-bridges.mjs';
import {feintIntent,blockedStringAlternative} from '../engine/ai-feints.mjs';
import {signatureNext} from '../engine/signature-routes.mjs';
import {projectStrikeTip,STRIKE_ANCHORS} from '../engine/strike-anchors.mjs';
import {createFighterMove,attackAnimationPose} from '../engine/fighter-kits.mjs';
for(const id of BRIDGE_FIGHTERS){
 const select=createBridgeSelector(),seen=new Set();
 for(const action of ['light','heavy','launcher']){
  const a=createFighterMove(id,action),f={def:{id},grounded:true,attacking:a};
  for(let frame=0;frame<a.totalFrames;frame++){
   f.attackFrame=frame;const p=select(f,true);
   if(frame>=a.activeStartFrame&&frame<a.activeEndFrame)assert.equal(p,null,`${id} contact preserved`);
   if(p)seen.add(p.frame);
  }
 }
 assert.deepEqual([...seen].sort(),[1,2,3,4,5],id+' all five new drawings used');
 const a=createFighterMove(id,'light'),f={def:{id},grounded:true,attacking:a,attackFrame:a.activeEndFrame+2};
 assert.equal(select(f,false),null);assert.equal(select(f,true),null,'late loading cannot pop into an attack');
 assert.ok(signatureNext(id,'light').length);
 for(const action of ['launcher','enhancedLauncher']){
  const a=createFighterMove(id,action);
  const end=attackAnimationPose(a,a.activeEndFrame-1,{inbetween:true});
  assert.deepEqual(end,{bank:a.animation.bank,frame:a.animation.frames[2]},id+' rising arc cannot become a cross');
  assert.deepEqual(attackAnimationPose(a,a.activeEndFrame),{bank:a.animation.bank,frame:a.animation.frames[3]});
 }
 for(const tip of Object.values(STRIKE_ANCHORS[id]))assert.ok(tip.every(v=>v>0&&v<320));
}
const self={id:'jez',x:500,grounded:true,health:100},opp={fighterId:'benny',x:500+createFighterMove('benny','heavy').range+60,grounded:true};
const brain={};
assert.equal(feintIntent(brain,self,opp,400,0).reason,'feint-approach');
assert.equal(feintIntent(brain,self,opp,407,.9).reason,'feint-retreat');
assert.equal(feintIntent(brain,self,opp,421,.9).reason,'feint-watch');
assert.equal(feintIntent(brain,self,opp,430,.9),null);
assert.equal(feintIntent(brain,self,opp,440,0),null,'cooldown');
brain.feint={started:700,direction:1};assert.equal(feintIntent(brain,self,{...opp,attacking:{}},701,0),null,'abort against attack');
assert.equal(blockedStringAlternative({blockedPlanUntil:90},self,{...opp,x:540,guarding:true},70,.1).action,'throw');
assert.equal(blockedStringAlternative({},self,{...opp,x:540,guarding:true},70,.1),null);
const right=projectStrikeTip([280,120],{x:500,y:600,size:320}),left=projectStrikeTip([280,120],{x:500,y:600,size:320,mirror:-1});
assert.deepEqual(right,{x:620,y:400});assert.deepEqual(left,{x:380,y:400});
console.log('PASS: all 50 bridge drawings routed, contacts retained, feint phases/cooldown/abort, blocked throw and mirrored strike tips');
