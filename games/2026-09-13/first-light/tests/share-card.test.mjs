import test from 'node:test';import assert from 'node:assert/strict';
import {catchCardLines,photoCardLines,footerText,fileName,CARD} from '../share-card.js';
test('a catch card carries the catch in order, biggest line the species',()=>{
 const lines=catchCardLines({name:'the Ridge Fish',species:'Largemouth bass',classLabel:'Legend',lengthIn:23,weightText:'7 lb 2 oz',rig:'Topwater casting',lure:'Bone walker',technique:'walking the dog',fought:48,time:'6:58 AM',date:'Mon, Sep 14',weather:'Calm, a little mist · 1 mph SW'});
 assert.equal(lines.length,5);assert.equal(lines[0].text,'THE RIDGE FISH · CATCH');assert.equal(lines[1].text,'Largemouth bass');assert.ok(lines[1].size>lines[2].size&&lines[1].serif);
 assert.match(lines[2].text,/Legend · 23 in · 7 lb 2 oz/);assert.match(lines[3].text,/fought 48 s/);assert.match(lines[4].text,/6:58 AM · Mon, Sep 14/);
 const plain=catchCardLines({species:'Bluegill',classLabel:'Common',lengthIn:7.5,weightText:'0 lb 6 oz',rig:'Float rig',lure:'Nightcrawler under a float',technique:'dead stick',time:'9:30 AM',date:'Tue, Sep 15',weather:'Overcast'});
 assert.equal(plain[0].text,'CATCH');assert.ok(!/fought/.test(plain[3].text));
});
test('photo captions, footer and file names',()=>{
 const p=photoCardLines({place:'Three Mile Run',time:'7:10 AM',date:'Mon, Sep 14',weather:'Light breeze'});assert.equal(p.length,2);assert.match(p[1].text,/Three Mile Run · 7:10 AM · Mon, Sep 14 · Light breeze/);
 assert.match(footerText(),/jez237\.com/);assert.match(fileName('catch',{species:'Channel catfish'}),/^first-light-catch-channel-catfish-\d{8}-\d{4}\.png$/);assert.match(fileName('photo',null),/^first-light-photo-lake-/);
 assert.equal(CARD.w,1280);assert.equal(CARD.h,720);
});
