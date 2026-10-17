import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {scrapeSurfaceMix} from '../src/scrape-surface-audio';import {Sound} from '../src/audio';
test('ground drag changes timbre while wall rubbing stays hard on any tyre surface',()=>{
 const asphalt=scrapeSurfaceMix(1,0,'asphalt',12),gravel=scrapeSurfaceMix(1,0,'gravel',12),mud=scrapeSurfaceMix(1,0,'mud',12);
 assert.equal(asphalt.looseGain,0);assert.ok(gravel.looseGain>0);assert.ok(gravel.metalGain<asphalt.metalGain);assert.ok(mud.looseRate<gravel.looseRate);assert.ok(mud.looseGain<gravel.looseGain);
 for(const surface of ['asphalt','gravel','mud']){const wall=scrapeSurfaceMix(0,1,surface,12);assert.equal(wall.metalGain,.12);assert.equal(wall.looseGain,0);}
 for(const surface of ['asphalt','gravel','mud']){const both=scrapeSurfaceMix(1,1,surface,12);assert.equal(both.metalGain,.12);assert.ok(both.metalGain+both.looseGain<=.22);}
});
test('mix is bounded, speed responsive, and silent without contact evidence',()=>{
 for(const value of [-1,0,1,100,NaN,Infinity])for(const surface of ['asphalt','gravel','mud']){
  const mix=scrapeSurfaceMix(value,value,surface,value);assert.ok(Object.values(mix).every(Number.isFinite));assert.ok(mix.metalGain>=0&&mix.metalGain<=.12);assert.ok(mix.looseGain>=0&&mix.looseGain<=.095);
 }
 assert.ok(scrapeSurfaceMix(1,0,'gravel',24).looseRate>scrapeSurfaceMix(1,0,'gravel',2).looseRate);
 assert.equal(scrapeSurfaceMix(0,0,'gravel',20).metalGain,0);assert.equal(scrapeSurfaceMix(0,0,'gravel',20).looseGain,0);
});
const parameter=()=>({value:0,setTargetAtTime(value:number){this.value=value;}});
const loop=()=>({source:{playbackRate:parameter(),stop(){},disconnect(){}},gain:{gain:parameter(),disconnect(){}},pan:{positionX:parameter(),positionY:parameter(),positionZ:parameter(),disconnect(){}}});
test('actual mixer blends loose drag on wrecks and silences inspection and separation',()=>{
 const sound=new Sound(),metal=loop(),loose=loop();sound.ready=true;sound.ctx={currentTime:0,listener:Object.fromEntries(['positionX','positionY','positionZ','forwardX','forwardY','forwardZ','upX','upY','upZ'].map(k=>[k,parameter()]))}as any;sound.shot=()=>{};sound.loops.set(0,new Map([['scrape',metal],['scrape-loose',loose]])as any);
 const car={id:0,kind:'coupe',health:0,rpm:0,current:new T.Vector3(),velocity:new T.Vector3(),input:{throttle:0},speed:10,slip:0,gear:1,surface:'asphalt',scraping:1,controller:{wheelIsInContact:()=>false}};
 const update=(inspection=false)=>sound.update([car]as any,new T.PerspectiveCamera(),1/60,inspection);
 update();assert.equal(metal.gain.gain.value,.12);assert.equal(loose.gain.gain.value,0);
 car.surface='gravel';update();assert.ok(loose.gain.gain.value>0);assert.ok(metal.gain.gain.value<.12,'a dragged part can touch ground without wheel contact');
 const gravelRate=loose.source.playbackRate.value;car.surface='mud';update();assert.ok(loose.source.playbackRate.value<gravelRate);
 update(true);assert.equal(metal.gain.gain.value,0);assert.equal(loose.gain.gain.value,0);
 car.scraping=0;update();assert.equal(metal.gain.gain.value,0);assert.equal(loose.gain.gain.value,0);
 sound.contactScraping.receive([{id:0,contactScrape:1}]);update();assert.equal(metal.gain.gain.value,.12);assert.equal(loose.gain.gain.value,0);
 sound.clearCars();assert.equal(sound.loops.size,0);
});
test('attach reuses the bundled gravel clip for a separate spatial scrape voice',()=>{
 const sound=new Sound();sound.ready=true;sound.buffers.set('starter',{} as any);sound.buffers.set('gear-grind',{} as any);
 const ids:string[]=[];sound.loop=((id:string)=>{ids.push(id);return loop();})as any;
 sound.attach([{id:0,kind:'coupe'}]as any);assert.ok(sound.loops.get(0)?.has('scrape-loose'));assert.equal(ids.filter(id=>id==='gravel').length,2);assert.notEqual(sound.loops.get(0)?.get('gravel'),sound.loops.get(0)?.get('scrape-loose'));sound.clearCars();
});
