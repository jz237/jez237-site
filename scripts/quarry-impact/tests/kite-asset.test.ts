import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {buildKiteAsset} from '../src/kite-asset';import {DASHBOARD_EYES} from '../src/driving-camera';import {CHALLENGES} from '../src/challenges';import {CAREER_GROUPS} from '../src/career';import {classicWheelAnchors} from '../src/classic-vehicle-specs';
test('original shell has finite bounded geometry, wheel clearance, paired lamps and an unobstructed dashboard sightline',()=>{
 const root=buildKiteAsset(),bounds=new T.Box3().setFromObject(root);let count=0;const opaque:T.Mesh[]=[];
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;count+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));if(!(o.material as T.Material).transparent&&!o.name.startsWith('wheel_'))opaque.push(o);});
 assert.ok(count<110000);assert.ok(bounds.min.y>=0&&bounds.max.y<1.7);assert.ok(bounds.min.z>-2.1&&bounds.max.z<2.1);assert.ok(bounds.min.x>-1.1&&bounds.max.x<1.1);
 const anchors=classicWheelAnchors('kite');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,anchors.wheels[i].x);assert.equal(wheel.position.z,anchors.wheels[i].z);}
 for(const name of ['panel_KiteHeadlight-1','panel_KiteHeadlight1','panel_KiteRearLamp-1','panel_KiteRearLamp1','glass_FrontKite','glass_TailgateKite','Structure Kite transverse engine'])assert.ok(root.getObjectByName(name),name);
 const ray=new T.Raycaster(new T.Vector3(...DASHBOARD_EYES.kite),new T.Vector3(0,-.035,1).normalize(),.035,4);
 assert.deepEqual(ray.intersectObjects(opaque,false).map(h=>h.object.name),[],'dashboard centre sightline');
});
test('hot hatch career links three distinct playable race challenges',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='hot-hatch-weekend')!;assert.equal(group.events.length,3);
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='kite'&&c.mode==='race'));assert.equal(new Set(events.map(c=>c.course)).size,3);assert.ok(events.some(c=>c.direction==='reverse'));
});
