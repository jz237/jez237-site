// Water mode's care simulation (WaterCare.ts runs it): the betta bowl's water, day by day - the
// nitrogen cycle (the fish's waste and rotting food become ammonia; bacteria turn it into nitrite,
// then nitrate; water changes take some of each away), the bacteria themselves and where they live,
// the plants, the heater and the room, the water's buffer (KH) and pH, the almond leaf's tannins,
// chlorine from untreated tap water, a bloom of free-floating bacteria - and what all of that does
// to the fish (water/effects.ts: WaterEffects). Plain numbers, no page: the tests run it in Node
// (water-chemistry.test.mjs: the scenarios it is calibrated against).
//
// Units: nitrogen in mg of N in the whole bowl (TAN: total ammonia nitrogen, NH3 + NH4+), so a
// concentration is mg N/L; what a test kit reads (ppm of NH3/NH4+, NO2-, NO3-) is converted for the
// panel (readings). Time in sim seconds; rates per day.

/** The water in the bowl (L): about a gallon (render/bowl.ts: ~24 cm across; Learn's glass card). */
const VOLUME = 4.0;
export const DAY = 86400;
export const HOUR = 3600;
/** The longest step taken at once (s): ten sim minutes; the heater's thermostat is followed in
 *  steps of a minute within it. */
const SUBSTEP = 600;
const THERMOSTAT_STEP = 60;

// ---- Food and the fish ---------------------------------------------------------------------
/** A pellet: ~2 mg, ~40 % protein (16 % of protein is N): its nitrogen (mg N), and its organic
 *  carbon (mg C), what a bloom of bacteria feeds on as it rots. */
export const PELLET_N = 0.128;
const PELLET_C = 0.9;
/** Of the nitrogen the fish eats: how much it excretes as ammonia through its gills (over 12-24
 *  h), how much leaves as feces (to the detritus on the sand); the rest it keeps (growth). */
const EXCRETED = 0.55;
const FECES = 0.2;
/** How long the meal takes to come out (time constant, days): nearly all of it within a day. */
const GUT_DAYS = 8 / 24;
/** Ammonia it excretes fasting (mg N/day, at 25 °C), from its own tissue. */
const FASTING = 0.04;
/** An uneaten pellet rots (per day, at 25 °C): gone in about two days. Most of its nitrogen
 *  becomes ammonia; the rest stays as detritus. Once this little is left it has fallen apart. */
const ROT = 1.3;
const ROT_TAN = 0.7;
const ROTTED = 0.08;
/** The most uneaten pellets kept (past them, the oldest is taken as rotted at once: a saved bowl
 *  stays small). */
const MOST_PELLETS = 60;
/** Detritus (feces, the remains of food, dead bacteria) mineralizes to ammonia (per day). */
const MINERALIZE = 0.07;

// ---- Bacteria -------------------------------------------------------------------------------
// The nitrifiers live on surfaces, as a biofilm: mostly in the sponge (the water is drawn through
// it), some in the sand, a little on the glass and the decor. Each group is a capacity: how much
// nitrogen (mg N/day) it could process if it had plenty, growing on what it gets and dying back
// without. Their affinity is high (half-saturation Ks, mg N/L): an aquarium's biofilter is mostly
// ammonia-oxidizing archaea and complete-ammonia-oxidizing Nitrospira, which work at a few
// thousandths of a mg/L. The loss rate is the active biofilm's (decay, grazing by protozoa,
// sloughing), so it carries only about a third more than the load it is fed: why a filter rinsed
// under the tap sets the bowl back by a week or two, and why a cycled bowl's ammonia reads zero.
// In acid water the whole film slows, its losses too, so the bacteria hang on, working slowly.
/** Where they live (share of each group: the sponge, the sand, the glass and decor), and the most
 *  each place can hold (mg N/day): its surface, far more than this bowl needs. */
const SHARE = [0.7, 0.25, 0.05];
const ROOM = [40, 15, 3];
/** Ammonia oxidizers (AOB; TAN -> nitrite) and nitrite oxidizers (NOB; nitrite -> nitrate): their
 *  growth rate on plenty (per day, 25 °C), half-saturation (mg N/L), loss rate (per day, 25 °C). */
const AOB = { growth: 0.75, ks: 0.006, loss: 0.56 };
const NOB = { growth: 0.65, ks: 0.004, loss: 0.45 };
/** Faster when warmer (per °C, about 25 °C); slower in acid water, all but stopped by pH 6.0. */
const WARMER = 1.07;
const PH_HALF = 6.45;
const PH_WIDTH = 0.15;

// ---- Plants -----------------------------------------------------------------------------------
/** The anubias and the rosette: nitrogen they take up while growing (mg N/day), ammonia first,
 *  then nitrate, each with its half-saturation (mg N/L). */
const PLANTS = 0.07;
const PLANT_KS_TAN = 0.02;
const PLANT_KS_NO3 = 0.2;

// ---- Water, buffer, pH -------------------------------------------------------------------------
/** Tap water: its KH (dKH) and chlorine or chloramine (ppm, as Cl2). */
const TAP_KH = 4;
const TAP_CHLORINE = 2;
/** 1 dKH is 17.9 mg/L as CaCO3 (= 0.3577 meq/L); nitrifying ammonium uses 7.14 mg CaCO3 per mg N.
 *  The fish excretes most of its ammonia as NH3, which takes up a proton as it becomes NH4+, giving
 *  back half that for its share. (Rotting food and waste release ammonia too, but also acids:
 *  taken as even.) */
const DKH_MG = 17.9;
const MEQ_PER_DKH = 17.9 / 50.04;
const CACO3_PER_N = 7.14;
const EXCRETED_NH3 = 0.6;
/** Water lost to the air through the lid's vents (share a day, ~3 % a week at 79 °F with the
 *  airstone), topped up with tap water as it goes: only the tap water's KH comes in (what the water
 *  held stays, its concentration as it was). Plants taking up nitrate give back as much buffer as
 *  nitrifying it took for the step from ammonium (half the 7.14). */
const EVAPORATION = 0.004;
/** CO2 in the water (ppm; the filter's airstone keeps it about here), and carbonic acid's first
 *  constant: pH from KH and CO2 (pH ~ 7 + log10(3 KH / CO2): 7.6 at 4 dKH). */
const CO2 = 3;
const KA1 = 10 ** -6.35;
/** The almond leaf and the wood: their tannins come to a steady level over days (time constant),
 *  as weak acids worth this much buffer there (meq/L), and tint the water this tea-brown. */
const TANNIN_DAYS = 4;
const TANNIN_ACID = 0.08;
const TANNIN_TINT = 0.3;
/** Chlorine or chloramine: gone over about a day (per day, aerated, with organics to react with);
 *  it kills bacteria (per ppm per day), and chloramine's breakdown frees some of its ammonia (mg N
 *  per mg Cl2). */
const CHLORINE_DECAY = 3;
const CHLORINE_KILL = 0.7;
const CHLORAMINE_N = 0.5 * (14 / 71);

// ---- The bloom ----------------------------------------------------------------------------------
/** Free-floating bacteria (heterotrophs), in units of cloudiness (1: milky): their growth on
 *  dissolved organics (per day; half-saturation, mg C/L), loss (settling, grazing; per day), and
 *  the cloud a mg C/L of organics makes. The biofilm's own heterotrophs eat the organics too,
 *  quickly once it is established (per day, new and mature). */
const BLOOM = { growth: 6, ks: 0.3, loss: 0.7, yield: 0.6 };
const BIOFILM_EATS = [0.4, 4];

// ---- Temperature ----------------------------------------------------------------------------------
/** The room (°C): 70 °F on average, a little warmer by afternoon; the bowl follows it with this
 *  time constant (h); the heater (10 W) warms its 4 kg of water; its thermostat holds 79 °F, on
 *  below and off above a band 0.5 °F wide. */
const ROOM_C = 21.1;
const ROOM_SWING = 0.6;
const BOWL_HOURS = 3.5;
const HEATER_W = 10;
const HEAT_CAPACITY = VOLUME * 4186;
const SET_F = 79;
const BAND_F = 0.5;

// ---- The fish -------------------------------------------------------------------------------------
/** What troubles it, each to a severity 0..1 (0.7: severe): free ammonia NH3 (ppm; even a little,
 *  for long, irritates the gills), nitrite (ppm NO2-), nitrate (ppm NO3-), cold (°F), chlorine
 *  (ppm), very acid water (bettas come from soft, acid water: only under about pH 5.5 is it harmful
 *  in itself), a sudden change of pH (half a unit stresses it, a whole one is a shock: what one big
 *  change on a crashed buffer does). */
const CAUSES = ['ammonia', 'nitrite', 'nitrate', 'cold', 'chlorine', 'acid', 'swing'];
/** How each shows in it (WaterEffects): its weight in lethargy, gasping, clamped fins, paleness and
 *  loss of appetite, per cause (in CAUSES' order). Nitrite stops the blood carrying oxygen, so the
 *  fish gasps; cold slows everything; chlorine and ammonia burn the gills. */
const SHOWS = {
  lethargy: [0.9, 0.9, 0.7, 1.0, 0.8, 0.6, 0.6],
  gasp: [0.8, 1.0, 0.1, 0.0, 0.7, 0.2, 0.2],
  clamp: [0.9, 0.6, 0.6, 0.6, 0.9, 0.8, 0.8],
  pale: [0.7, 0.6, 0.6, 0.4, 0.8, 0.6, 0.7],
  appetite: [1.0, 0.9, 0.7, 0.8, 1.0, 0.6, 0.6],
};
/** It takes a few hours to feel bad water (time constant, h), and days to get over it, except the
 *  cold, which it shakes off as the water warms. */
const FEEL_HOURS = 2;
const MEND_HOURS = [36, 36, 48, 3, 18, 24, 24];
/** Its body follows the pH over days (time constant), so a sudden change is a shock. */
const PH_SETTLE_DAYS = 2;
/** It tends its nest only when content (overall severity under this) and warm (°F), taking a day
 *  to start and stopping within hours. */
const CONTENT = 0.12;
const NEST_HOURS = [24, 3];
/** The fish's condition by its overall severity: Thriving below the first, Uncomfortable, Stressed,
 *  In danger from the last. */
const CONDITIONS = [0.12, 0.35, 0.65];
/** The effects of clear water (effects.ts CLEAR_WATER: the page as it always was); an effect within
 *  SNAP of its clear value is taken as clear, so a fish that has got over its troubles is exactly
 *  well again. */
export const CLEAR_FX = Object.freeze({ lethargy: 0, gasp: 0, clamp: 0, pale: 0, appetite: 1, nest: 1, cloud: 0, tint: 0, heaterLamp: 1 });
const SNAP = 0.01;
/** What the panel tells of (state.event). */
const EVENTS = ['tap', 'rinse', 'change', 'untreated', 'feast'];

// ---- The routine ------------------------------------------------------------------------------------
/** A meal (pellets), and when meals are given (hours of the day) for each number a day. */
export const MEAL = 3;
const MEAL_HOURS = { 0: [], 1: [9], 2: [9, 19], 4: [8, 12, 16, 20] };
/** Automatic water changes: which days of the week (day number mod 7) at this hour, and how much;
 *  or, tested every day, half whenever ammonia or nitrite reads this much (ppm) or more - what a
 *  bowl this small needs while it cycles with the fish in. */
const CHANGES = {
  none: null,
  weekly: { days: [0], fraction: 0.25 },
  twice: { days: [3, 0], fraction: 0.5 },
  test: { days: [0, 1, 2, 3, 4, 5, 6], fraction: 0.5, reads: 0.5 },
};
const CHANGE_HOUR = 10;
/** Where a fresh start's clock begins (h on day 1). */
const START_HOUR = 9;
/** The chart's samples: every so often (s), the last so many days. */
const SAMPLE_EVERY = 3 * HOUR;
const SAMPLE_DAYS = 120;

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** 0 below onset, 0.7 at severe, on a log scale (and 1 a little beyond). */
const severity = (x, onset, severe) => (x <= onset ? 0 : clamp01((0.7 * Math.log(x / onset)) / Math.log(severe / onset)));
/** °F from °C and back. */
const toF = (c) => c * 1.8 + 32;
const toC = (f) => (f - 32) / 1.8;
/** The fraction of ammonia that is free NH3 (the toxic form) at pH and T (°C). */
const freeFraction = (ph, tc) => 1 / (1 + 10 ** (0.09018 + 2729.92 / (tc + 273.15) - ph));

/** A fresh state: an empty bowl just set up (the fish in today), before anything has grown. */
function newState() {
  return {
    /** Sim time (s since midnight before day 1). */
    t: START_HOUR * HOUR,
    tan: 0,
    no2: 0,
    no3: 0,
    detritus: 0,
    /** Nitrogen eaten and still to come out (mg N). */
    gut: 0,
    /** Uneaten pellets on the sand: [id, mg N left] each, oldest first. @type {[number, number][]} */
    pellets: [],
    nextPellet: 1,
    /** The nitrifiers' capacity (mg N/day at 25 °C) in each place (SHARE's). (A new bowl: the few
     *  the tap water, the plants and the fish's bag water bring.) */
    aob: SHARE.map((s) => s * 0.02),
    nob: SHARE.map((s) => s * 0.01),
    kh: TAP_KH,
    tannin: 0,
    chlorine: 0,
    /** Dissolved organics (mg C/L), and the bloom (cloudiness): a new bowl's sand, wood and plants
     *  leach organics for a few days. */
    doc: 2,
    leach: 3,
    bloom: 0.0001,
    tempC: toC(SET_F),
    heater: true,
    heating: false,
    /** Of the last stretch stepped, the share the heater was heating (its lamp, averaged). */
    lamp: 1,
    dechlor: true,
    /** The fish: each cause's severity as it feels it (CAUSES), the pH it is used to, its nest
     *  urge, and the share of a pellet it is owed for meals counted at its appetite. */
    feel: CAUSES.map(() => 0),
    phUsed: 0,
    nest: 1,
    owed: 0,
    /** What last happened that the panel tells of, and when (s): 'tap', 'rinse', 'change',
     *  'untreated', 'feast'. @type {string | null} */
    event: null,
    eventAt: 0,
    /** Food given in the last day, for 'feast': [t, pellets] each. @type {[number, number][]} */
    given: [],
    /** The cycle reached at some point: ammonia and nitrite both cleared once the bacteria grew. */
    cycled: false,
    /** The chart's samples: [t, ammonia, nitrite, nitrate] (ppm) each. @type {number[][]} */
    history: [],
  };
}

/** The bowl's water and the fish in it, as Water mode simulates them. */
export class BowlWater {
  /** state: a saved state (toJSON), or a fresh new bowl. */
  constructor(state = null) {
    /** @type {ReturnType<typeof newState>} */
    this.s = { ...newState(), ...(state ?? {}) };
    if (!this.s.phUsed) this.s.phUsed = this.ph;
    /** What the fish shows (WaterEffects: lethargy, gasp, clamp, pale, appetite, nest, cloud, tint,
     *  heaterLamp), as of the last step. */
    this.fx = { ...CLEAR_FX };
    /** The heater's lamp is the share of the time it heated over about this long (sim s; 0: the
     *  last stretch run): what an eye would see of it at the clock's speed (care.mjs sets it). */
    this.lampWindow = 0;
    this.effects();
  }

  /** A saved state (toJSON) back, or null if it is not one this model saved: every field there, of
   *  its kind, its numbers finite and in range, its lists of the right shape. */
  static restore(saved) {
    if (!saved || typeof saved !== 'object') return null;
    const fresh = newState();
    const number = (x, low = 0) => typeof x === 'number' && Number.isFinite(x) && x >= low;
    const numbers = (a, n, low = 0) => Array.isArray(a) && (n < 0 || a.length === n) && a.every((x) => number(x, low));
    for (const [k, v] of Object.entries(fresh)) {
      const got = saved[k];
      if (typeof v === 'number' && !number(got, k === 'phUsed' ? -Infinity : 0)) return null;
      if (typeof v === 'boolean' && typeof got !== 'boolean') return null;
    }
    const ok =
      numbers(saved.aob, 3) &&
      numbers(saved.nob, 3) &&
      numbers(saved.feel, CAUSES.length) &&
      saved.feel.every((x) => x <= 1) &&
      Array.isArray(saved.pellets) &&
      saved.pellets.length <= MOST_PELLETS &&
      saved.pellets.every((p) => numbers(p, 2)) &&
      Array.isArray(saved.given) &&
      saved.given.every((g) => numbers(g, 2)) &&
      Array.isArray(saved.history) &&
      saved.history.length <= (SAMPLE_DAYS * DAY) / SAMPLE_EVERY &&
      saved.history.every((h) => numbers(h, 4)) &&
      (saved.event === null || EVENTS.includes(saved.event));
    return ok ? new BowlWater(saved) : null;
  }

  /** A start: 'new' (set up today, the fish in today), 'cycled' (its bacteria grown, kept well),
   *  'neglected' (cycled, then four months without a water change, only topped up). */
  static start(kind) {
    const w = new BowlWater();
    if (kind === 'new') {
      w.sample();
      return w;
    }
    const s = w.s;
    // A bowl run for months: its bacteria at what the fish's food supports, its detritus, nitrate
    // and tannins at their usual levels; then a month of the usual care, to settle.
    s.aob = SHARE.map((x) => x * 1.0);
    s.nob = SHARE.map((x) => x * 1.0);
    s.detritus = 2.2;
    s.no3 = 2.5 * VOLUME;
    s.kh = 2.8;
    s.tannin = 1;
    s.doc = 0.05;
    s.leach = 0;
    s.bloom = 0.01;
    s.cycled = true;
    w.advance(28 * DAY, { meals: 2, change: 'weekly' });
    if (kind === 'neglected') w.advance(120 * DAY, { meals: 2, change: 'none' });
    // (A new start of the clock and the chart; the fish as it is now, used to its water.)
    s.t = START_HOUR * HOUR;
    s.history = [];
    s.given = [];
    s.event = null;
    s.phUsed = w.ph;
    w.sample();
    return w;
  }

  // ---- Readings -------------------------------------------------------------------------------

  /** The pH, from the buffer (KH, less the tannins' acids) and the CO2. */
  get ph() {
    const s = this.s;
    const alk = (s.kh * MEQ_PER_DKH - TANNIN_ACID * s.tannin) / 1000;
    const co2 = CO2 / 44010;
    const h = (-alk + Math.sqrt(alk * alk + 4 * KA1 * co2)) / 2;
    return -Math.log10(h);
  }

  /** What a test kit and a thermometer read: ammonia (NH3 + NH4+), nitrite (NO2-), nitrate (NO3-),
   *  chlorine (ppm); pH; KH (dKH); the temperature (°F and °C); and free ammonia (ppm NH3). */
  readings() {
    const s = this.s;
    const ph = this.ph;
    const tan = s.tan / VOLUME;
    return {
      ammonia: tan * (17 / 14),
      nitrite: (s.no2 / VOLUME) * (46 / 14),
      nitrate: (s.no3 / VOLUME) * (62 / 14),
      ph,
      kh: s.kh,
      tempF: toF(s.tempC),
      tempC: s.tempC,
      chlorine: s.chlorine,
      freeAmmonia: tan * (17 / 14) * freeFraction(ph, s.tempC),
    };
  }

  /** The nitrifiers' capacity in all (mg N/day at 25 °C): ammonia's, nitrite's. */
  get bacteria() {
    const sum = (a) => a[0] + a[1] + a[2];
    return { aob: sum(this.s.aob), nob: sum(this.s.nob) };
  }

  /** Each cause's severity as the fish feels it now (CAUSES' order), and overall. */
  get stress() {
    return 1 - this.s.feel.reduce((p, x) => p * (1 - x), 1);
  }

  /** The fish's condition (0 Thriving, 1 Uncomfortable, 2 Stressed, 3 In danger) and what troubles
   *  it most (a CAUSES id), or null when it thrives. */
  condition() {
    const stress = this.stress;
    const level = CONDITIONS.filter((c) => stress >= c).length;
    if (level === 0) return { level, cause: null };
    const f = this.s.feel;
    return { level, cause: CAUSES[f.indexOf(Math.max(...f))] };
  }

  /** What is happening, for the panel's line (content.ts HAPPENING): the most pressing thing. */
  happening() {
    const s = this.s;
    const r = this.readings();
    const since = s.t - s.eventAt;
    if (s.chlorine > 0.05) return 'chlorine';
    if (!s.heater) return r.tempF < 76 ? 'cold' : 'cooling';
    if (r.tempF < 76) return 'warming';
    if (s.event === 'tap' && since < 3 * DAY) return 'tapRinse';
    if (s.event === 'feast' && since < DAY) return 'feast';
    if (r.ph < 6.6 && s.kh < 1) return 'acid';
    if (this.fx.cloud > 0.25) return s.cycled ? 'bloomFood' : 'bloomNew';
    if (r.ammonia >= 0.1 && r.nitrite < 0.1) return s.cycled ? 'ammoniaBack' : 'stage1';
    if (r.ammonia >= 0.1) return 'stage2';
    if (r.nitrite >= 0.1) return 'stage3';
    if (!s.cycled) return 'uncycled';
    if (r.nitrate >= 40) return 'nitrate';
    if (s.kh < 1.5) return 'kh';
    if (s.pellets.length > 0) return 'rotting';
    if (s.event === 'rinse' && since < DAY) return 'rinsed';
    if (s.event === 'change' && since < DAY) return 'changed';
    return 'cycled';
  }

  // ---- Care -----------------------------------------------------------------------------------

  /** n pellets eaten by the fish. */
  eat(n) {
    this.s.gut += n * PELLET_N * (EXCRETED + FECES);
    this.fed(n);
  }

  /** A pellet left uneaten, to rot on the sand: its id. */
  leave() {
    const s = this.s;
    const id = s.nextPellet++;
    if (s.pellets.length >= MOST_PELLETS) {
      const [, n] = s.pellets.shift();
      s.tan += n * ROT_TAN;
      s.detritus += n * (1 - ROT_TAN);
    }
    s.pellets.push([id, PELLET_N]);
    this.fed(1);
    return id;
  }

  /** A meal of n pellets, counted rather than watched: the fish takes what its appetite allows
   *  (fx.appetite: a share of every meal, its fractions carried to the next). The pellets left
   *  uneaten: their ids. */
  meal(n = MEAL) {
    const s = this.s;
    s.owed += n * this.fx.appetite;
    const eaten = Math.min(Math.floor(s.owed + 1e-9), n);
    s.owed = Math.min(s.owed - eaten, 1);
    if (eaten) this.eat(eaten);
    const left = [];
    for (let k = eaten; k < n; k++) left.push(this.leave());
    return left;
  }

  /** A test kit reads ammonia or nitrite at `level` ppm or more (0: whatever it reads). */
  reads(level) {
    const r = this.readings();
    return r.ammonia >= level || r.nitrite >= level;
  }

  /** A fraction of the water changed for tap water (dechlorinated or not: this.s.dechlor), the sand
   *  siphoned as it goes (a share of the detritus out with it, every leftover pellet, and a little
   *  of the sand's bacteria). A dechlorinator is dosed for the whole bowl: it neutralizes any
   *  chlorine or chloramine still in it too. */
  waterChange(fraction) {
    const s = this.s;
    const keep = 1 - fraction;
    s.tan *= keep;
    s.no2 *= keep;
    s.no3 *= keep;
    s.doc *= keep;
    s.bloom *= keep;
    s.tannin *= keep;
    s.kh = s.kh * keep + TAP_KH * fraction;
    s.chlorine = s.dechlor ? 0 : s.chlorine * keep + TAP_CHLORINE * fraction;
    s.detritus *= 1 - Math.min(1.2 * fraction, 0.8);
    s.pellets = [];
    s.aob[1] *= 1 - 0.15 * fraction;
    s.nob[1] *= 1 - 0.15 * fraction;
    this.mark(s.dechlor ? 'change' : 'untreated');
  }

  /** The sponge squeezed out: in a cup of the bowl's water (a little of its bacteria go with the
   *  muck), or under the tap (the chlorine and the cold kill most of them). */
  rinseSponge(tap) {
    const s = this.s;
    const keep = tap ? 0.03 : 0.9;
    s.aob[0] *= keep;
    s.nob[0] *= keep;
    s.detritus *= 0.85;
    this.mark(tap ? 'tap' : 'rinse');
  }

  set heater(on) {
    this.s.heater = on;
  }

  get heater() {
    return this.s.heater;
  }

  set dechlor(on) {
    this.s.dechlor = on;
  }

  get dechlor() {
    return this.s.dechlor;
  }

  // ---- Time -----------------------------------------------------------------------------------

  /** The routine's next event after time t (s): a meal or a water change, at its time; or null. */
  static nextEvent(t, routine) {
    const day = Math.floor(t / DAY);
    let best = null;
    for (let d = day; d <= day + 7 && !best; d++) {
      const at = [];
      for (const h of MEAL_HOURS[routine.meals] ?? []) at.push({ t: d * DAY + h * HOUR, kind: 'meal' });
      const c = CHANGES[routine.change];
      // (Day numbers count from 1: day d + 1 for the day starting at d * DAY.)
      if (c && c.days.includes((d + 1) % 7)) at.push({ t: d * DAY + CHANGE_HOUR * HOUR, kind: 'change', fraction: c.fraction, reads: c.reads ?? 0 });
      for (const e of at) if (e.t > t && (!best || e.t < best.t)) best = e;
    }
    return best;
  }

  /** Runs `seconds` of sim time with a routine ({ meals: 0 | 1 | 2 | 4, change: 'none' | 'weekly' |
   *  'twice' | 'test' }), meals and water changes (or tests) at their times: the clock lands on each
   *  exactly, so none comes round twice. onMeal: a meal is due (default: counted at the fish's
   *  appetite, this.meal).
   *  @param {number} seconds @param {{ meals: number, change: string }} routine @param {() => unknown} [onMeal] */
  advance(seconds, routine, onMeal = () => this.meal()) {
    if (!(seconds > 0)) return;
    const end = this.s.t + seconds;
    for (;;) {
      const e = BowlWater.nextEvent(this.s.t, routine);
      if (!e || e.t > end) break;
      this.runTo(e.t);
      if (e.kind === 'meal') onMeal();
      else if (this.reads(e.reads)) this.waterChange(e.fraction);
    }
    this.runTo(end);
  }

  /** Runs `seconds` of sim time as it is (no routine). */
  step(seconds) {
    if (seconds > 0) this.runTo(this.s.t + seconds);
  }

  /** Runs the clock to `end` (s), landing on it exactly, in steps of at most SUBSTEP (one at the
   *  least); then the lamp and the effects. */
  runTo(end) {
    const s = this.s;
    const span = end - s.t;
    if (!(span > 0)) return;
    const n = Math.max(1, Math.ceil(span / SUBSTEP - 1e-9));
    let heated = 0;
    for (let k = 0; k < n; k++) heated += this.substep(k === n - 1 ? end - s.t : span / n);
    s.t = end;
    const share = Math.min(Math.max(heated / span, 0), 1);
    s.lamp = this.lampWindow > 0 ? s.lamp + (share - s.lamp) * (1 - Math.exp(-span / this.lampWindow)) : share;
    this.effects();
  }

  /** One step of dt s: how long (s) the heater heated in it. */
  substep(dt) {
    const s = this.s;
    const d = dt / DAY;
    const t0 = s.t;
    s.t += dt;

    // The temperature: the room (warmest mid-afternoon), the bowl following it, the heater as its
    // thermostat switches it (followed a minute at a time).
    const hourOfDay = (t0 / HOUR) % 24;
    const room = ROOM_C + ROOM_SWING * Math.cos(((hourOfDay - 15) / 24) * 2 * Math.PI);
    const m = Math.max(1, Math.ceil(dt / THERMOSTAT_STEP));
    const tick = dt / m;
    let heated = 0;
    for (let k = 0; k < m; k++) {
      const f = toF(s.tempC);
      if (!s.heater) s.heating = false;
      else if (f < SET_F - BAND_F / 2) s.heating = true;
      else if (f > SET_F + BAND_F / 2) s.heating = false;
      s.tempC += (room - s.tempC) * (1 - Math.exp(-tick / (BOWL_HOURS * HOUR))) + (s.heating ? (HEATER_W * tick) / HEAT_CAPACITY : 0);
      if (s.heating) heated += tick;
    }
    const warm = WARMER ** (s.tempC - 25);
    const ph = this.ph;
    const acid = 1 / (1 + Math.exp(-(ph - PH_HALF) / PH_WIDTH));

    // Food and waste: the meal coming out, the fish's own upkeep, the detritus, rotting pellets.
    const out = s.gut * (1 - Math.exp(-d / GUT_DAYS));
    s.gut -= out;
    const excreted = out * (EXCRETED / (EXCRETED + FECES)) + FASTING * warm * d;
    s.kh += (excreted * EXCRETED_NH3 * (CACO3_PER_N / 2)) / VOLUME / DKH_MG;
    let tanIn = excreted;
    let docIn = (out / PELLET_N) * PELLET_C * 0.15 + s.leach * d;
    s.leach *= Math.exp(-d / 2);
    const mineral = s.detritus * (1 - Math.exp(-MINERALIZE * warm * d));
    s.detritus += out * (FECES / (EXCRETED + FECES)) - mineral;
    tanIn += mineral;
    docIn += mineral * 2;
    const rot = 1 - Math.exp(-ROT * warm * d);
    for (let i = s.pellets.length - 1; i >= 0; i--) {
      const p = s.pellets[i];
      const gone = p[1] * rot;
      p[1] -= gone;
      // (Fallen apart: what is left joins the detritus.)
      if (p[1] < ROTTED * PELLET_N) {
        s.detritus += p[1];
        s.pellets.splice(i, 1);
      }
      tanIn += gone * ROT_TAN;
      s.detritus += gone * (1 - ROT_TAN);
      docIn += (gone / PELLET_N) * PELLET_C;
    }
    // Chlorine: it decays (chloramine freeing some of its ammonia), killing bacteria as it goes.
    if (s.chlorine > 0) {
      const cl = s.chlorine;
      s.chlorine *= Math.exp(-CHLORINE_DECAY * d);
      tanIn += (cl - s.chlorine) * VOLUME * CHLORAMINE_N;
      const kill = Math.exp(-CHLORINE_KILL * ((cl + s.chlorine) / 2) * d);
      for (let k = 0; k < 3; k++) {
        s.aob[k] *= kill;
        s.nob[k] *= kill;
      }
      s.bloom *= kill * kill;
      if (s.chlorine < 1e-4) s.chlorine = 0;
    }
    s.tan += tanIn;

    // The plants take ammonia first, then nitrate (a step's take is a sliver of what there is).
    const plantsTan = (PLANTS * d * (s.tan / VOLUME)) / (PLANT_KS_TAN + s.tan / VOLUME);
    s.tan -= plantsTan;
    const want = PLANTS * d - plantsTan;
    const plantsNo3 = Math.min((want * (s.no3 / VOLUME)) / (PLANT_KS_NO3 + s.no3 / VOLUME), s.no3);
    s.no3 -= plantsNo3;
    s.kh += ((plantsNo3 * (CACO3_PER_N / 2)) / VOLUME / DKH_MG) + TAP_KH * EVAPORATION * d;

    // The nitrifiers: ammonia to nitrite (using up the buffer), nitrite to nitrate.
    const aob = s.aob[0] + s.aob[1] + s.aob[2];
    const nob = s.nob[0] + s.nob[1] + s.nob[2];
    const oxidized = uptake(s.tan, aob * warm * acid * d, AOB.ks);
    s.tan -= oxidized;
    s.no2 += oxidized;
    const nitrified = uptake(s.no2, nob * warm * acid * d, NOB.ks);
    s.no2 -= nitrified;
    s.no3 += nitrified;
    s.kh = Math.max(s.kh - (oxidized * CACO3_PER_N) / VOLUME / DKH_MG, 0);
    grow(s.aob, aob, oxidized, AOB, warm * (0.1 + 0.9 * acid), d);
    grow(s.nob, nob, nitrified, NOB, warm * (0.1 + 0.9 * acid), d);

    // The bloom feeds on the organics, as does the biofilm (once it is established).
    const docMg = s.doc + docIn / VOLUME;
    const mature = Math.min(aob / 0.6, 1);
    const eaten = docMg * (1 - Math.exp(-(BIOFILM_EATS[0] + (BIOFILM_EATS[1] - BIOFILM_EATS[0]) * mature) * d));
    const food = docMg - eaten;
    const bloomGrowth = Math.min(BLOOM.growth * warm * (food / (BLOOM.ks + food)) * s.bloom * d, food * BLOOM.yield);
    s.doc = Math.max(food - bloomGrowth / BLOOM.yield, 0);
    s.bloom = Math.max(s.bloom + bloomGrowth - s.bloom * (1 - Math.exp(-BLOOM.loss * d)), 1e-5);

    // The tannins come to their level.
    s.tannin += (1 - s.tannin) * (1 - Math.exp(-d / TANNIN_DAYS));

    // The fish feels it.
    this.feel(dt, ph);
    if (!s.cycled && aob > 0.3 && nob > 0.3 && s.tan / VOLUME < 0.05 && s.no2 / VOLUME < 0.02) s.cycled = true;
    if (Math.floor(s.t / SAMPLE_EVERY) > Math.floor(t0 / SAMPLE_EVERY)) this.sample();
    return heated;
  }

  /** The fish, over dt s at pH ph: how it feels each cause, coming on over hours and going over
   *  days; the pH it is used to; its urge to tend a nest. */
  feel(dt, ph) {
    const s = this.s;
    const r = this.readings();
    s.phUsed += (ph - s.phUsed) * (1 - Math.exp(-dt / (PH_SETTLE_DAYS * DAY)));
    const now = [
      severity(r.freeAmmonia, 0.004, 0.05),
      severity(r.nitrite, 0.25, 2),
      severity(r.nitrate, 40, 160),
      clamp01(((76.5 - r.tempF) / 6.5) * 0.55),
      severity(r.chlorine, 0.02, 0.2),
      clamp01(((5.6 - ph) / 0.6) * 0.7),
      clamp01(((Math.abs(ph - s.phUsed) - 0.5) / 0.6) * 0.7),
    ];
    for (let k = 0; k < now.length; k++) {
      const hours = now[k] > s.feel[k] ? FEEL_HOURS : MEND_HOURS[k];
      s.feel[k] += (now[k] - s.feel[k]) * (1 - Math.exp(-dt / (hours * HOUR)));
    }
    const content = this.stress < CONTENT && r.tempF >= 77 ? 1 : 0;
    s.nest += (content - s.nest) * (1 - Math.exp(-dt / (NEST_HOURS[content ? 0 : 1] * HOUR)));
  }

  /** this.fx from the state: each 0..1 and finite (whatever the state), and within SNAP of its
   *  clear value, exactly that. */
  effects() {
    const s = this.s;
    const show = (w) => 1 - s.feel.reduce((p, x, k) => p * (1 - w[k] * x), 1);
    const fx = this.fx;
    fx.lethargy = show(SHOWS.lethargy);
    fx.gasp = show(SHOWS.gasp);
    fx.clamp = show(SHOWS.clamp);
    fx.pale = show(SHOWS.pale);
    fx.appetite = 1 - 0.95 * show(SHOWS.appetite);
    fx.nest = s.nest;
    fx.cloud = s.bloom;
    fx.tint = TANNIN_TINT * s.tannin;
    fx.heaterLamp = s.lamp;
    for (const k in fx) {
      const v = Number.isFinite(fx[k]) ? clamp01(fx[k]) : CLEAR_FX[k];
      fx[k] = Math.abs(v - CLEAR_FX[k]) < SNAP ? CLEAR_FX[k] : v;
    }
  }

  /** A sample for the chart, now (the oldest dropped past SAMPLE_DAYS). */
  sample() {
    const s = this.s;
    const r = this.readings();
    const round = (x) => Math.round(x * 1000) / 1000;
    s.history.push([Math.round(s.t), round(r.ammonia), round(r.nitrite), round(r.nitrate)]);
    const keep = (SAMPLE_DAYS * DAY) / SAMPLE_EVERY;
    if (s.history.length > keep) s.history.splice(0, s.history.length - keep);
  }

  /** Food given (pellets), for 'feast': twenty or more in a day is a feast. */
  fed(n) {
    const s = this.s;
    s.given.push([s.t, n]);
    while (s.given.length && s.given[0][0] < s.t - DAY) s.given.shift();
    if (s.given.reduce((sum, g) => sum + g[1], 0) >= 20 && !(s.event === 'feast' && s.t - s.eventAt < DAY)) this.mark('feast');
  }

  mark(event) {
    this.s.event = event;
    this.s.eventAt = this.s.t;
  }

  toJSON() {
    return this.s;
  }
}

/** How much of `mass` (mg N in the bowl) a capacity of `cap` (mg N over the step) takes up, at
 *  half-saturation ks (mg N/L): Monod, implicit in the step (stable however large the capacity). */
function uptake(mass, cap, ks) {
  if (mass <= 0 || cap <= 0) return 0;
  const conc = mass / VOLUME;
  return mass - mass / (1 + cap / (VOLUME * (ks + conc)));
}

/** The nitrifiers grow on what they took up (in each place by its share, to its room) and are lost
 *  at their rate, times `slow` (warmth, acid). */
function grow(places, total, taken, kind, slow, d) {
  const loss = Math.exp(-kind.loss * slow * d);
  for (let k = 0; k < 3; k++) {
    const share = total > 0 ? places[k] / total : SHARE[k];
    places[k] = Math.min(places[k] * loss + kind.growth * taken * share, ROOM[k]);
  }
}
