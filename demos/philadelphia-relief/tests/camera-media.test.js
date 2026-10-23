import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mountCameraMedia, mountCameraPlayer } from '../src/camera-media.js';

class FakeMedia extends EventTarget {
  style = {};
  paused = false;
  setAttribute() {}
  removeAttribute(name) { delete this[name]; }
  canPlayType() { return ''; }
  pause() { this.paused = true; }
  load() {}
  play() { return Promise.resolve(); }
}
function setup(t) {
  t.mock.timers.enable({apis: ['setTimeout', 'setInterval']});
  const previous = globalThis.document;
  globalThis.document = { createElement: () => new FakeMedia() };
  t.after(() => { globalThis.document = previous; });
  for (const key of ['MediaSource','ManagedMediaSource']) {
    const original=Object.getOwnPropertyDescriptor(globalThis,key);
    Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:undefined});
    t.after(()=>{if(original)Object.defineProperty(globalThis,key,original);else delete globalThis[key];});
  }
  const host = { clientWidth: 344, children: [], append(e) { this.children.push(e); },
    replaceChildren(...children) { this.children = children; } };
  return host;
}
const camera = {name: 'Test camera', stream: 'https://video.deldot.gov/live/NCAM001.stream/playlist.m3u8'};

function hlsFixture() {
  const listeners = new Map();
  class Hls {
    static Events = {MANIFEST_PARSED:'manifest', ERROR:'error'};
    static isSupported() { return true; }
    on(type, handler) { listeners.set(type, handler); }
    loadSource() {}
    attachMedia() {}
    destroy() {}
  }
  return {loadRuntime:async () => ({default:Hls}),
    emit:(type, data) => listeners.get(type)?.(type, data)};
}

test('expired previews ignore late playback, manifest and error events', async t => {
  const host=setup(t), messages=[], hls=hlsFixture();
  const cleanup=mountCameraMedia(host,camera,{...hls,onStatus:text=>messages.push(text)});
  await Promise.resolve();
  const video=host.children[0];let plays=0;
  video.play=()=>{plays++;return Promise.resolve();};
  hls.emit('manifest');video.dispatchEvent(new Event('playing'));
  t.mock.timers.tick(60000);
  assert.match(messages.at(-1),/paused after one minute/);
  const count=messages.length;
  video.dispatchEvent(new Event('playing'));
  hls.emit('manifest');video.dispatchEvent(new Event('error'));
  await Promise.resolve();
  assert.equal(plays,1,'a queued manifest must not restart an expired stream');
  assert.equal(messages.length,count,'late events must preserve the expiry message');cleanup();
});

test('a pending play rejection cannot replace the expired preview message', async t => {
  const host=setup(t), messages=[], hls=hlsFixture();
  const cleanup=mountCameraMedia(host,camera,{...hls,onStatus:text=>messages.push(text)});
  await Promise.resolve();
  const video=host.children[0];let reject;
  video.play=()=>new Promise((_resolve,fail)=>{reject=fail;});
  video.dispatchEvent(new Event('playing'));hls.emit('manifest');
  t.mock.timers.tick(60000);reject(new Error('play interrupted by pause'));await Promise.resolve();
  assert.match(messages.at(-1),/paused after one minute/);cleanup();
});

test('modern Safari starts native HLS without downloading an unnecessary runtime', async t => {
  const host=setup(t), original=globalThis.document.createElement;
  globalThis.MediaSource=class{};globalThis.ManagedMediaSource=class{};
  globalThis.document.createElement=()=>{
    const video=original();video.canPlayType=()=> 'probably';return video;
  };
  let runtimeLoads=0;
  const cleanup=mountCameraMedia(host,camera,{loadRuntime:()=>{
    runtimeLoads++;return new Promise(()=>{});
  }});
  await Promise.resolve();
  assert.equal(runtimeLoads,0,'native playback must survive a blocked JavaScript CDN');
  assert.equal(host.children[0].src,camera.stream);cleanup();
});

test('browsers reporting tentative native HLS keep the compatible MSE player', async t => {
  const host=setup(t), original=globalThis.document.createElement, hls=hlsFixture();
  globalThis.MediaSource=class{};
  globalThis.document.createElement=()=>{
    const video=original();video.canPlayType=()=> 'maybe';return video;
  };
  let runtimeLoads=0;
  const cleanup=mountCameraMedia(host,camera,{loadRuntime:()=>{runtimeLoads++;return hls.loadRuntime();}});
  await Promise.resolve();
  assert.equal(runtimeLoads,1,'Chrome needs HLS.js for streams its native player cannot decode');
  assert.equal(host.children[0].src,undefined);cleanup();
});

test('an unsupported MSE runtime falls back to native HLS', async t => {
  const host=setup(t), original=globalThis.document.createElement;
  globalThis.MediaSource=class{};
  globalThis.document.createElement=()=>{
    const video=original();video.canPlayType=()=> 'maybe';return video;
  };
  const cleanup=mountCameraMedia(host,camera,{loadRuntime:async()=>({default:{isSupported:()=>false}})});
  await Promise.resolve();assert.equal(host.children[0].src,camera.stream);cleanup();
});

test('closing a preview before its video library loads never starts a late stream', async t => {
  const host = setup(t);
  let resolve, constructed = 0;
  const pending = new Promise(r => { resolve = r; });
  class Hls { constructor() { constructed++; } static isSupported() { return true; } }
  const cleanup = mountCameraMedia(host, camera, {loadRuntime: () => pending});
  const video = host.children[0];
  cleanup(); resolve({default: Hls}); await pending; await Promise.resolve();
  assert.equal(constructed, 0); assert.equal(video.paused, true); assert.equal(host.children.length, 0);
});

test('timed-out previews report failure and ignore a late library response', async t => {
  const host = setup(t);
  let resolve, constructed = 0;
  const messages = [], pending = new Promise(r => { resolve = r; });
  class Hls { constructor() { constructed++; } static isSupported() { return true; } }
  const cleanup = mountCameraMedia(host, camera, {
    loadRuntime: () => pending, onStatus: text => messages.push(text),
  });
  t.mock.timers.tick(18000);
  assert.match(messages.at(-1), /unavailable/);
  resolve({default: Hls}); await pending; await Promise.resolve();
  assert.equal(constructed, 0); cleanup();
});

test('preview timeouts cancel pending image and iframe navigations', t => {
  const host=setup(t);
  for (const source of [{snapshot:'https://example.test/camera.jpg'},{preview:'https://example.test/view'}]) {
    const messages=[];
    const cleanup=mountCameraMedia(host,{name:'Camera',...source},{onStatus:text=>messages.push(text)});
    const media=host.children[0];assert.ok(media.src);
    t.mock.timers.tick(18000);assert.equal(media.src,undefined);
    assert.match(messages.at(-1),/unavailable/);cleanup();
  }
});

test('provider snapshots show an explicit error and stop refreshing when closed', t => {
  const host = setup(t), messages = [];
  const cleanup = mountCameraMedia(host, {snapshot: 'https://api.igotview.com/image.jpg', name:'Square'},
    {onStatus: text => messages.push(text)});
  const image = host.children[0]; image.onerror();
  assert.match(messages.at(-1), /unavailable/);
  const lateLoad=image.onload; cleanup(); lateLoad(); t.mock.timers.tick(120000);
  assert.equal(host.children.length, 0); assert.match(messages.at(-1), /unavailable/);
});


test('static thumbnails identify themselves and do not poll', t => {
  const host = setup(t), messages = [];
  const cleanup = mountCameraMedia(host, {name:'Falcon', snapshot:'https://i.ytimg.com/vi/test/hqdefault.jpg',
    previewKind:'thumbnail', previewNote:'Video thumbnail · not a live frame.'},
    {onStatus: text => messages.push(text)});
  const image = host.children[0]; image.onload();
  assert.match(messages.at(-1), /not a live frame/);
  let writes = 0;
  Object.defineProperty(image, 'src', {set() { writes++; }});
  t.mock.timers.tick(180000);
  assert.equal(writes, 0); cleanup();
});

test('provider playback is removed after one minute and cleanup cancels expiry callbacks', t => {
  const host = setup(t); let expired = 0;
  const item = {name:'Falcon', provider:'DOS', player:'https://www.youtube-nocookie.com/embed/2oqJJvDzdFY'};
  const cleanup = mountCameraPlayer(host, item, {onExpired: () => expired++});
  assert.equal(host.children.length, 1);
  assert.equal(host.children[0].src, item.player);
  t.mock.timers.tick(60000);
  assert.equal(host.children.length, 0); assert.equal(expired, 1); cleanup();
  const close = mountCameraPlayer(host, item, {onExpired: () => expired++});
  close(); t.mock.timers.tick(60000);
  assert.equal(host.children.length, 0); assert.equal(expired, 1);
});


test('failed snapshots stop their refresh timer before the card is closed', t => {
  const host=setup(t);let requests=0;
  const original=globalThis.document.createElement;
  globalThis.document.createElement=()=>{
    const image=original();Object.defineProperty(image,'src',{configurable:true,set(){requests++;}});return image;
  };
  const cleanup=mountCameraMedia(host,{snapshot:'https://example.test/camera.jpg',name:'Camera'});
  assert.equal(requests,1);host.children[0].onerror();t.mock.timers.tick(180000);
  assert.equal(requests,1,'An unavailable preview must not keep polling');cleanup();
});
