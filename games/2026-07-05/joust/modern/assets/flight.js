// Modern controls, evaluated on the same fixed simulation ticks as the arcade rules.
(function (root) {
  'use strict';
  const {JoustEngine, wrapX} = typeof module !== 'undefined' && module.exports
    ? require('../../retro/assets/engine.js') : root.JOUST_ENGINE;
  const {PHYS, WORLD} = typeof module !== 'undefined' && module.exports
    ? require('../../retro/assets/data.js') : root.JOUST_DATA;
  const FLIGHT = Object.freeze({
    acceleration: .11, braking: .20, maxSpeed: 1.65, glideDrag: .90,
    flapImpulse: .29, takeoff: -.45, repeatTicks: 10, minFlapTicks: 8,
    maxRise: 1.6, maxFall: 3.2, gravity: .02,
    wallRebound: .18, maxWallRebound: .28, maxBirdRebound: .45,
  });
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  // The inherited platform resolver uses the arcade index to determine direction.
  // Player movement itself uses continuous velocity, so a rebound stays damped.
  function syncIndex(b) {
    const a = Math.abs(b.vx);
    b.vxi = Math.sign(b.vx) * (a >= 1.5 ? 8 : a >= .75 ? 6 : a >= .375 ? 4 : a > 0 ? 2 : 0);
  }
  class ModernJoustEngine extends JoustEngine {
    placeBird(b, x, y, face) {
      super.placeBird(b, x, y, face);
      b.flapCooldown = 0;
    }
    controlPlayer(p, input) {
      if (p.alive && !p.materializing) p.flapCooldown = Math.max(0, (p.flapCooldown || 0) - 1);
      super.controlPlayer(p, input);
    }
    doFlap(b, dir) {
      if (b.kind !== 'player') return super.doFlap(b, dir);
      if (b.flapCooldown > 0) {
        b.flapRepeat = b.flapCooldown;
        return;
      }
      if (b.onGround) {
        b.onGround = false;
        b.y -= 1;
        b.vy = FLIGHT.takeoff;
      } else {
        // Catch a fall without turning each stroke into a large upward launch.
        if (b.vy > 0) b.vy *= .45;
        b.vy = Math.max(-FLIGHT.maxRise, b.vy - FLIGHT.flapImpulse);
      }
      b.flapCooldown = FLIGHT.minFlapTicks;
      b.flapRepeat = FLIGHT.repeatTicks;
      b.wingDown = PHYS.WING_DOWN_FRAMES;
      b.ptimup = 0;
      this.emit('flap', {x:b.x, y:b.y, player:true});
    }
    airMove(b, dir, maxH) {
      if (b.kind !== 'player') return super.airMove(b, dir, maxH);
      if (dir) {
        b.face = dir;
        b.vx = clamp(b.vx + dir * (b.vx * dir < 0 ? FLIGHT.braking : FLIGHT.acceleration), -FLIGHT.maxSpeed, FLIGHT.maxSpeed);
      } else {
        b.vx *= FLIGHT.glideDrag;
        if (Math.abs(b.vx) < .025) b.vx = 0;
      }
      syncIndex(b);
    }
    groundMove(b, dir) {
      if (b.kind !== 'player') return super.groundMove(b, dir);
      // Keep footstep/skid animation and sound, but apply the same speed ceiling.
      const x = b.x;
      super.groundMove(b, dir);
      b.vx = clamp(b.vx, -FLIGHT.maxSpeed, FLIGHT.maxSpeed);
      b.x = wrapX(x + b.vx);
      syncIndex(b);
    }
    landingPlatform(b) {
      if (b.kind !== 'player') return super.landingPlatform(b);
      // Support the feet, not the wider body: the arcade overlap margin could
      // re-land a rider every tick after its support point had left the ledge.
      const previousY = b.y - b.vy;
      return this.platforms.find(p => this.xInPlat(b.x, p)
        && previousY <= p.y + 2 && b.y >= p.y - 1) || null;
    }
    integrate(b) {
      if (b.kind !== 'player' || b.materializing || !b.alive) return super.integrate(b);
      const vx = b.vx, vy = b.vy, previousY = b.y, eventStart = this.events.length;
      if (!b.onGround && !b.grabbed) {
        if (!b.flapHeld && b.vy < 0) b.vy *= .985;
        // Replace only the player's gravity; enemies retain their established AI.
        b.vy = clamp(b.vy + FLIGHT.gravity, -FLIGHT.maxRise, FLIGHT.maxFall)
          - (b.flapHeld ? PHYS.GRAV_DOWN : PHYS.GRAV_UP);
      }
      const fallingVy = b.vy + (b.flapHeld ? PHYS.GRAV_DOWN : PHYS.GRAV_UP);
      super.integrate(b);
      const contact = this.events.slice(eventStart).find(e => e.type === 'cthud' && e.birdId === b.id);
      const ledge = contact && this.platforms.find(p => p.id === contact.platform);
      // A descending body may graze the cliff after its feet leave the top.
      // Slide past that edge instead of bouncing upward into an endless hover.
      if (ledge && fallingVy > 0 && b.vy < 0 && !this.xInPlat(b.x, ledge)) {
        b.vy = fallingVy;
        b.y = previousY + fallingVy;
      }
      if (contact && vx * b.vx < 0) {
        b.vx = -Math.sign(vx) * Math.min(FLIGHT.maxWallRebound, Math.abs(vx) * FLIGHT.wallRebound);
      }
      if (contact && vy * b.vy < 0) b.vy = clamp(b.vy * .25, -.22, .22);
      if (b.y === WORLD.CEIL && vy < 0 && b.vy > 0) b.vy = Math.min(.18, b.vy * .12);
      syncIndex(b);
    }
    bounce(a, b) {
      super.bounce(a, b);
      for (const bird of [a, b]) if (bird.kind === 'player') {
        bird.vx = clamp(bird.vx, -FLIGHT.maxBirdRebound, FLIGHT.maxBirdRebound);
        syncIndex(bird);
      }
    }
  }
  const api = {ModernJoustEngine, FLIGHT};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.JOUST_FLIGHT = api;
})(typeof window !== 'undefined' ? window : globalThis);
