import assert from 'node:assert/strict';
import * as T from 'three';
import {buildAnemones} from '../Anemones.ts';
let seed=91;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const {mesh,behavior:b}=buildAnemones([new T.Vector3(3,1,.8),new T.Vector3(-3,.8,1)],{value:0},random,p=>p.y-.28);
const host=b.hosts[0],strand=host.strands[40],group=new T.Group();group.scale.setScalar(.45);
const fish={position:new T.Vector3(),velocity:new T.Vector3(.4,0,0),group};
fish.position.set(0,5,0);for(let i=0;i<60;i++)b.update(i/60,[],[fish]);assert.equal(b.snapshot().brushing,0);assert.equal(b.snapshot().maxBrush,0);
for(let i=60;i<105;i++){fish.position.copy(b.tipAt(0,strand,i/60,new T.Vector3())).add(new T.Vector3(0,.03,.035));b.update(i/60,[],[fish]);}
const touched=b.snapshot();assert.ok(touched.brushing>0&&touched.maxBrush>.02,'physical contact bends nearby strands');
let active=0;for(let i=1;i<=540;i++){const length=Math.hypot(...b.brushData.slice(i*4,i*4+3));if(length>.001)active++;if(i>180)assert.equal(length,0,'other hosts must not react to rubbing');}
assert.ok(active>1&&active<100,'localized contact does not pulse the entire anemone');
const held=Array.from(b.brushData);b.update(104/60,[],[fish]);assert.deepEqual(Array.from(b.brushData),held,'same simulation time freezes springs');
for(let i=105;i<600;i++)b.update(i/60,[],[]);assert.ok(b.snapshot().maxBrush<.00001,'soft tissue settles after fish leaves');
const lookup=mesh.geometry.getAttribute('anemoneBrush'),flex=mesh.geometry.getAttribute('anemoneFlex');
for(let i=0;i<lookup.count;i++){if(flex.getW(i)===0)assert.equal(lookup.getX(i),0);else assert.ok(lookup.getX(i)>=1&&lookup.getX(i)<=540);}
console.log('Local clownfish brushing:',{...touched,active,settled:b.snapshot().maxBrush,textureBytes:b.brushData.byteLength});
mesh.geometry.dispose();mesh.material.dispose();b.brushTexture.dispose();
