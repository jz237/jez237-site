// Render pipeline. Scene FBO (float where available) ← bg, ground, path,
// ground-light accumulation, y-sorted entity pass, effects; a decaying
// half-res trail buffer; then brightpass → 3-tier blur chain → post
// composite (tonemap, aberration, vignette, grain).

import { createGL, compile, createFBO, createQuad, InstanceBatch, INST_FLOATS } from './gl.js';
import * as SH from './shaders.js';
import { WORLD_W, WORLD_H, HORIZON_Y, COLORS, TOWERS, ENEMIES, depthScale } from './content.js';
import { Rng } from './rng.js';

const KIND = {
  MITE: 0, GRUB: 1, WISP: 2, CORAL: 3, TESLA: 4, FLORA: 5, HEART: 6,
  GLOW: 7, PROJ: 8, PORTAL: 9, MOTE: 10, SEG: 11,
};

export class Renderer {
  constructor(canvas) {
    const ctx = createGL(canvas);
    if (!ctx) throw new Error('WebGL2 unavailable');
    this.gl = ctx.gl;
    this.halfFloat = ctx.halfFloat;
    this.canvas = canvas;
    const gl = this.gl;

    this.pBg = compile(gl, SH.VS_FULL, SH.FS_BG, 'bg');
    this.pGround = compile(gl, SH.VS_RIBBON, SH.FS_GROUND, 'ground');
    this.pPath = compile(gl, SH.VS_RIBBON, SH.FS_PATH, 'path');
    this.pLight = compile(gl, SH.VS_INST, SH.FS_LIGHT, 'light');
    this.pEnt = compile(gl, SH.VS_INST, SH.FS_ENTITY, 'entity');
    this.pDecay = compile(gl, SH.VS_FULL, SH.FS_TRAIL_DECAY, 'decay');
    this.pBright = compile(gl, SH.VS_FULL, SH.FS_BRIGHT, 'bright');
    this.pBlur = compile(gl, SH.VS_FULL, SH.FS_BLUR, 'blur');
    this.pPost = compile(gl, SH.VS_FULL, SH.FS_POST, 'post');

    this.quad = createQuad(gl);
    this.entities = new InstanceBatch(gl, 4096);
    this.lights = new InstanceBatch(gl, 2048);
    this.additive = new InstanceBatch(gl, 6144);
    this.segs = new InstanceBatch(gl, 2048);
    this.trailEm = new InstanceBatch(gl, 2048);

    this.groundMesh = null;
    this.pathMesh = null;
    this.spores = this.makeSpores();
    this.fgFlora = null; // foreground silhouettes, built per map
    this.frame = 0;
    this.w = 0; this.h = 0;
    this.resize();
  }

  makeSpores() {
    const rng = new Rng(0xA11CE);
    const out = [];
    for (let i = 0; i < 110; i++) {
      const layer = rng.next(); // 0 far … 1 near-foreground
      out.push({
        x: rng.range(0, WORLD_W), y: rng.range(HORIZON_Y - 80, WORLD_H),
        layer, size: 1.5 + layer * 7 + rng.next() * 3,
        vx: rng.range(4, 16) * (0.3 + layer), vy: rng.range(-6, 4),
        phase: rng.range(0, 6.28),
        hue: rng.pick([COLORS.cyan, COLORS.violet, COLORS.acid, COLORS.amber]),
        bright: 0.05 + rng.next() * 0.16,
      });
    }
    return out;
  }

  resize() {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const w = Math.floor(this.canvas.clientWidth * dpr) || 1280;
    const h = Math.floor(this.canvas.clientHeight * dpr) || 720;
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.canvas.width = w; this.canvas.height = h;
    const gl = this.gl;
    const mk = (div, filter = true) => createFBO(gl, Math.max(2, w >> div), Math.max(2, h >> div), this.halfFloat, filter);
    this.fScene = mk(0);
    this.fTrailA = mk(1); this.fTrailB = mk(1);
    this.fBright = mk(1);
    this.fB1a = mk(1); this.fB1b = mk(1);
    this.fB2a = mk(2); this.fB2b = mk(2);
    this.fB3a = mk(3); this.fB3b = mk(3);
    // clear trails
    for (const f of [this.fTrailA, this.fTrailB]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
      gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  buildMapMeshes(sim) {
    const gl = this.gl;
    // ground quad: world-space, from just above horizon to below bottom
    const gverts = new Float32Array([
      -200, HORIZON_Y - 6, 0, 0, WORLD_W + 200, HORIZON_Y - 6, 1, 0,
      -200, WORLD_H + 100, 0, 1, WORLD_W + 200, WORLD_H + 100, 1, 1,
    ]);
    this.groundMesh = this.meshFrom(gverts, 4);
    // path ribbon triangle strip
    const { pts, arc, total } = sim.path;
    const w = sim.map.pathW * 1.7; // ribbon wider than gameplay width — edges erode in shader
    const verts = [];
    for (let i = 0; i < pts.length; i++) {
      const i2 = Math.min(pts.length - 1, i + 1);
      const dx = pts[i2][0] - pts[Math.max(0, i - 1)][0];
      const dy = pts[i2][1] - pts[Math.max(0, i - 1)][1];
      const l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l, ny = dx / l;
      const along = arc[i] / total;
      verts.push(pts[i][0] + nx * w, pts[i][1] + ny * w, along, -1);
      verts.push(pts[i][0] - nx * w, pts[i][1] - ny * w, along, 1);
    }
    this.pathMesh = this.meshFrom(new Float32Array(verts), verts.length / 4);
    // foreground silhouette flora along the bottom edge
    const rng = new Rng(sim.map.seed ^ 0xF06);
    this.fgFlora = [];
    for (let i = 0; i < 9; i++) {
      this.fgFlora.push({
        x: rng.range(-60, WORLD_W + 60), y: WORLD_H + rng.range(-8, 40),
        size: rng.range(120, 300), seed: rng.next(), phase: rng.range(0, 6.28),
      });
    }
  }

  meshFrom(data, count) {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindVertexArray(null);
    return { vao, count };
  }

  render(sim, cam, fx, dt) {
    const gl = this.gl;
    this.frame++;
    const t = sim.time + fx.wallTime; // keep ambient life moving even when paused
    if (!this.pathMesh) this.buildMapMeshes(sim);
    this.updateSpores(dt);

    // ---- camera → uniforms
    const camX = WORLD_W / 2 + cam.dx + cam.shakeX;
    const camY = WORLD_H / 2 + cam.dy + cam.shakeY;
    const zoom = cam.zoom;
    // horizon line in screen uv measured from bottom (0) to top (1)
    const horizonUv = (-(HORIZON_Y - camY) * zoom / (WORLD_H * 0.5) + 1) * 0.5;
    const skyFrac = Math.min(0.5, Math.max(0.04, 1 - horizonUv));

    const bindWorld = (p) => {
      gl.useProgram(p.prog);
      gl.uniform2f(p.u.uCam, camX, camY);
      gl.uniform1f(p.u.uZoom, zoom);
      gl.uniform2f(p.u.uRes, WORLD_W, WORLD_H);
      if (p.u.uT) gl.uniform1f(p.u.uT, t);
    };

    // ================= scene =================
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fScene.fbo);
    gl.viewport(0, 0, this.fScene.w, this.fScene.h);
    gl.disable(gl.BLEND);

    // mood: dusk → deep night → violet pre-dawn across a run
    const mood = Math.min(2, Math.max(0, (sim.wave - 1) / 19 * 2));

    // background
    gl.useProgram(this.pBg.prog);
    gl.uniform1f(this.pBg.u.uT, t);
    gl.uniform2f(this.pBg.u.uReso, this.w, this.h);
    gl.uniform1f(this.pBg.u.uHorizon, skyFrac);
    gl.uniform2f(this.pBg.u.uPar, cam.dx * 60, cam.dy * 60);
    gl.uniform1f(this.pBg.u.uMood, mood);
    gl.bindVertexArray(this.quad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ground
    bindWorld(this.pGround);
    gl.uniform1f(this.pGround.u.uHorizon, skyFrac);
    gl.uniform2f(this.pGround.u.uReso, this.w, this.h);
    gl.uniform1f(this.pGround.u.uMood, mood);
    gl.bindVertexArray(this.groundMesh.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.groundMesh.count);

    // path (premultiplied over)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    bindWorld(this.pPath);
    gl.bindVertexArray(this.pathMesh.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.pathMesh.count);

    // ---- ground lights (additive)
    this.lights.reset();
    this.pushGroundLights(sim, t);
    gl.blendFunc(gl.ONE, gl.ONE);
    bindWorld(this.pLight);
    this.lights.flush(this.pLight);

    // ---- entities: y-sorted single pass (premultiplied)
    this.entities.reset();
    this.pushEntities(sim, t, fx);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    bindWorld(this.pEnt);
    gl.uniform1i(this.pEnt.u.uKind, -1);
    gl.uniform1f(this.pEnt.u.uHorizon, skyFrac);
    this.entities.flush(this.pEnt);

    // ---- additive effects: projectiles, arcs, particles, spores, rings
    this.additive.reset();
    this.segs.reset();
    this.pushEffects(sim, t);
    gl.blendFunc(gl.ONE, gl.ONE);
    // seg batch (lightning)
    bindWorld(this.pEnt);
    gl.uniform1i(this.pEnt.u.uKind, KIND.SEG);
    this.segs.flush(this.pEnt);
    // glow batch
    gl.uniform1i(this.pEnt.u.uKind, -1);
    this.additive.flush(this.pEnt);

    // ================= trails =================
    // decay previous into other buffer, then add this frame's emissions
    const A = this.fTrailA, B = this.fTrailB;
    gl.bindFramebuffer(gl.FRAMEBUFFER, B.fbo);
    gl.viewport(0, 0, B.w, B.h);
    gl.disable(gl.BLEND);
    gl.useProgram(this.pDecay.prog);
    const decay = Math.pow(0.028, dt); // ~0.94/frame at 60
    gl.uniform1f(this.pDecay.u.uDecayR, decay * 0.985);
    gl.uniform1f(this.pDecay.u.uDecayG, decay * 0.997);
    gl.uniform1f(this.pDecay.u.uDecayB, decay);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.uniform1i(this.pDecay.u.uPrev, 0);
    gl.bindVertexArray(this.quad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // emissions
    this.trailEm.reset();
    this.pushTrailEmissions(sim, t);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    bindWorld(this.pEnt);
    gl.uniform1i(this.pEnt.u.uKind, KIND.GLOW);
    gl.uniform1f(this.pEnt.u.uHorizon, skyFrac);
    this.trailEm.flush(this.pEnt);
    this.fTrailA = B; this.fTrailB = A; // swap

    // ================= bloom =================
    gl.disable(gl.BLEND);
    const passBlur = (src, tmpA, tmpB) => {
      gl.useProgram(this.pBlur.prog);
      gl.uniform1i(this.pBlur.u.uTex, 0);
      gl.activeTexture(gl.TEXTURE0);
      // H
      gl.bindFramebuffer(gl.FRAMEBUFFER, tmpB.fbo);
      gl.viewport(0, 0, tmpB.w, tmpB.h);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform2f(this.pBlur.u.uDir, 1, 0);
      gl.uniform2f(this.pBlur.u.uTexel, 1 / tmpB.w, 1 / tmpB.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // V
      gl.bindFramebuffer(gl.FRAMEBUFFER, tmpA.fbo);
      gl.viewport(0, 0, tmpA.w, tmpA.h);
      gl.bindTexture(gl.TEXTURE_2D, tmpB.tex);
      gl.uniform2f(this.pBlur.u.uDir, 0, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return tmpA;
    };
    // brightpass at half res
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fBright.fbo);
    gl.viewport(0, 0, this.fBright.w, this.fBright.h);
    gl.useProgram(this.pBright.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fScene.tex);
    gl.uniform1i(this.pBright.u.uScene, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.fTrailA.tex);
    gl.uniform1i(this.pBright.u.uTrail, 1);
    gl.uniform1f(this.pBright.u.uThresh, 0.12);
    gl.uniform1f(this.pBright.u.uKnee, 0.30);
    gl.bindVertexArray(this.quad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const b1 = passBlur(this.fBright, this.fB1a, this.fB1b);
    const b2 = passBlur(b1, this.fB2a, this.fB2b);
    const b3 = passBlur(b2, this.fB3a, this.fB3b);

    // ================= post =================
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.w, this.h);
    gl.useProgram(this.pPost.prog);
    const bindTex = (unit, tex, name) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(this.pPost.u[name], unit);
    };
    bindTex(0, this.fScene.tex, 'uScene');
    bindTex(1, this.fTrailA.tex, 'uTrail');
    bindTex(2, b1.tex, 'uB1');
    bindTex(3, b2.tex, 'uB2');
    bindTex(4, b3.tex, 'uB3');
    gl.uniform1f(this.pPost.u.uT, t);
    gl.uniform1f(this.pPost.u.uAberr, fx.aberr);
    gl.uniform1f(this.pPost.u.uBloomAmt, 1.15);
    gl.bindVertexArray(this.quad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  }

  updateSpores(dt) {
    for (const s of this.spores) {
      s.x += s.vx * dt; s.y += s.vy * dt + Math.sin(s.phase + s.x * 0.01) * 3 * dt;
      s.phase += dt * 0.7;
      if (s.x > WORLD_W + 60) { s.x = -50; }
      if (s.y < HORIZON_Y - 100) s.y = WORLD_H;
      if (s.y > WORLD_H + 40) s.y = HORIZON_Y;
    }
  }

  pushGroundLights(sim, t) {
    const L = this.lights;
    // heart aura
    const [hx, hy] = sim.map.heart;
    const hpulse = 0.75 + 0.25 * Math.sin(t * 1.5);
    L.push(hx, hy + 10, 340, 200, 0, t, 0, 0.5 * hpulse, ...COLORS.heart, 0);
    // portal aura
    const [px, py] = sim.map.portal;
    L.push(px + 40, py + 20, 220, 130, 0, t * 0.7, 0, 0.4, 0.35, 0.15, 0.5, 0);
    // tower light pools
    for (const tw of sim.towers) {
      const ds = depthScale(tw.y);
      const c = tw.def.color;
      const intensity = 0.22 + tw.charge * 0.3;
      L.push(tw.x, tw.y + 14 * ds, 150 * ds, 90 * ds, 0, tw.phase, 0, intensity, c[0], c[1], c[2], 0);
    }
    // enemy glows move along the path — the river of colour
    for (const e of sim.enemies) {
      const ds = depthScale(e.y);
      const c = e.def.color;
      const big = (e.def.boss || e.def.miniboss) ? 3.2 : 1;
      L.push(e.x, e.y + 10 * ds, 60 * ds * big, 38 * ds * big, 0, e.phase, 0, 0.30, c[0], c[1], c[2], 0);
    }
    // excited flora cast their own small light
    for (const f of sim.flora) {
      if (f.excite < 0.25) continue;
      const ds = depthScale(f.y);
      L.push(f.x, f.y, 70 * ds * f.excite, 44 * ds * f.excite, 0, f.phase, 0, 0.35 * f.excite, 0.2, 0.75, 0.5, 0);
    }
    // projectile ground light
    for (const pr of sim.projectiles) {
      const ds = depthScale(pr.y);
      L.push(pr.x, pr.y + 20, 70 * ds, 44 * ds, 0, 0, 0, 0.25, pr.color[0], pr.color[1], pr.color[2], 0);
    }
    // hazard pools light the ground
    for (const pl of sim.pools) {
      const lf = Math.min(1, (pl.dur - pl.t) / 0.6) * Math.min(1, pl.t / 0.15);
      const ds = depthScale(pl.y);
      L.push(pl.x, pl.y, pl.r * 2.1 * ds, pl.r * 1.3 * ds, 0, pl.t * 2, 0, 0.5 * lf, pl.color[0], pl.color[1], pl.color[2], 0);
    }
    // shockwave rings (extra=1 → ring)
    for (const r of sim.rings) {
      const f = r.t / r.dur;
      const ds = depthScale(r.y);
      L.push(r.x, r.y, r.max * ds, r.max * 0.62 * ds, 0, r.t * 3, 0, f, r.color[0], r.color[1], r.color[2], 1);
    }
  }

  pushEntities(sim, t, fx) {
    const E = [];
    // flora
    for (const f of sim.flora) {
      const ds = depthScale(f.y);
      E.push({ y: f.y, k: KIND.FLORA, x: f.x, sx: f.size * ds, sy: f.size * ds, rot: 0, phase: t * 1.1 + f.phase, aux: f.excite, c: [0.2, 0.75, 0.5], seed: f.seed });
    }
    // portal
    const [px, py] = sim.map.portal;
    E.push({ y: py, k: KIND.PORTAL, x: px + 30, sx: 95, sy: 110, rot: 0, phase: t, aux: 1, c: COLORS.violet, seed: 0.3 });
    // heart
    const [hx, hy] = sim.map.heart;
    const integ = sim.lives / 20;
    E.push({ y: hy, k: KIND.HEART, x: hx, sx: 130, sy: 130, rot: 0, phase: t, aux: integ, c: COLORS.heart, seed: 0.7 });
    // towers
    for (const tw of sim.towers) {
      const ds = depthScale(tw.y);
      const size = tw.def.size * (1 + tw.level * 0.22) * ds;
      E.push({ y: tw.y, k: tw.def.kind, x: tw.x, sx: size, sy: size, rot: 0, phase: t * 2 + tw.phase, aux: tw.charge, c: tw.def.color, seed: tw.seed });
    }
    // enemies
    for (const e of sim.enemies) {
      const ds = depthScale(e.y);
      const size = e.def.size * ds;
      const faces = e.type === 'grub' || e.type === 'mite' || e.type === 'husk' || e.type === 'dartfin' || e.type === 'bulwark';
      const rot = faces ? Math.atan2(e.diry || 0, e.dirx || 1) + Math.PI : 0;
      const hpf = e.hp / e.maxHp;
      let aux = hpf;
      if (e.def.shield) aux = e.maxShield > 0 ? e.shield / e.maxShield : 0;
      else if (e.def.phasing) aux = e.untargetable ? 0.28 : 1;
      else if (e.def.boss) aux = e.bossPhase === 2 ? 1 : 0;
      if (e.def.boss || e.def.miniboss) {
        // dark aura beneath the great ones
        E.push({ y: e.y - 1, k: 26, x: e.x, sx: size * 2.4, sy: size * 1.5, rot: 0, phase: e.phase, aux: e.def.boss ? 0.8 : 0.45, c: [0, 0, 0], seed: e.wobblePhase });
      }
      E.push({ y: e.y, k: e.def.kind, x: e.x, sx: size, sy: size, rot, phase: e.phase, aux, c: e.def.color, seed: e.wobblePhase });
    }
    E.sort((a, b) => a.y - b.y);
    for (const e of E) {
      this.entities.push(e.x, e.y, e.sx, e.sy, e.rot, e.phase, e.k, e.aux, e.c[0], e.c[1], e.c[2], e.seed);
    }
    // foreground silhouettes — parallax: drawn last, near-black, oversized
    if (this.fgFlora) {
      for (const f of this.fgFlora) {
        const parx = f.x + fx.camDx * -2.2;
        this.entities.push(parx, f.y, f.size, f.size, 0, t * 0.5 + f.phase, KIND.FLORA, 0.05, 0.012, 0.02, 0.035, f.seed);
      }
    }
  }

  pushEffects(sim, t) {
    const A = this.additive;
    // projectiles
    for (const pr of sim.projectiles) {
      const ds = depthScale(pr.y);
      A.push(pr.x, pr.y, 26 * ds, 26 * ds, pr.rot || 0, t * 4, KIND.PROJ, 1, pr.color[0], pr.color[1], pr.color[2], 0.5);
    }
    // death motes
    for (const p of sim.particles) {
      const lf = 1 - p.age / p.life;
      const ds = depthScale(p.y);
      A.push(p.x, p.y, p.size * 2.4 * ds * (0.5 + lf * 0.5), p.size * 2.4 * ds * (0.5 + lf * 0.5), 0, p.phase + p.age * 5, KIND.MOTE, lf,
        p.color[0] * lf * 0.9, p.color[1] * lf * 0.9, p.color[2] * lf * 0.9, p.seed);
    }
    // ambient spores
    for (const s of this.spores) {
      const tw = 0.6 + 0.4 * Math.sin(t * 0.8 + s.phase * 4);
      A.push(s.x, s.y, s.size * 2.2, s.size * 2.2, 0, s.phase, KIND.GLOW, 1,
        s.hue[0] * s.bright * tw, s.hue[1] * s.bright * tw, s.hue[2] * s.bright * tw, 0);
    }
    // tesla arcs → jagged segment chains, regenerated per frame
    for (const arc of sim.arcs) {
      const lf = 1 - arc.t / arc.dur;
      for (const hit of arc.hits) {
        this.pushLightning(hit.from.x, hit.from.y, hit.to.x, hit.to.y, arc.color, lf, arc.seed + hit.to.x);
      }
    }
    // urchin lances — straight, hot core, tapering off, muzzle bloom
    for (const b of sim.beams) {
      const lf = 1 - b.t / b.dur;
      const dx = b.x2 - b.x1, dy = b.y2 - b.y1;
      const len = Math.hypot(dx, dy);
      const rot = Math.atan2(dy, dx);
      const segsN = 6;
      for (let i = 0; i < segsN; i++) {
        const f0 = i / segsN, f1 = (i + 1) / segsN;
        const mx = b.x1 + dx * (f0 + f1) / 2, my = b.y1 + dy * (f0 + f1) / 2;
        const taper = 1 - f0 * 0.65;
        this.segs.push(mx, my, len / segsN / 2 + 3, 13 * taper * lf, rot, 0, KIND.SEG, lf,
          b.color[0] * lf * taper, b.color[1] * lf * taper, b.color[2] * lf * taper, 0);
      }
      A.push(b.x1, b.y1, 46 * lf, 46 * lf, 0, 0, KIND.GLOW, 1,
        b.color[0] * lf, b.color[1] * lf, b.color[2] * lf, 0);
    }
    // hazard pools — flickering ground fire + rising embers
    for (const pl of sim.pools) {
      const lf = Math.min(1, (pl.dur - pl.t) / 0.6) * Math.min(1, pl.t / 0.15);
      for (let i = 0; i < 5; i++) {
        const hx = Math.sin(i * 2.4 + pl.x) * pl.r * 0.55;
        const hy = Math.cos(i * 1.7 + pl.y) * pl.r * 0.33;
        const fl = 0.5 + 0.5 * Math.sin(t * (6 + i) + i * 2.2 + pl.x);
        A.push(pl.x + hx, pl.y + hy, 26 + fl * 14, 20 + fl * 10, 0, t * 3 + i, KIND.MOTE, lf,
          pl.color[0] * fl * lf * 0.55, pl.color[1] * fl * lf * 0.55, pl.color[2] * fl * lf * 0.55, i * 0.13);
      }
      // rising embers
      for (let i = 0; i < 4; i++) {
        const cyc = (t * (0.5 + i * 0.13) + i * 0.7 + pl.x * 0.01) % 1;
        const ex = pl.x + Math.sin(i * 51.7 + pl.y) * pl.r * 0.6;
        const ey = pl.y - cyc * 55;
        A.push(ex, ey, 7, 7, 0, 0, KIND.GLOW, 1,
          pl.color[0] * (1 - cyc) * lf * 0.8, pl.color[1] * (1 - cyc) * lf * 0.8, pl.color[2] * (1 - cyc) * lf * 0.8, 0);
      }
    }
    // status halos — statuses must be readable as light
    for (const e of sim.enemies) {
      const ds = depthScale(e.y);
      const st = e.st;
      if (!st) continue;
      if (st.freeze > 0) {
        A.push(e.x, e.y, e.def.size * 1.6 * ds, e.def.size * 1.6 * ds, 0, e.phase, KIND.GLOW, 1, 0.5, 0.75, 0.9, 0);
      } else if (st.chill > 0) {
        const f = Math.min(1, st.chill);
        A.push(e.x, e.y, e.def.size * 1.35 * ds, e.def.size * 1.35 * ds, 0, e.phase, KIND.GLOW, 1, 0.06 * f, 0.35 * f, 0.42 * f, 0);
      }
      if (st.ignite > 0) {
        const fl = 0.6 + 0.4 * Math.sin(t * 11 + e.phase * 3);
        A.push(e.x, e.y - e.def.size * 0.5 * ds, e.def.size * 0.9 * ds, e.def.size * 1.3 * ds, 0, t * 5, KIND.MOTE, 1,
          1.0 * fl * 0.7, 0.5 * fl * 0.7, 0.1 * fl * 0.7, e.wobblePhase);
      }
      if (st.corrodeStacks > 0) {
        for (let i = 0; i < Math.min(3, st.corrodeStacks); i++) {
          const a = t * 2.4 + i * 2.1 + e.phase;
          A.push(e.x + Math.cos(a) * e.def.size * 0.55 * ds, e.y + Math.sin(a) * e.def.size * 0.4 * ds,
            8 * ds, 8 * ds, 0, 0, KIND.GLOW, 1, 0.35, 0.6, 0.08, 0);
        }
      }
      if (st.shock > 0) {
        this.pushLightning(e.x - e.def.size * 0.6 * ds, e.y, e.x + e.def.size * 0.6 * ds, e.y,
          [1, 0.5, 0.95], 0.7, e.phase + this.frame * 0.1);
      }
    }
    // boss telegraph: gathering ring + rising dread-glow while winding up
    for (const e of sim.enemies) {
      if (!e.def.boss || e.telegraphT <= 0) continue;
      const P = e.def.pulse;
      const f = 1 - e.telegraphT / P.telegraph; // 0 → 1 as the pulse nears
      const ds = depthScale(e.y);
      // contracting warning ring
      const r = P.radius * (1.15 - f * 0.95) * ds;
      A.push(e.x, e.y, r * 2, r * 1.25, 0, t * 4, KIND.GLOW, 1,
        0.55 * f, 0.18 * f, 0.8 * f, 0);
      // core gathering violence
      A.push(e.x, e.y, 120 * f * ds, 120 * f * ds, 0, t * 8, KIND.MOTE, 1,
        0.8 * f, 0.3 * f, 1.0 * f, e.wobblePhase);
    }
    // heart-hit flash
    if (sim.heartHitT > 0) {
      const [hx, hy] = sim.map.heart;
      const f = sim.heartHitT / 0.8;
      A.push(hx, hy, 260 * f, 260 * f, 0, 0, KIND.GLOW, 1, 1 * f, 0.3 * f, 0.2 * f, 0);
    }
  }

  pushLightning(x1, y1, x2, y2, color, alpha, seed) {
    // midpoint-displaced polyline; 8 segments
    const segs = 8;
    const pts = [[x1, y1]];
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    for (let i = 1; i < segs; i++) {
      const f = i / segs;
      const wig = (Math.sin(seed * 37 + i * 9.7 + this.frame * 0.9) + Math.sin(seed * 11 + i * 3.3 - this.frame * 1.3)) * 0.5;
      const amp = len * 0.09 * Math.sin(f * Math.PI);
      pts.push([x1 + dx * f + nx * wig * amp, y1 + dy * f + ny * wig * amp]);
    }
    pts.push([x2, y2]);
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i][0], ay = pts[i][1], bx = pts[i + 1][0], by = pts[i + 1][1];
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      const sl = Math.hypot(bx - ax, by - ay) / 2 + 4;
      const rot = Math.atan2(by - ay, bx - ax);
      this.segs.push(mx, my, sl, 10, rot, 0, KIND.SEG, alpha,
        color[0] * alpha, color[1] * alpha, color[2] * alpha, 0);
    }
  }

  pushTrailEmissions(sim, t) {
    const T = this.trailEm;
    for (const pr of sim.projectiles) {
      const ds = depthScale(pr.y);
      T.push(pr.x, pr.y, 16 * ds, 16 * ds, 0, 0, KIND.GLOW, 1,
        pr.color[0] * 0.55, pr.color[1] * 0.55, pr.color[2] * 0.55, 0);
    }
    for (const e of sim.enemies) {
      if (e.type !== 'wisp') continue;
      const ds = depthScale(e.y);
      T.push(e.x, e.y, 14 * ds, 14 * ds, 0, 0, KIND.GLOW, 1,
        e.def.color[0] * 0.18, e.def.color[1] * 0.18, e.def.color[2] * 0.18, 0);
    }
    for (const arc of sim.arcs) {
      if (arc.t > 0.05) continue;
      for (const hit of arc.hits) {
        T.push(hit.to.x, hit.to.y, 22, 22, 0, 0, KIND.GLOW, 1,
          arc.color[0] * 0.35, arc.color[1] * 0.35, arc.color[2] * 0.35, 0);
      }
    }
    // beams sear a line into the trail buffer on their first frame
    for (const b of sim.beams) {
      if (b.t > 0.05) continue;
      const n = 9;
      for (let i = 0; i <= n; i++) {
        const f = i / n;
        T.push(b.x1 + (b.x2 - b.x1) * f, b.y1 + (b.y2 - b.y1) * f, 13, 13, 0, 0, KIND.GLOW, 1,
          b.color[0] * 0.4 * (1 - f * 0.5), b.color[1] * 0.4 * (1 - f * 0.5), b.color[2] * 0.4 * (1 - f * 0.5), 0);
      }
    }
  }
}
