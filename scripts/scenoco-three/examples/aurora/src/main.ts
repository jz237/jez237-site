import { ACESFilmicToneMapping, HalfFloatType, Vector2, WebGLRenderTarget, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { play } from '@scenoco-three/core';
import { Main } from './scenes/Main';

// The loading screen fills as the game gets ready: its code, its fonts, then the first frame.
const loading = document.getElementById('loading')!;
const bar = document.getElementById('loading-fill')!;
const reached = (part: number) => void (bar.style.width = `${part * 100}%`);
reached(1 / 3);
await Promise.race([
  Promise.all([document.fonts.load('bold 16px Orbitron'), document.fonts.load('italic 800 16px "Exo 2"')]),
  new Promise((resolve) => setTimeout(resolve, 2500)),
]);
reached(2 / 3);

const game = play(Main, { renderer: new WebGLRenderer({ powerPreference: 'high-performance' }) });
// Phones get 1.5× at most: the bloom's passes are drawn at the canvas's resolution too.
const phone = matchMedia('(pointer: coarse)').matches;
game.renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.5 : 2));

// Breakout's look: a filmic curve so the neon does not clip flat, and bloom on what is brighter than white.
game.renderer.toneMapping = ACESFilmicToneMapping;
game.renderer.toneMappingExposure = 1.1;

// Half-float, so emissive colours brighter than white survive until the bloom picks them out — a
// threshold of 1 then glows the neon and nothing else.
const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType });
const composer = new EffectComposer(game.renderer, target);
const scene = new RenderPass(game.scene, game.camera!);
composer.addPass(scene);
composer.addPass(new UnrealBloomPass(new Vector2(1, 1), 0.6, 0.42, 1));
composer.addPass(new OutputPass());

const size = new Vector2();
const drawn = new Vector2();
let ratio = 0;
game.render = () => {
  game.renderer.getSize(size);
  if (!size.equals(drawn) || game.renderer.getPixelRatio() !== ratio) {
    drawn.copy(size);
    ratio = game.renderer.getPixelRatio();
    composer.setPixelRatio(ratio);
    composer.setSize(size.x, size.y);
  }
  scene.camera = game.camera!;
  composer.render();
};

requestAnimationFrame(() => requestAnimationFrame(() => {
  reached(1);
  loading.classList.add('done');
}));
loading.addEventListener('transitionend', (e) => e.target === loading && loading.remove());
