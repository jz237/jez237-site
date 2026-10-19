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
