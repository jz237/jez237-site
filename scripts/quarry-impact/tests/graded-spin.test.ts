import test from 'node:test';import assert from 'node:assert/strict';
import {CombatFeats,validCombatFeats,type CombatMotion} from '../src/combat-feats';import {CombatScoreboard} from '../src/event-rules';import {OnlineEvent,DEFAULT_ONLINE_EVENT,validOnlineEventState} from '../src/online-events';
const motion=(id:number,patch:Partial<CombatMotion>={}):CombatMotion=>({id,x:id*4,z:0,yaw:0,speed:10,vx:10,vz:0,angular:0,up:1,grounded:4,health:100,...patch});
const yaw=(angle:number)=>Math.atan2(Math.sin(angle),Math.cos(angle));
function sample(board:CombatScoreboard,angle:number,time:number,patch:Partial<CombatMotion>={}){board.sample([motion(0),motion(1,{yaw:yaw(angle),angular:Math.PI,...patch})],time);}
const board=()=>{const b=new CombatScoreboard(true);b.contact(motion(0),motion(1),3,1);return b;};
test('exact thresholds award both directions, upgrades pay differences and count one incident',()=>{
 for(const direction of [-1,1])for(const degrees of [90,180,360]){
  const b=board();for(let i=1;i<=degrees/3;i++)sample(b,direction*i*Math.PI/60,1+i/60);
  const r=b.get(0);assert.equal(r.spins,1);assert.equal(r.spins180??0,degrees>=180?1:0);assert.equal(r.spins360??0,degrees===360?1:0);assert.equal(b.points(0),degrees===90?75:degrees===180?150:300);assert.equal(r.award?.kind,degrees===90?'spin':degrees===180?'spin180':'spin360');
  if(degrees===360)assert.equal(b.feats.snapshot().pending.length,0);
 }
});
test('yaw wraps, reversals, repeated thresholds and expiry do not farm upgrades',()=>{
 const b=board();for(let i=1;i<=31;i++)sample(b,i*Math.PI/60,1+i/60);assert.equal(b.points(0),75);
 // Oscillate around the already-paid threshold; never reach a half turn.
 for(let i=32;i<120;i++)sample(b,Math.PI/2+Math.sin(i)*.02,1+i/60);assert.equal(b.points(0),75);assert.equal(b.get(0).spins,1);
 sample(b,Math.PI/2,3.6);assert.equal(b.feats.snapshot().pending.length,0);
 b.contact(motion(0),motion(1),3,4);assert.equal(b.feats.snapshot().pending.length,0);
 b.contact(motion(0),motion(1),3,11);assert.equal(b.feats.snapshot().pending.length,1);
});
test('paid pending spins preserve interruption protections and cannot upgrade after recovery',()=>{
 for(const patch of [{up:0},{grounded:0},{health:0},{x:1000}]){const b=board();for(let i=1;i<=31;i++)sample(b,i*Math.PI/60,1+i/60);sample(b,Math.PI,1.54,patch);assert.equal(b.points(0),75);assert.equal(b.feats.snapshot().pending.length,0);}
 const b=board();for(let i=1;i<=31;i++)sample(b,i*Math.PI/60,1+i/60);b.feats.remove(1);for(let i=32;i<=120;i++)sample(b,i*Math.PI/60,1+i/60);assert.equal(b.points(0),75);
});
test('graded event cold restore pays remaining tiers once and rejects inconsistent bonuses',()=>{
 const rules={...DEFAULT_ONLINE_EVENT,derby:'score' as const,duration:60},event=new OnlineEvent('derby',rules,7,8,true);event.combat.contact(motion(0),motion(1),3,1);
 for(let i=1;i<=40;i++)sample(event.combat,i*Math.PI/60,1+i/60);
 const state=event.snapshot(8);assert.equal(state.spinTiers,1);assert.ok(validOnlineEventState(state,'derby',8));assert.ok(validCombatFeats(state.feats,8,60,true));assert.equal(validCombatFeats(state.feats,8,60),false);
 const copy=new OnlineEvent('derby',rules,7);copy.restore(state,8);assert.deepEqual(copy.snapshot(8),state);
 for(let i=41;i<=120;i++)sample(copy.combat,i*Math.PI/60,1+i/60);assert.equal(copy.combat.points(0),300);assert.equal(copy.combat.get(0).spins,1);assert.ok(validOnlineEventState(copy.snapshot(8),'derby',8));assert.equal(event.combat.points(0),75);
 for(const mutate of [(v:any)=>delete v.spinTiers,(v:any)=>v.spinTiers=2,(v:any)=>v.combat[0].bonus++,(v:any)=>v.combat[0].spins360=2,(v:any)=>v.combat[0].spins180=0]){const bad=structuredClone(copy.snapshot(8));mutate(bad);assert.equal(validOnlineEventState(bad,'derby',8),false);}
 const old=new OnlineEvent('derby',rules,7);old.combat.contact(motion(0),motion(1),3,1);for(let i=1;i<=120;i++)sample(old.combat,i*Math.PI/60,1+i/60);assert.equal(old.combat.points(0),75);assert.equal(old.snapshot(8).spinTiers,undefined);assert.ok(validOnlineEventState(old.snapshot(8),'derby',8));copy.restore(old.snapshot(8),8);assert.equal(copy.combat.feats.graded,false);
});

import R from '@dimforge/rapier3d-compat';import {Room,type Peer} from '../multiplayer/room';import {parseClientMessage} from '../multiplayer/protocol';import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
await R.init();
const peer=()=>{const closed:number[]=[];return{closed,p:{send(){},close(code:number){closed.push(code);}} as Peer};};
const hello=(graded:boolean,token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'DRIVER',kind:'coupe',eventRules:1,...graded?{spinTiers:1}:{},token});
test('rooms negotiate legacy peers, reject incompatible late joins, and preserve upgraded scores through wire and restore',()=>{
 for(const mixed of [false,true]){const room=new Room('ABCDEF',R),cold=new Room('ABCDEF',R),a=peer(),b=peer();try{
  assert.equal(room.connect(a.p,hello(true)),0);assert.equal(room.connect(b.p,hello(!mixed)),1);
  room.receive(0,a.p,JSON.stringify({type:'start',mode:'derby',rules:{...DEFAULT_ONLINE_EVENT,derby:'score',duration:60}}));
  const event=room.sim.event!;assert.equal(event.combat.feats.graded,!mixed);assert.equal(room.snapshot().spinTierSupport,mixed?undefined:true);
  event.combat.contact(motion(0),motion(1),3,1);for(let i=1;i<=70;i++)sample(event.combat,i*Math.PI/60,1+i/60);
  const state=room.snapshot(true);assert.ok(validOnlineSnapshot(state));const decoded=decodeSnapshotWire(encodeSnapshotWire(state));assert.deepEqual(JSON.parse(JSON.stringify(decoded)),JSON.parse(JSON.stringify(state)));
  if(!mixed){assert.equal(event.combat.points(0),150);const bad=structuredClone(state);delete bad.spinTierSupport;assert.equal(validOnlineSnapshot(bad),false);const late=peer();assert.equal(room.connect(late.p,hello(false)),null);assert.deepEqual(late.closed,[1008]);}
  const saved=room.save();cold.restore(saved);const again=peer();assert.equal(cold.connect(again.p,hello(true,saved.sessions[0].token)),0);assert.deepEqual(cold.sim.event!.snapshot(8),event.snapshot(8));
  for(let i=71;i<=120;i++)sample(cold.sim.event!.combat,i*Math.PI/60,1+i/60);assert.equal(cold.sim.event!.combat.points(0),mixed?75:300);assert.ok(validOnlineSnapshot(cold.snapshot(true)));
 }finally{room.dispose();cold.dispose();}}
 const good=JSON.parse(hello(true));for(const bad of [{...good,spinTiers:2},{...good,eventRules:undefined}])assert.equal(parseClientMessage(JSON.stringify(bad)),null);
});
test('restore rejects orphan paid tiers and direction reversal cancels the remaining upgrade',()=>{
 const e=new OnlineEvent('derby',{...DEFAULT_ONLINE_EVENT,derby:'score',duration:60},7,8,true);e.combat.contact(motion(0),motion(1),3,1);for(let i=1;i<=31;i++)sample(e.combat,i*Math.PI/60,1+i/60);
 const state=e.snapshot(8);for(const mutate of [(s:any)=>s.feats.cooldowns=[],(s:any)=>{s.combat[0]={...s.combat[0],spins:0,bonus:0,award:undefined};}]){const bad=structuredClone(state);mutate(bad);assert.equal(validOnlineEventState(bad,'derby',8),false);}
 for(let i=32;i<=70;i++)sample(e.combat,(62-i)*Math.PI/60,1+i/60);assert.equal(e.combat.points(0),75);assert.equal(e.combat.feats.snapshot().pending.length,0);assert.ok(validOnlineEventState(e.snapshot(8),'derby',8));
});

import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';import {derbyRecordPrefix} from '../src/derby-policy';
test('spectator feed shows earned upgrades once and new records cannot overwrite legacy scores',()=>{
 const b=board(),feed=new DerbyEventFeed(),rows=()=>[{id:0,name:'DRIVER',record:b.get(0)}];feed.observe(rows(),1);
 for(let i=1;i<=120;i++)sample(b,i*Math.PI/60,1+i/60);feed.observe(rows(),3);assert.deepEqual(feed.visible(3).map(e=>e.kind),['spin360','spin180','spin']);assert.match(derbyFeedMarkup(feed.visible(3),0),/360° SPIN ★★★/);feed.observe(rows(),4);assert.equal(feed.visible(4).length,3);
 for(const format of ['score','score-no-respawn'] as const)for(const rivals of [false,true])assert.notEqual(derbyRecordPrefix(format,rivals,true),derbyRecordPrefix(format,rivals));assert.equal(derbyRecordPrefix('survival',false,true),'derby');
});
