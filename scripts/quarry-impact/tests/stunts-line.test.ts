import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards,stuntsText} from '../src/event-awards';
test('a driver\'s stunts are tallied from the event: rolls, pins, slams, dominoes, pile-ups, fires, wheels and parts off',()=>{
 const a=new EventAwards();a.rolled(0,2,1);a.pinned(0,1,5);a.pinned(0,3,20);a.slammed(0,1,30);a.dominoed(0,2,40);a.pileUp(0,5,50);a.setAlight(0,3,60);a.stripped(0,1,1,4,70);
 a.pinned(1,0,80);a.dominoed(2,0,90);
 assert.deepEqual(a.stunts(0),{rolled:1,pins:2,slams:1,dominoes:1,pileUps:1,tanks:0,alight:1,wheels:1,parts:4});
 assert.deepEqual(a.stunts(3),{rolled:0,pins:0,slams:0,dominoes:0,pileUps:0,tanks:0,alight:0,wheels:0,parts:0},'a quiet night');
});
test('the line reads biggest kinds first, singular or plural, zeros left out, and is empty for a quiet night',()=>{
 assert.equal(stuntsText({rolled:1,pins:2,slams:0,dominoes:3,pileUps:0,tanks:0,alight:0,wheels:1,parts:7}),'YOUR STUNTS · 1 CAR ROLLED · 2 PINS · 3 DOMINOES · 1 WHEEL OFF · 7 PARTS OFF');
 assert.equal(stuntsText({rolled:0,pins:0,slams:1,dominoes:0,pileUps:2,tanks:0,alight:1,wheels:0,parts:0}),'YOUR STUNTS · 1 WALL SLAM · 2 PILE-UPS · 1 CAR ALIGHT');
 assert.equal(stuntsText({rolled:0,pins:0,slams:0,dominoes:0,pileUps:0,tanks:0,alight:0,wheels:0,parts:0}),'');
});
