// GPU FFT against a direct CPU sum of the same spectrum, plus wave height statistics. Needs: npm i playwright (and a Chrome/Chromium; set CHROME to its path if needed).
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const K = new URL('../', import.meta.url).pathname;
const tmp = join(tmpdir(), 'water_fft_check.html');
const S = {
  header: '#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\nprecision highp sampler2DArray;\n',
  fft: readFileSync(K + 'glsl/fft/water_fft.glsl', 'utf8'), cascades: readFileSync(K + 'glsl/fft/water_cascades.glsl', 'utf8'),
  spectrum: readFileSync(K + 'glsl/fft/fft_spectrum.frag', 'utf8'), evolve: readFileSync(K + 'glsl/fft/fft_evolve.frag', 'utf8'),
  butterfly: readFileSync(K + 'glsl/fft/fft_butterfly.frag', 'utf8'), assemble: readFileSync(K + 'glsl/fft/fft_assemble.frag', 'utf8'),
  query: readFileSync(K + 'glsl/fft/fft_query.frag', 'utf8')
};
writeFileSync(tmp, `<!DOCTYPE html><canvas id=c></canvas><script>${readFileSync(K + 'js/water_fft.js', 'utf8')}</script><script>window.S=${JSON.stringify(S)};</script>`);
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME || undefined, args: ['--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto('file://' + tmp);
const out = await page.evaluate(() => {
  const gl = document.getElementById('c').getContext('webgl2');
  const N = 64, tiles = [256, 32, 4, 1];
  const oc = new WaterFFT.Ocean(gl, { size: N, tiles, shaders: S });
  oc.setParams({ windSpeed: 11, windDirection: 0.7, swellHeight: 0.8, swellLength: 70, choppiness: 1.1 });
  const T = 37.25;
  oc.update(T, 1 / 60, 0, 0);
  const fbo = gl.createFramebuffer(), res = { cascades: [] };
  const read = (tex, c) => { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, tex, 0, c); const a = new Float32Array(N * N * 4); gl.readPixels(0, 0, N, N, gl.RGBA, gl.FLOAT, a); return a; };
  const w0 = 2 * Math.PI / WaterFFT.REPEAT_TIME, tWrap = T % WaterFFT.REPEAT_TIME;
  for (let c = 0; c < 4; c++) {
    const disp = read(oc.disp[oc.ring], c), deriv = read(oc.deriv, c), mom = read(oc.mom, c);
    const L = tiles[c], ch = oc.state.params.choppiness * (c >= 2 ? 0.6 : 1);
    // all modes, once
    const modes = [];
    for (let iz = 0; iz < N; iz++) for (let ix = 0; ix < N; ix++) {
      const a = oc.cpuH0(c, ix, iz), b = oc.cpuH0(c, (N - ix) % N, (N - iz) % N);
      if (!a[0] && !a[1] && !b[0] && !b[1]) continue;
      const nx = ix < N / 2 ? ix : ix - N, nz = iz < N / 2 ? iz : iz - N;
      const kx = nx * 2 * Math.PI / L, kz = nz * 2 * Math.PI / L, kl = Math.hypot(kx, kz);
      const w = Math.floor(Math.sqrt(9.81 * kl) / w0) * w0, ct = Math.cos(w * tWrap), st = Math.sin(w * tWrap);
      // h = a e^{-iwt} + conj(b) e^{iwt}
      const hr = a[0] * ct + a[1] * st + b[0] * ct + b[1] * st;
      const hi = a[1] * ct - a[0] * st - b[1] * ct + b[0] * st;
      modes.push([kx, kz, kl, hr, hi]);
    }
    let maxErr = [0, 0, 0, 0, 0], scale = [0, 0, 0, 0, 0], var0 = 0;
    for (let s = 0; s < 40; s++) {
      const px = (s * 37 + 5) % N, pz = (s * 23 + 11) % N, x = px * L / N, z = pz * L / N;
      let dy = 0, dx = 0, sx = 0, dxx = 0, dxz = 0;
      for (const [kx, kz, kl, hr, hi] of modes) {
        const ph = kx * x + kz * z, cr = Math.cos(ph), ci = Math.sin(ph);
        const er = hr * cr - hi * ci, ei = hr * ci + hi * cr;     // h e^{ik.x}
        dy += er;
        dx += -ei * (kx / kl) * ch;                               // i*(kx/k)*ch*h -> real part = -Im
        sx += -ei * kx;
        dxx += er * (-kx * kx / kl) * ch;
        dxz += er * (-kx * kz / kl) * ch;
      }
      const o = (pz * N + px) * 4;
      const gpu = [disp[o + 1], disp[o], deriv[o], deriv[o + 2], mom[o]], cpu = [dy, dx, sx, dxx, dxz];
      for (let q = 0; q < 5; q++) { maxErr[q] = Math.max(maxErr[q], Math.abs(gpu[q] - cpu[q])); scale[q] = Math.max(scale[q], Math.abs(cpu[q])); }
    }
    for (let i = 0; i < N * N; i++) var0 += disp[i * 4 + 1] * disp[i * 4 + 1];
    res.cascades.push({ c, modes: modes.length, maxAbsErr: maxErr.map((v) => +v.toExponential(2)), maxAbs: scale.map((v) => +v.toFixed(4)), rmsHeight: +Math.sqrt(var0 / (N * N)).toFixed(4), expectedRms: +Math.sqrt(oc.state.bands[c].m0).toFixed(4) });
  }
  res.Hs = oc.state.significantHeight; res.full = oc.fullPrecision;
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
