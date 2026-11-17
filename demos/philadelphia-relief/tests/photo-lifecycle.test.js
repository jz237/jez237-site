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
function fixture(t,options={}){
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
    dataSources={add(){},remove(){}};
    scene={screenSpaceCameraController:{},postProcessStages:{fxaa:{}},
      requestRender(){},primitives:{add:tiles=>{this.tiles=tiles;}},renderError:new Signal(),
      preRender:new Signal(),postRender:new Signal()};
    constructor(host,settings){if(options.graphicsError)throw options.graphicsError;
      this.settings=settings;viewers.push(this);
      host.append(new Element());settings.creditContainer.append(new Element());}
    resize(){}
    isDestroyed(){return this.destroyed;}
    destroy(){
      assert.equal(this.rendering,false,'do not destroy a viewer during its render traversal');
      this.destroyed=true;this.destroyCount++;this.tiles?.destroy();
    }
    render(){
      if(this.skipRender)return;
      this.rendering=true;
      this.scene.preRender.fire();
      if(this.failRender)this.scene.renderError.fire(this.scene,new Error('render failure'));
      else if(!this.empty)this.tiles.tileVisible.fire({geometricError:32});
      this.scene.postRender.fire();
      this.rendering=false;
    }
  }
  const C={Viewer,Ion:{},CustomDataSource:class{},Cartographic:class{},
    BoundingSphere:class{center={};},Quaternion:class{},HeadingPitchRoll:class{},
    Color:{fromCssColorString:s=>s},Cartesian3:{fromDegrees:()=>({})},
    Matrix4:{IDENTITY:{}},HeadingPitchRange:class{},Math:{toRadians:n=>n*Math.PI/180},
    createGooglePhotorealistic3DTileset:()=>new Promise((resolve,reject)=>tileRequests.push({resolve,reject}))};
  globalThis.document=doc;globalThis.window={Cesium:C,devicePixelRatio:1};
  const store=createStore({photoMode:'photo'}),stage=new Element();
  const photo=createPhotographic({stage,store,sampleElevation:()=>4,
    resources:async()=>{await options.resourcesReady;
      if(options.resourceError)throw options.resourceError;return [C,{ionToken:'test-fixture'}];}});
  const update=(nextPose=pose)=>photo.update(nextPose,store.get(),1200,800);
  const makeTiles=()=>({tileVisible:new Signal(),loadProgress:new Signal(),tilesLoaded:true,
    destroyed:0,destroy(){this.destroyed++;}});
  const ready=async()=>{
    update();await flush();const tiles=makeTiles();tileRequests.at(-1).resolve(tiles);
    await flush();update();assert.equal(photo.active,true);return tiles;
  };
  t.after(()=>{photo.dispose();globalThis.document=oldDocument;globalThis.window=oldWindow;});
  return {photo,viewers,tileRequests,nodes,update,ready,makeTiles,stage,doc,store};
}
test('tile counts describe the last actual draw and unchanged frames do not rewrite its status attributes',async t=>{
  const f=fixture(t);await f.ready();
  const viewer=f.viewers[0],message=f.nodes.get('photoStatus');
  let writes=0;
  message.dataset=new Proxy(message.dataset,{set(data,key,value){writes++;data[key]=value;return true;}});
  f.update();assert.equal(writes,0);
  viewer.skipRender=true;f.update();
  assert.equal(f.photo.stats().visibleTiles,1);assert.equal(f.photo.stats().detailTiles,1);
  assert.equal(message.dataset.bestError,'32');assert.equal(writes,0);
  viewer.skipRender=false;viewer.empty=true;f.update();
  assert.equal(f.photo.stats().visibleTiles,0);assert.equal(message.dataset.visibleTiles,'0');
  assert.equal(message.dataset.bestError,undefined);
});

test('subpixel orbit easing allows fine tiles to return while accumulated pans and wheel zoom still select motion detail',async t=>{
  let time=1000;t.mock.method(performance,'now',()=>time);
  const f=fixture(t),tiles=await f.ready();f.update();assert.equal(tiles.maximumScreenSpaceError,12);
  time+=200;f.update();assert.equal(tiles.maximumScreenSpaceError,4);
  const shifted={...pose,lon:pose.lon+.001};f.update(shifted);assert.equal(tiles.maximumScreenSpaceError,12);
  for(let i=1;i<=4;i++){time+=50;f.update({...shifted,lon:shifted.lon+i*.0000005});}
  assert.equal(tiles.maximumScreenSpaceError,4);
  time+=20;f.update({...shifted,lon:shifted.lon+.000008});assert.equal(tiles.maximumScreenSpaceError,12);
  time+=230;f.update({...shifted,lon:shifted.lon+.000008});assert.equal(tiles.maximumScreenSpaceError,4);
  f.update({...shifted,dist:pose.dist*1.3});assert.equal(tiles.maximumScreenSpaceError,12);
});

test('changing tile backlog counts is rate limited while completion is announced immediately',async t=>{
  let time=1000;t.mock.method(performance,'now',()=>time);
  const f=fixture(t),tiles=await f.ready(),message=f.nodes.get('photoStatus');
  tiles.loadProgress.fire(20,1);f.update();assert.match(message.textContent,/21 tiles/);
  time+=100;tiles.loadProgress.fire(9,1);f.update();assert.match(message.textContent,/21 tiles/);
  time+=160;f.update();assert.match(message.textContent,/10 tiles/);
  tiles.loadProgress.fire(0,0);f.update();assert.match(message.textContent,/full detail/);
  tiles.loadProgress.fire(4,2);f.update();assert.match(message.textContent,/6 tiles/);
});

test('photo render errors fall back immediately and release the viewer after rendering returns',async t=>{
  const f=fixture(t),tiles=await f.ready(),viewer=f.viewers[0];
  viewer.failRender=true;
  assert.equal(f.update(),false);assert.equal(f.photo.active,false);
  assert.equal(f.photo.aircraftViewer,null,'aircraft cannot use a failed renderer');
  assert.equal(viewer.destroyed,false,'cleanup waits until the render call has returned');
  await flush();assert.equal(viewer.destroyCount,1);assert.equal(tiles.destroyed,1);
  assert.equal(f.nodes.get('photoRetry').hidden,false);
  assert.match(f.nodes.get('photoStatus').textContent,/Diorama still works/);
  assert.equal(f.nodes.get('photoStatus').dataset.visibleTiles,undefined);
  f.update();assert.equal(f.viewers.length,1,'failure must not trigger an endless automatic retry');
});

test('immediate engine and graphics failures are distinguishable without exposing error contents',async t=>{
  const f=fixture(t,{resourceError:new Error('https://provider.invalid/?access_token=secret')});
  f.update();await flush();
  const message=f.nodes.get('photoStatus').textContent;
  assert.match(message,/engine or configuration/);assert.doesNotMatch(message,/secret|provider.invalid/);
  assert.equal(f.viewers.length,0);
});

test('graphics initialization failure offers a lower-memory retry',async t=>{
  const options={graphicsError:new Error('context creation failed')},f=fixture(t,options);
  f.update();await flush();assert.match(f.nodes.get('photoStatus').textContent,/Photo graphics/);
  options.graphicsError=null;f.nodes.get('photoRetry').onclick();await f.ready();
  assert.equal(f.viewers[0].settings.msaaSamples,1);
  assert.equal(f.photo.aircraftViewer.tiles.cacheBytes,96*1024*1024);
  assert.equal(f.photo.aircraftViewer.tiles.maximumScreenSpaceError,16);
  // The first 180 ms retain the existing in-motion threshold before settling.
  f.update();assert.equal(f.photo.aircraftViewer.tiles.maximumScreenSpaceError,12);
});

test('choosing Diorama dismisses a failed photo session and its stale retry message',async t=>{
  const f=fixture(t,{resourceError:new Error('unavailable')});
  f.update();await flush();assert.equal(f.photo.stats().failed,true);
  const select=f.nodes.get('photoMode');select.value='relief';select.onchange();f.update();
  assert.equal(f.photo.stats().failed,false);assert.equal(f.nodes.get('photoRetry').hidden,true);
  assert.equal(f.nodes.get('photoStatus').textContent,'Diorama · photographic detail off');
});

test('choosing Diorama frees a healthy photo renderer, traffic, tiles and credits and can reopen',async t=>{
  const f=fixture(t),tiles=await f.ready(),viewer=f.viewers[0];
  assert.ok(f.photo.stats().traffic);assert.equal(f.stage.children[0].children.length,1);
  f.store.set({photoMode:'relief'});assert.equal(f.update(),false);
  assert.equal(viewer.destroyCount,1);assert.equal(tiles.destroyed,1);
  assert.equal(f.photo.aircraftViewer,null);assert.equal(f.photo.stats().traffic,undefined);
  assert.equal(f.photo.stats().firstViewReady,false);assert.equal(f.photo.stats().wanted,false);
  assert.equal(f.stage.children[0].children.length,0);
  assert.equal(f.nodes.get('photoCredits').children.length,0);
  f.update();await flush();assert.equal(f.viewers.length,1);
  f.store.set({photoMode:'photo'});await f.ready();
  assert.equal(f.viewers.length,2);assert.equal(f.photo.aircraftViewer,f.viewers[1]);
});

test('choosing Diorama while engine resources load prevents a late hidden viewer',async t=>{
  let resolve;
  const f=fixture(t,{resourcesReady:new Promise(done=>{resolve=done;})});
  f.update();f.store.set({photoMode:'relief'});f.update();resolve();await flush();
  assert.equal(f.viewers.length,0);assert.equal(f.photo.stats().loading,false);
  assert.equal(f.photo.stats().failed,false);assert.equal(f.photo.stats().wanted,false);
  assert.equal(f.nodes.get('photoStatus').textContent,'Diorama · photographic detail off');
  f.store.set({photoMode:'photo'});await f.ready();assert.equal(f.viewers.length,1);
});

for(const lateResult of ['resolve','reject']){
  test(`a cancelled tile request cannot affect a reopened photo session when it ${lateResult}s`,async t=>{
    const f=fixture(t);f.update();await flush();const old=f.viewers[0];
    f.store.set({photoMode:'relief'});f.update();assert.equal(old.destroyCount,1);
    f.store.set({photoMode:'photo'});await f.ready();const current=f.viewers[1],late=f.makeTiles();
    if(lateResult==='resolve')f.tileRequests[0].resolve(late);
    else f.tileRequests[0].reject(new Error('cancelled request failed'));
    await flush();assert.equal(f.update(),true);
    assert.equal(f.photo.aircraftViewer,current);assert.equal(current.destroyed,false);
    assert.equal(f.photo.stats().failed,false);assert.equal(f.nodes.get('photoRetry').hidden,true);
    assert.equal(late.destroyed,lateResult==='resolve'?1:0);
  });
}

test('brief auto-mode zoom changes reuse the renderer; a sustained regional view releases it',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const f=fixture(t);await f.ready();const viewer=f.viewers[0],far={...pose,dist:30000};
  f.store.set({photoMode:'auto'});f.update(far);
  t.mock.timers.tick(29000);assert.equal(viewer.destroyed,false);
  assert.equal(f.update(),true);t.mock.timers.tick(30000);assert.equal(viewer.destroyed,false);
  f.update(far);
  for(let i=0;i<3;i++){t.mock.timers.tick(9000);f.update(far);}
  t.mock.timers.tick(3000);assert.equal(viewer.destroyCount,1);
  assert.equal(f.photo.aircraftViewer,null);assert.equal(f.photo.stats().failed,false);
  assert.equal(f.nodes.get('photoStatus').textContent,'Diorama · zoom in for photographic 3D');
  f.update(far);await flush();assert.equal(f.viewers.length,1);
  await f.ready();assert.equal(f.viewers.length,2);
});

test('leaving photographic coverage during tile loading cancels without a later timeout error',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const f=fixture(t);f.update();await flush();f.update({...pose,dist:30000});
  t.mock.timers.tick(30000);assert.equal(f.viewers[0].destroyCount,1);
  t.mock.timers.tick(90000);assert.equal(f.photo.stats().failed,false);
  const late=f.makeTiles();f.tileRequests[0].resolve(late);await flush();
  assert.equal(late.destroyed,1);assert.equal(f.photo.stats().loading,false);
});

test('switching away during engine loading does not spend its foreground timeout',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const f=fixture(t);f.doc.hidden=true;f.update();await flush();
  t.mock.timers.tick(50000);await flush();assert.equal(f.photo.stats().failed,false);
  f.doc.hidden=false;f.doc.dispatchEvent(new Event('visibilitychange'));
  t.mock.timers.tick(45000);await flush();assert.equal(f.photo.stats().failed,true);
  assert.match(f.nodes.get('photoStatus').textContent,/timed out/);
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
