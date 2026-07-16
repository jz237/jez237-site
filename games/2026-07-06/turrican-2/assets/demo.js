/* Turrican II — Redux : demo.js
 * ATTRACT MODE. A reactive autopilot that plays the real engine through the
 * whole campaign — it reads the tilemap and the live entity lists and returns
 * an input frame per 60Hz tick, exactly like a human on the pad.
 *
 * It is NOT a recording: no scripted key list, so it survives level tweaks.
 * Hidden failsafes (stall rescue, boss drain) exist only so an unattended
 * cabinet can never wedge — they are last resorts, not the strategy.
 * UMD: usable in Node (headless bot tests) and the browser.
 */
(function (root, factory) {
  const D = (typeof module === 'object' && module.exports) ? require('./data.js') : root.TData;
  const mod = factory(D);
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else root.TDemo = mod;
})(typeof self !== 'undefined' ? self : this, function (D) {
  'use strict';

  const { TILE, T, VIEW_W } = D;
  const DT = D.DT;

  // ---- tile probes (mirror the engine's rules exactly) ---------------------
  function tileAt(lvl, tx, ty) {
    if (ty >= lvl.rows) return T.EMPTY;                 // below the map = open air
    if (tx < 0 || tx >= lvl.cols || ty < 0) return T.SOLID;
    return lvl.tiles[ty * lvl.cols + tx];
  }
  const isSolid = (t) => t === T.SOLID || t === T.CRATE;
  function solidAt(lvl, px, py) { return isSolid(tileAt(lvl, Math.floor(px / TILE), Math.floor(py / TILE))); }
  function spikeAt(lvl, px, py) { return tileAt(lvl, Math.floor(px / TILE), Math.floor(py / TILE)) === T.SPIKE; }

  // The floor under a column, searched ALL the way down from `fromY` — a pit is
  // a column with no floor at all, and that is what kills. A shallow probe would
  // mistake "ground three tiles down" for a pit and "the void" for safe footing.
  function floorBelow(lvl, px, fromY) {
    const tx = Math.floor(px / TILE);
    if (tx < 0 || tx >= lvl.cols) return null;
    for (let ty = Math.max(0, Math.floor(fromY / TILE)); ty < lvl.rows; ty++)
      if (isSolid(tileAt(lvl, tx, ty))) return ty * TILE;
    return null;                                       // bottomless: death column
  }
  // one-way platforms are standable too (from above)
  function platformBelow(lvl, px, fromY) {
    let best = null;
    for (const pl of (lvl.platforms || [])) {
      const plx = pl.x * TILE, ply = pl.y * TILE;
      if (px > plx + 2 && px < plx + pl.w * TILE - 2 && ply >= fromY - 4)
        if (best === null || ply < best) best = ply;
    }
    return best;
  }
  function standBelow(lvl, px, fromY) {
    const f = floorBelow(lvl, px, fromY), pl = platformBelow(lvl, px, fromY);
    if (f === null) return pl;
    return (pl !== null && pl < f) ? pl : f;
  }
  // spiked landing? (spikes only ever line pit floors in this generator)
  function spikedAt(lvl, px, surfaceY) {
    if (surfaceY === null) return true;
    for (let y = surfaceY - 26; y <= surfaceY + 12; y += 8) if (spikeAt(lvl, px, y)) return true;
    return false;
  }
  // a crate plug is a floor that our own fan fire is about to delete
  function crateTop(lvl, px, surfaceY) {
    if (surfaceY === null) return false;
    return tileAt(lvl, Math.floor(px / TILE), Math.floor((surfaceY + 4) / TILE)) === T.CRATE;
  }
  // a column we must not put our feet in
  function deadly(lvl, px, fromY) {
    const g = standBelow(lvl, px, fromY);
    return g === null || spikedAt(lvl, px, g) || crateTop(lvl, px, g);
  }
  // shmup: the clear flight gap at a column, measured from SOLID only (crates
  // sit *inside* the gap and are meant to be shot through, not flown around)
  function tunnelGap(lvl, px) {
    const tx = Math.max(0, Math.min(lvl.cols - 1, Math.floor(px / TILE)));
    let top = 0, bot = lvl.rows - 1;
    while (top < lvl.rows && tileAt(lvl, tx, top) === T.SOLID) top++;
    while (bot > top && tileAt(lvl, tx, bot) === T.SOLID) bot--;
    return { top: top * TILE, bot: (bot + 1) * TILE };
  }
  function crateAhead(lvl, px, span) {
    const t0 = Math.floor(px / TILE), t1 = Math.floor((px + span) / TILE);
    for (let tx = t0; tx <= t1; tx++)
      for (let ty = 0; ty < lvl.rows; ty++)
        if (tileAt(lvl, tx, ty) === T.CRATE) return tx * TILE;
    return -1;
  }

  function blankInput() {
    return {
      left: false, right: false, up: false, down: false, jump: false, fire: false, morph: false,
      jumpPressed: false, jumpReleased: false, upPressed: false, downPressed: false,
      leftPressed: false, rightPressed: false, firePressed: false, morphPressed: false,
      switchPressed: false, bombPressed: false, linePressed: false,
      pausePressed: false, mutePressed: false, startPressed: false,
    };
  }

  // ---- the pilot -----------------------------------------------------------
  function createPilot() {
    const P = {
      jumpT: 0, jumpCd: 0, dodgeCd: 0, bombCd: 0, switchCd: 0,
      morphT: 0, morphCd: 0, breach: 0,
      maxX: -1e9, stallT: 0, safeY: null, rescues: 0, deaths: 0, wasDead: false,
      bossT: 0, elapsed: 0, held: blankInput(),
    };

    function reset() {
      P.jumpT = P.jumpCd = P.dodgeCd = P.bombCd = P.switchCd = 0;
      P.morphT = P.morphCd = 0; P.breach = 0;
      P.maxX = -1e9; P.stallT = 0; P.safeY = null; P.bossT = 0; P.elapsed = 0;
      P.held = blankInput();
    }

    // Press a jump for n ticks (variable-height: holding longer jumps higher).
    // The cooldown outlasts the hold on purpose — the engine jumps on the PRESS
    // edge, so a pilot that never lets go of the button never jumps again.
    function jump(n) {
      if (P.jumpT > 0 || P.jumpCd > 0) return;
      P.jumpT = n; P.jumpCd = n / 60 + 0.14;
    }

    function frame(state) {
      const inp = blankInput();
      const p = state.player, lvl = state.level;
      P.elapsed += DT;
      for (const k of ['jumpCd', 'dodgeCd', 'bombCd', 'switchCd', 'morphCd']) if (P[k] > 0) P[k] -= DT;

      if (p.dead) {
        if (!P.wasDead) { P.deaths++; P.wasDead = true; }
        P.jumpT = 0; P.morphT = 0; P.stallT = 0; P.maxX = -1e9;
        return finish(inp);
      }
      P.wasDead = false;

      if (lvl.type === 'shmup') flyShip(state, inp);
      else runAndGun(state, inp);

      // keep the demo pilot on MULTIPLE — the beam locks facing while firing,
      // which reads badly on an autopilot that turns to shoot
      if (p.weapon !== 'spread' && p.weapons.spread > 0 && P.switchCd <= 0) {
        inp.switchPressed = true; P.switchCd = 0.3;
      }
      return finish(inp);
    }

    // fill in the edge flags the engine expects from a real pad
    function finish(inp) {
      const prev = P.held;
      inp.jumpPressed = inp.jump && !prev.jump;
      inp.jumpReleased = !inp.jump && prev.jump;
      inp.firePressed = inp.fire && !prev.fire;
      inp.upPressed = inp.up && !prev.up;
      inp.downPressed = inp.down && !prev.down;
      inp.leftPressed = inp.left && !prev.left;
      inp.rightPressed = inp.right && !prev.right;
      P.held = inp;
      return inp;
    }

    // ---- platform stages ---------------------------------------------------
    function runAndGun(state, inp) {
      const p = state.player, lvl = state.level, b = state.boss;
      const pcx = p.x + p.w / 2, footY = p.y + p.h + 2;
      inp.fire = !p.morph;

      // ---- boss duel ------------------------------------------------------
      // (before the stall watchdog: holding a firing line in a sealed arena is
      // not "stuck", and a rescue teleport mid-duel would look ridiculous)
      if (b && b.alive && b.awake && !b.dying) {
        P.stallT = 0; P.maxX = p.x;
        duel(state, inp);
        return;
      }
      P.bossT = 0;

      // stall watchdog: never let an unattended cabinet wedge on geometry
      if (p.x > P.maxX + 4) { P.maxX = p.x; P.stallT = 0; P.safeY = p.y + p.h; }
      else P.stallT += DT;
      if (P.stallT > 2.5 && p.onGround) jump(20);
      if (P.stallT > 7) rescue(state);

      const dir = (lvl.exit.x + 10 > pcx) ? 1 : -1;
      inp[dir > 0 ? 'right' : 'left'] = true;

      // ---- terrain reading (pits, spikes, walls) --------------------------
      // Standing on real terrain, any drop of 3+ tiles is a shaft, not a step —
      // the generator only ever steps the ground by one tile. (Our own downward
      // spread fire pops the crate plugs off the secret vaults, so these open up
      // mid-run.) Hop them; don't file them under "ground below, carry on".
      const under = standBelow(lvl, pcx, footY);
      const onTerrain = under !== null && under === floorBelow(lvl, pcx, footY);
      let hazard = 0;                 // px to the first column we must clear
      for (let d = 10; d <= 56; d += 5) {
        const x = pcx + dir * d;
        if (deadly(lvl, x, footY)) { hazard = d; break; }
        if (onTerrain && p.onGround) {
          const g = standBelow(lvl, x, footY);
          if (g !== null && g - under > TILE * 2.5) { hazard = d; break; }
        }
      }
      // a wall taller than the engine's 1-tile auto step-up has to be jumped
      const aheadX = p.x + (dir > 0 ? p.w + 3 : -3);
      const wall = solidAt(lvl, aheadX, p.y + p.h - 3) && solidAt(lvl, aheadX, p.y + p.h - 6 - TILE);

      // ---- climbing out of a well ----------------------------------------
      // Our own downward spread fire pops the crate plugs off the secret vaults,
      // so the pilot does sometimes drop into one (and takes the gems). Getting
      // back out means finding the column with sky above it and jumping there —
      // under the chamber roof, a jump just cracks your head on the ceiling.
      let surf = null;
      for (let c = -3; c <= 3; c++) {
        const f = floorBelow(lvl, pcx + c * TILE, TILE * 1.5);
        if (f !== null && (surf === null || f < surf)) surf = f;
      }
      const inWell = under !== null && surf !== null && under - surf > TILE * 2.2;
      if (p.onGround && inWell && !p.inWater) {
        const roofed = solidAt(lvl, p.x + 2, p.y - 10) || solidAt(lvl, p.x + p.w - 2, p.y - 10) ||
                       solidAt(lvl, p.x + 2, p.y - 30) || solidAt(lvl, p.x + p.w - 2, p.y - 30);
        if (roofed) {
          let openDir = 0, bestD = 99;
          for (let c = -4; c <= 4; c++) {
            if (!c) continue;
            const x = pcx + c * TILE;
            let clear = true;
            for (let up = 1; up <= 4; up++) if (solidAt(lvl, x, p.y + 10 - up * TILE)) { clear = false; break; }
            if (clear && Math.abs(c) < bestD) { bestD = Math.abs(c); openDir = Math.sign(c); }
          }
          if (openDir) { inp.left = openDir < 0; inp.right = openDir > 0; }
        } else jump(26);
        if (P.jumpT > 0) { inp.jump = true; P.jumpT--; }
        return;
      }

      if (p.inWater) {
        // Flooded caverns: you cannot jump out of water, you swim out. UP is
        // thrust (it keeps the jump edge unused), and the engine hands you a
        // coyote frame the instant you breach — spend it on a jump and you
        // clear the ledge. That breach-hop is the whole trick to World 2.
        const g = standBelow(lvl, pcx + dir * 30, p.y - 40);
        const want = (g !== null ? g : lvl.rows * TILE) - p.h - 16;
        const climb = p.y > want || hazard || wall;
        if (climb) { inp.up = true; P.breach = 6; }
        P.jumpT = 0;
      } else if (p.onGround) {
        P.breach = 0;
        if (wall) jump(20);
        else if (hazard && hazard <= 60) {
          const hold = planJump(state, dir);
          if (hold) jump(hold);
          else if (hazard <= 22) jump(28);   // out of runway — commit, and let the air planner cope
        }
      } else {
        if (P.breach > 0) { P.breach--; inp.jump = true; }   // launch out of the water
        steerLanding(state, inp, dir);                  // airborne: pick a safe touchdown
      }

      // ---- shooting -------------------------------------------------------
      let up = null, best = 1e9;
      for (const e of state.enemies) {
        if (!e.alive) continue;
        const ex = e.x + e.w / 2 - pcx, ey = (e.y + e.h / 2) - (p.y + 11);
        const d2 = ex * ex + ey * ey;
        if (d2 > 200 * 200 || d2 > best) continue;
        best = d2;
        up = (ey < -30 && Math.abs(ex) < 60) ? e : null;   // straight overhead → fire skyward
      }
      if (up && !p.inWater && !p.morph) inp.up = true;

      // ---- dodging --------------------------------------------------------
      if (p.onGround && !p.morph && P.dodgeCd <= 0 && !p.inWater && !hazard) {
        for (const s of state.eshots) {
          const dx = s.x - pcx, dy = s.y - (p.y + p.h / 2);
          const closing = (s.vx || 0) * -Math.sign(dx || 1) > 0;
          if (Math.abs(dx) < 80 && Math.abs(dy) < 34 && closing) { jump(14); P.dodgeCd = 0.5; break; }
        }
      }
      // low on energy with company around → freeze the room and walk out
      if (p.energy < 34 && p.bombs > 0 && P.bombCd <= 0 && state.freeze <= 0) {
        let near = 0;
        for (const e of state.enemies) if (e.alive && Math.abs(e.x - p.x) < 150) near++;
        if (near >= 2) { inp.bombPressed = true; P.bombCd = 8; }
      }

      // ---- showboating: the wheel, on genuinely safe flat ground ----------
      if (p.morph) {
        P.morphT -= DT;
        if ((hazard || wall || P.morphT <= 0) && P.morphCd <= 0) { inp.morphPressed = true; P.morphCd = 0.3; }
      } else if (P.morphT <= 0 && P.morphCd <= 0 && p.onGround && !p.inWater && p.energy > 55 &&
                 !hazard && !wall && !(lvl.bossSpawn && pcx > lvl.bossSpawn.wakeX - 420) &&
                 Math.random() < 0.005 && flatRun(state, dir, 20)) {
        let clear = true;
        for (const e of state.enemies) if (e.alive && Math.abs(e.x - pcx) < 190) clear = false;
        if (clear) { inp.morphPressed = true; P.morphT = 0.7; P.morphCd = 0.3; }
      }

      if (P.jumpT > 0) { inp.jump = true; P.jumpT--; }
    }

    // ---- flight simulator ---------------------------------------------------
    // A miniature of the engine's own integrator: gravity, air accel, the
    // variable-jump cut on release, ceiling bonks and — the one that matters —
    // the horizontal wall clamp. Without that clamp the pilot "lands" on ledges
    // its shoulder would actually be shoved off, which is exactly how a bot
    // walks into a pit with a smile on its face.
    function simulate(state, mv, jumpHold) {
      const p = state.player, lvl = state.level;
      let x = p.x, y = p.y, vx = p.vx, vy = (jumpHold != null ? -560 : p.vy);
      for (let t = 0; t < 110; t++) {
        if (jumpHold != null && t === jumpHold && vy < 0) vy *= 0.42;   // release cut
        if (mv !== 0) vx = Math.max(-205, Math.min(205, vx + mv * 1800 * DT));
        else vx -= Math.sign(vx) * Math.min(Math.abs(vx), 528 * DT);
        vy = Math.min(vy + 1750 * DT, 760);
        const py0 = y;
        x += vx * DT;
        if (vx !== 0) {                                                 // wall clamp
          const edge = vx > 0 ? x + p.w : x;
          const tx = Math.floor(edge / TILE);
          const y0 = Math.floor(y / TILE), y1 = Math.floor((y + p.h - 0.01) / TILE);
          for (let ty = y0; ty <= y1; ty++) {
            if (isSolid(tileAt(lvl, tx, ty))) {
              x = vx > 0 ? tx * TILE - p.w - 0.01 : (tx + 1) * TILE + 0.01;
              vx = 0; break;
            }
          }
        }
        y += vy * DT;
        if (y > lvl.rows * TILE) return { ok: false, land: x };         // out of the world
        if (vy < 0 && (solidAt(lvl, x + 2, y - 1) || solidAt(lvl, x + p.w - 2, y - 1))) vy = 0;
        if (vy > 0) {
          const feet = y + p.h;
          if (solidAt(lvl, x + 2, feet + 1) || solidAt(lvl, x + p.w - 2, feet + 1)) {
            const top = Math.floor(feet / TILE) * TILE;
            const cx = x + p.w / 2;
            return { ok: !spikedAt(lvl, cx, top) && !crateTop(lvl, cx, top), land: x };
          }
          for (const pl of (lvl.platforms || [])) {                     // one-way ledges catch us
            const plx = pl.x * TILE, ply = pl.y * TILE;
            if (x + p.w > plx + 2 && x < plx + pl.w * TILE - 2 && py0 + p.h <= ply + 3 && feet >= ply)
              return { ok: true, land: x };
          }
        }
      }
      return { ok: false, land: x };                                    // never came down
    }

    // Take-off: the shortest hop that actually lands somewhere. Jumping flat out
    // at every gap is how you clear a shaft and sail straight into the pit on the
    // far side of it.
    function planJump(state, dir) {
      for (const hold of [8, 12, 16, 20, 24, 28]) {
        const r = simulate(state, dir, hold);
        if (r.ok && r.land * dir > (state.player.x + 6) * dir) return hold;
      }
      return 0;
    }

    // Airborne: hold forward, coast, or peel back — take the best touchdown.
    function steerLanding(state, inp, dir) {
      let bestMv = dir, bestScore = -1e9;
      for (const mv of [dir, 0, -dir]) {
        const r = simulate(state, mv, null);
        const score = (r.ok ? 1e6 + r.land * dir : 0) + (mv === dir ? 1 : 0);
        if (score > bestScore) { bestScore = score; bestMv = mv; }
      }
      inp.left = bestMv < 0; inp.right = bestMv > 0;
    }

    // is the ground dead flat (and spike-free) for the next n tiles?
    function flatRun(state, dir, n) {
      const lvl = state.level, p = state.player;
      const footY = p.y + p.h + 2;
      const base = standBelow(lvl, p.x + p.w / 2, footY);
      if (base === null) return false;
      for (let i = 1; i <= n; i++) {
        const x = p.x + p.w / 2 + dir * i * TILE;
        if (standBelow(lvl, x, footY) !== base) return false;
        if (deadly(lvl, x, footY)) return false;
        if (solidAt(lvl, x, footY - TILE - 8)) return false;     // any step up blocks the wheel
      }
      return true;
    }

    // ---- boss duels --------------------------------------------------------
    function duel(state, inp) {
      const p = state.player, b = state.boss;
      const pcx = p.x + p.w / 2, bcx = b.x + b.w / 2;
      const side = bcx > pcx ? 1 : -1;          // direction from us to the boss
      const gap = Math.abs(bcx - pcx);
      P.bossT += DT;

      // a wheel has no gun: stand up before anything else
      if (p.morph) {
        P.morphT = 0;
        if (P.morphCd <= 0) { inp.morphPressed = true; P.morphCd = 0.3; }
        inp[side > 0 ? 'left' : 'right'] = true;   // roll clear while we do it
        return;
      }
      inp.fire = true;

      const STAND = 150;
      if (gap > STAND + 20) inp[side > 0 ? 'right' : 'left'] = true;
      else if (gap < STAND - 30) inp[side > 0 ? 'left' : 'right'] = true;
      else if (p.facing !== side) inp[side > 0 ? 'right' : 'left'] = true;  // keep the gun on target

      // a dash is coming at us: give ground rather than trade paint
      if (b.state === 'attack' && b.attack && b.attack.kind === 'dash' && gap < 140)
        { inp[side > 0 ? 'left' : 'right'] = true; inp[side > 0 ? 'right' : 'left'] = false; }

      // freeze bomb: locks the core open — the demo's signature boss move
      if (p.bombs > 0 && P.bombCd <= 0 && state.freeze <= 0 && P.bossT > 1.2) {
        inp.bombPressed = true; P.bombCd = 6;
      }

      // hop shockwaves and anything else on a collision course
      if (p.onGround && P.dodgeCd <= 0) {
        for (const s of state.eshots) {
          const dx = s.x - pcx, dy = s.y - (p.y + p.h / 2);
          const closing = (s.vx || 0) * -Math.sign(dx || 1) > 0;
          const wave = s.kind === 'wave';
          if (Math.abs(dx) < (wave ? 110 : 76) && Math.abs(dy) < 40 && closing) {
            jump(wave ? 17 : 13); P.dodgeCd = 0.42; break;
          }
        }
      }
      if (P.jumpT > 0) { inp.jump = true; P.jumpT--; }

      // failsafe: an unattended demo must never stall on a boss it can't finish
      if (P.bossT > 150 && b.hp > 0) b.hp -= b.maxHp * 0.02 * DT;
    }

    // ---- shmup stages (World 3) --------------------------------------------
    function flyShip(state, inp) {
      const p = state.player, lvl = state.level, b = state.boss;
      inp.fire = true;
      const pcy = p.y + p.h / 2;
      const boss = b && b.alive && b.awake && !b.dying;
      // the camera clamps at the last screen of tunnel, so the exit only ever
      // comes to the ship's right edge — station-keeping would park forever
      const camMax = lvl.cols * TILE - VIEW_W;
      const endRun = state.bossDead && (state.cam.x >= camMax - 4 || lvl.exit.x - (p.x + p.w) < 240);

      // station-keeping: sit left of centre for reaction room — except on the
      // run-in, where the exit is pinned to the right edge of the frame and the
      // ship has to fly into it
      if (endRun) inp.right = true;
      else {
        const wantX = state.cam.x + (boss ? 140 : 120);
        if (p.x < wantX - 14) inp.right = true;
        else if (p.x > wantX + 14) inp.left = true;
      }

      const here = tunnelGap(lvl, p.x + p.w / 2);        // the slot we're inside right now
      let wantY;
      const crate = crateAhead(lvl, p.x + p.w, 140);
      if (boss) {
        wantY = b.y + b.h / 2;                           // line the guns up on the core
        if (b.x - (p.x + p.w) < 90) { inp.left = true; inp.right = false; }
        if (p.bombs > 0 && P.bombCd <= 0 && state.freeze <= 0) { inp.bombPressed = true; P.bombCd = 6; }
      } else if (crate >= 0) {
        // barrier ahead: hold this row rock-steady so our own fire drills the hole
        const g = tunnelGap(lvl, crate + TILE / 2);
        wantY = Math.min(Math.max(pcy, g.top + 28), g.bot - 28);
      } else {
        // aim at the middle of the tunnel a beat ahead of the scroll
        const look = 46 + (lvl.scroll || 70) * 0.55;
        const g = tunnelGap(lvl, p.x + p.w + look);
        wantY = (g.top + g.bot) / 2;
      }
      // slide off anything about to hit us
      for (const s of state.eshots) {
        const dx = s.x - p.x, dy = s.y - pcy;
        if (dx > -12 && dx < 130 && Math.abs(dy) < 26) wantY += dy > 0 ? -36 : 36;
      }
      for (const e of state.enemies) {
        if (!e.alive) continue;
        const dx = (e.x + e.w / 2) - p.x, dy = (e.y + e.h / 2) - pcy;
        if (dx > -10 && dx < 80 && Math.abs(dy) < 24) wantY += dy > 0 ? -28 : 28;
      }
      // never aim through the wall we're currently between
      wantY = Math.max(here.top + p.h / 2 + 5, Math.min(here.bot - p.h / 2 - 5, wantY));
      wantY = Math.max(44, Math.min(lvl.rows * TILE - 30, wantY));
      if (pcy > wantY + 4) inp.up = true;
      else if (pcy < wantY - 4) inp.down = true;

      if (boss) {
        P.bossT += DT;
        if (P.bossT > 150 && b.hp > 0) b.hp -= b.maxHp * 0.02 * DT;   // never stall the show
      }
    }

    // Last-resort unwedge: lift the pilot to the next clean ground ahead. It
    // aims at the level's own walking surface (within a couple of tiles of where
    // we last stood), so it can never deposit us back down a shaft.
    function rescue(state) {
      const p = state.player, lvl = state.level;
      let col = Math.floor((p.x + p.w / 2) / TILE) + 2;
      for (let i = 0; i < 80 && col < lvl.cols - 3; i++, col++) {
        const x = col * TILE + TILE / 2;
        const g = floorBelow(lvl, x, TILE * 1.5);
        if (g === null || spikedAt(lvl, x, g)) continue;
        const gl = floorBelow(lvl, x - TILE, TILE * 1.5), gr = floorBelow(lvl, x + TILE, TILE * 1.5);
        if ((gl !== null && g - gl > TILE * 1.5) || (gr !== null && g - gr > TILE * 1.5)) continue; // a well, not the path
        if (solidAt(lvl, x, g - 20) || solidAt(lvl, x, g - 40)) continue; // needs headroom
        p.x = x - p.w / 2; p.y = g - p.h - 2; p.vx = 0; p.vy = 0;
        p.morph = false; p.h = 30; p.w = 14;
        p.invuln = Math.max(p.invuln, 1);
        P.stallT = 0; P.maxX = p.x; P.rescues++;
        return;
      }
      P.stallT = 0;
    }

    return {
      frame, reset, stats: P,
      get deaths() { return P.deaths; },
      get rescues() { return P.rescues; },
    };
  }

  return { createPilot };
});
