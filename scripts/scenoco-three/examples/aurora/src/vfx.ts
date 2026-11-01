import { Color } from 'three';
import type { ParticleEffect } from '@scenoco-three/particles';

/** A burst in a colour, thrown out and falling back — Breakout's shatter. */
function burst(color: string, count = 40, speed = 7, size = 0.26, life = 0.8, gravity = 0.4): ParticleEffect {
  return {
    duration: 0.5,
    looping: false,
    startLifetime: life,
    startSpeed: speed,
    startSize: size,
    startColor: new Color(color),
    gravityModifier: gravity,
    simulationSpace: 'World',
    emission: { rateOverTime: 0, bursts: [{ time: 0, count }] },
    shape: { type: 'Sphere', radius: 0.3 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [1, 0.7, 0] },
    colorOverLifetime: { colors: [new Color('#ffffff'), new Color(color), new Color(color).multiplyScalar(0.12)] },
  };
}

/** A smoke-and-fire trail, left in the sky where it was made. */
function trail(head: string, tail: string, size: number, rate: number, life: number): ParticleEffect {
  return {
    looping: true,
    startLifetime: life,
    startSpeed: 0.15,
    startSize: size,
    startColor: new Color(head),
    simulationSpace: 'World',
    emission: { rateOverTime: rate },
    shape: { type: 'Sphere', radius: 0.04 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [0.6, 1, 0.2] },
    colorOverLifetime: { colors: [new Color(head).multiplyScalar(1.6), new Color(head), new Color(tail)] },
  };
}

export const vfx = {
  /** An interceptor's airburst: hot white-gold and cyan. */
  airburst: burst('#ffd38a', 60, 9, 0.3, 0.9, 0.25),
  airburstCyan: burst('#8ffcff', 30, 6, 0.22, 0.7, 0.2),
  /** A warhead hitting the ground. */
  impact: burst('#ff6a2a', 70, 8, 0.34, 1.1, 0.8),
  /** A city falling: dust and embers. */
  rubble: burst('#c08a5a', 60, 6, 0.4, 1.4, 1.2),
  /** A kill: the warhead's last spark. */
  kill: burst('#fff3a6', 26, 5, 0.22, 0.55, 0.1),
  /** Metal from a satellite, a bomber, the orbital cannon. */
  metal: burst('#cfe6ff', 70, 11, 0.28, 1.1, 0.6),
  meteor: burst('#ff8a3a', 40, 7, 0.3, 0.9, 0.6),
  nuke: burst('#ffe23f', 140, 14, 0.5, 1.8, -0.15),
  firework: burst('#ff7ad8', 50, 8, 0.24, 1.2, 0.5),
  fireworkGreen: burst('#7dff9a', 50, 8, 0.24, 1.2, 0.5),
  fireworkBlue: burst('#7ab8ff', 50, 8, 0.24, 1.2, 0.5),
  enemyTrail: trail('#ff7a2a', '#2a0800', 0.3, 48, 2.4),
  mirvTrail: trail('#ffb347', '#2a1400', 0.34, 48, 2.4),
  smartTrail: trail('#ff4fd8', '#1a0020', 0.3, 48, 2.2),
  nukeTrail: trail('#ffe23f', '#2a1a00', 0.6, 60, 2.6),
  stealthTrail: trail('#3bff9a', '#001a0a', 0.16, 30, 0.35),
  interceptorTrail: trail('#9ff6ff', '#001018', 0.24, 80, 0.9),
  meteorTrail: trail('#ff7a2a', '#200800', 0.8, 70, 1.4),
  /** A city burning: a slow column of fire and smoke. */
  fire: {
    looping: true,
    startLifetime: 1.6,
    startSpeed: 1.1,
    startSize: 0.55,
    startColor: new Color('#ff7a2a'),
    simulationSpace: 'World',
    emission: { rateOverTime: 26 },
    shape: { type: 'Cone', radius: 0.5, angle: 12 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [0.6, 1, 1.4] },
    colorOverLifetime: { colors: [new Color('#ffd27a'), new Color('#ff5a1a'), new Color('#100804')] },
  } satisfies ParticleEffect,
  /** The bomber's engines. */
  exhaust: trail('#ffb070', '#140600', 0.4, 50, 0.6),
};
