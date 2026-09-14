import test from 'node:test';import assert from 'node:assert/strict';
import {createLine,resetLine,setLure,stepLine,lurePosition,layLine} from '../line.js';
import {LURES} from '../tackle.js';
const flat={surface:()=>0,bed:()=>-4};
function run(line,env,seconds){for(let t=0;t<seconds;t+=1/120)stepLine(line,1/120,env);return line;}
test('a hanging line keeps its segments at the paid-out length',()=>{
 const line=createLine(24);resetLine(line,0,1.5,0);line.lineOut=6;setLure(line,3,-.5,3);
 run(line,{...flat,tip:{x:0,y:1.5,z:0},lineBuoy:-.6,lure:LURES.worm},4);
 const seg=6/23;for(let i=0;i<23;i++){const d=Math.hypot(line.x[i+1]-line.x[i],line.y[i+1]-line.y[i],line.z[i+1]-line.z[i]);assert.ok(d<=seg*1.02,'segment '+i+' '+d);}
 assert.equal(line.x[0],0);assert.equal(line.y[0],1.5);
});
test('a sinking lure never falls faster than its sink rate and comes to rest on the bed',()=>{
 const line=createLine(24);resetLine(line,0,1.5,0);layLine(line,{x:0,y:1.5,z:0},{x:6,y:-.05,z:0});line.lineOut=12;
 const env={...flat,tip:{x:0,y:1.5,z:0},lineBuoy:-.6,lure:LURES.worm};let fastest=0,prev=lurePosition(line).y;
 for(let t=0;t<12;t+=1/120){stepLine(line,1/120,env);const y=lurePosition(line).y;fastest=Math.max(fastest,(prev-y)*120);prev=y;}
 assert.ok(fastest<=LURES.worm.sinkRate*1.05,'fastest descent '+fastest);assert.ok(line.lureOnBottom);assert.ok(Math.abs(lurePosition(line).y-(-4+.04))<.02);
});
test('a floating lure rides the surface and reeling shortens the line until it is taut',()=>{
 const line=createLine(24);resetLine(line,0,1.5,0);line.lineOut=10;setLure(line,7,-.6,0);
 const env={...flat,tip:{x:0,y:1.5,z:0},lineBuoy:.4,lure:LURES.walker};run(line,env,3);
 assert.ok(Math.abs(lurePosition(line).y)<.05,'walker on the surface: '+lurePosition(line).y);
 for(let t=0;t<8;t+=1/120){line.lineOut=Math.max(1.6,line.lineOut-1.1/120);stepLine(line,1/120,env);}
 const p=lurePosition(line);assert.ok(Math.hypot(p.x,p.z)<2.2,'lure came in: '+Math.hypot(p.x,p.z));assert.ok(line.tension>.4,'line taut when short: '+line.tension);
});
