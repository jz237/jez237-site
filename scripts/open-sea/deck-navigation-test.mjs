import assert from 'node:assert/strict';import fs from 'node:fs';
import {DeckNavigator,DeckWalker,EYE_HEIGHT} from '../../demos/open-sea/js/deck.js';
const metadata=JSON.parse(fs.readFileSync(new URL('../../demos/open-sea/assets/schooner.json',import.meta.url)));
const nav=new DeckNavigator(metadata),spacing=.10,cols=453,rows=91;
const point=i=>[-22.6+(i%cols)*spacing,-4.5+Math.floor(i/cols)*spacing];
const free=new Uint8Array(cols*rows),visited=new Uint8Array(free.length),parents=new Int32Array(free.length).fill(-1);
for(let i=0;i<free.length;i++)free[i]=nav.canStand(...point(i));
const id=([x,z])=>Math.round((z+4.5)/spacing)*cols+Math.round((x+22.6)/spacing);
const start=id(nav.nearest(-17.7,0)),queue=[start];visited[start]=1;
for(let q=0;q<queue.length;q++)for(const d of [-1,1,-cols,cols]){const i=queue[q]+d;if(i<0||i>=free.length||!free[i]||visited[i])continue;if(Math.abs(point(i)[0]-point(queue[q])[0])>spacing*1.1&&Math.abs(d)===1)continue;visited[i]=1;parents[i]=queue[q];queue.push(i);}
const stations={Helm:[-17.7,0],Bow:[18,0],Stern:[-22.6,2.8],Port:[-10.8,-3.7],Starboard:[-10.8,3.7]};
for(const [name,p]of Object.entries(stations)){const p0=nav.nearest(...p);assert.ok(visited[id(p0)],`${name} must be reachable by walking from helm`);}
const route=[];for(let i=id(stations.Bow);i!==-1;i=parents[i])route.push(point(i));route.reverse();
const walking=[...route[0]];
for(const p of route.slice(1)){nav.move(walking,p[0]-walking[0],p[1]-walking[1]);assert.ok(Math.hypot(walking[0]-p[0],walking[1]-p[1])<1e-8,'Continuous walking must complete the route without tunnelling');}
let collisionSteps=0;
for(const p of [[-17.7,0],[-5,-3.4],[18,0],[-10.8,3.7]])for(const delta of [[100,0],[-100,0],[0,100],[0,-100],[100,100],[-100,-100]]){
 const pos=nav.nearest(...p);nav.move(pos,...delta);assert.ok(nav.canStand(...pos),'Large frame movement must not enter an obstacle or leave the deck');collisionSteps++;
}
// Exercise the passenger independently of rendering using a rigid pose with
// simultaneous roll, pitch and translation, including uneven frame intervals.
const angle=.32,c=Math.cos(angle),s=Math.sin(angle),yacht={metadata,axes:{up:[0,c,s]},
 toWorld:([x,y,z])=>[150+x,2+y*c-z*s,-240+y*s+z*c],
 toWorldDir:([x,y,z])=>[x,y*c-z*s,y*s+z*c],
 toLocalPoint:([x,y,z])=>[x-150,(y-2)*c+(z+240)*s,-(y-2)*s+(z+240)*c]};
const walker=new DeckWalker(yacht),cam={};
for(let i=0;i<480;i++){walker.update([1/240,1/60,.1,.5,.004][i%5],new Set(i%3?['w']:['d']));walker.syncCamera(cam);const p=yacht.toLocalPoint([cam.x,cam.y,cam.z]);assert.ok(nav.canStand(p[0],p[2]));assert.ok(Math.abs(p[1]-nav.height(p[0],p[2])-EYE_HEIGHT-walker.bob)<1e-10);assert.ok([...Object.values(cam).flat()].every(Number.isFinite));}
const result={reachableStations:Object.keys(stations),continuousHelmToBowSteps:route.length,connectedCells:queue.length,walkableCells:free.reduce((a,b)=>a+b,0),collisionSteps,unevenFrameSteps:480,obstacles:nav.obstacles.length,raisedSurfaces:nav.surfaces.length};
console.log(JSON.stringify(result,null,2));
