import test from 'node:test';import assert from 'node:assert/strict';
import {createRecognizer,recordSample,recordTwitch,classify} from '../technique.js';
import {LURES} from '../tackle.js';
function feed(pattern,lure,opts){const r=createRecognizer();let t=0;for(const step of pattern){for(let i=0;i<step.n;i++){t+=.05;recordSample(r,t,step.reel);if(step.twitchEvery&&i%step.twitchEvery===0)recordTwitch(r,t);}}return classify(r,t,lure,opts);}
test('continuous reeling is a straight retrieve; alternating is stop & go',()=>{
 assert.equal(feed([{n:60,reel:1}],LURES.squarebill),'straight retrieve');
 assert.equal(feed([{n:12,reel:1},{n:12,reel:0},{n:12,reel:1},{n:12,reel:0},{n:12,reel:1}],LURES.squarebill),'stop & go');
});
test('rod twitches on a topwater walk the dog, on a sinking lure lift and drop',()=>{
 assert.equal(feed([{n:60,reel:0,twitchEvery:15}],LURES.walker),'walking the dog');
 assert.equal(feed([{n:60,reel:0,twitchEvery:20}],LURES.worm,{onBottom:true}),'lift & drop');
 assert.equal(feed([{n:60,reel:1,twitchEvery:20}],LURES.squarebill),'twitching');
});
test('nothing happening is a dead stick, and out of the water is idle',()=>{
 assert.equal(feed([{n:60,reel:0}],LURES.worm),'dead stick');assert.equal(feed([{n:60,reel:1}],LURES.worm,{inWater:false}),'idle');
});
