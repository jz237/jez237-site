// UNDERSTORM 2026 — HDR post chain: bloom (dual-filter down/up), screen-space shockwaves and heat
// distortion, chromatic fringe, filmic tonemap, vignette, flash and fade.
import * as THREE from '../vendor/three.module.min.js';

const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
const mk = (fs, uniforms) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: fs, uniforms, depthTest: false, depthWrite: false });

export class Post {
  constructor(renderer) {
    this.r = renderer; this.scene = new THREE.Scene(); this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null); this.quad.frustumCulled = false; this.scene.add(this.quad);
    this.levels = 5; this.down = []; this.up = [];
    this.mBright = mk('varying vec2 vUv; uniform sampler2D t; uniform vec2 px; void main(){ vec3 c = (texture2D(t, vUv + px*vec2(-.5,-.5)).rgb + texture2D(t, vUv + px*vec2(.5,-.5)).rgb + texture2D(t, vUv + px*vec2(-.5,.5)).rgb + texture2D(t, vUv + px*vec2(.5,.5)).rgb) * .25; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(min(c, vec3(24.0)) * smoothstep(1.0, 2.1, l), 1.0); }', { t: { value: null }, px: { value: new THREE.Vector2() } });
    this.mDown = mk('varying vec2 vUv; uniform sampler2D t; uniform vec2 px; void main(){ vec3 c = texture2D(t, vUv).rgb * 4.0; c += texture2D(t, vUv + px*vec2(-1.,-1.)).rgb + texture2D(t, vUv + px*vec2(1.,-1.)).rgb + texture2D(t, vUv + px*vec2(-1.,1.)).rgb + texture2D(t, vUv + px*vec2(1.,1.)).rgb; gl_FragColor = vec4(c / 8.0, 1.0); }', { t: { value: null }, px: { value: new THREE.Vector2() } });
    this.mUp = mk('varying vec2 vUv; uniform sampler2D t; uniform sampler2D a; uniform vec2 px; void main(){ vec3 c = texture2D(t, vUv + px*vec2(-2.,0.)).rgb + texture2D(t, vUv + px*vec2(2.,0.)).rgb + texture2D(t, vUv + px*vec2(0.,-2.)).rgb + texture2D(t, vUv + px*vec2(0.,2.)).rgb; c += (texture2D(t, vUv + px*vec2(-1.,1.)).rgb + texture2D(t, vUv + px*vec2(1.,1.)).rgb + texture2D(t, vUv + px*vec2(-1.,-1.)).rgb + texture2D(t, vUv + px*vec2(1.,-1.)).rgb) * 2.0; gl_FragColor = vec4(c / 12.0 + texture2D(a, vUv).rgb, 1.0); }', { t: { value: null }, a: { value: null }, px: { value: new THREE.Vector2() } });
    this.mRays = mk('varying vec2 vUv; uniform sampler2D t; uniform vec2 sun; uniform float aspect; void main(){ vec2 d = (vUv - sun) * (0.92 / 28.0); vec2 uv = vUv; vec3 c = vec3(0.0); float w = 1.0; for (int i = 0; i < 28; i++) { uv -= d; float m = 1.0 - smoothstep(0.08, 0.3, length((uv - sun) * vec2(aspect, 1.0))); c += min(texture2D(t, uv).rgb, vec3(1.6)) * w * m; w *= 0.945; } gl_FragColor = vec4(c / 28.0 * 2.6, 1.0); }', { t: { value: null }, sun: { value: new THREE.Vector2(0.7, 0.8) }, aspect: { value: 16 / 9 } }); // shafts come only from the sky around the sun: without the mask every bright sprite (ship, shots, blasts) smeared away from it
    this.mOut = mk(`varying vec2 vUv; uniform sampler2D t; uniform sampler2D b; uniform sampler2D r; uniform vec4 w[4]; uniform sampler2D dT; uniform float bloom, flash, fade, aspect, time, heat, grain, sat, rays, ao, flare, gcon; uniform vec2 sunP; uniform vec3 grade; uniform vec3 flashCol; uniform vec4 heatBox; uniform vec2 nf;
      float lin(float z){ return nf.x * nf.y / (nf.y - z * (nf.y - nf.x)); }
      vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
      float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
      void main(){ vec2 uv = vUv; vec2 off = vec2(0.0);
        for (int i = 0; i < 4; i++) { vec2 d = uv - w[i].xy; d.x *= aspect; float l = length(d); float e = l - w[i].z; float s = w[i].w * exp(-e*e*260.0); off += normalize(d + 1e-5) * s * vec2(1.0/aspect, 1.0); }
        if (heat > 0.0) { vec2 q = (uv - heatBox.xy) / heatBox.zw; float m = smoothstep(0.0, 0.08, q.x) * (1.0 - smoothstep(0.0, 1.0, abs(q.y))) * step(q.x, 1.0); off += vec2(0.0, sin(uv.x*90.0 - time*30.0) * 0.004) * m * heat; }
        uv += off; float ca = length(off) * 0.6 + 0.0012 * length(vUv - 0.5);
        vec3 c = vec3(texture2D(t, uv + vec2(ca, 0.0)).r, texture2D(t, uv).g, texture2D(t, uv - vec2(ca, 0.0)).b);
        // creases and contact shadows: compare each pixel's depth with pairs of neighbours either side of it. On a flat
        // slope the two differences cancel; in a crease, or where something sits just in front, they do not.
        if (ao > 0.0) { float d0 = lin(texture2D(dT, uv).x); if (d0 < 140.0) { float occ = 0.0, ru = 2.005 / d0;
          for (int i = 0; i < 6; i++) { float an = float(i) * 0.5236 + 0.26, rr = ru * (i < 3 ? 0.55 : 1.3); vec2 o = vec2(cos(an) / aspect, sin(an)) * rr;
            float da = d0 - lin(texture2D(dT, uv + o).x), db = d0 - lin(texture2D(dT, uv - o).x); if (abs(da) < 2.5 && abs(db) < 2.5) occ += smoothstep(0.06, 0.9, da + db); }
          c *= 1.0 - ao * occ * 0.13; } }
        c += texture2D(b, uv).rgb * bloom;
        // lens flare: ghosts strung along the line from the sun through the centre, and a thin streak, only as bright as the sun is on screen
        if (flare > 0.0) { vec3 sb = texture2D(b, sunP).rgb; float vis = clamp(max(sb.r, max(sb.g, sb.b)) * 0.5, 0.0, 1.0) * flare; vec2 ax = vec2(aspect, 1.0), dir = vec2(0.5) - sunP;
          float g1 = smoothstep(0.07, 0.0, length((vUv - (sunP + dir * 0.6)) * ax)), g2 = smoothstep(0.035, 0.0, length((vUv - (sunP + dir * 1.25)) * ax)), g3 = smoothstep(0.12, 0.05, length((vUv - (sunP + dir * 1.8)) * ax)) * smoothstep(0.03, 0.1, length((vUv - (sunP + dir * 1.8)) * ax));
          vec2 sd = (vUv - sunP) * ax; float streak = exp(-abs(sd.y) * 70.0) * exp(-abs(sd.x) * 2.4);
          c += vis * (vec3(1.0, 0.75, 0.45) * g1 * 0.10 + vec3(0.5, 0.9, 1.0) * g2 * 0.16 + vec3(0.8, 0.6, 1.0) * g3 * 0.07 + vec3(1.0, 0.92, 0.8) * streak * 0.22); } c += texture2D(r, uv).rgb * rays; c += flashCol * flash;
        float lum = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(lum), c, sat);
        c = aces(c * 1.05); c = clamp((c * grade - 0.5) * gcon + 0.5, 0.0, 1.0); vec2 v = vUv - 0.5; c *= 1.0 - dot(v, v) * 0.85;
        c = pow(max(c, 0.0), vec3(1.0/2.2)); c += (h21(vUv * 913.0 + time) - 0.5) * grain; gl_FragColor = vec4(c * fade, 1.0); }`,
      { t: { value: null }, b: { value: null }, r: { value: null }, rays: { value: 0 }, dT: { value: null }, ao: { value: 0 }, flare: { value: 0 }, gcon: { value: 1 }, sunP: { value: new THREE.Vector2(0.7, 0.8) }, grade: { value: new THREE.Color(1, 1, 1) }, nf: { value: new THREE.Vector2(1, 400) }, w: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, 9, 0)) }, bloom: { value: 0.9 }, flash: { value: 0 }, flashCol: { value: new THREE.Color(1, 1, 1) }, fade: { value: 1 }, aspect: { value: 16 / 9 }, time: { value: 0 }, heat: { value: 0 }, heatBox: { value: new THREE.Vector4(0, 0.5, 1, 0.05) }, grain: { value: 0.014 }, sat: { value: 1.08 } });
    this.waves = [0, 1, 2, 3].map(() => ({ x: 0, y: 0, r: 9, s: 0, v: 1 })); this.wi = 0;
  }
  resize(w, h, msaa, ao) {
    const opt = { type: THREE.HalfFloatType, depthBuffer: true, samples: msaa }; if (this.main && this.main.depthTexture) this.main.depthTexture.dispose(); if (ao) opt.depthTexture = new THREE.DepthTexture(w, h);
    if (this.main) this.main.dispose(); this.main = new THREE.WebGLRenderTarget(w, h, opt);
    for (const t of [...this.down, ...this.up]) t.dispose(); this.down = []; this.up = [];
    let cw = w, ch = h; for (let i = 0; i < this.levels; i++) { cw = Math.max(2, cw >> 1); ch = Math.max(2, ch >> 1); const o = { type: THREE.HalfFloatType, depthBuffer: false }; this.down.push(new THREE.WebGLRenderTarget(cw, ch, o)); this.up.push(new THREE.WebGLRenderTarget(cw, ch, o)); }
    if (this.rays) this.rays.dispose(); this.rays = new THREE.WebGLRenderTarget(this.down[1].width, this.down[1].height, { type: THREE.HalfFloatType, depthBuffer: false });
    this.w = w; this.h = h;
  }
  shock(u, v, strength = 0.03, speed = 1) { const o = this.waves[this.wi++ & 3]; o.x = u; o.y = v; o.r = 0.01; o.s = strength; o.v = speed; }
  pass(mat, target) { this.quad.material = mat; this.r.setRenderTarget(target); this.r.render(this.scene, this.cam); }
  render(scene, camera, dt, o) {
    const r = this.r; r.setRenderTarget(this.main); r.clear(); r.render(scene, camera);
    let src = this.main.texture, sw = this.w, sh = this.h;
    this.mBright.uniforms.t.value = src; this.mBright.uniforms.px.value.set(1 / sw, 1 / sh); this.pass(this.mBright, this.down[0]);
    for (let i = 1; i < this.levels; i++) { const s = this.down[i - 1]; this.mDown.uniforms.t.value = s.texture; this.mDown.uniforms.px.value.set(1 / s.width, 1 / s.height); this.pass(this.mDown, this.down[i]); }
    let acc = this.down[this.levels - 1];
    for (let i = this.levels - 2; i >= 0; i--) { this.mUp.uniforms.t.value = acc.texture; this.mUp.uniforms.a.value = this.down[i].texture; this.mUp.uniforms.px.value.set(1 / acc.width, 1 / acc.height); this.pass(this.mUp, this.up[i]); acc = this.up[i]; }
    if (o.rays > 0) { this.mRays.uniforms.t.value = this.down[1].texture; this.mRays.uniforms.sun.value.copy(o.sun); this.pass(this.mRays, this.rays); }
    const u = this.mOut.uniforms; u.t.value = src; u.b.value = acc.texture; u.r.value = this.rays.texture; u.rays.value = o.rays || 0; u.flare.value = o.flare || 0; u.gcon.value = o.gcon || 1; if (o.grade) u.grade.value.copy(o.grade); if (o.sun) u.sunP.value.copy(o.sun); u.dT.value = this.main.depthTexture || null; u.ao.value = this.main.depthTexture ? (o.ao || 0) : 0; u.nf.value.set(camera.near, camera.far); u.time.value += dt; u.bloom.value = o.bloom; u.flash.value = o.flash; u.fade.value = o.fade; u.heat.value = o.heat || 0; if (o.heatBox) u.heatBox.value.set(...o.heatBox); if (o.flashCol) u.flashCol.value.copy(o.flashCol);
    this.waves.forEach((w, i) => { w.r += dt * 0.9 * w.v; w.s *= Math.exp(-dt * 2.6); u.w.value[i].set(w.x, w.y, w.r, o.noShock ? 0 : w.s); });
    this.pass(this.mOut, null);
  }
}
