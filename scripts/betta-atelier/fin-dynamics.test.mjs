import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SwimGait } from './src/swim-gait.js';
import { BodyMotion } from './src/body-motion.js';
import { FinDynamics, waterVelocity } from './src/fin-dynamics.js';

const make = (kind = 0, side = 0) => new FinDynamics({
  kind, side, columns: 17, rows: 13,
  point(u, v) {
    const angle = (u - 0.5) * 2.7;
    if (kind === 3) return [-0.8 + v * 0.3, (u - 0.5) * (0.06 + v * 0.35), side * (0.267 + v * 0.19)];
    if (kind === 4) return [-0.9 + v * 0.35, -0.3 - v * 0.9, side * (0.14 + v * 0.05)];
    return [0.8 + Math.cos(angle) * v, Math.sin(angle) * v + (u - 0.5) * 0.12, 0.02 * Math.sin(u * 15) * v * v];
  },
});
const state = (t, strength = 0, direction = 'front') => {
  const body = new BodyMotion(); body.update(t * 2.8, 0.3, 0, t * 4.5);
  return ({ body,
  time: t, phase: t * 2.8, pectoralPhase: t * 15, drive: 0.1, turn: 0,
  flare: 1, heading: 0, velocity: [0, 0, 0], angularVelocity: 0,
  origin: [0, 0, 0], strength, direction,
}); };
function run(fin, seconds, strength, direction, fps = 60) {
  for (let i = 1; i <= seconds * fps; i++) fin.advance(1 / fps, state(i / fps, strength, direction));
  return fin;
}
const edgeMean = (f, axis) => {
  let sum = 0;
  for (let i = 0; i < f.columns; i++) sum += f.position[((f.rows - 1) * f.columns + i) * 3 + axis];
  return sum / f.columns;
};

test('zero current is truly still; directional currents reverse without random frame noise', () => {
  assert.deepEqual(waterVelocity(2, 1, 2, 3, 0, 'changing', []), [0, 0, 0]);
  for (const [a, b, axis] of [['left', 'right', 0], ['down', 'up', 1], ['back', 'front', 2]]) {
    assert.ok(waterVelocity(2, 1, 2, 3, 1, a, [])[axis] < 0);
    assert.ok(waterVelocity(2, 1, 2, 3, 1, b, [])[axis] > 0);
  }
});
test('all seven fins remain anchored, finite and bounded under maximum current', () => {
  for (const [kind, side] of [[0, 0], [1, 0], [2, 0], [3, -1], [3, 1], [4, -1], [4, 1]]) {
    const f = run(make(kind, side), 5, 1, 'changing');
    const m = f.metrics();
    assert.ok(f.position.every(Number.isFinite));
    assert.equal(m.anchorError, 0);
    assert.ok(m.maxDisplacement < 1.5, JSON.stringify(m));
    assert.ok(m.maxRayStrain < 0.15, JSON.stringify(m));
  }
});
test('water pushes each fin to the opposite side when the current reverses', () => {
  for (const [kind, side] of [[0, 0], [1, 0], [2, 0], [3, -1], [3, 1], [4, -1], [4, 1]]) {
    const front = run(make(kind, side), 5, 0.8, 'front');
    const back = run(make(kind, side), 5, 0.8, 'back');
    // The small, actively braced pectorals deflect less than the broad trailing fins.
    assert.ok(edgeMean(front, 2) - edgeMean(back, 2) > (kind === 3 ? 0.01 : 0.06), `fin ${kind}/${side} flow deflection ${edgeMean(front, 2) - edgeMean(back, 2)}`);
  }
});
test('muscular strokes continue in still water and pause freezes the membrane', () => {
  for (const [kind, side] of [[0, 0], [1, 0], [2, 0], [3, -1], [3, 1], [4, -1], [4, 1]]) {
    const f = run(make(kind, side), 2, 0, 'front');
    const before = f.position.slice();
    for (let i = 1; i <= 24; i++) f.advance(1 / 60, state(2 + i / 60));
    assert.ok(f.position.some((v, i) => Math.abs(v - before[i]) > 0.004), `fin ${kind}/${side} not powered`);
    const frozen = f.position.slice();
    f.advance(0, state(2.4));
    assert.deepEqual(f.position, frozen);
  }
});
test('fixed physics steps keep 30/60/120fps results close', () => {
  const reference = run(make(), 4, 0.7, 'front', 120);
  for (const fps of [30, 60]) {
    const f = run(make(), 4, 0.7, 'front', fps);
    const rms = Math.sqrt(f.position.reduce((sum, p, i) => sum + (p - reference.position[i]) ** 2, 0) / f.position.length);
    assert.ok(rms < 0.035, `${fps}fps RMS drift ${rms}`);
  }
});


test('hover has a quiet trunk, propulsion stays compact, and the spine preserves length', () => {
  const body = new BodyMotion(), point = [], samples = [];
  let min = Infinity, max = -Infinity;
  for (let phase = 0; phase < Math.PI * 2; phase += 0.1) {
    body.update(phase, 0, 0, 0);
    body.transform(1.056, 0, 0, point);
    min = Math.min(min, point[2]); max = Math.max(max, point[2]);
    body.transform(-1.408, 0.064, 0.15, point);
    assert.ok(Math.abs(point[0] + 1.408) < 0.00001, 'eye attachment moved');
  }
  assert.ok(max - min < 0.025, `hover trunk excursion: ${max - min}`);
  min = Infinity; max = -Infinity;
  for (let phase = 0; phase < Math.PI * 2; phase += 0.1) {
    body.update(phase, 1, 0, 0); body.transform(1.056, 0, 0, point);
    min = Math.min(min, point[2]); max = Math.max(max, point[2]);
  }
  assert.ok(max - min > 0.15 && max - min < 0.5, `propulsion excursion: ${max - min}`);
  body.update(2.1, 1, 0.8, 0);
  let length = 0;
  for (let x = -1.22; x <= 1.056; x += 0.002) {
    body.frame(x, point); samples.push([point[0], point[1]]);
    if (samples.length > 1) { const before = samples.at(-2); length += Math.hypot(point[0] - before[0], point[1] - before[1]); }
  }
  assert.ok(Math.abs(length - 2.276) < 0.006, `centerline stretched: ${length}`);
});
test('mouth opens into a larger aperture before the gill covers open', () => {
  const body = new BodyMotion(), upper = [], lower = [];
  const gap = (phase) => {
    body.update(0, 0.3, 0, phase);
    body.transform(-1.68, 0.1056, 0, upper); body.transform(-1.68, 0.0608, 0, lower);
    return upper[1] - lower[1];
  };
  const closed = gap(Math.PI * 1.5), open = gap(Math.PI * 0.5);
  assert.ok(open > closed * 4 && open > 0.05, `mouth aperture ${closed} to ${open}`);
  body.update(0, 0.3, 0, Math.PI * 0.5); const intake = body.mouth, firstGill = body.gill;
  body.update(0, 0.3, 0, Math.PI * 0.5 + 1.05);
  assert.ok(body.gill > firstGill && body.mouth < intake, 'gills should lag mouth intake');
});


test('flow and locomotion accelerate cadence without stopping quiet-hover breathing', () => {
  const hover = new SwimGait(), current = new SwimGait(), swim = new SwimGait();
  for (let i = 0; i < 600; i++) {
    hover.advance(1 / 60, 0.045, 0); current.advance(1 / 60, 0.045, 0.9);
    swim.advance(1 / 60, 0.38, 0);
  }
  assert.ok(hover.effort < 0.01 && hover.breathPhase > 30);
  assert.ok(current.pectoralHz > hover.pectoralHz * 3);
  assert.ok(current.bodyHz > 3 && swim.bodyHz > 3);
  const before = structuredClone(current);
  current.advance(0, 0, 0); assert.deepEqual({...current}, before);
  current.advance(1 / 60, 0.045, 0);
  assert.ok(current.effort > before.effort * 0.9, 'flow changes should ease, not snap');
});

test('actual pectoral membrane beats faster under load, stays attached and resolves at 30fps', () => {
  function sample(load, fps = 60) {
    const fin = make(3, 1), gait = new SwimGait(), trace = [];
    for (let i = 1; i <= fps * 7; i++) {
      const t = i / fps; gait.advance(1 / fps, 0.045, load);
      const s = state(t, load, 'right');
      Object.assign(s, {phase:gait.phase, pectoralPhase:gait.pectoralPhase, effort:gait.effort, drive:gait.effort * 0.55});
      s.body.update(gait.phase, gait.effort, 0, gait.breathPhase);
      fin.advance(1 / fps, s);
      if (i > fps * 4) trace.push(edgeMean(fin, 2));
    }
    const mean = trace.reduce((a,b)=>a+b,0) / trace.length;
    let best = {hz:0,power:0};
    for (let hz = 0.8; hz <= 9; hz += 0.05) {
      let c=0,s=0; trace.forEach((x,i)=>{c+=(x-mean)*Math.cos(i/fps*hz*Math.PI*2);s+=(x-mean)*Math.sin(i/fps*hz*Math.PI*2)});
      const power=c*c+s*s; if(power>best.power)best={hz,power};
    }
    assert.equal(fin.metrics().anchorError, 0);
    assert.ok(fin.metrics().maxRayStrain < 0.15, JSON.stringify(fin.metrics()));
    assert.ok(Math.max(...trace)-Math.min(...trace) > 0.015, 'membrane beat must remain visible');
    return best.hz;
  }
  const hover=sample(0), loaded=sample(0.9), phone=sample(0.9,30);
  assert.ok(loaded > hover * 2.5, `rendered cadence ${hover} -> ${loaded}`);
  assert.ok(Math.abs(loaded-phone)<0.35, `30fps alias/drift ${loaded} vs ${phone}`);
});

test('a long fin with distributed body insertions does not stretch during fast trunk strokes', () => {
  const fin = new FinDynamics({kind:2,side:0,point:(u,v)=>[-0.7+u*1.7,-0.3-v*(0.2+u*1.1),0]});
  for (let i=1;i<=240;i++) {
    const s=state(i/60,1,'changing');s.phase=i/60*27;s.body.update(s.phase,1,0.4,s.time*5);
    fin.advance(1/60,s);
    assert.equal(fin.metrics().anchorError,0);
    assert.ok(fin.metrics().maxRayStrain<0.07,JSON.stringify(fin.metrics()));
  }
});

// Test the rendered solver points, not only the fast display-control value.
test('relaxed tail opens rapidly, closes again and keeps ray lengths at 30/60/120fps', async () => {
  const { DisplayMotion } = await import('./src/display-motion.js');
  const span = f => { const ys=[]; for(let n=1;n<f.position.length;n+=3) ys.push(f.position[n]);return Math.max(...ys)-Math.min(...ys); };
  for (const fps of [30, 60, 120]) {
    const f=make(), display=new DisplayMotion(), s=state(0);
    s.body.update(0,0,0,0);s.drive=0;s.phase=0;
    const advance = seconds => {for(let i=0;i<Math.round(seconds*fps);i++){display.advance(1/fps);s.flare=display.flare;f.advance(1/fps,s)}};
    advance(1);const relaxed=span(f);display.requested=true;advance(.267);const quick=span(f);advance(1);const open=span(f);
    assert.ok(open>relaxed*1.5, `${fps}: fan lacks contrast`);
    assert.ok((quick-relaxed)/(open-relaxed)>.8, `${fps}: visible opening too slow`);
    display.requested=false;advance(.4);assert.ok(span(f)<relaxed+(open-relaxed)*.3, `${fps}: relaxation too slow`);
    const before=f.position.slice(),held=display.flare;display.requested=true;display.advance(0);f.advance(0,s);assert.equal(display.flare,held);assert.deepEqual(f.position,before);
    advance(1);assert.equal(f.metrics().anchorError,0);assert.ok(f.metrics().maxRayStrain<.07);
  }
});

test('eye gaze has quiet fixations, short glances, bounded independent motion and pause', async () => {
  const { EyeMotion } = await import('./src/display-motion.js');
  const left=new EyeMotion(1),right=new EyeMotion(-1),trace=[];
  for(let i=0;i<1200;i++) {left.advance(1/120);right.advance(1/120);trace.push([left.yaw,left.pitch,right.yaw,right.pitch]);}
  assert.ok(Math.max(...trace.map(p=>p[0]))-Math.min(...trace.map(p=>p[0]))>.3,'gaze is static');
  assert.ok(trace.every(p=>Math.abs(p[0])<=.24&&Math.abs(p[2])<=.24&&Math.abs(p[1])<=.13&&Math.abs(p[3])<=.13));
  const changes=trace.slice(1).map((p,i)=>Math.hypot(p[0]-trace[i][0],p[1]-trace[i][1]));
  assert.ok(changes.filter(v=>v<.0001).length>changes.length*.65,'eyes continually rolling instead of fixating');
  assert.ok(Math.max(...changes)>.01&&Math.max(...changes)<.08,'glance should be brief but not teleport');
  assert.ok(trace.some(p=>Math.abs(p[0]-p[2])>.1),'eyes mechanically locked together');
  const frozen=[left.time,left.yaw,left.pitch];left.advance(0,1,1);assert.deepEqual([left.time,left.yaw,left.pitch],frozen);
});
