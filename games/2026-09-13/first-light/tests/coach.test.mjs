import test from 'node:test';import assert from 'node:assert/strict';
import {hotspots,hotspotLine,createCoach,coachTip,COACH_COOLDOWN} from '../coach-model.js';
const features=[{type:'laydown',x:10,z:10,r:8},{type:'laydown',x:22,z:14,r:8},{type:'dock',x:60,z:-20,r:9},{type:'weedbed',x:-40,z:30,r:70},{type:'riprap',x:120,z:-80,r:35},{type:'pads',x:-90,z:60,r:20},{type:'stump',x:30,z:80,r:15}];
test("the hotspots are the planner's best spots for the light, ranked and capped at three",()=>{
 const dawn=hotspots({features,hour:6.4,activity:.9});assert.equal(dawn.length,3);assert.ok(!(dawn[0].type==='laydown'&&dawn[1].type==='laydown'),'two laydowns twelve metres apart are one spot');assert.equal(dawn[0].rank,1);assert.ok(dawn[0].value>=dawn[1].value&&dawn[1].value>=dawn[2].value);
 for(const h of dawn){assert.ok(h.name&&h.lure&&h.rig&&h.target,JSON.stringify(h));}
 const night=hotspots({features,hour:22.5,activity:.2});assert.ok(night.some(h=>h.rig==='bottom'||h.target==='catfish'||h.target==='walleye'),'after dark the numbers point at cats or walleye: '+JSON.stringify(night.map(h=>[h.type,h.rig,h.target])));
 assert.match(hotspotLine(dawn[0]),/^Hotspot now: .+ · .+ on .+/);assert.equal(hotspotLine(null),'');
});
test('tips fire on what the player is doing, one at a time, and wait five minutes before repeating',()=>{
 const c=createCoach();const base={enabled:true,phase:'idle',idleSeconds:0,casts:3,cover:{where:'the dock',m:40,word:'NE'},lureDepthBed:2,elevation:10,castsHere:0,sinceBite:0,lure:'worm',technique:'lift & drop',retrieves:0,family:'soft',missedEarly:0,brokeOff:0,night:false,unlocked:['finesse','topwater','float'],rig:'finesse',hotspot:null};
 assert.equal(coachTip(c,{...base},0),null,'nothing to say');
 const idle=coachTip(c,{...base,idleSeconds:30},10);assert.equal(idle.id,'idle');assert.match(idle.text,/Cast at the dock, 40 m NE/);
 assert.equal(coachTip(c,{...base,idleSeconds:40},20),null,'the same tip is on cooldown');
 assert.equal(coachTip(c,{...base,idleSeconds:40},10+COACH_COOLDOWN+1).id,'idle','and fires again after it');
 assert.equal(coachTip(c,{...base,casts:0,idleSeconds:20},50).id,'first');
 assert.equal(coachTip(c,{...base,phase:'retrieve',lureDepthBed:.3,elevation:40},60).id,'thin');
 assert.equal(coachTip(c,{...base,castsHere:6,sinceBite:100,hotspot:{name:'Riprap point',dist:90,word:'E',target:'walleye',lure:'Squarebill'}},70).id,'stale');
 assert.equal(coachTip(c,{...base,technique:'straight retrieve',retrieves:3},80).id,'worm');
 assert.equal(coachTip(c,{...base,family:'topwater',elevation:45},90).id,'topwater');
 assert.equal(coachTip(c,{...base,missedEarly:2},100).id,'early');assert.equal(coachTip(c,{...base,brokeOff:2},110).id,'broke');
 assert.equal(coachTip(c,{...base,night:true,unlocked:['finesse','bottom'],rig:'finesse',sinceBite:200},120).id,'cats');
 const hs=coachTip(c,{...base,castsHere:3,sinceBite:200,hotspot:{name:'Riprap point',dist:90,word:'E',target:'walleye',lure:'Squarebill'}},130);assert.equal(hs.id,'hotspot');assert.match(hs.text,/walleye on squarebill\. It is 90 m E/);
 assert.equal(coachTip(c,{...base,enabled:false,idleSeconds:99},999),null,'switched off');
});
