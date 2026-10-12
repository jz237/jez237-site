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
patch(
  'Weatherglass could not start: ',
  'Jurassic Terrarium could not start: ',
  'fatal message',
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
// to tree ferns, cycads, ferns and horsetails planted by dinos.js. Conifers and shrubs stay.
patch(
  'u(-3.95,.25,Re.oak,1.3,.64,.5),u(-3.75,2.4,Re.cherry,.8,.47,.35),u(3.3,.35,Re.cherry,.74,.44,.45),u(-4.95,1.5,Re.birch,1.2,.3,.4);',
  '',
  'hero broadleaf trees',
);
patch('broad:e.pick(11,16,20)', 'broad:0', 'broadleaf count');
patch('h=FC(e.pick(2e4,6e4,12e4),l,c)', 'h=FC(e.pick(9e3,26e3,52e3),l,c)', 'grass count');
patch('const f=NC(e.pick(1800,3500,7e3),l,c)', 'const f=NC(e.pick(250,500,1e3),l,c)', 'flower count');

// The T. rex den: a level shelf cut into the foot of the right-hand peak, under the rock overhang that
// dinos.js places there. The terrain function is shared by the mesh bake, water, planting and routing,
// so everything agrees about the new ground. DEN must match DEN in runtime/main.js.
const DEN = { x: 4.4, z: -1.7, hx: 0.95, hz: 0.75, y: 0.72 };
patch('h=(w,y,_,M,A)=>!(!a(w,y,M)||', 'h=(w,y,_,M,A)=>!(!a(w,y,M)||window.__jtDenAt&&window.__jtDenAt(w,y,M)||', 'no trees in the den');
patch('function We(r,t){let e=zp(r,t);', 'function We(r,t){let e=zp(r,t);window.__jtCave&&(e=window.__jtCave(r,t,e));', 'den shelf');

// Hold the veil while dinos.js loads its models. The hold is set before the bundle runs.
patch(
  '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
  '<link rel="icon" href="favicon.svg" type="image/svg+xml"><script>window.__wgHold=1</script>',
  'hold flag',
);
patch(
  '<script>window.__wgHold=1</script>',
  `<script>window.__wgHold=1</script><script>window.__jtDen=${JSON.stringify(DEN)};window.__jtCave=function(x,z,e){` +
    `var d=window.__jtDen,u=Math.abs(x-d.x)/d.hx,v=Math.abs(z-d.z)/d.hz;` +
    `function s(a,b,t){t=Math.min(1,Math.max(0,(t-a)/(b-a)));return t*t*(3-2*t)}` +
    `var m=(1-s(0.75,1.3,u))*(1-s(0.75,1.3,v));return e+(d.y-e)*m};` +
    `window.__jtDenAt=function(x,z,r){var d=window.__jtDen;r=r||0;` +
    `return Math.abs(x-d.x)<1.55+r&&z>d.z-1.7-r&&z<d.z+0.95+r}</script>`,
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
