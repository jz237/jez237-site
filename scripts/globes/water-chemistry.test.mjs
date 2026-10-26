// Water mode's care simulation (src/water/chemistry.mjs), against what a betta keeper sees in a real
// one-gallon bowl: a new bowl's nitrogen cycle with and without water changes, a cycled bowl kept
// well and neglected, the sponge rinsed in tank water and under the tap, the heater switched off, a
// change without dechlorinator, a day's overfeeding; and the fish's response to each.
// Run: node --test water-chemistry.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { BowlWater, DAY, HOUR } from './src/water/chemistry.mjs';

const TWICE = { meals: 2, change: 'none' };
/** The day a time falls on, as the panel counts them (day 1 is the first). */
const dayOf = (t) => Math.floor(t / DAY) + 1;

/** Runs a bowl `days` with a routine, reading it every `every` s: the readings, each with its time
 *  and the fish's state. */
function log(w, days, routine, every = HOUR) {
  const out = [];
  for (let t = 0; t < days * DAY; t += every) {
    w.advance(every, routine);
    out.push({ t: w.s.t, ...w.readings(), fx: { ...w.fx }, level: w.condition().level, aob: w.bacteria.aob });
  }
  return out;
}

const first = (rows, test) => rows.find(test) ?? null;
const max = (rows, key) => Math.max(...rows.map((r) => r[key]));

test('a new bowl, fed twice a day, never changed: the classic cycle, ammonia then nitrite then nitrate', () => {
  const rows = log(BowlWater.start('new'), 60, TWICE);
  const day = (test) => dayOf(first(rows, test)?.t ?? Infinity);
  assert.ok(day((r) => r.ammonia >= 0.25) >= 3 && day((r) => r.ammonia >= 0.25) <= 5, `ammonia 0.25 on day ${day((r) => r.ammonia >= 0.25)}`);
  assert.ok(day((r) => r.ammonia >= 1) >= 7 && day((r) => r.ammonia >= 1) <= 11, `ammonia 1 on day ${day((r) => r.ammonia >= 1)}`);
  assert.ok(day((r) => r.nitrite >= 0.25) >= 10 && day((r) => r.nitrite >= 0.25) <= 18, `nitrite readable on day ${day((r) => r.nitrite >= 0.25)}`);
  // (Back to zero: the first reading under a kit's lowest step after the peak, for good.)
  const peakA = rows.findIndex((r) => r.ammonia === max(rows, 'ammonia'));
  const goneA = rows.slice(peakA).find((r) => r.ammonia < 0.1);
  const clearA = dayOf(goneA.t);
  assert.ok(clearA >= 18 && clearA <= 28, `ammonia gone on day ${clearA}`);
  const peakN = rows.findIndex((r) => r.nitrite === max(rows, 'nitrite'));
  const clearN = dayOf(rows.slice(peakN).find((r) => r.nitrite < 0.1).t);
  assert.ok(clearN >= 28 && clearN <= 45, `nitrite gone on day ${clearN}`);
  assert.ok(rows.slice(rows.indexOf(goneA)).every((r) => r.ammonia < 0.1), 'ammonia stays gone');
  // Nitrate from then on, rising.
  const at = (d) => rows.find((r) => dayOf(r.t) === d).nitrate;
  assert.ok(at(46) > 5 && at(60) > at(46), `nitrate ${at(46).toFixed(1)} then ${at(60).toFixed(1)}`);
  // The fish suffers (in danger at the worst), but never more than the effects can say.
  assert.equal(Math.max(...rows.map((r) => r.level)), 3);
  for (const r of rows) for (const v of Object.values(r.fx)) assert.ok(v >= 0 && v <= 1);
});

test('fish-in cycling with half the water changed twice a week: much lower peaks, cycled in five to eight weeks', () => {
  const rows = log(BowlWater.start('new'), 63, { meals: 2, change: 'twice' });
  const none = log(BowlWater.start('new'), 63, TWICE);
  // (Six pellets a day in 4 L is ~0.13 ppm of ammonia a day; half of it changed every 3.5 days
  // holds it under ~0.75 at its worst before a change, and nitrite under ~2.5: a quarter or less of
  // the bowl never changed.)
  assert.ok(max(rows, 'ammonia') <= 0.75, `ammonia ${max(rows, 'ammonia').toFixed(2)}`);
  assert.ok(max(rows, 'nitrite') <= 2.5, `nitrite ${max(rows, 'nitrite').toFixed(2)}`);
  assert.ok(max(rows, 'ammonia') < 0.5 * max(none, 'ammonia') && max(rows, 'nitrite') < 0.3 * max(none, 'nitrite'));
  // Cycled: both under a kit's lowest step from then on.
  const last = rows.findLastIndex((r) => r.ammonia >= 0.1 || r.nitrite >= 0.1);
  const cycled = dayOf(rows[last + 1].t);
  // (Weeks 5 to 8: days 29 to 56.)
  assert.ok(cycled >= 4 * 7 + 1 && cycled <= 8 * 7, `cycled on day ${cycled}`);
});

test('a cycled bowl, a quarter changed weekly: ammonia and nitrite read zero, nitrate levels off, the pH holds', () => {
  const rows = log(BowlWater.start('cycled'), 56, { meals: 2, change: 'weekly' });
  assert.ok(max(rows, 'ammonia') <= 0.05, `ammonia ${max(rows, 'ammonia').toFixed(3)}`);
  assert.ok(max(rows, 'nitrite') <= 0.05, `nitrite ${max(rows, 'nitrite').toFixed(3)}`);
  const late = rows.slice(-28 * 24);
  assert.ok(Math.min(...late.map((r) => r.nitrate)) >= 10 && max(late, 'nitrate') <= 25, `nitrate ${Math.min(...late.map((r) => r.nitrate)).toFixed(1)}-${max(late, 'nitrate').toFixed(1)}`);
  assert.ok(rows.every((r) => r.ph >= 7.2 && r.ph <= 7.6), `pH ${Math.min(...rows.map((r) => r.ph)).toFixed(2)}-${max(rows, 'ph').toFixed(2)}`);
  // A content fish: thriving, nesting, eating.
  const end = rows.at(-1);
  assert.equal(end.level, 0);
  assert.ok(end.fx.nest > 0.9 && end.fx.appetite > 0.95 && end.fx.lethargy < 0.05);
});

test('a cycled bowl left three months without a water change: nitrate climbs, the buffer goes, the pH falls, ammonia comes back', () => {
  const rows = log(BowlWater.start('cycled'), 91, TWICE);
  const at = (d) => rows.find((r) => dayOf(r.t) === d);
  const weekly = (at(43).nitrate - at(1).nitrate) / 6;
  assert.ok(weekly >= 3 && weekly <= 8, `nitrate +${weekly.toFixed(1)} a week`);
  const acid = dayOf(first(rows, (r) => r.ph < 6.5).t);
  assert.ok(acid >= 50 && acid <= 90, `pH under 6.5 on day ${acid}`);
  assert.ok(at(acid).kh < 0.6, `KH ${at(acid).kh.toFixed(2)}`);
  // Old tank syndrome: nitrification slows in the acid water and ammonia shows.
  assert.ok(max(rows.slice(acid * 24), 'ammonia') >= 0.25 && max(rows.slice(0, (acid - 14) * 24), 'ammonia') < 0.05);
  // The "Neglected bowl" start is this, about two months on: high nitrate, the buffer spent, acid.
  const n = BowlWater.start('neglected').readings();
  assert.ok(n.nitrate >= 40 && n.kh < 0.6 && n.ph > 6.15 && n.ph < 6.45, JSON.stringify(n));
});

test('the sponge rinsed under the tap sets the bowl back a week or two; rinsed in tank water, nothing shows', () => {
  for (const tap of [true, false]) {
    const w = BowlWater.start('cycled');
    w.advance(10 * HOUR, { meals: 2, change: 'weekly' });
    w.rinseSponge(tap);
    const rows = log(w, 21, { meals: 2, change: 'weekly' });
    if (tap) {
      const early = rows.slice(0, 4 * 24);
      assert.ok(max(early, 'ammonia') >= 0.25, `ammonia ${max(early, 'ammonia').toFixed(2)} in 4 days`);
      assert.ok(max(rows, 'ammonia') <= 0.5, `ammonia ${max(rows, 'ammonia').toFixed(2)}`);
      assert.ok(rows.slice(14 * 24).every((r) => r.ammonia < 0.05), 'gone again within two weeks');
    } else {
      assert.ok(max(rows, 'ammonia') <= 0.05 && max(rows, 'nitrite') <= 0.05, `${max(rows, 'ammonia').toFixed(3)} ${max(rows, 'nitrite').toFixed(3)}`);
    }
  }
});

test('the heater off: the bowl falls to the room in half a day and the fish slows; on again, warm in a few hours', () => {
  const w = BowlWater.start('cycled');
  w.heater = false;
  const cold = log(w, 0.5, TWICE);
  const by = (rows, h) => rows[h - 1];
  assert.ok(by(cold, 8).tempF <= 72 && by(cold, 12).tempF <= 71 && by(cold, 12).tempF >= 69.5, `${by(cold, 8).tempF.toFixed(1)} °F at 8 h, ${by(cold, 12).tempF.toFixed(1)} at 12 h`);
  assert.ok(by(cold, 12).fx.lethargy >= 0.3 && by(cold, 12).fx.nest < 0.2, `lethargy ${by(cold, 12).fx.lethargy.toFixed(2)}`);
  assert.equal(w.condition().cause, 'cold');
  w.heater = true;
  const warm = log(w, 0.5, TWICE);
  assert.ok(by(warm, 4).tempF >= 78, `${by(warm, 4).tempF.toFixed(1)} °F after 4 h`);
  assert.ok(by(warm, 12).fx.lethargy < 0.1, 'lively again');
});

test('the heater lamp blinks with the thermostat: lit while it heats, at about two-thirds of the time', () => {
  const w = BowlWater.start('cycled');
  const lamp = [];
  // (Play speed: 30 sim minutes a second, a frame each 30 s of sim time.)
  for (let k = 0; k < 6 * 120; k++) {
    w.step(30);
    lamp.push(w.fx.heaterLamp);
  }
  assert.ok(lamp.every((x) => x === 0 || x === 1));
  const lit = lamp.reduce((a, b) => a + b, 0) / lamp.length;
  assert.ok(lit > 0.5 && lit < 0.85, `lit ${(lit * 100).toFixed(0)} %`);
  const switches = lamp.slice(1).filter((x, k) => x !== lamp[k]).length;
  assert.ok(switches >= 10, `${switches} switches in 6 h`);
  // (A frame of 6 sim hours: the lamp at its average.)
  w.step(6 * HOUR);
  assert.ok(w.fx.heaterLamp > 0.5 && w.fx.heaterLamp < 0.85);
});

test('half the water changed without dechlorinator: a day of burnt gills, bacteria lost, a little ammonia', () => {
  const w = BowlWater.start('cycled');
  w.advance(HOUR, TWICE);
  const before = w.bacteria.aob;
  w.dechlor = false;
  w.waterChange(0.5);
  assert.ok(Math.abs(w.readings().chlorine - 1) < 1e-9);
  const rows = log(w, 4, TWICE);
  assert.ok(rows.slice(0, 6).some((r) => r.level >= 2), 'stressed within hours');
  assert.ok(rows[24].chlorine < 0.1, 'gone within a day');
  assert.ok(rows[60].level <= 1, `level ${rows[60].level} after 2.5 days`);
  const lost = 1 - Math.min(...rows.map((r) => r.aob)) / before;
  assert.ok(lost >= 0.08 && lost <= 0.35, `bacteria lost ${(lost * 100).toFixed(0)} %`);
  assert.ok(max(rows, 'ammonia') >= 0.05 && max(rows, 'ammonia') <= 0.3, `ammonia ${max(rows, 'ammonia').toFixed(2)}`);
  // With dechlorinator (the default), nothing of the sort.
  const ok = BowlWater.start('cycled');
  ok.waterChange(0.5);
  assert.equal(ok.readings().chlorine, 0);
});

test('a day of overfeeding: the water clouds within a day, a modest ammonia bump, the leftovers rot in about two days', () => {
  const w = BowlWater.start('cycled');
  w.advance(HOUR, TWICE);
  const start = w.s.t;
  const rows = [];
  // Seven meals of three, two hours apart: the fish eats two meals' worth, the rest sinks uneaten.
  for (let m = 0; m < 7; m++) {
    if (m < 2) w.eat(3);
    else for (let k = 0; k < 3; k++) w.leave();
    rows.push(...log(w, 2 / 24, { meals: 0, change: 'none' }));
  }
  rows.push(...log(w, 4, TWICE));
  const cloudy = first(rows, (r) => r.fx.cloud >= 0.25);
  assert.ok(cloudy && cloudy.t - start <= DAY, `cloudy after ${((cloudy?.t - start) / HOUR).toFixed(0)} h`);
  assert.ok(max(rows, 'ammonia') >= 0.1 && max(rows, 'ammonia') <= 0.5, `ammonia ${max(rows, 'ammonia').toFixed(2)}`);
  // (Every pellet left has rotted away within about two days of the last.)
  const w2 = BowlWater.start('cycled');
  for (let k = 0; k < 15; k++) w2.leave();
  w2.advance(1.5 * DAY, { meals: 0, change: 'none' });
  assert.ok(w2.s.pellets.length > 0, 'still there after a day and a half');
  w2.advance(1 * DAY, { meals: 0, change: 'none' });
  assert.equal(w2.s.pellets.length, 0, 'gone by two and a half days');
});

test('a saved bowl picks up where it left off; meals counted at the fish\'s appetite', () => {
  const w = BowlWater.start('new');
  w.advance(9 * DAY, TWICE);
  const saved = JSON.stringify(w);
  assert.ok(saved.length < 40000, `${saved.length} bytes`);
  const back = new BowlWater(JSON.parse(saved));
  w.advance(3 * DAY, TWICE);
  back.advance(3 * DAY, TWICE);
  assert.deepEqual(back.readings(), w.readings());
  assert.deepEqual(back.fx, w.fx);
  // A fish off its food leaves a share of each meal, its fractions carried over.
  const sick = BowlWater.start('cycled');
  sick.fx.appetite = 0.5;
  const left = [sick.meal(3), sick.meal(3)].flat();
  assert.equal(left.length, 3);
  assert.equal(sick.s.pellets.length, 3);
  // The routine's times: twice a day at 9 am and 7 pm; a quarter changed on days 7, 14...
  const e = BowlWater.nextEvent(9 * HOUR, { meals: 2, change: 'weekly' });
  assert.deepEqual(e, { t: 19 * HOUR, kind: 'meal' });
  const c = BowlWater.nextEvent(5 * DAY + 20 * HOUR, { meals: 0, change: 'weekly' });
  assert.deepEqual(c, { t: 6 * DAY + 10 * HOUR, kind: 'change', fraction: 0.25 });
});
