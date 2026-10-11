import test from 'node:test';
import assert from 'node:assert/strict';
import { createPhotographic } from '../src/photographic.js';
import { createStore } from '../src/state.js';

class Element extends EventTarget{
  children=[];dataset={};hidden=false;
  classList={toggle(){}};
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(){}
  remove(){this.removed=true;}
}
class Signal{
  listeners=[];
  addEventListener(fn){this.listeners.push(fn);}
  fire(...args){for(const fn of this.listeners)fn(...args);}
}
const pose={lon:-75.1655,lat:39.9505,dist:650,pitch:55,bearing:25,fov:40};
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(t){
  const oldDocument=globalThis.document,oldWindow=globalThis.window;
  const nodes=new Map(),viewers=[],tileRequests=[];
  const doc=new EventTarget();doc.hidden=false;doc.body=new Element();
  doc.createElement=()=>new Element();doc.getElementById=id=>{
    if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);
  };
  class Viewer{
    destroyed=false;destroyCount=0;rendering=false;
    camera={frustum:{},lookAt(){},lookAtTransform(){}};
    entities={values:[]};
    scene={screenSpaceCameraController:{},postProcessStages:{fxaa:{}},
      requestRender(){},primitives:{add:tiles=>{this.tiles=tiles;}},renderError:new Signal()};
    constructor(){viewers.push(this);}
    resize(){}
    isDestroyed(){return this.destroyed;}
    destroy(){
      assert.equal(this.rendering,false,'do not destroy a viewer during its render traversal');
      this.destroyed=true;this.destroyCount++;this.tiles?.destroy();
    }
    render(){
      this.rendering=true;
      if(this.failRender)this.scene.renderError.fire(this.scene,new Error('render failure'));
      else this.tiles.tileVisible.fire({geometricError:32});
      this.rendering=false;
    }
  }
  const C={Viewer,Ion:{},Color:{fromCssColorString:s=>s},Cartesian3:{fromDegrees:()=>({})},
    Matrix4:{IDENTITY:{}},HeadingPitchRange:class{},Math:{toRadians:n=>n*Math.PI/180},
    createGooglePhotorealistic3DTileset:()=>new Promise((resolve,reject)=>tileRequests.push({resolve,reject}))};
  globalThis.document=doc;globalThis.window={Cesium:C,devicePixelRatio:1};
  const store=createStore({photoMode:'photo'}),stage=new Element();
  const photo=createPhotographic({stage,store,sampleElevation:()=>4,
    resources:async()=>[C,{ionToken:'test-fixture'}]});
  const update=()=>photo.update(pose,store.get(),1200,800);
  const makeTiles=()=>({tileVisible:new Signal(),loadProgress:new Signal(),tilesLoaded:true,
    destroyed:0,destroy(){this.destroyed++;}});
  const ready=async()=>{
    update();await flush();const tiles=makeTiles();tileRequests.at(-1).resolve(tiles);
    await flush();update();assert.equal(photo.active,true);return tiles;
  };
  t.after(()=>{photo.dispose();globalThis.document=oldDocument;globalThis.window=oldWindow;});
  return {photo,viewers,tileRequests,nodes,update,ready,makeTiles,stage};
}
test('photo render errors fall back immediately and release the viewer after rendering returns',async t=>{
  const f=fixture(t),tiles=await f.ready(),viewer=f.viewers[0];
  viewer.failRender=true;
  assert.equal(f.update(),false);assert.equal(f.photo.active,false);
  assert.equal(f.photo.aircraftViewer,null,'aircraft cannot use a failed renderer');
  assert.equal(viewer.destroyed,false,'cleanup waits until the render call has returned');
  await flush();assert.equal(viewer.destroyCount,1);assert.equal(tiles.destroyed,1);
  assert.equal(f.nodes.get('photoRetry').hidden,false);
  assert.match(f.nodes.get('photoStatus').textContent,/diorama still works/);
  assert.equal(f.nodes.get('photoStatus').dataset.visibleTiles,undefined);
  f.update();assert.equal(f.viewers.length,1,'failure must not trigger an endless automatic retry');
});
test('retry cannot be destroyed by an earlier failed-render cleanup',async t=>{
  const f=fixture(t);await f.ready();const old=f.viewers[0];old.failRender=true;
  f.update();f.nodes.get('photoRetry').onclick();
  await flush();const next=f.viewers[1];
  assert.equal(old.destroyCount,1);assert.equal(next.destroyed,false);
  f.tileRequests[1].resolve(f.makeTiles());await flush();
  assert.equal(f.update(),true);assert.equal(f.photo.aircraftViewer,next);
});
test('failed tile initialization releases its partially constructed viewer and supports retry',async t=>{
  const f=fixture(t);f.update();await flush();
  f.tileRequests[0].reject(new Error('provider unavailable'));await flush();
  assert.equal(f.viewers[0].destroyCount,1);assert.equal(f.photo.stats().failed,true);
  f.nodes.get('photoRetry').onclick();await f.ready();
  assert.equal(f.viewers.length,2);assert.equal(f.photo.stats().failed,false);
});
test('disposing while tiles load destroys late resources and prevents a new render',async t=>{
  const f=fixture(t);f.update();await flush();const tiles=f.makeTiles();
  f.photo.dispose();f.tileRequests[0].resolve(tiles);await flush();
  assert.equal(f.viewers[0].destroyCount,1);assert.equal(tiles.destroyed,1);
  assert.equal(f.update(),false);assert.equal(f.nodes.get('photoRetry').onclick,null);
  assert.equal(f.nodes.get('photoMode').onchange,null);
});
test('resource timeout releases the viewer and rejects tiles that arrive after the deadline',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const f=fixture(t);f.update();await flush();
  t.mock.timers.tick(45000);await flush();
  assert.equal(f.viewers[0].destroyCount,1);assert.equal(f.photo.stats().failed,true);
  const late=f.makeTiles();f.tileRequests[0].resolve(late);await flush();
  assert.equal(late.destroyed,1);assert.equal(f.photo.active,false);
});
