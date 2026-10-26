// Learn mode (src/app/learn): every topic a tap can come to and every behaviour the fish can be
// captioned for has its card, short; a behaviour is captioned once it has lasted a moment, not over
// another card nor just after one, and not again for a while; the feeding advice follows what the
// fish has had.
// Run: node --test learn.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CAPTIONS, FEEDING, INTRO, TOPICS } from './src/app/learn/content.ts';
import { AFTER, CaptionClock, COOLDOWN, GAP, MODE_CAPTIONS } from './src/app/learn/captions.mjs';
import { DAY, DAY_PELLETS, FeedLog, SPACING } from './src/app/learn/feedLog.mjs';
import { TOPIC_IDS } from './src/app/learn/pick.mjs';

/** A card is short: a title of a line, a few sentences. */
function short(name, c) {
  for (const k of ['kicker', 'title', 'body']) assert.ok(typeof c[k] === 'string' && c[k].trim().length > 0, `${name}: ${k}`);
  assert.ok(c.title.length <= 48, `${name}: title of ${c.title.length} characters`);
  assert.ok(c.body.length <= 245, `${name}: body of ${c.body.length} characters`);
  assert.ok(c.body.split(/(?<=[.!?])\s+/).length <= 4, `${name}: more than four sentences`);
}

test('every topic a tap can come to has its card, and every card a topic', () => {
  assert.deepEqual(Object.keys(TOPICS).sort(), [...TOPIC_IDS].sort());
  for (const [id, c] of Object.entries(TOPICS)) short(id, c);
});

test('every mode of the swim is captioned or is only the route; every caption is short', () => {
  const swim = readFileSync(new URL('./src/fish/bettaSwim.mjs', import.meta.url), 'utf8');
  const modes = new Set([...swim.matchAll(/mode (?:=|===) '(\w+)'/g)].map((m) => m[1]));
  const route = new Set(['burst', 'glide']);
  for (const m of modes) assert.ok(m in MODE_CAPTIONS || route.has(m), `mode ${m}`);
  for (const c of Object.values(MODE_CAPTIONS)) assert.ok(c in CAPTIONS && c in AFTER, c);
  for (const [id, c] of Object.entries(CAPTIONS)) short(id, c);
  short('intro', INTRO);
  short('rule', FEEDING.rule);
  short('again', FEEDING.again(3, 12));
  short('over', FEEDING.over(9, 340));
  // (Counted in plain words: one pellet, minutes or hours ago, a day's food or more than one.)
  assert.match(FEEDING.again(1, 0.3).body, /one pellet just now/);
  assert.match(FEEDING.again(3, 125).body, /3 pellets 2 hours ago/);
  assert.match(FEEDING.over(DAY_PELLETS, 5).body, /^6 pellets in 5 minutes is a whole day’s food/);
  assert.match(FEEDING.over(DAY_PELLETS + 3, 0.5).body, /^9 pellets in a minute or two is more than a day’s food/);
});

test('a behaviour is captioned once it has lasted a moment, not over a card or just after one, and not again for a while', () => {
  const c = new CaptionClock();
  // Exploring: once it has kept at it AFTER.
  c.watch('cruise', 0);
  assert.equal(c.due(AFTER.cruise - 0.1, false), null);
  assert.equal(c.due(AFTER.cruise, false), 'cruise');
  assert.equal(c.due(AFTER.cruise + 1, false), null, 'not twice');
  // The card goes at 10 s: nothing for GAP, though it hovers.
  c.closed(10);
  c.watch('hover', 12);
  assert.equal(c.due(14, false), null);
  assert.equal(c.due(10 + GAP, true), null, 'not over another card');
  assert.equal(c.due(10 + GAP, false), 'hover');
  c.closed(40);
  // A hover over before it has lasted AFTER is not captioned.
  c.watch('rest', 100);
  c.watch('lap', 101);
  assert.equal(c.due(101 + AFTER.lap - 0.5, false), null);
  c.watch('hover', 104);
  c.watch('cruise', 104.5);
  // Back to exploring within its (long) cooldown: not again; displaying at the glass, a new one.
  assert.equal(c.due(200, false), null);
  c.watch('mirror', 200);
  assert.equal(c.due(200 + AFTER.mirror, false), 'mirror');
  c.closed(210);
  c.watch('cruise', 240);
  c.watch('mirror', 300);
  assert.equal(c.due(300 + AFTER.mirror, false), null, 'its cooldown');
  c.watch('cruise', 400);
  c.watch('mirror', 202.5 + COOLDOWN);
  assert.equal(c.due(202.5 + COOLDOWN + AFTER.mirror, false), 'mirror', 'once its cooldown is over');
  // Events: the nest grows (not over a card, not again for its cooldown); the fins flared at the
  // button, asked for, over another card, but not again for its cooldown either.
  const e = new CaptionClock();
  assert.equal(e.event('nest', 0, true), false);
  assert.equal(e.event('nest', 1, false), true);
  assert.equal(e.event('nest', 60, false), false);
  e.closed(70);
  assert.equal(e.event('flare', 71, true, true), true);
  assert.equal(e.event('flare', 90, false, true), false);
  assert.equal(e.event('sunk', 75, false), false, 'within the gap');
  assert.equal(e.event('sunk', 70 + GAP, false), true);
});

test('feeding: how to feed first; a meal soon after another, a word; a day’s food in a day, a warning', () => {
  const log = new FeedLog();
  assert.deepEqual(log.advise(0), { advice: 'rule', pellets: 0, minutes: 0 });
  // A meal: three pellets, half a second apart.
  const meal = (t, n = 3) => {
    for (let k = 0; k < n; k++) log.drop(t + 0.45 * k);
  };
  meal(10);
  assert.equal(log.recent(20), 3);
  assert.equal(log.lastMeal(20).pellets, 3);
  assert.equal(log.lastMeal(20).at, 10 + 0.45 * 2);
  // Again two minutes on: it has just eaten.
  const again = log.advise(10 + 0.45 * 2 + 120);
  assert.equal(again.advice, 'again');
  assert.equal(again.pellets, 3);
  assert.ok(Math.abs(again.minutes - 2) < 1e-9);
  meal(140);
  // A third meal: six pellets in a couple of minutes is a day's food.
  const over = log.advise(200);
  assert.equal(over.advice, 'over');
  assert.equal(over.pellets, DAY_PELLETS);
  assert.ok(Math.abs(over.minutes - 190 / 60) < 1e-9);
  // Only so many went in when there was room for them (a meal of two counts two).
  meal(210, 2);
  assert.equal(log.recent(300), 8);
  assert.deepEqual(log.lastMeal(300), { pellets: 2, at: 210 + 0.45 });
  // Half a day on, today's count starts afresh; a meal spaced well after the last is fine.
  assert.equal(log.recent(10 + DAY + 1), 5);
  assert.equal(log.advise(211 + DAY).advice, 'rule');
  const fresh = new FeedLog();
  fresh.drop(0);
  fresh.drop(0.45);
  fresh.drop(0.9);
  assert.equal(fresh.advise(0.9 + SPACING - 1).advice, 'again');
  assert.equal(fresh.advise(0.9 + SPACING + 1).advice, 'rule', 'a second meal hours later');
  // (The log keeps no more than a day's.)
  fresh.drop(DAY + 10);
  assert.equal(fresh.times.length, 1);
});
