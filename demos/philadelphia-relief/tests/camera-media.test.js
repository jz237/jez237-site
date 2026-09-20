import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mountCameraMedia } from '../src/camera-media.js';

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
    replaceChildren() { this.children = []; } };
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

test('provider snapshots show an explicit error and stop refreshing when closed', t => {
  const host = setup(t), messages = [];
  const cleanup = mountCameraMedia(host, {snapshot: 'https://api.igotview.com/image.jpg', name:'Square'},
    {onStatus: text => messages.push(text)});
  const image = host.children[0]; image.onerror();
  assert.match(messages.at(-1), /unavailable/);
  cleanup(); image.onload(); t.mock.timers.tick(120000);
  assert.equal(host.children.length, 0); assert.match(messages.at(-1), /unavailable/);
});
