import test from 'node:test';
import assert from 'node:assert/strict';
import { createAirportCamera } from '../src/airport-camera.js';

class Element extends EventTarget {
  children = []; style = {}; clientWidth = 520;
  append(...children) { this.children.push(...children); }
  replaceChildren() { this.children = []; }
  setAttribute() {}
  removeAttribute(name) { delete this[name]; }
  showModal() { this.open = true; }
  close() { this.open = false; this.dispatchEvent(new Event('close')); }
  remove() {}
}
test('airport preview is lazy and releases its frame on close, tab hide and viewing timeout', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const previous = globalThis.document, nodes = [], button = new Element(), doc = new EventTarget();
  doc.body = new Element(); doc.hidden = false; doc.getElementById = () => button;
  doc.createElement = tag => { const node = new Element(); node.tag = tag; nodes.push(node); return node; };
  globalThis.document = doc;
  t.after(() => { globalThis.document = previous; });
  const airport = createAirportCamera(), dialog = doc.body.children[0];
  assert.equal(nodes.filter(n => n.tag === 'iframe').length, 0, 'no remote load at startup');
  const preview = nodes.find(n => n.className === 'camera-preview-image');
  airport.open(); assert.equal(preview.children.length, 1);
  const frame = preview.children[0];
  assert.equal(new URL(frame.src).hostname, 'api.wetmet.net');
  dialog.close(); assert.equal(preview.children.length, 0);
  airport.open(); doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(preview.children.length, 0);
  doc.hidden = false; airport.open(); t.mock.timers.tick(60000);
  assert.equal(preview.children.length, 0);
  const link = nodes.find(n => n.tag === 'a');
  assert.equal(link.href, 'https://www.fox29.com/philadelphia-international-airport-camera');
  airport.dispose(); assert.equal(button.onclick, null);
});
