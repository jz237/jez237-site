import assert from 'node:assert/strict';
import * as T from 'three';
import {buildAnemones} from '../Anemones.ts';
let seed=91;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const {mesh,tentacles}=buildAnemones([new T.Vector3(3,1,.8),new T.Vector3(-3,.8,1)],{value:0},random,p=>p.y-.28);
assert.equal(tentacles,540);
const p=mesh.geometry.getAttribute('position'),n=mesh.geometry.getAttribute('normal'),flex=mesh.geometry.getAttribute('anemoneFlex');
const rings=new Map();
for(let i=0;i<p.count;i++){
 assert.ok(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)+n.getX(i)+n.getY(i)+n.getZ(i)),'finite positions and normals');
 const t=flex.getX(i);if(t<=0||t>=.94)continue;
 const key=flex.getY(i)+':'+t;
 const r=rings.get(key)||{x:0,y:0,z:0,count:0,ids:[]};r.x+=p.getX(i);r.y+=p.getY(i);r.z+=p.getZ(i);r.count++;r.ids.push(i);rings.set(key,r);
}
let facingOut=0,total=0;
for(const r of rings.values()){r.x/=r.count;r.y/=r.count;r.z/=r.count;for(const i of r.ids){const dot=(p.getX(i)-r.x)*n.getX(i)+(p.getY(i)-r.y)*n.getY(i)+(p.getZ(i)-r.z)*n.getZ(i);if(dot>0)facingOut++;total++;}}
assert.ok(facingOut/total>.99,'tentacle skins face outward; inverted tubes appear as split leaves');
// Every tentacle has anchored root vertices and a rounded, joined tip.
const ends=new Map();for(let i=0;i<p.count;i++){if(flex.getW(i)===0)continue;const phase=flex.getY(i),e=ends.get(phase)||{root:0,tip:0};if(flex.getX(i)===0)e.root++;if(flex.getX(i)===1)e.tip++;ends.set(phase,e);}
assert.equal(ends.size,540);assert.ok([...ends.values()].every(e=>e.root>0&&e.tip>0));
console.log(`Anemone geometry passed: ${tentacles} anchored tentacles, ${(100*facingOut/total).toFixed(2)}% outward normals.`);
mesh.geometry.dispose();mesh.material.dispose();
