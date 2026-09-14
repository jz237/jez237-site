import test from 'node:test';import assert from 'node:assert/strict';
import {plural,closeSession,createSession,seedFrom,pickTarget,pickWeather,scoreCatch,recordCatch,tick,remaining,formatRemaining,boardNamespace,summary,initialsOf,dailyKey,SESSION_SECONDS,VARIANTS} from '../session.js';
import {fromLocal} from '../game-clock.js';
test('the daily seed is stable per day and variant, and picks a target that is up at that hour',()=>{
 assert.equal(seedFrom('20260914','dawn'),seedFrom('20260914','dawn'));assert.notEqual(seedFrom('20260914','dawn'),seedFrom('20260914','dusk'));assert.notEqual(seedFrom('20260914','dawn'),seedFrom('20260915','dawn'));
 assert.equal(dailyKey(fromLocal({year:2026,month:9,day:14,hour:6})),'20260914');
 const targets=new Set();for(let d=1;d<=30;d++){const s=createSession({variant:'dawn',key:'202609'+String(d).padStart(2,'0')});targets.add(s.target);assert.ok(VARIANTS.dawn.weatherPool.includes(s.weather));}
 assert.ok(targets.size>=3,'dawn targets vary across a month: '+[...targets]);
 let nightCats=0;for(let d=1;d<=30;d++){const t=pickTarget(seedFrom('202609'+String(d).padStart(2,'0'),'night'),'night');if(t==='catfish'||t==='walleye')nightCats++;}
 assert.ok(nightCats>=15,'night sessions lean to cats and walleye: '+nightCats);
 assert.ok(VARIANTS.dusk.weatherPool.includes(pickWeather(seedFrom('20260914','dusk'),'dusk')));
});
test('scoring triples the target, rewards a trophy target, and the clock ends the session',()=>{
 const s=createSession({variant:'dawn',key:'20260914',seed:5});s.target='largemouth';
 assert.equal(scoreCatch(s,{species:'bluegill',lengthIn:8}),8);assert.equal(scoreCatch(s,{species:'largemouth',lengthIn:16,sizeClass:'common'}),48);assert.equal(scoreCatch(s,{species:'largemouth',lengthIn:20,sizeClass:'trophy'}),75);
 recordCatch(s,{species:'bluegill',lengthIn:8,sizeClass:'common'});recordCatch(s,{species:'largemouth',lengthIn:16,sizeClass:'common'});s.casts=9;
 assert.equal(s.score,56);assert.equal(s.best.lengthIn,16);assert.equal(s.bestTarget.lengthIn,16);
 assert.match(summary(s),/56 points · 2 landed, 1 largemouth bass · best largemouth bass 16 in · 9 casts/);
 assert.equal(tick(s,60),false);assert.equal(remaining(s),SESSION_SECONDS-60);assert.equal(formatRemaining(remaining(s)),'19:00');
 assert.equal(tick(s,SESSION_SECONDS),true);assert.equal(s.over,true);assert.ok(recordCatch(s,{species:'largemouth',lengthIn:20,sizeClass:'trophy'})>0,'a fish hooked before the horn still counts');closeSession(s);assert.equal(recordCatch(s,{species:'largemouth',lengthIn:20}),0,'nothing after the card');
 assert.equal(plural('muskellunge',0),'muskellunge');assert.equal(plural('bluegill',3),'bluegills');assert.equal(plural('walleye',2),'walleye');
 assert.equal(boardNamespace(s),'first-light-dawn-20260914');assert.equal(initialsOf('je z!'),'JEZ');assert.equal(initialsOf('abcd'),'ABC');
});
