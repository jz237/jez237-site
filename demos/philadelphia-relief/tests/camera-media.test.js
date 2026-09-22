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
  const host = { clientWidth: 344, children: [], append(e) { this.children.push(e); },
    replaceChildren(...children) { this.children = children; } };
  return host;
}
const camera = {name: 'Test camera', stream: 'https://video.deldot.gov/live/NCAM001.stream/playlist.m3u8'};

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
