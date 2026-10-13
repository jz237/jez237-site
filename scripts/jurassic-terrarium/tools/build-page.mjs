// Builds demos/jurassic-terrarium/index.html from the original Weatherglass page.
//
// Weatherglass is a single minified file, so every change is an exact-string patch that must
// match once; the build fails loudly if the source ever changes under it. The patches only:
//   - rename the page and its loading veil,
//   - let a later module script join the simulation (window.__wg.addModule),
//   - hold the loading veil until the dinosaurs have loaded (window.__wgHold),
//   - load dinos.js after the main bundle.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../..');
const src = join(repo, 'demos/weatherglass/index.html');
const outDir = join(repo, 'demos/jurassic-terrarium');
mkdirSync(outDir, { recursive: true });

let html = readFileSync(src, 'utf8');

function patch(from, to, label) {
  const n = html.split(from).length - 1;
  if (n !== 1) throw new Error(`patch "${label}": expected 1 match, found ${n}`);
  html = html.replace(from, () => to);
}

const TITLE = 'Jurassic Terrarium — a miniature dinosaur world under glass';
const DESC =
  'A miniature prehistoric world sealed in a glass case: Brachiosaurus, Triceratops, Stegosaurus, Tyrannosaurus and Pteranodon live under weather you control.';

patch('<title>Weatherglass — Weather Terrarium</title>', `<title>${TITLE}</title>`, 'title');
patch(
  '<meta name="description" content="A miniature living landscape sealed in a glass box. Grab clouds, squeeze out rain, blow wind, build storms, move the sun and turn the seasons.">',
  `<meta name="description" content="${DESC}">`,
  'description',
);
patch(
  '<div class="veil-title">Weatherglass</div><div class="veil-sub">sealing the atmosphere…</div>',
  '<div class="veil-title">Jurassic Terrarium</div><div class="veil-sub">hatching the Mesozoic…</div>',
  'veil',
);
// When the browser will not give us WebGL 2 at all (most often Chrome blocking it on the page after the
// GPU ran out of memory on an earlier visit), phones and tablets say so in plain words, with what to do,
// instead of three.js's raw "Error creating WebGL context". Desktop and other errors keep the plain message.
patch(
  't.textContent="Weatherglass could not start: "+r.message',
  '(/WebGL/.test(r.message)&&window.__jtNoGL&&window.__jtNoGL(t)||(t.textContent="Jurassic Terrarium could not start: "+r.message))',
  'fatal message',
);
// A lost WebGL context used to reload the page as soon as the browser restored it. When the loss came
// from running out of graphics memory, the reload ran out again: a loop that ends with Chrome blocking
// WebGL on the page. Now, on phones and tablets only, the page stops and offers a reload or a lighter reload
// (low quality, small skins). Desktop keeps the old reload-on-restore unchanged.
patch(
  'r.addEventListener("webglcontextlost",T=>{T.preventDefault()},!1),r.addEventListener("webglcontextrestored",()=>location.reload(),!1)',
  'r.addEventListener("webglcontextlost",T=>{T.preventDefault(),t.mobile&&window.__jtLost&&window.__jtLost()},!1),r.addEventListener("webglcontextrestored",()=>{t.mobile||location.reload()},!1)',
  'no reload loop on context loss',
);

// On-screen names: the HUD title, the brass plaque on the case, and the coach-mark storage key.
patch('At("div",{class:"wg-title",text:"Weatherglass"})', 'At("div",{class:"wg-title",text:"Jurassic Terrarium"})', 'hud title');
patch(
  'p.font=`700 ${Math.round(t*.5)}px ${f}`,p.textAlign="center",p.textBaseline="middle","letterSpacing"in p&&(p.letterSpacing=`${Math.round(t*.12)}px`),p.fillText("WEATHERGLASS",1024/2+("letterSpacing"in p?t*.06:0),t*.53)',
  'p.font=`700 ${Math.round(t*.36)}px ${f}`,p.textAlign="center",p.textBaseline="middle","letterSpacing"in p&&(p.letterSpacing=`${Math.round(t*.07)}px`),p.fillText("JURASSIC TERRARIUM",1024/2+("letterSpacing"in p?t*.035:0),t*.53)',
  'plaque',
);
patch('R1="weatherglass.coach.v1"', 'R1="jurassic-terrarium.coach.v1"', 'coach key');

// Jurassic planting: Weatherglass's oak, birch and cherry trees and most of its flowers and grass give way
// to tree ferns, cycads, ferns, red rosettes and horsetails planted by dinos.js. Fewer conifers.
patch(
  'u(-3.95,.25,Re.oak,1.3,.64,.5),u(-3.75,2.4,Re.cherry,.8,.47,.35),u(3.3,.35,Re.cherry,.74,.44,.45),u(-4.95,1.5,Re.birch,1.2,.3,.4);',
  '',
  'hero broadleaf trees',
);
patch('broad:e.pick(11,16,20)', 'broad:0', 'broadleaf count');
patch('h=FC(e.pick(2e4,6e4,12e4),l,c)', 'h=FC(e.pick(3e3,8e3,16e3),l,c)', 'grass count');
patch('const f=NC(e.pick(1800,3500,7e3),l,c)', 'const f=NC(e.pick(80,160,320),l,c)', 'flower count');
patch('pine:e.pick(16,24,30)', 'pine:e.pick(9,13,16)', 'fewer pines');

// The T. rex den: a level shelf cut into the foot of the right-hand peak, under the rock overhang that
// dinos.js places there. The terrain function is shared by the mesh bake, water, planting and routing,
// so everything agrees about the new ground. DEN must match DEN in runtime/main.js.
const DEN = { x: 5.4, z: -1.55, hx: 1.25, hz: 0.95, y: 0.66, s: 1 / 6.2 };
// Footpaths (x, z): cabin door -> jetty, and a branch from it over the stream on stepping stones to the
// cave. runtime/paths.js builds them from window.__jtPath; planting keeps PATH_HALF (+ its radius) off.
const PATHS = [
  [[-2.62, 1.66], [-2.4, 2.02], [-1.85, 2.24], [-1.25, 2.3], [-0.7, 2.44], [-0.3, 2.47], [0.0, 2.43]],
  [[-1.25, 2.3], [-0.85, 1.95], [-0.35, 1.62], [0.25, 1.42], [0.75, 1.2], [1.3, 0.92], [1.95, 0.62], [2.6, 0.42],
    [3.3, 0.28], [3.95, 0.12], [4.55, -0.12], [5.05, -0.36], [5.38, -0.5]],
];
const PATH_HALF = 0.09;
patch('h=(w,y,_,M,A)=>!(!a(w,y,M)||', 'h=(w,y,_,M,A)=>!(!a(w,y,M)||window.__jtDenAt&&window.__jtDenAt(w,y,M)||window.__jtPathAt&&window.__jtPathAt(w,y,M*.5)||', 'no trees in the den');
// Jurassic rock: the concept's mountains are dark volcanic stone thick with moss on every ledge and
// upward face (moss rule after the reptile terrarium's rocks), not pale alpine limestone
patch(
  `    ao = mix(1.0, rAO, rockM);
  }`,
  `    ao = mix(1.0, rAO, rockM);
    float jMoss = smoothstep(0.5, 0.72, smoothstep(0.2, 0.8, nG.y) * 0.75 + (n3 * 0.6 + nC * 0.4) * 0.55);
    vec3 jDark = rock * vec3(0.5, 0.48, 0.45);
    vec3 jMossC = mix(vec3(0.1, 0.16, 0.045), vec3(0.2, 0.28, 0.08), nD) * (0.8 + 0.4 * nC);
    col = mix(col, mix(jDark, jMossC, jMoss), rockM);
    rough = mix(rough, mix(0.84, 0.96, jMoss), rockM);
  }`,
  'mossy dark rock',
);
// Tiered cascades, as in the concept: below the waterfall's plunge pool the river no longer slides
// gently to the lake; it steps down in three short cascades between calm pools, the last dropping into
// the front pool. Each spline segment eases in and out, so a short, steep segment between long, flat
// ones is a cascade. The terrain carves its bed to the spline, so the channel steps with it.
patch(
  'In=[{x:-1.8,z:-2.35,y:2.2},{x:-1.55,z:-1.72,y:2.02},{x:-1.35,z:-1.22,y:.98},{x:-.7,z:-.55,y:.66},{x:-.05,z:.25,y:.46},{x:.75,z:.8,y:.3},{x:1.5,z:1.5,y:.16},{x:2.15,z:2.1,y:.06}]',
  'In=[{x:-1.8,z:-2.35,y:2.2},{x:-1.55,z:-1.72,y:2.02},{x:-1.35,z:-1.22,y:.98},{x:-1.12,z:-.98,y:.95},{x:-.95,z:-.78,y:.7},' +
    '{x:-.45,z:-.2,y:.64},{x:-.28,z:0,y:.42},{x:.45,z:.62,y:.36},{x:.62,z:.78,y:.17},{x:1.5,z:1.5,y:.12},{x:2.15,z:2.1,y:.06}]',
  'tiered cascades',
);
// the scattered boulders too: dark basalt with moss on their tops, as in the concept's jungle floor
patch(
  `TRock tR = rockSurface(vRPos, normalize(vRNrm), vRLoc, vRock, vRock2);
        diffuseColor.rgb = tR.albedo;`,
  `TRock tR = rockSurface(vRPos, normalize(vRNrm), vRLoc, vRock, vRock2);
        float jrMoss = smoothstep(0.45, 0.7, smoothstep(0.1, 0.75, tR.n.y) * 0.75 + wgNoise(vRPos.xz * 9.0 + vRLoc.y * 3.0) * 0.55);
        vec3 jrMossC = mix(vec3(0.1, 0.16, 0.045), vec3(0.2, 0.28, 0.08), wgNoise(vRPos.xz * 31.0));
        diffuseColor.rgb = mix(tR.albedo * vec3(0.55, 0.53, 0.5), jrMossC, jrMoss);`,
  'mossy boulders',
);
// A warm, humid Mesozoic jungle: spring and autumn are tropical (winter keeps its snow), and the case
// opens in early summer, so Weatherglass's own fireflies, butterflies and insects come out
patch('seasonBase:[12,24,10,-7]', 'seasonBase:[21,27,22,-7]', 'tropical seasons');
patch('class bE{constructor(){this.season=.25,', 'class bE{constructor(){this.season=.85,', 'opens in summer');
patch('calm(r){const{world:t}=r;t.season=.25,', 'calm(r){const{world:t}=r;t.season=.85,', 'calm is summer');
// Settle, then lock the resolution. Weatherglass re-tuned it every 0.75 s with a 1.2 s cool-down, so on a
// machine near its 50/58 fps thresholds it kept resizing the canvas: every change re-renders the whole
// picture at a new sharpness, with the glow and soft-focus rebuilt, which reads as a flash. Now: nothing
// for the first 5 s after the veil lifts (shaders and textures are still warming up then), small steps
// only on two low readings in a row until 20 s, then it holds; afterwards only an emergency (below
// 26 fps for 6 s) lowers it. Never below 0.75 on medium/high tiers (lower aliases badly), never back up,
// and the glow and soft focus are never switched off.
patch(
  "sample(t){if(!this.adaptive||t>.5||(this._acc+=t,this._frames++,this._cool-=t,this._acc<.75))return;const e=this._frames/this._acc;if(this._acc=0,this._frames=0,this._cool>0)return;let i=this.dpr;e<50?i=Math.max(this.minDpr,this.dpr*(e<35?.8:.9)):e>58&&this.dpr<this.maxDpr&&(i=Math.min(this.maxDpr,this.dpr*1.06)),Math.abs(i-this.dpr)>.01&&(this.dpr=i,this._cool=1.2,this.onChange?.(this.dpr)),e<45&&this.dpr<=this.minDpr+.01?++this._lowStreak>=3&&this.postLevel>0&&(this.postLevel--,this._lowStreak=0,this._cool=2,this.onPostLevel?.(this.postLevel)):this._lowStreak=0}",
  "sample(t){if(!this.adaptive||t>.5)return;if(!document.body.classList.contains(\"ready\"))return;this._age=(this._age||0)+t;if(this._age<5)return;this._acc+=t;this._frames++;this._cool-=t;if(this._acc<2)return;const e=this._frames/this._acc;this._acc=0;this._frames=0;if(this._cool>0)return;const floor=this.tier>0?Math.max(this.minDpr,Math.min(.75,this.maxDpr)):this.minDpr;const settled=this._age>20;this._lo=e<44?(this._lo||0)+1:0;this._vlo=e<26?(this._vlo||0)+1:0;let i=this.dpr;if(!settled){this._lo>=2&&(i=Math.max(floor,this.dpr*.9),this._lo=0)}else if(this._vlo>=3){i=Math.max(floor,this.dpr*.88);this._vlo=0}if(Math.abs(i-this.dpr)>.01){this.dpr=i;this._cool=2;this.onChange?.(this.dpr)}}",
  'settle-then-lock resolution governor',
);
// gentler film grain: it is redrawn every frame, and at reduced resolution it crawls like static
patch('uVignette:{value:.32},uGrain:{value:.035}', 'uVignette:{value:.32},uGrain:{value:.014}', 'gentle grain');
// The pool's mirror reflection was refreshed only every 2 frames while the view moved and every 4-5
// when it was still, at a resolution and margin that changed with the view: everything reflected in the
// pool (swaying planting, walking animals, clouds) moved in jerky steps and the reflection popped
// between sharpnesses: the water flickered. Now on medium/high it is redrawn every frame at a fixed
// scale and margin. And the sun glitter twinkles slower and less hot, so it no longer strobes the glow.
patch('this.fastEvery=n.pick(2,2,1),this.slowEvery=n.pick(5,4,3)', 'this.fastEvery=n.pick(2,1,1),this.slowEvery=n.pick(3,1,1)', 'mirror every frame');
patch('const m=.04+(f?.05:.02);', 'const m=.09;', 'mirror margin fixed');
patch('M=Math.min(this.maxScale,Math.sqrt(_/Math.max(w*y,1)))', 'M=this.maxScale', 'mirror scale fixed');
patch('float tw = wgHash(gc + floor(uTime * 5.0 + wgHash(gc) * 5.0) * 0.731);', 'float tw = wgHash(gc + floor(uTime * 1.2 + wgHash(gc) * 5.0) * 0.731);', 'slower glitter twinkle');
patch('float k = (g * 5.0 * fade + pdf * 1.1) * F * amount;', 'float k = (g * 1.8 * fade + pdf * 1.1) * F * amount;', 'softer glitter');
// A shallower substrate, as in the Terramundi reference: the case floor is raised (bottomY -0.42) and the
// pool made shallower to fit; the cut-away reads topsoil with hanging roots, loam, a clay band and a bed of
// rounded pebbles at the bottom (bedrock only shows under the mountains)
patch('De={cx:2.75,cz:2.65,rx:2.35,rz:1.75,bottomY:-.85}', 'De={cx:2.75,cz:2.65,rx:2.35,rz:1.75,bottomY:-.34}', 'shallower pool');
patch('float yRock = mix(-0.98 + w3 * 0.22, S - 0.13 - abs(w1) * 0.12, m);', 'float yRock = mix(-0.64 + w3 * 0.08, S - 0.13 - abs(w1) * 0.12, m);', 'bedrock below the floor');
patch('float yLoam = min(max(-0.16 + (S - 0.6) * 0.5 + w2 * 0.12 + w4 * 0.02, yRock), yTop - 0.02);', 'float yLoam = min(max(-0.02 + (S - 0.6) * 0.4 + w2 * 0.06 + w4 * 0.015, yRock), yTop - 0.02);', 'loam higher');
patch('float yClay = min(max(yLoam - (0.16 + w1 * 0.06 + w3 * 0.05), yRock), yLoam);', 'float yClay = min(max(yLoam - (0.09 + w1 * 0.03 + w3 * 0.03), yRock), yLoam);', 'thinner clay');
patch('float yGrav = min(max(-0.9 + (S - 0.6) * 0.15 + w3 * 0.2 + w1 * 0.04, yRock), yClay);', 'float yGrav = min(max(-0.6, yRock), yClay);', 'pebble bed at the bottom');
// gravel fills everything from the clay down to the floor (it lies above yGrav; bedrock below it is
// pushed under the floor), the stones rounder and larger, shaded as domes
patch('vec3 gc = tCell(q * vec2(8.0, 10.5), toF);', 'vec3 gc = tCell(q * vec2(7.0, 7.6), toF);', 'rounder pebbles');
patch('vec3 gravel = mix(mix(grit, stone, gIn), cobble, cIn);', 'vec3 gravel = mix(mix(grit, stone * (0.5 + 0.65 * gDome), gIn), cobble * (0.5 + 0.65 * cDome), cIn);', 'domed pebbles');
patch(`    roots = max(tRoots(u, d - rimB, 22.0, 0.75, mix(0.34, 0.12, m), 0.0045, fw),
                tRoots(u + 7.3, d - rimB, 7.0, 0.45, mix(0.5, 0.16, m), 0.009, fw)) * rootZone;`, `    roots = max(max(tRoots(u, d - rimB, 26.0, 0.85, mix(0.3, 0.12, m), 0.0045, fw),
                tRoots(u + 7.3, d - rimB, 9.0, 0.6, mix(0.42, 0.16, m), 0.009, fw)),
                tRoots(u + 3.1, d - rimB, 4.0, 0.5, mix(0.5, 0.2, m), 0.014, fw)) * rootZone;`, 'more hanging roots');
patch('function We(r,t){let e=zp(r,t);', 'function We(r,t){let e=zp(r,t);window.__jtCave&&(e=window.__jtCave(r,t,e));', 'den shelf');

// The cabin's chimney smoke follows the wind harder: carried closer to the wind's own speed, laid
// down flatter as the wind strengthens (rising slower against it), and torn ragged by gusts.
patch('const v=.55+.45*Math.min(1,d*3),g=(1.1+d*1.5)*t;', 'const v=(.6+.55*Math.min(1,d*3))*1.25,g=(1.4+d*1.8)*t;', 'smoke carried by the wind');
patch('const x=(.36*(1-d)+.07)*(.7+e.fire*.5)-e.rain*.12;', 'const x=((.36*(1-d)+.07)*(.7+e.fire*.5)-e.rain*.12)/(1+.9*Math.hypot(Kf.x,Kf.z));', 'smoke laid down by the wind');
patch('_=(.12+d*.25)*t;', '_=(.12+d*.25)*(1+1.6*Math.min(1.5,Math.hypot(Kf.x,Kf.z)))*t;', 'smoke torn by gusts');
// Meteors at night made the whole screen flicker: the streak's fragment shader raised vT (interpolated,
// so a hair below 0 at the tail) to a power, a NaN, which the bloom spread over the whole frame (black
// frames while one crossed). Clamp it, and keep the streak's direction defined at launch.
patch('float a = pow(vT, 2.2) * exp(-vSide * vSide * 3.0) * uAlpha;', 'float a = pow(clamp(vT, 0.0, 1.0), 2.2) * exp(-vSide * vSide * 3.0) * uAlpha;', 'meteor NaN');
patch('vec3 dir = normalize(uHead - uTail);\n  vec3 toCam', 'vec3 dir = normalize(uHead - uTail + vec3(1e-4, 0.0, 0.0));\n  vec3 toCam', 'meteor direction');
// Game trails (runtime/trails.js keeps the map): a shared trample texture every Weatherglass shader can
// read; the grass lies flat and short where the animals keep walking, and the ground wears to bare earth.
patch('const ke={uTime:{value:0},', 'const ke={uJtTrample:{value:null},uTime:{value:0},', 'trample uniform');
patch('vec2 fieldUV(vec2 xz) { return clamp((xz - uFieldMin) / uFieldSize, 0.0, 1.0); }',
  'vec2 fieldUV(vec2 xz) { return clamp((xz - uFieldMin) / uFieldSize, 0.0, 1.0); }\nuniform sampler2D uJtTrample;\nfloat jtTrample(vec2 xz) { return texture2D(uJtTrample, fieldUV(xz)).r; }', 'trample lookup');
patch('  H *= 1.0 - 0.55 * snowFlat;\n  // drowned', '  H *= 1.0 - 0.55 * snowFlat;\n  float jtTr = jtTrample(aRoot.xz);\n  H *= 1.0 - 0.7 * jtTr; // trodden flat\n  // drowned', 'trodden grass');
patch('  float droop = aShape.w * (1.0 + snowFlat * 1.8 + G.y * 0.45);', '  float droop = aShape.w * (1.0 + snowFlat * 1.8 + G.y * 0.45 + jtTr * 3.0);', 'trodden grass droops');
patch('  float bareM = smoothstep(0.3, 0.62, D.b + (nB - 0.5) * 0.46 + (nC - 0.5) * 0.24) * (1.0 - rockM);',
  '  float bareM = max(smoothstep(0.3, 0.62, D.b + (nB - 0.5) * 0.46 + (nC - 0.5) * 0.24), smoothstep(0.3, 0.85, jtTrample(p.xz) + (nB - 0.5) * 0.25) * (1.0 - riverBed)) * (1.0 - rockM);', 'worn trails');
// The wind tool blows where the stroke is drawn on the ground, so a stroke drawn across the smoke in the
// air landed far behind the cabin, and the smoke, caught in the side-draught of that gust, went the other
// way. A stroke that passes over the plume now blows at the plume itself (window.__jtWindPick, weather.js).
patch('function l(c){return t.rayToTerrain(c)?(c.y+=.4,c):t.rayToPlaneY(1.2,c)}', 'function l(c){return window.__jtWindPick&&window.__jtWindPick(t.pointer.ray,c)?c:t.rayToTerrain(c)?(c.y+=.4,c):t.rayToPlaneY(1.2,c)}', 'wind at the smoke');
// In a wind the chimney puffs out faster and each puff swells and thins sooner, so the smoke streams
// off as one ribbon instead of separate balls (this._ws: the wind at the chimney, 0..1.6).
patch('_sim(t,e){if(t<=0)return;this.time+=t;const i=(2.2+e.fire*9)*(1-e.rain*.35);',
  '_sim(t,e){if(t<=0)return;this.time+=t;this.ctx.wind.sample(this.origin.x,this.origin.z,Kf,.4);this._ws=Math.min(1.6,Math.hypot(Kf.x,Kf.z))||0;const i=(2.2+e.fire*9)*(1-e.rain*.35)*(1+2.4*this._ws);', 'smoke puffs faster in wind');
patch('this.age[u]+=t;const d=this.age[u]/this.life[u];', 'this.age[u]+=t*(1+.9*this._ws);const d=this.age[u]/this.life[u];', 'smoke thins sooner in wind');
patch('p=this.s0[u]+(this.s1[u]-this.s0[u])*Math.sqrt(d),v=$(0,.05,d)*Math.pow(1-d,1.6)*this.dens[u];',
  'p=(this.s0[u]+(this.s1[u]-this.s0[u])*Math.sqrt(d))*(1+1.1*(this._ws||0)*Math.sqrt(d)),v=$(0,.05,d)*Math.pow(1-d,1.6)*this.dens[u]/(1+.45*(this._ws||0));', 'smoke swells in wind');

// The case: a long, low display cabinet (18 x 8 units under a lid at 5.6) instead of Weatherglass's
// tall 12 x 8 x 7.4 box. Everything in Weatherglass sizes itself from this one constant; the clouds'
// band drops to sit beside the peaks, and the camera fit frames the wider case.
if (!process.env.JT_TALL) {
  patch('N={halfW:6,halfD:4,bottomY:-1.8,topY:7.4,glass:.08}', 'N={halfW:9,halfD:4,bottomY:-0.42,topY:5.0,glass:.08}', 'wide case');
  patch('on={minY:4.5,maxY:6.5,defaultY:5.5}', 'on={minY:3.2,maxY:4.25,defaultY:3.75}', 'cloud band');
  patch('const i=12.5/(2*Math.tan(Mr.degToRad(e/2))*t);', 'const i=22.5/(2*Math.tan(Mr.degToRad(e/2))*t);', 'camera fit');
  patch('me={top:Ci.y0,coreW:6.36,', 'me={top:Ci.y0,coreW:9.36,', 'plinth width');
  patch('new C(-6.36-me.footOffset,me.bottom,-4.36-me.footOffset)', 'new C(-me.coreW-me.footOffset,me.bottom,-me.coreD-me.footOffset)', 'plinth hit box');
  // look at the cabinet from the front, a little above the lid line, as you would in a room
  patch('front:{theta:0,phi:1.2,radius:21,target:[0,1.6,0]}', 'front:{theta:0,phi:1.32,radius:21.6,target:[0,1.2,0]}', 'front view');
  patch('n.preset(ki.get("cam")||"hero",!0)', 'n.preset(ki.get("cam")||"front",!0)', 'default view');
}

// The messages shown when WebGL 2 is unavailable or the context is lost (see the patches above). The
// lighter link reloads with ?quality=low&skins=1024: the low tier and 1024 px dinosaur skins.
const GL_HELP =
  '<script>(function(){' +
  'function lite(){var u=new URL(location.href);u.searchParams.set("quality","low");u.searchParams.set("skins","1024");return u.href}' +
  'var B="display:inline-block;margin:12px 10px 0 0;padding:8px 14px;border-radius:8px;border:1px solid #ffd98a;color:#ffd98a;background:none;font:inherit;text-decoration:none;cursor:pointer";' +
  'function show(el,html){var v=document.getElementById("veil");v&&(v.style.display="none");el.innerHTML=html;el.style.width="min(420px,calc(100vw - 32px))";el.style.display="block";el.style.pointerEvents="auto"}' +
  'var M=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches&&navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<900;' +
  'window.__jtNoGL=function(el){if(!M)return!1;show(el,' +
  '"<b>3D graphics are switched off in this browser right now.</b><br>' +
  'Jurassic Terrarium needs WebGL 2. Browsers turn it off for a page after it runs out of graphics memory. ' +
  'Close the browser completely (on a phone, swipe it away from recent apps), open it again and reload, or try another browser.<br>' +
  '<a style=\\""+B+"\\" href=\\""+lite()+"\\">Reload the lighter version</a>");return!0};' +
  'window.__jtLost=function(){var el=document.getElementById("fatal");el&&show(el,' +
  '"<b>The 3D view stopped: the graphics chip ran out of memory.</b><br>' +
  'The lighter version uses smaller dinosaur skins and less detail.<br>' +
  '<a style=\\""+B+"\\" href=\\""+lite()+"\\">Reload the lighter version</a>' +
  '<a style=\\""+B+"\\" href=\\"javascript:location.reload()\\">Reload</a>")}' +
  '})()</script>';

// Hold the veil while dinos.js loads its models. The hold is set before the bundle runs.
patch(
  '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
  '<link rel="icon" href="favicon.svg" type="image/svg+xml"><script>window.__wgHold=1</script>' + GL_HELP,
  'hold flag',
);
patch(
  '<script>window.__wgHold=1</script>',
  `<script>window.__wgHold=1</script><script>window.__jtDen=${JSON.stringify(DEN)};window.__jtCave=function(x,z,e){` +
    `var d=window.__jtDen,u=Math.abs(x-d.x)/d.hx,v=Math.abs(z-d.z)/d.hz;` +
    `function s(a,b,t){t=Math.min(1,Math.max(0,(t-a)/(b-a)));return t*t*(3-2*t)}` +
    `var m=(1-s(0.75,1.3,u))*(1-s(0.75,1.3,v));return e+(d.y-e)*m};` +
    `window.__jtDenAt=function(x,z,r){var d=window.__jtDen;r=r||0;` +
    `return Math.abs(x-d.x)<d.hx*1.65+r&&z>d.z-d.hz*2.3-r&&z<d.z+d.hz*1.25+r};` +
    // the footpaths: control points, smoothed (Chaikin) into a winding line; __jtPathAt tells planting
    // (Weatherglass's and ours) to keep off them
    `window.__jtPath=${JSON.stringify(PATHS)};window.__jtPathLines=window.__jtPath.map(function(l){` +
    `for(var k=0;k<3;k++){var o=[l[0]];for(var i=0;i<l.length-1;i++){var a=l[i],c=l[i+1];` +
    `o.push([a[0]*.75+c[0]*.25,a[1]*.75+c[1]*.25],[a[0]*.25+c[0]*.75,a[1]*.25+c[1]*.75])}o.push(l[l.length-1]);l=o}return l});` +
    `window.__jtPathDist=function(x,z){var b=1e9;window.__jtPathLines.forEach(function(l){for(var i=0;i<l.length-1;i++){` +
    `var a=l[i],c=l[i+1],dx=c[0]-a[0],dz=c[1]-a[1],t=((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1);t=t<0?0:t>1?1:t;` +
    `var ex=a[0]+dx*t-x,ez=a[1]+dz*t-z,d=ex*ex+ez*ez;if(d<b)b=d}});return Math.sqrt(b)};` +
    `window.__jtPathAt=function(x,z,r){return window.__jtPathDist(x,z)<${PATH_HALF}+(r||0)}</script>`,
  'den terrain hook',
);
patch(
  '_===2&&(document.body.classList.add("ready"),S.ready=!0)',
  '_>=2&&!S.ready&&!(window.__wgHold>0)&&(document.body.classList.add("ready"),S.ready=!0)',
  'ready gate',
);

// window.__wg.addModule(name, Class[, before]): construct a module with the shared context and
// splice it into the update/render order, exactly like the built-in modules.
patch(
  'setVisible(T,R){for(const z of f.moduleObjects[T]||[])z.visible=R}};',
  'setVisible(T,R){for(const z of f.moduleObjects[T]||[])z.visible=R},' +
    'addModule(T,R,B="clouds"){const z=new Set(i.children),L=new R(f);f.modules[T]=L;' +
    'f.moduleObjects[T]=i.children.filter(k=>!z.has(k));let j=ud.findIndex(([k])=>k===B);' +
    'j<0&&(j=ud.length);ud.splice(j,0,[T,R]);L.resize?.(window.innerWidth,window.innerHeight);return L}};',
  'addModule',
);

// Load the dinosaur module after the main bundle (module scripts run in document order).
patch('</script>\n</body></html>', '</script>\n<script type="module" src="dinos.js"></script>\n</body></html>', 'dinos.js tag');

writeFileSync(join(outDir, 'index.html'), html);
for (const f of ['favicon.svg', 'THREE-LICENSE.txt']) copyFileSync(join(repo, 'demos/weatherglass', f), join(outDir, f));
console.log('wrote', join(outDir, 'index.html'), html.length, 'bytes');
