import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {routeSourceHash} from '../cory-route-sources.mjs';
import * as T from 'three';
import {CoryFloorRoutes} from '../lib/CoryFloorRoutes.ts';
test('saved floor passages match their physical source geometry',()=>{const map=JSON.parse(fs.readFileSync(new URL('../lib/CoryFloorRoutes.json',import.meta.url),'utf8'));for(const [file,hash] of Object.entries(map.sources))assert.equal(routeSourceHash(file),hash,file+' changed: rebuild with node bake-cory-routes.mjs');assert.ok(map.nodes.some(n=>n.point[0]<-4)&&map.nodes.some(n=>n.point[0]>4));});
test('global routes go around a dividing rock instead of aiming through it',async()=>{const rock=new T.Vector3(0,.4,0),clear=p=>Math.abs(p.x)<4.9&&Math.abs(p.z)<2.3&&(Math.abs(p.x)>.7||Math.abs(p.z)>1.2),nav=new CoryFloorRoutes(()=>.4,(p)=>clear(p));await nav.build();const start=new T.Vector3(-3,.4,0),path=nav.route(start,new Map(),0,237);assert.ok(path.length>3);let previous=start;for(const p of path){assert.ok(nav.segment(previous,p),'every route segment remains clear');previous=p;}assert.ok(path.some(p=>Math.abs(p.z)>1.2),'uses the passage around the rock');assert.ok(path.at(-1).x>1,'reaches the far side');});
