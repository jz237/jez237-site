import * as T from 'three';
import {frameGarage} from '../src/garage-camera';
import test from 'node:test';
import assert from 'node:assert/strict';
import {LIVERY_LIMIT,newLayer,normalizeLivery,normalizeGroups,transformLayers,mirrorLayer,drawLivery} from '../src/livery';
import {exportSetup,importSetup,readGarage,stockSetup} from '../src/garage';
import {verifyLiveryRevision} from './livery-invariants';
test('old garage saves migrate without artwork and malicious layers are bounded and copied',()=>{
 assert.deepEqual(readGarage('{"version":1,"cars":{"coupe":{"setup":{"paint":255}}}}').cars.coupe.setup.livery,[]);
 assert.deepEqual(normalizeLivery([null,{}, {shape:'script',face:'left'}]),[]);
 const source={...newLayer(),x:Infinity,y:-99,width:0,height:8,opacity:3,color:-10,text:'a'.repeat(99)};
 const layers=normalizeLivery(Array(80).fill(source));assert.equal(layers.length,LIVERY_LIMIT);assert.equal(layers[0].x,.5);assert.equal(layers[0].y,-.5);assert.equal(layers[0].width,.02);assert.equal(layers[0].height,2);assert.equal(layers[0].opacity,1);assert.equal(layers[0].text.length,16);assert.equal(layers[0].color,0);
 layers[0].x=.2;assert.equal(layers[1].x,.5);assert.equal(source.x,Infinity);
});
test('maximum designs roundtrip setup exchange and saved presets/groups remain independent',()=>{
 const setup=stockSetup('sedan');setup.livery=Array.from({length:32},(_,i)=>({...newLayer(i%2?'text':'spray',i%2?'left':'right'),name:'n'.repeat(24),text:'m'.repeat(16),seed:i,x:i/32}));
 const data=exportSetup('sedan',setup);assert.ok(data.length<65536);assert.deepEqual(importSetup(data,'sedan'),setup);
 const car=readGarage(JSON.stringify({version:1,cars:{sedan:{setup,presets:[{name:'race',setup}],groups:[{name:'badge',layers:setup.livery}]}}})).cars.sedan;
 car.setup.livery[0].color=0;assert.notEqual(car.presets[0].setup.livery[0].color,0);assert.notEqual(car.groups[0].layers[0].color,0);assert.equal(normalizeGroups(Array(20).fill({name:'a',layers:setup.livery})).length,8);
});
test('group translation, scale, rotation and readable opposite-side copies preserve relative placement',()=>{
 const layers=[{...newLayer(),x:.25,y:.5},{...newLayer(),x:.75,y:.5},newLayer('star')];
 const moved=transformLayers(layers,[0,1],.1,0,.5,90);assert.ok(Math.abs(moved[0].x-.6)<1e-8);assert.ok(Math.abs(moved[0].y-.375)<1e-8);assert.ok(Math.abs(moved[1].y-.625)<1e-8);assert.deepEqual(moved[2],layers[2]);assert.equal(moved[0].width,layers[0].width*.5);
 const mirror=mirrorLayer({...newLayer('number','left'),x:.2,rotation:20});assert.equal(mirror.face,'right');assert.equal(mirror.x,.8);assert.equal(mirror.rotation,-20);assert.equal(mirror.flip,false);assert.equal(mirrorLayer(newLayer('chevron','front')).face,'rear');assert.equal(mirrorLayer(newLayer('chevron')).flip,true);assert.deepEqual(mirrorLayer(mirror).face,'left');
});
function draw(layers:ReturnType<typeof normalizeLivery>,finishMask=false){const commands:any[]=[];const ctx=new Proxy({measureText:(s:string)=>({width:s.length*60})},{get:(o,k)=>k in o?(o as any)[k]:(...a:any[])=>commands.push([k,...a]),set:(o,k,v)=>{commands.push([k,v]);(o as any)[k]=v;return true;}}) as unknown as CanvasRenderingContext2D;drawLivery(ctx,layers,'left',600,240,finishMask);return commands;}
test('spray/weathering are repeatable and hidden or opposite-face layers never paint',()=>{
 const layers=[newLayer('spray'),newLayer('rust'),newLayer('chips')];assert.deepEqual(draw(layers),draw(layers));assert.notDeepEqual(draw(layers),draw(layers.map(l=>({...l,seed:90}))));assert.deepEqual(draw(layers.map(l=>({...l,hidden:true}))),[['clearRect',0,0,600,240]]);assert.deepEqual(draw(layers.map(l=>({...l,face:'right'}))),[['clearRect',0,0,600,240]]);
});
test('weathering finish masks use the same seeded coverage as visible artwork',()=>{const layers=[newLayer('rust'),newLayer('chips')];const rectangles=(commands:any[])=>commands.filter(c=>c[0]==='fillRect'||c[0]==='ellipse');assert.deepEqual(rectangles(draw(layers)),rectangles(draw(layers,true)));assert.ok(draw(layers,true).some(c=>c[0]==='fillStyle'&&c[1]==='#ff0000'));});
test('garage camera centers every surface in the exposed pane even for rotated cars',()=>{
 for(const face of ['left','right','top','front','rear'] as const){const camera=new T.PerspectiveCamera(52,1280/720,.1,100),position=new T.Vector3(0,1,-13),rotation=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),.65);frameGarage(camera,position,rotation,face,1280,720);const center=position.clone().add(new T.Vector3(0,.1,0)).project(camera);assert.ok(Math.abs(center.x+570/1280)<1e-6);assert.ok(Math.abs(center.y)<1e-6);assert.ok(camera.quaternion.toArray().every(Number.isFinite));}
});
test('livery revision retains exact preceding release bytes',verifyLiveryRevision);
