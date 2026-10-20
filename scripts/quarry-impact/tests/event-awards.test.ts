import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards,awardsHtml} from '../src/event-awards';
test('awards pick the biggest single hit, the most destructive driver, the biggest climber and the toughest survivor',()=>{
 const a=new EventAwards();a.hit(2,5,12);a.hit(3,1,30);a.hit(3,1,Number.NaN);a.hit(4,4,99);a.hit(1,2,-5);
 a.grid([0,1,2,3,4]);a.grid([4,3,2,1,0]);
 const cars=[{id:0,inflicted:10,health:40},{id:1,inflicted:3,health:0},{id:2,inflicted:44,health:70},{id:3,inflicted:30,health:90},{id:4,inflicted:0,health:20}];
 const race=a.awards('race',cars,[3,0,4,2,1]);
 assert.deepEqual(race.map(x=>[x.key,x.id,Math.round(x.value)]),[['hit',3,30],['destroyer',2,44],['climber',3,3]]);assert.equal(race[0].victim,1);
 const derby=a.awards('derby',cars);assert.deepEqual(derby.map(x=>[x.key,x.id]),[['hit',3],['destroyer',2],['toughest',3]]);
 a.reset();assert.equal(a.started,false);assert.deepEqual(a.awards('race',cars.map(c=>({...c,inflicted:0})),[0,1,2]),[]);
});
test('award cards name cars, highlight the player and escape names',()=>{
 const a=new EventAwards();a.hit(0,1,25);
 const html=awardsHtml(a.awards('derby',[{id:0,inflicted:25,health:50},{id:1,inflicted:0,health:10}]),id=>id===1?'#2 <b>RIVAL</b>':'#1',0);
 assert.match(html,/event-award event-award-you" data-award="hit"><span class="eyebrow">BIGGEST HIT<\/span><b>YOU<\/b>/);assert.match(html,/on #2 &lt;b&gt;RIVAL&lt;\/b&gt;/);assert.equal(awardsHtml([],String),'');
});
test('takedowns count only hits that wreck the victim and earn the MOST TAKEDOWNS card',()=>{
 const a=new EventAwards();
 assert.equal(a.hit(0,1,20,true),true);assert.equal(a.hit(0,2,5,false),false);assert.equal(a.hit(3,2,15,true),true);assert.equal(a.hit(0,4,9,true),true);assert.equal(a.hit(0,0,50,true),false);
 assert.equal(a.takedownsFor(0),2);assert.equal(a.takedownsFor(3),1);
 const cards=a.awards('derby',[{id:0,inflicted:34,health:60},{id:3,inflicted:15,health:10}]);
 assert.deepEqual(cards.find(c=>c.key==='takedowns'),{key:'takedowns',title:'MOST TAKEDOWNS',id:0,value:2,detail:'2 cars wrecked'});
 a.reset();assert.equal(a.takedownsFor(0),0);
});
test('nemesis names who hurt the player most and notes revenge',()=>{
 const a=new EventAwards();a.hit(2,0,12);a.hit(2,0,10);a.hit(3,0,15);a.hit(0,2,40,true);a.hit(4,1,90);
 const cars=[{id:0,inflicted:40,health:55},{id:1,inflicted:0,health:0},{id:2,inflicted:22,health:0},{id:3,inflicted:15,health:80},{id:4,inflicted:90,health:70}];
 const n=a.nemesis(0,cars,'derby')!;assert.equal(n.id,2);assert.equal(n.value,22);assert.equal(n.title,'NEMESIS · REVENGE TAKEN');assert.match(n.detail,/dealt you 22 damage · you outlasted them/);
 const b=new EventAwards();b.hit(3,0,20);
 assert.equal(b.nemesis(0,cars,'race',[3,0])!.title,'NEMESIS');assert.equal(b.nemesis(0,cars,'race',[0,3])!.title,'NEMESIS · REVENGE TAKEN');
 const c=new EventAwards();c.hit(3,0,2);assert.equal(c.nemesis(0,cars,'race'),null,'glancing contact is not a nemesis');
});
test('the biggest hit keeps its time for the replay shortcut',()=>{
 const a=new EventAwards();assert.equal(a.biggestHit,null);a.hit(1,2,10,false,4.5);a.hit(3,4,8,false,9);a.hit(5,6,20,true,Number.NaN);
 assert.deepEqual(a.biggestHit,{attacker:5,victim:6,damage:20,time:0});a.hit(7,8,25,false,12.25);assert.equal(a.biggestHit!.time,12.25);
});
test('the live rival is whoever has hurt the player most so far',()=>{
 const a=new EventAwards();assert.equal(a.rivalOf(0),null);a.hit(3,0,4);assert.equal(a.rivalOf(0),null,'below 5 damage');a.hit(5,0,6);a.hit(3,0,3);
 assert.deepEqual(a.rivalOf(0),{id:3,damage:7});a.hit(0,3,50);assert.deepEqual(a.rivalOf(0),{id:3,damage:7});assert.equal(a.rivalOf(9),null);
});
test('wheels torn off and parts knocked off rivals earn the snatcher and scrap awards',()=>{
 const a=new EventAwards();a.stripped(2,5,1,2);a.stripped(2,6,1,0);a.stripped(3,5,0,4);a.stripped(4,4,3,9);a.stripped(1,5,0,0);
 assert.deepEqual(a.strippedBy(2),{wheels:2,parts:2});assert.deepEqual(a.strippedBy(4),{wheels:0,parts:0},'self-inflicted does not count');
 const list=a.awards('derby',[{id:2,inflicted:10,health:50},{id:3,inflicted:5,health:40}]);
 const wheels=list.find(x=>x.key==='wheels'),scrap=list.find(x=>x.key==='scrap');
 assert.ok(wheels&&wheels.id===2&&wheels.value===2&&wheels.detail==='2 wheels torn off');assert.ok(scrap&&scrap.id===3&&scrap.value===4);
 const quiet=new EventAwards();quiet.stripped(1,2,0,2);assert.ok(!quiet.awards('race',[]).some(x=>x.key==='scrap'||x.key==='wheels'),'two parts is not yet a merchant');
 a.reset();assert.deepEqual(a.strippedBy(2),{wheels:0,parts:0});
});
test('highlights keep the best spread-out moments in time order',()=>{
 const a=new EventAwards();a.hit(1,2,4,false,1);a.hit(1,2,12,false,5);a.hit(3,4,40,true,6);a.stripped(5,6,1,0,20);a.hit(7,8,11,false,20.5);a.hit(2,3,15,false,30);a.hit(9,2,10,false,40);a.hit(2,9,14,false,50);
 const h=a.highlights(4);assert.equal(h.length,4);assert.deepEqual(h.map(m=>m.kind),['takedown','wheel','hit','hit']);
 assert.ok(h.every((m,i)=>i===0||m.time>h[i-1].time),'in time order');assert.ok(!h.some(m=>m.time===20.5),'a moment within 2 s of a better one is dropped');
 assert.ok(!h.some(m=>m.time===1),'small hits are not highlights');
 a.reset();assert.equal(a.highlights().length,0);
});
