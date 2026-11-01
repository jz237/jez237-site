import { Color } from 'three';
import type { ParticleEffect } from '@scenoco-three/particles';

/** Something breaking: a burst of sparks in its colour, thrown out of the field and falling back. */
function shatter(color: string, count = 30, speed = 7, size = 0.24, life = 0.7): ParticleEffect {
  return {
    duration: 0.5,
    looping: false,
    startLifetime: life,
    startSpeed: speed,
    startSize: size,
    startColor: new Color(color),
    gravityModifier: 0.6,
    simulationSpace: 'World',
    emission: { rateOverTime: 0, bursts: [{ time: 0, count }] },
    shape: { type: 'Sphere', radius: 0.35 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [1, 0.7, 0] },
    colorOverLifetime: { colors: [new Color('#ffffff'), new Color(color), new Color(color).multiplyScalar(0.15)] },
  };
}

export const vfx = {
  segment: shatter('#16e0ff', 30),
  queen: shatter('#ffd23f', 48, 9, 0.3, 0.9),
  child: shatter('#8eff4a', 22, 6),
  armor: shatter('#9fdcff', 10, 5, 0.16, 0.35),
  shroom: shatter('#ffa21c', 16, 4.5, 0.2, 0.55),
  poison: shatter('#c04bff', 18, 4.5, 0.22, 0.6),
  spider: shatter('#ff3b4b', 40, 8),
  bug: shatter('#ffe9a8', 32, 7),
  scorpion: shatter('#ff7a2f', 40, 8),
  inchworm: shatter('#5ab8ff', 44, 8, 0.28, 0.9),
  pickup: shatter('#ffffff', 36, 6, 0.22, 0.6),
  player: shatter('#ffffff', 90, 13, 0.36, 1.2),
  /** A bolt striking: a small hot flash. */
  spark: {
    duration: 0.15,
    looping: false,
    startLifetime: 0.25,
    startSpeed: 4.5,
    startSize: 0.18,
    startColor: new Color('#ff7d9b'),
    simulationSpace: 'World',
    emission: { rateOverTime: 0, bursts: [{ time: 0, count: 9 }] },
    shape: { type: 'Hemisphere', radius: 0.1 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [1, 0] },
  } satisfies ParticleEffect,
  /** The gunner's thrusters: a short blue wash under it. */
  thrust: {
    looping: true,
    startLifetime: 0.28,
    startSpeed: 1.6,
    startSize: 0.34,
    startColor: new Color('#6fc8ff'),
    simulationSpace: 'World',
    emission: { rateOverTime: 55 },
    shape: { type: 'Cone', radius: 0.12, angle: 18 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [1, 0.4, 0] },
    colorOverLifetime: { colors: [new Color('#e6f6ff'), new Color('#3b8bff'), new Color('#020818')] },
  } satisfies ParticleEffect,
  /** An escort drone's short gold wake. */
  droneTrail: {
    looping: true,
    startLifetime: 0.35,
    startSpeed: 0.1,
    startSize: 0.3,
    startColor: new Color('#ffd23f'),
    simulationSpace: 'World',
    emission: { rateOverTime: 45 },
    shape: { type: 'Sphere', radius: 0.05 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [1, 0.3, 0] },
    colorOverLifetime: { colors: [new Color('#fff6c8'), new Color('#ffa21c'), new Color('#1a0c00')] },
  } satisfies ParticleEffect,
  /** A poison spore's tail as it arcs over the field. */
  sporeTrail: {
    looping: true,
    startLifetime: 0.4,
    startSpeed: 0.3,
    startSize: 0.4,
    startColor: new Color('#ff3dd8'),
    simulationSpace: 'World',
    emission: { rateOverTime: 60 },
    shape: { type: 'Sphere', radius: 0.08 },
    renderer: { blending: 'Additive' },
    sizeOverLifetime: { curve: [1, 0.4, 0] },
    colorOverLifetime: { colors: [new Color('#ffd0f6'), new Color('#ff3dd8'), new Color('#1a0016')] },
  } satisfies ParticleEffect,
};
