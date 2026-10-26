// Water mode's running of the simulation (src/water/care.mjs), with stand-ins for the page's feeding
// and food: the clock at each speed and stopped while the page is hidden, the routine's meals (real
// ones through the lid at Play, counted at Fast), the food eaten and left and the leftovers shown on
// the sand, what is kept on the device, and water.fx - the bowl's while on, clear while off.
// Run: node --test water-care.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { Care, clockText, RATE, SHOWN } from './src/water/care.mjs';
import { BowlWater, DAY, HOUR } from './src/water/chemistry.mjs';
import { CLEAR_WATER } from './src/water/effects.ts';

/** The page's feeding (Feeding.ts): its state, which the Feed button moves on from idle. */
function feeding() {
  return { state: 'idle' };
}

/** The page's food (FishFood.ts): seven slots, pellets eaten counted, settlings numbered, settled
 *  ones left to rot. */
function food() {
  return {
    slots: new Array(7).fill(null),
    eatenCount: 0,
    landings: 0,
    leave(after = 0) {
      const out = [];
      this.slots.forEach((f, i) => {
        if (f && f.landed && f.left === null && f.settled > after) {
          f.left = 1;
          out.push(i);
        }
      });
      return out;
    },
    lay(p) {
      const i = this.slots.indexOf(null);
      if (i >= 0) this.slots[i] = { at: p, landed: true, left: 1 };
      return i;
    },
    rot(slot, left) {
      this.slots[slot].left = left;
    },
    isLeft(slot) {
      return this.slots[slot]?.left != null;
    },
    take(slot) {
      this.slots[slot] = null;
    },
    /** A pellet dropped in by a meal, settling on the sand uneaten. */
    sink() {
      const i = this.slots.indexOf(null);
      this.slots[i] = { landed: true, left: null, settled: ++this.landings };
    },
    get left() {
      return this.slots.filter((f) => f?.left != null).length;
    },
  };
}

/** The fish off its food, whatever the water (it eats none of a counted meal). */
function offFood(bowl) {
  bowl.effects = function () {
    BowlWater.prototype.effects.call(this);
    this.fx.appetite = 0;
  };
}

function page() {
  const water = { fx: CLEAR_WATER };
  const host = { water, idle: CLEAR_WATER, feeding: feeding(), food: food(), rotation: () => [1, 0, 0, 0, 1, 0, 0, 0, 1], bed: -0.6 };
  return { host, water, care: new Care(host) };
}

test('water.fx: the bowl’s while on, clear (or ?water=’s) while off', () => {
  const { care, water, host } = page();
  assert.equal(water.fx, CLEAR_WATER);
  care.set(true);
  assert.equal(water.fx, care.bowl.fx);
  care.startOver('neglected');
  assert.equal(water.fx, care.bowl.fx, 'a fresh start’s');
  assert.ok(water.fx.tint > 0.2 && care.bowl.readings().nitrate > 40);
  offFood(care.bowl);
  care.speed = 'fast';
  care.frame(1);
  assert.ok(host.food.left > 0, 'leftovers on the sand');
  care.set(false);
  assert.equal(water.fx, CLEAR_WATER);
  assert.equal(host.food.left, 0, 'taken away');
});

test('turned on, only what happens from then on counts: a pellet that sank before is no leftover of it', () => {
  const { care, host } = page();
  host.food.sink();
  care.set(true);
  care.frame(1 / 60);
  assert.equal(care.bowl.s.pellets.length, 0);
  host.food.sink();
  care.frame(1 / 60);
  assert.equal(care.bowl.s.pellets.length, 1);
});

test('slow frames at Fast (a phone at 10 fps, a tab come back): the clock runs on, each meal once', () => {
  const { care } = page();
  care.set(true);
  care.speed = 'fast';
  const t0 = performance.now();
  for (let k = 0; k < 3000; k++) care.frame(0.1);
  assert.ok(performance.now() - t0 < 2000);
  assert.equal(clockText(care.bowl.s.t), 'Day 76 · 9:00 am');
  // (75 days, two meals a day: the last half day's in Learn's count.)
  assert.equal(care.meals.log.times.length, 3);
  assert.ok(Number.isFinite(care.bowl.fx.heaterLamp));
});

test('the clock: half an hour a second at Play, six hours at Fast, nothing paused or hidden', () => {
  const { care } = page();
  care.set(true);
  assert.equal(clockText(care.bowl.s.t), 'Day 1 · 9:00 am');
  care.frame(1);
  assert.equal(care.bowl.s.t, 9 * HOUR + RATE.play);
  assert.equal(clockText(care.bowl.s.t), 'Day 1 · 9:30 am');
  care.speed = 'fast';
  care.frame(1);
  assert.equal(clockText(care.bowl.s.t), 'Day 1 · 3:30 pm');
  const t = care.bowl.s.t;
  care.frame(1, true);
  care.speed = 'pause';
  care.frame(1);
  assert.equal(care.bowl.s.t, t);
  care.speed = 'fast';
  for (let k = 0; k < 4 * 3; k++) care.frame(1);
  assert.equal(clockText(care.bowl.s.t), 'Day 4 · 3:30 pm');
  assert.equal(clockText(12 * HOUR + 59 * 60), 'Day 1 · 12:50 pm');
  assert.equal(clockText(DAY + 5 * 60), 'Day 2 · 12:00 am');
});

test('routine meals counted, the lid on, at every speed; the Feed button’s pellets counted as the fish eats or leaves them', () => {
  const { care, host } = page();
  care.set(true);
  care.speed = 'fast';
  // A day at Fast: meals at 9 am (now passed) and 7 pm, then 9 am tomorrow.
  for (let k = 0; k < 4; k++) care.frame(1);
  assert.equal(host.feeding.state, 'idle', 'no lid');
  assert.deepEqual(care.meals.log.times, [DAY + 9 * HOUR, DAY + 9 * HOUR, DAY + 9 * HOUR], 'counted for Learn (its log keeps half a day)');
  assert.ok(care.bowl.s.gut > 0, 'eaten');
  assert.equal(care.bowl.s.pellets.length, 0, 'a well fish eats them all');
  // Off its food: what it leaves lies on the sand, the newest few shown, until they rot.
  offFood(care.bowl);
  for (let k = 0; k < 8; k++) care.frame(1);
  care.sync();
  assert.ok(care.bowl.s.pellets.length > SHOWN);
  assert.equal(host.food.left, SHOWN);
  care.routine.meals = 0;
  for (let k = 0; k < 12; k++) care.frame(1);
  care.sync();
  assert.equal(care.bowl.s.pellets.length, 0, 'rotted');
  assert.equal(host.food.left, 0);

  // At Play too: the 7 pm meal counted (for Learn as well), the lid left on.
  const p = page();
  p.care.set(true);
  for (let k = 0; k < 21; k++) p.care.frame(1);
  assert.equal(clockText(p.care.bowl.s.t), 'Day 1 · 7:30 pm');
  assert.equal(p.host.feeding.state, 'idle');
  assert.deepEqual(p.care.meals.log.times, [19 * HOUR, 19 * HOUR, 19 * HOUR]);
  assert.equal(p.care.meals.log.advise(p.care.meals.now()).advice, 'again', 'a Feed now: already fed');
  // The Feed button at 8 pm: the fish takes two pellets; the third settles uneaten and is left to
  // rot, shown where it fell; Learn counts all three at the time the meal was asked for.
  p.care.frame(1);
  p.host.feeding.state = 'waiting';
  p.care.frame(1 / 60);
  const gut = p.care.bowl.s.gut;
  p.host.food.eatenCount += 2;
  p.host.food.sink();
  p.care.frame(1 / 60);
  assert.ok(p.care.bowl.s.gut > gut);
  assert.equal(p.care.bowl.s.pellets.length, 1);
  assert.equal(p.care.shown.size, 1);
  for (let k = 0; k < 3; k++) p.care.meals.drop();
  assert.deepEqual(p.care.meals.log.times.slice(3), [20 * HOUR, 20 * HOUR, 20 * HOUR]);
  assert.equal(p.care.meals.log.advise(20 * HOUR + 600).advice, 'over', 'six pellets in an hour');
});

test('kept on the device: the bowl, the speed and the routine come back; anything else is set aside', () => {
  const { care } = page();
  care.speed = 'fast';
  care.routine.meals = 4;
  care.routine.change = 'weekly';
  care.set(true);
  for (let k = 0; k < 40; k++) care.frame(1);
  const kept = JSON.stringify(care);
  assert.ok(kept.length < 60000, `${kept.length} characters`);
  const back = page().care;
  assert.ok(back.restore(JSON.parse(kept)));
  assert.equal(back.speed, 'fast');
  assert.deepEqual(back.routine, { meals: 4, change: 'weekly' });
  assert.deepEqual(back.bowl.readings(), care.bowl.readings());
  assert.deepEqual(back.bowl.s.history, care.bowl.s.history);
  // (Something else, or spoilt: a new bowl as on a first visit.)
  for (const bad of [null, {}, { v: 0 }, { ...JSON.parse(kept), v: 99 }, { ...JSON.parse(kept), bowl: { ...JSON.parse(kept).bowl, tan: 'x' } }, { ...JSON.parse(kept), bowl: { ...JSON.parse(kept).bowl, pellets: [5] } }]) assert.equal(page().care.restore(bad), false);
  // (A speed or a routine it does not know: left as they were.)
  const odd = page().care;
  assert.ok(odd.restore({ ...JSON.parse(kept), speed: 'toString', meals: 3, change: 'constructor' }));
  assert.equal(odd.speed, 'play');
  assert.deepEqual(odd.routine, { meals: 2, change: 'none' });
});
