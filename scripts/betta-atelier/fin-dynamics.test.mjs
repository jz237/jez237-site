import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SwimGait, BODY_LENGTH } from './src/swim-gait.js';
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

test('whole-fish transport has no false fin drag; three-axis rotation creates membrane lag', () => {
  const calm = make(), carried = make(), rolled = make();
  for (let i = 1; i <= 120; i++) {
    const a = state(i / 60, 0), b = state(i / 60, 0), c = state(i / 60, 0);
    b.localHydrodynamics = { flow: [1.2, -0.7, 0.9], velocity: [1.2, -0.7, 0.9], angular: [0, 0, 0] };
    c.localHydrodynamics = { flow: [0, 0, 0], velocity: [0, 0, 0], angular: [1.5, 0, 0.6] };
    calm.advance(1 / 60, a); carried.advance(1 / 60, b); rolled.advance(1 / 60, c);
  }
  assert.deepEqual(carried.position, calm.position);
  assert.equal(rolled.metrics().anchorError, 0);
  const rms = Math.sqrt(rolled.position.reduce((sum, v, i) => sum + (v - calm.position[i]) ** 2, 0) / rolled.position.length);
  assert.ok(rms > 0.015);
});

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
  // (Breathing, the lips only part; a gulp at the film opens them wide.)
  assert.ok(open > closed * 3 && open > 0.03, `mouth aperture ${closed} to ${open}`);
  body.update(0, 0.3, 0, Math.PI * 1.5, 1); body.transform(-1.68, 0.1056, 0, upper); body.transform(-1.68, 0.0608, 0, lower);
  assert.ok(upper[1] - lower[1] > open * 1.5, `gulp aperture ${upper[1] - lower[1]} vs a breath's ${open}`);
  body.update(0, 0.3, 0, Math.PI * 0.5); const intake = body.mouth, firstGill = body.gill;
  body.update(0, 0.3, 0, Math.PI * 0.5 + 1.05);
  assert.ok(body.gill > firstGill && body.mouth < intake, 'gills should lag mouth intake');
});


// The water past the fish, in the gait's units (Atelier units/s) from body lengths a second.
const lengths = bl => bl * BODY_LENGTH;
test('the tail beats with speed, all but stops at hover, works against a current, and breathing goes on', () => {
  const hover = new SwimGait(), current = new SwimGait(), cruise = new SwimGait(), fast = new SwimGait();
  for (let i = 0; i < 600; i++) {
    hover.advance(1 / 60, 0.045, 0); current.advance(1 / 60, 0.045, 0.9);
    cruise.advance(1 / 60, 0.2, lengths(0.35)); fast.advance(1 / 60, 0.34, lengths(1));
  }
  assert.ok(hover.effort < 0.01 && hover.breathPhase > 25);
  // A halfmoon's tail: about 2 Hz at an easy cruise, near 3 at a body length a second, still at hover.
  assert.ok(hover.bodyHz < 1, `hover ${hover.bodyHz}`);
  assert.ok(cruise.bodyHz > 1.5 && cruise.bodyHz < 2.4, `cruise ${cruise.bodyHz}`);
  assert.ok(fast.bodyHz > 2.6 && fast.bodyHz < 3.8, `fast ${fast.bodyHz}`);
  assert.ok(current.effort > hover.effort + 0.05, 'holding against a current costs effort');
  const before = structuredClone(current);
  current.advance(0, 0, 0); assert.deepEqual({...current}, before);
  current.advance(1 / 60, 0.045, 0);
  assert.ok(current.effort > before.effort * 0.9, 'flow changes should ease, not snap');
});

test('actual pectoral membrane beats at a halfmoon rate, stays attached and resolves at 30fps', () => {
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
  for (const hz of [hover, loaded]) assert.ok(hz > 1.3 && hz < 3.3, `rendered cadence ${hover}, ${loaded}`);
  assert.ok(Math.abs(loaded-phone)<0.35, `30fps alias/drift ${loaded} vs ${phone}`);
});

test('hover sculling fans the pectorals continuously and a startle tucks them to the flanks', () => {
  function pectoral(pose, fps = 60) {
    const fin = make(3, 1), gait = new SwimGait(), trace = [];
    for (let i = 1; i <= fps * 8; i++) {
      gait.advance(1 / fps, 0.045, 0, 0, pose);
      const s = state(i / fps, 0, 'right');
      Object.assign(s, { phase: gait.phase, pectoralPhase: gait.pectoralPhase, effort: gait.effort, drive: 0.045, scull: gait.scull, tuck: gait.tuck });
      s.body.update(gait.phase, gait.effort, 0, gait.breathPhase);
      fin.advance(1 / fps, s);
      if (i > fps * 5) trace.push(edgeMean(fin, 2));
    }
    assert.equal(fin.metrics().anchorError, 0);
    assert.ok(fin.metrics().maxRayStrain < 0.15, JSON.stringify(fin.metrics()));
    const mean = trace.reduce((a, b) => a + b, 0) / trace.length;
    let crossings = 0;
    for (let i = 1; i < trace.length; i++) if ((trace[i - 1] - mean) * (trace[i] - mean) < 0) crossings++;
    return { gait, mean, swing: Math.max(...trace) - Math.min(...trace), hz: crossings / 2 / (trace.length / fps) };
  }
  const idle = pectoral({}), scull = pectoral({ scull: 1 }), tucked = pectoral({ tuck: 1 });
  // Sculling differs from idle swimming by longer runs of beats, not by a bigger fin: the swing must not shrink or grow much.
  assert.ok(scull.swing > idle.swing * 0.8 && scull.swing < idle.swing * 1.3, `sculling swing ${scull.swing} vs idle ${idle.swing}`);
  for (const { hz } of [idle, scull]) assert.ok(hz > 1 && hz < 3.5, `beats at ${scull.hz} Hz, idle ${idle.hz}`);
  // The tuck draws the fins in and stills them, but gently: a deep fold reads as the fin changing size.
  assert.ok(tucked.mean < idle.mean - 0.01, `tucked mean ${tucked.mean} vs ${idle.mean}`);
  assert.ok(tucked.swing < idle.swing * 0.6, 'a tucked fin beats much less');
  // The beats themselves: about 1.5-3 Hz, each at its own rate, in runs with rests of up to a
  // second or so between them, the runs longer while sculling; never a steady clock.
  for (const [pose, most] of [[{ scull: 1 }, 0.25], [{}, 0.4]]) {
    const gait = new SwimGait(), beats = [], rests = [];
    let last = null, resting = 0;
    for (let i = 1; i <= 60 * 120; i++) {
      const was = Math.floor(gait.pectoralPhase / (Math.PI * 2)), paused = gait.pectoralPause > 0;
      gait.advance(1 / 60, 0.045, 0, 0, pose);
      if (gait.pectoralPause > 0) resting += 1 / 60; else if (resting) { rests.push(resting); resting = 0; }
      if (paused) last = null;
      else if (Math.floor(gait.pectoralPhase / (Math.PI * 2)) !== was) { if (last !== null) beats.push(i / 60 - last); last = i / 60; }
    }
    beats.sort((a, b) => a - b);
    const at = q => beats[Math.floor(q * (beats.length - 1))], share = rests.reduce((a, b) => a + b, 0) / 120;
    assert.ok(1 / at(0.5) > 1.5 && 1 / at(0.5) < 3, `median beat ${1 / at(0.5)} Hz`);
    assert.ok(at(0.9) / at(0.1) > 1.4, `beats too even: ${at(0.1)}..${at(0.9)} s`);
    assert.ok(Math.max(...rests) > 0.6 && Math.max(...rests) < 1.4 && share > 0.05 && share < most, `rests up to ${Math.max(...rests)} s, ${share} of the time`);
  }
  const quick = new SwimGait(); for (let i = 0; i < 6; i++) quick.advance(1 / 60, 0.045, 0, 0, { tuck: 1 });
  assert.ok(quick.tuck > 0.15 && quick.tuck < 0.5, `the tuck accelerates into the fold instead of snapping (${quick.tuck})`);
  for (let i = 0; i < 24; i++) quick.advance(1 / 60, 0.045, 0, 0, { tuck: 1 });
  assert.ok(quick.tuck > 0.9, 'the tuck is closed within about half a second');
  for (let i = 0; i < 180; i++) quick.advance(1 / 60, 0.045, 0, 0, {});
  assert.ok(quick.tuck < 0.05 && quick.scull === 0, 'it opens again afterwards');
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
test('partly open resting tail flares over one second, closes again and keeps ray lengths at 30/60/120fps', async () => {
  const { DisplayMotion } = await import('./src/display-motion.js');
  const span = f => { const ys=[]; for(let n=1;n<f.position.length;n+=3) ys.push(f.position[n]);return Math.max(...ys)-Math.min(...ys); };
  for (const fps of [30, 60, 120]) {
    const f=make(), display=new DisplayMotion(), s=state(0);
    s.body.update(0,0,0,0);s.drive=0;s.phase=0;
    const advance = seconds => {for(let i=0;i<Math.round(seconds*fps);i++){display.advance(1/fps);s.flare=display.flare;f.advance(1/fps,s)}};
    advance(1);const relaxed=span(f);display.requested=true;advance(.267);const early=span(f);advance(.733);const atOneSecond=span(f);advance(1);const open=span(f);
    // (At rest the halfmoon's fan is already most of a D: the display opens the last of it.)
    assert.ok(open>relaxed*1.06 && open<relaxed*1.6, `${fps}: fan lacks contrast (${relaxed} -> ${open})`);
    assert.ok((early-relaxed)/(open-relaxed)<.35, `${fps}: still flares in a quarter-second`);
    assert.ok((atOneSecond-relaxed)/(open-relaxed)>.85, `${fps}: not open after one second`);
    display.requested=false;advance(.4);assert.ok(span(f)<relaxed+(open-relaxed)*.3, `${fps}: relaxation too slow`);
    const before=f.position.slice(),held=display.flare;display.requested=true;display.advance(0);f.advance(0,s);assert.equal(display.flare,held);assert.deepEqual(f.position,before);
    advance(1);assert.equal(f.metrics().anchorError,0);assert.ok(f.metrics().maxRayStrain<.07);
  }
});

test('eye gaze has quiet fixations, short glances, bounded synchronized motion and pause', async () => {
  const { EyeMotion } = await import('./src/display-motion.js');
  const left=new EyeMotion(),right=new EyeMotion(),trace=[];
  // (Twenty seconds: a fixation may last several.)
  for(let i=0;i<2400;i++) {left.advance(1/120);right.advance(1/120);trace.push([left.yaw,left.pitch,right.yaw,right.pitch]);}
  assert.ok(Math.max(...trace.map(p=>p[0]))-Math.min(...trace.map(p=>p[0]))>.15,'gaze is static');
  assert.ok(trace.every(p=>Math.abs(p[0])<=.24&&Math.abs(p[2])<=.24&&Math.abs(p[1])<=.13&&Math.abs(p[3])<=.13));
  const changes=trace.slice(1).map((p,i)=>Math.hypot(p[0]-trace[i][0],p[1]-trace[i][1]));
  assert.ok(changes.filter(v=>v<.0001).length>changes.length*.65,'eyes continually rolling instead of fixating');
  assert.ok(Math.max(...changes)>.01&&Math.max(...changes)<.08,'glance should be brief but not teleport');
  assert.ok(trace.every(p=>p[0]===p[2]&&p[1]===p[3]),'eyes must share glance direction and timing');
  const frozen=[left.time,left.yaw,left.pitch];left.advance(0,1,1);assert.deepEqual([left.time,left.yaw,left.pitch],frozen);
  // Glances come at uneven times, not on a clock.
  const starts=[];for(let i=1;i<changes.length;i++)if(changes[i]>=.0001&&changes[i-1]<.0001)starts.push(i/120);
  const gaps=starts.slice(1).map((t,i)=>t-starts[i]);
  assert.ok(gaps.length>=4&&Math.max(...gaps)>Math.min(...gaps)*2,`glances every ${gaps.map(g=>g.toFixed(2))} s`);
});


test('turns curl the trunk in either direction without widening straight swimming or stretching the spine', () => {
  const body=new BodyMotion(), point=[];
  for (const direction of [-1,1]) {
    body.update(0,0,direction*1.4,0);
    body.frame(1.056,point);
    const angle=Math.atan2(point[3],point[2]);
    assert.ok(angle*direction>2.2 && angle*direction<2.6, `turn too rigid or folded: ${angle}`);
    body.frame(-1.22,point);assert.deepEqual(point,[-1.22,0,1,0]);
    let length=0;
    for(let i=4;i<body.data.length;i+=4)length+=Math.hypot(body.data[i]-body.data[i-4],body.data[i+1]-body.data[i-3]);
    assert.ok(Math.abs(length-3.87)<.002, `turn stretched centerline: ${length}`);
  }
  body.update(0,0,0,0);body.frame(1.056,point);
  assert.ok(Math.abs(point[1])<.01,'holding retained a turn curve');
  body.update(0,0,100,0);body.frame(1.056,point);
  assert.ok(Math.atan2(point[3],point[2])<3.0,'extreme input overfolded body');
});

test('turning long fins cup with the trunk, retain free-edge lag, and recover at 30/120fps', () => {
  for(const fps of [30,120])for(const kind of [0,1,2]) {
    const fin=kind===0?make():new FinDynamics({kind,side:0,columns:17,rows:13,
      point:(u,v)=>[-.65+u*1.65,(kind===1?1:-1)*(.28+v*(.25+u*.7)),0]});
    const s=state(0);s.drive=0;s.phase=0;s.flare=0;s.body.update(0,0,0,0);
    for(let i=0;i<fps*3;i++)fin.advance(1/fps,s);
    const rest=fin.position.slice();let peakLag=0,peakCurve=0;
    for(let i=1;i<=fps*2;i++) {
      const t=i/fps;s.turn=1.4*Math.sin(Math.PI*t/2);s.angularVelocity=s.turn;
      s.body.update(0,0,s.turn,0);fin.advance(1/fps,s);
      const q=((fin.rows-1)*fin.columns+Math.floor(fin.columns/2))*3;
      peakCurve=Math.max(peakCurve,Math.abs(fin.position[q+2]-rest[q+2]));
      peakLag=Math.max(peakLag,Math.hypot(...[0,1,2].map(k=>fin.position[q+k]-fin.target[q+k])));
      assert.equal(fin.metrics().anchorError,0);
      assert.ok(fin.metrics().maxRayStrain<.07);
      assert.ok(fin.position.every(Number.isFinite));
    }
    assert.ok(peakCurve>.2,`${fps}fps fin ${kind} did not follow turn: ${peakCurve}`);
    assert.ok(peakLag>.015,`${fps}fps fin ${kind} is a rigid fan: ${peakLag}`);
    s.turn=0;s.angularVelocity=0;s.body.update(0,0,0,0);
    for(let i=0;i<fps*5;i++)fin.advance(1/fps,s);
    const rms=Math.sqrt(fin.position.reduce((sum,v,i)=>sum+(v-rest[i])**2,0)/rest.length);
    assert.ok(rms<.035,`${fps}fps fin ${kind} failed to settle: ${rms}`);
  }
});

test('external solver flow overrides the artistic current and reverses membrane drag', () => {
  const forward = make(), backward = make();
  for (let i = 1; i <= 240; i++) {
    const s = state(i / 60, 0, 'changing');
    forward.advance(1 / 60, { ...s, externalFlow: [0, 0, 0.8] });
    backward.advance(1 / 60, { ...s, externalFlow: [0, 0, -0.8] });
  }
  assert.ok(edgeMean(forward, 2) - edgeMean(backward, 2) > 0.1);
  assert.equal(forward.metrics().anchorError, 0);
  assert.equal(backward.metrics().anchorError, 0);
});

test('each node is kept as the body carried it, with the update it was carried at, for the host', () => {
  for (const kind of [0, 3, 4]) {
    const fin = make(kind, kind > 2 ? 1 : 0), body = new BodyMotion();
    const s = { ...state(0), body };
    for (let i = 1; i <= 90; i++) {
      body.update(i / 60 * 2.8, 0.3, 0.2, i / 60 * 4.5);
      fin.advance(1 / 60, { ...s, time: i / 60 });
      assert.equal(fin.carriedBy, body);
      assert.equal(fin.carriedAt, body.revision);
    }
    const out = [0, 0, 0, 0];
    for (let n = 0; n < fin.count; n++) {
      body.transform(fin.rest[n * 3], fin.rest[n * 3 + 1], fin.rest[n * 3 + 2], out);
      for (let k = 0; k < 3; k++) assert.ok(Object.is(fin.carried[n * 3 + k], out[k]), `fin ${kind}, node ${n}`);
    }
    // A frame with no step keeps the last displacement, and says it was carried before this update.
    body.update(3, 0.3, 0.2, 2);
    fin.advance(0, { ...s, time: 1.5 });
    assert.notEqual(fin.carriedAt, body.revision);
  }
});
