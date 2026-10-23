import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { createBetta, uniforms } from "./fish.js";
import { water, waterVelocity } from "./fin-dynamics.js";
import "./style.css";
const PI = Math.PI;
const $ = (s) => document.querySelector(s);
const small = () => innerWidth < 700;
let renderer;
try {
  renderer = new T.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    alpha: false,
  });
} catch (e) {
  $("#error").hidden = false;
  $("#loading").style.display = "none";
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, small() ? 1.7 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = T.SRGBColorSpace;
$("#stage").append(renderer.domElement);
const scene = new T.Scene();
scene.background = new T.Color("#07191b");
scene.fog = new T.FogExp2("#07191b", 0.035);
const camera = new T.PerspectiveCamera(31, innerWidth / innerHeight, 0.05, 70);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.enablePan = true;
controls.minDistance = 1.0;
controls.maxDistance = 16;
controls.maxPolarAngle = PI * 0.85;
controls.minPolarAngle = PI * 0.15;
controls.target.set(0.32, -0.12, 0);
const pmrem = new T.PMREMGenerator(renderer);
const envScene = new RoomEnvironment();
const env = pmrem.fromScene(envScene, 0.025);
scene.environment = env.texture;
scene.environmentIntensity = 0.25;
envScene.dispose();
pmrem.dispose();
const lights = {
  key: new T.DirectionalLight(0xe3ffe9, 1.35),
  rim: new T.DirectionalLight(0x79e8ff, 1.1),
  warm: new T.DirectionalLight(0xffd1b0, 0.35),
  fill: new T.HemisphereLight(0x8fcbd0, 0x102528, 0.45),
};
lights.key.position.set(-3, 5, 5);
lights.rim.position.set(2, 3, -4);
lights.warm.position.set(-5, -1, 2);
Object.values(lights).forEach((l) => scene.add(l));
const fish = createBetta();
scene.add(fish);
// The scene is a quietly lit body of water, not a fishbowl: depth, light and drifting motes.
const bg = new T.Mesh(
  new T.PlaneGeometry(45, 30),
  new T.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader:
      "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: `varying vec2 vUv;uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec2 p=vUv;float glow=exp(-length((p-vec2(.49,.56))*vec2(4.,3.))*2.);vec3 c=mix(vec3(.002,.006,.007),vec3(.009,.025,.025),glow);float shaft=0.;for(int i=0;i<5;i++){float x=.20+float(i)*.15+(p.y-.6)*.24+sin(time*.07+float(i))* .012;float w=.012+.014*(1.-p.y);shaft+=exp(-pow((p.x-x)/w,2.))*smoothstep(.1,.95,p.y)*.035;}c+=vec3(.35,.6,.48)*shaft;gl_FragColor=vec4(c,1.);}`,
  }),
);
bg.position.z = -7;
scene.add(bg);
// The water surface seen from below: a silvery rippled ceiling. Total internal
// reflection makes it a mirror at the oblique angles of this view; it is a
// shader-only approximation (it does not reflect the fish or other scene objects).
const surface = new T.Mesh(
  new T.PlaneGeometry(70, 50),
  new T.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
      time: { value: 0 },
      ripple: { value: -1 },
      ripplePos: { value: new T.Vector2() },
      fogColor: { value: scene.fog.color },
      fogDensity: { value: scene.fog.density },
    },
    vertexShader:
      "varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",
    fragmentShader: `varying vec3 vW;uniform float time,ripple,fogDensity;uniform vec2 ripplePos;uniform vec3 fogColor;
float wave(vec2 p){return sin(dot(p,vec2(1.3,.7))*2.1+time*.6)*.5+sin(dot(p,vec2(-.8,1.4))*3.3-time*.8)*.3+sin(dot(p,vec2(2.1,-1.1))*5.7+time*1.1)*.18+sin(dot(p,vec2(-2.7,-1.9))*9.1-time*1.5)*.1;}
void main(){
 vec2 p=vW.xz,e=vec2(.02,0.);
 vec2 g=vec2(wave(p+e.xy)-wave(p-e.xy),wave(p+e.yx)-wave(p-e.yx))/(.04);
 vec2 rv=p-ripplePos;float r=length(rv);float ring=0.;
 if(ripple>=0.){float front=ripple*.85,k=(r-front);float env=exp(-25.*k*k)*exp(-ripple*.7)*smoothstep(0.,.3,ripple);ring=sin(k*30.)*env;g+=normalize(rv+1e-4)*cos(k*30.)*env*7.;}
 vec3 n=normalize(vec3(g.x*.05,-1.,g.y*.05));
 vec3 v=normalize(cameraPosition-vW);
 float c=clamp(dot(n,v),0.,1.);
 float refl=smoothstep(.62,.78,sqrt(1.-c*c));
 float mottle=clamp(.5+.5*wave(p*1.7+vec2(time*.1,-time*.07)),0.,1.);
 vec3 mirror=vec3(.006,.020,.021)*(.7+2.4*pow(mottle,3.))+vec3(.010,.022,.020)*pow(1.-c,3.);
 vec3 window=vec3(.05,.15,.15)*(.7+.5*mottle);
 vec3 col=mix(window,mirror,refl)+vec3(.55,.8,.75)*max(ring,0.)*.05;
 float d=length(cameraPosition-vW);
 col=mix(col,fogColor,1.-exp(-fogDensity*fogDensity*d*d));
 // The ceiling dissolves into the dark water before it meets the backdrop plane.
 float far=smoothstep(-6.2,1.5,vW.z);
 gl_FragColor=vec4(col,.92*far);
}`,
  }),
);
// Drawn first among the transparents and writing depth, so dust above the water is
// hidden by the surface while dust and fins in front of it still show.
surface.renderOrder = -1;
surface.rotation.x = Math.PI / 2;
surface.position.y = fish.userData.gulp.surfaceY;
scene.add(surface);
let rippleAge = -1,
  rippled = false;
function stepSurface(dt, time) {
  const g = fish.userData.gulp;
  if (g.phase === "gulp" && !rippled) {
    rippled = true;
    rippleAge = 0;
    surface.material.uniforms.ripplePos.value.set(g.lip[0], g.lip[2]);
  } else if (g.phase === "none") rippled = false;
  if (rippleAge >= 0) {
    rippleAge += dt;
    if (rippleAge > 7) rippleAge = -1;
  }
  surface.material.uniforms.ripple.value = rippleAge;
  surface.material.uniforms.time.value = time;
}
let seed = 9273;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const n = small() ? 120 : 260;
const pos = new Float32Array(n * 3),
  sizes = new Float32Array(n),
  phase = new Float32Array(n);
for (let i = 0; i < n; i++) {
  pos[i * 3] = (rand() - 0.5) * 18;
  pos[i * 3 + 1] = (rand() - 0.5) * 12;
  pos[i * 3 + 2] = (rand() - 0.5) * 14 - 2;
  sizes[i] = 0.8 + rand() * 2.2;
  phase[i] = rand() * 6.28;
}
const dustGeo = new T.BufferGeometry();
dustGeo.setAttribute("position", new T.BufferAttribute(pos, 3));
dustGeo.setAttribute("size", new T.BufferAttribute(sizes, 1));
dustGeo.setAttribute("phase", new T.BufferAttribute(phase, 1));
const dustMat = new T.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: { time: { value: 0 }, ratio: { value: renderer.getPixelRatio() } },
  vertexShader: `attribute float size;attribute float phase;uniform float time;uniform float ratio;varying float fade;void main(){vec3 p=position;p.y=mod(p.y+6.+time*.026,12.)-6.;p.x+=sin(time*.17+phase)*.10;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*ratio*10./-mv.z,1.,7.);fade=.12+.14*sin(phase+time*.25);}`,
  fragmentShader: `varying float fade;void main(){float d=length(gl_PointCoord-.5);float a=exp(-d*d*17.)*smoothstep(.5,.2,d)*fade;gl_FragColor=vec4(.50,.76,.68,a);}`,
});
scene.add(new T.Points(dustGeo, dustMat));
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new T.Vector2(innerWidth, innerHeight),
  0.19,
  0.44,
  1.1,
);
composer.addPass(bloom);
const grade = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, time: { value: 0 } },
  vertexShader:
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
  fragmentShader: `uniform sampler2D tDiffuse;uniform float time;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 p=vUv-.5;float vig=1.-.31*pow(length(p)*1.25,1.7);c*=vig;gl_FragColor=vec4(c,1.);}`,
});
composer.addPass(grade);
composer.addPass(new OutputPass());
const views = {
  portrait: { target: [0.35, -0.13, 0], pos: [-0.05, 0.45, 9.8] },
  head: { target: [-1.31, 0.08, 0], pos: [-2.65, 0.65, 2.5] },
  scales: { target: [-0.4, 0.12, 0.2], pos: [-0.5, 0.55, 1.9] },
  fins: { target: [1.4, 0.07, 0], pos: [1.8, 0.45, 4.4] },
};
let transition = null,
  selected = "portrait",
  paused = matchMedia("(prefers-reduced-motion: reduce)").matches,
  cinematic = true,
  flare = false,
  t = 0,
  last = performance.now(),
  ready = false;
function view(name, immediate = false) {
  selected = name;
  document.body.dataset.view = name;
  const v = views[name];
  const dst = new T.Vector3(...v.pos),
    target = new T.Vector3(...v.target);
  if (small() && name === "portrait") {
    dst.set(0.08, 0.8, 16.2);
    target.y = 0.03;
    camera.fov = 36;
  } else camera.fov = 31;
  if (name === "portrait")
    dst.z = Math.max(
      dst.z,
      4.85 / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect),
    );
  camera.updateProjectionMatrix();
  if (immediate) {
    camera.position.copy(dst);
    controls.target.copy(target);
    controls.update();
  } else
    transition = {
      from: camera.position.clone(),
      to: dst,
      a: controls.target.clone(),
      b: target,
      start: performance.now(),
    };
  $("#view").value = name;
}
view("portrait", true);
function syncMotion() {
  const b = $("#motion");
  b.innerHTML = paused
    ? '<span class="button-icon">▷</span> Animate'
    : '<span class="button-icon">Ⅱ</span> Pause';
  b.setAttribute("aria-pressed", String(paused));
}
syncMotion();
$("#motion").onclick = () => {
  paused = !paused;
  syncMotion();
};
$("#flare").onclick = () => {
  flare = !flare;
  fish.userData.display.requested = flare;
  $("#flare").setAttribute("aria-pressed", String(flare));
  $("#flare").innerHTML = flare
    ? '<span class="button-icon">◒</span> Display flared'
    : '<span class="button-icon">◔</span> Fins relaxed';
};
$("#view").onchange = (e) => view(e.target.value);
$("#flow").oninput = (e) => {
  water.strength = Number(e.target.value) / 100;
  $("#flow-value").value = e.target.value === "0" ? "Still" : `${e.target.value}%`;
};
$("#flow-direction").onchange = (e) => { water.direction = e.target.value; };
$("#reset").onclick = () => view("portrait");
$("#light").onclick = () => {
  cinematic = !cinematic;
  $("#light").setAttribute("aria-pressed", String(!cinematic));
  $("#light").innerHTML = cinematic
    ? '<span class="button-icon">☼</span> Studio light'
    : '<span class="button-icon">☾</span> Ocean light';
  lights.key.color.set(cinematic ? 0xe3ffe9 : 0xffffff);
  lights.key.intensity = cinematic ? 1.35 : 2.2;
  lights.rim.intensity = cinematic ? 1.1 : 1.0;
  lights.warm.intensity = cinematic ? 0.35 : 0.5;
  scene.environmentIntensity = cinematic ? 0.25 : 0.45;
};
$("#fullscreen").onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {}
};
$("#info-toggle").onclick = () => {
  const show = $("#info").hidden;
  $("#info").hidden = !show;
  $("#info-toggle").setAttribute("aria-expanded", String(show));
  $("#info-toggle span").textContent = show ? "−" : "+";
};
controls.addEventListener("start", () => {
  transition = null;
  $("#hint").style.opacity = "0";
});
window.addEventListener("keydown", (e) => {
  if (
    e.code === "Space" &&
    !/INPUT|SELECT|BUTTON/.test(document.activeElement.tagName)
  ) {
    e.preventDefault();
    paused = !paused;
    syncMotion();
  }
  if (e.key === "Escape") {
    $("#info").hidden = true;
    $("#info-toggle").setAttribute("aria-expanded", "false");
  }
});
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  if (selected === "portrait") view("portrait");
});
renderer.domElement.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  $("#error").hidden = false;
  $("#error h2").textContent = "The graphics context was interrupted.";
  $("#error p").textContent = "Reload this page to return to the aquarium.";
});
let textureReady = false;
fish.userData.ready
  .then(() => {
    textureReady = true;
  })
  .catch(() => {
    $("#error").hidden = false;
    $("#error h2").textContent = "The fish textures could not load.";
    $("#error p").textContent =
      "Check your connection and reload to try again.";
    $("#loading").style.display = "none";
  });
let frame = 0;
const particleFlow = [0, 0, 0];
function draw(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (!paused) t += dt;
  fish.userData.update(t, selected !== "portrait");
  stepSurface(paused ? 0 : dt, t);
  if (!paused) {
    for (let i = 0; i < n; i++) {
      const k = i * 3;
      waterVelocity(t, pos[k], pos[k + 1], pos[k + 2], fish.userData.flowStrength, water.direction, particleFlow);
      pos[k] = T.MathUtils.euclideanModulo(pos[k] + particleFlow[0] * dt + 9, 18) - 9;
      pos[k + 1] = T.MathUtils.euclideanModulo(pos[k + 1] + particleFlow[1] * dt + 6, 12) - 6;
      pos[k + 2] = T.MathUtils.euclideanModulo(pos[k + 2] + particleFlow[2] * dt + 9, 14) - 9;
    }
    dustGeo.attributes.position.needsUpdate = true;
  }
  bg.material.uniforms.time.value = t;
  dustMat.uniforms.time.value = t;
  if (transition) {
    const u = clamp((now - transition.start) / 1450, 0, 1),
      s = u * u * (3 - 2 * u);
    camera.position.lerpVectors(transition.from, transition.to, s);
    controls.target.lerpVectors(transition.a, transition.b, s);
    if (u === 1) transition = null;
  }
  controls.update();
  composer.render();
  if (!ready && textureReady && ++frame > 3) {
    ready = true;
    $("#loading").classList.add("done");
    setTimeout(() => $("#loading").remove(), 1200);
    document.body.dataset.ready = "true";
  }
  requestAnimationFrame(draw);
}
const clamp = T.MathUtils.clamp;
requestAnimationFrame(draw);
window.__betta = {
  fish,
  scene,
  camera,
  controls,
  renderer,
  uniforms,
  view,
  surface,
  advance(seconds) {
    const steps = Math.max(1, Math.round(seconds * 60));
    for (let i = 0; i < steps; i++) {
      t += 1 / 60;
      fish.userData.update(t, selected !== "portrait");
      stepSurface(1 / 60, t);
    }
  },
  get time() {
    return t;
  },
  get paused() {
    return paused;
  },
  get ready() {
    return ready;
  },
};
