import * as THREE from 'three';
import {Clouds, S} from './Clouds';
import type {Surface} from './Surface';
import type {Water} from './Water';
import {WATER_LEVEL, poolDistance} from './Ground';
import {TANK} from './Case';
import {WindField} from './WindField';
import {Rain} from './Rain';
import {Lightning} from './Lightning';
import {FogField} from './FogField';
import {FogVolume} from './FogVolume';
import {Wisps} from './Wisps';
import {noise3D} from './Noise3D';

const smooth = (a: number, b: number, x: number) => {const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t);};
const SUN_GOLD = new THREE.Color(1, 0.66, 0.36);
const SUN_LOW = new THREE.Color(1, 0.45, 0.22);

/**
 * The climate inside the glass: air that moves when stirred, clouds you can
 * grab, squeeze, shake into storms and merge; rain with splashes; lightning;
 * fog that pours and pools; humidity, wetness and the lamp's day.
 */
export class Weather {
  readonly wind = new WindField();
  readonly clouds: Clouds;
  readonly rain: Rain;
  readonly lightning: Lightning;
  readonly fog: FogField;
  readonly fogVolume: FogVolume;
  readonly wisps: Wisps;
  readonly group = new THREE.Group();
  humidity = 0.72; // 0..1 (a rainforest case runs humid)
  wet = 0; // overall wetness (leaves, rock, skin)
  hours = 11.5; // time of day, as set on the schedule
  timeFlow = 0; // hours per second (0 = paused)
  /** The lamp's own clock: it glides after the schedule, so the light never jumps. */
  sunHours = 11.5;
  /** Towards the lamp, which sweeps an arc like the sun (east in the morning, west at dusk). */
  readonly sunDir = new THREE.Vector3(0, 1, 0);
  /** Lamp height above the horizon (sine of elevation, below 0 at night). */
  sunElevation = 1;
  /** 0 night .. 1 full day; rises and falls over hours, not minutes. */
  daylight = 1;
  /** 0..1 how low and warm the light is (dawn, dusk). */
  golden = 0;
  /** The lamp's colour: white-gold at noon, amber then orange towards the horizon. */
  readonly sunColor = new THREE.Color(1, 0.88, 0.7);
  /** Called on each lightning stroke (first = the main return stroke). */
  onStrike?: (end: THREE.Vector3, strength: number, water: boolean, first: boolean, amp: number) => void;

  constructor(private surface: Surface, private water: Water) {
    const noise = noise3D();
    this.clouds = new Clouds(noise);
    this.updateSun(0);
    // clouds stay above the tallest thing under them
    this.clouds.floorAt = (x, z) => {
      let h = 0;
      for (const [dx, dz] of [[0, 0], [0.05, 0], [-0.05, 0], [0, 0.04], [0, -0.04]]) h = Math.max(h, surface.topAt(x + dx, z + dz));
      return h;
    };
    this.rain = new Rain((x, z) => surface.topAt(x, z), this.wind);
    this.rain.roofed = (x, z) => surface.roofed(x, z);
    this.rain.onWaterDrop = (x, z, s) => water.ripples.add(x, z, 0.0016 + 0.0012 * s, -(0.9 + 1.6 * s * 0.6));
    this.lightning = new Lightning((x, z) => surface.topAt(x, z));
    this.fog = new FogField((x, z) => surface.topAt(x, z), this.wind);
    this.fogVolume = new FogVolume(this.fog, noise, this.wind);
    this.wisps = new Wisps(this.wind, (x, z) => Math.max(surface.topAt(x, z), poolDistance(x, z) < 0 ? WATER_LEVEL : 0));
    this.group.add(this.clouds.group, this.rain.group, this.lightning.group, this.wisps.mesh, this.fogVolume.mesh, this.fogVolume.puffs);
    this.clouds.events.strike = (c, start, strength) => this.strike(c.pos, c.radius, start, strength);
    this.lightning.onStroke = (amp, b, first) => {
      if (first) {
        // the flash pushes the air out and kicks the water
        this.wind.addRadial(b.end.x, b.end.z, 0.25 * b.strength, 0.08);
        if (b.water) water.ripples.add(b.end.x, b.end.z, 0.012, -9 * b.strength);
      }
      this.onStrike?.(b.end, b.strength, b.water, first, amp);
    };
  }

  /** Picks where a bolt from `start` lands: high ground nearby, or the water. */
  private strike(centre: THREE.Vector3, radius: number, start: THREE.Vector3, strength: number) {
    const R = Math.max(0.066, 1.1 * radius);
    let best = new THREE.Vector3(centre.x, 0, centre.z), bs = -Infinity;
    for (let i = 0; i < 24; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * R;
      const x = THREE.MathUtils.clamp(centre.x + Math.cos(a) * r, -TANK.w / 2 + 0.02, TANK.w / 2 - 0.02);
      const z = THREE.MathUtils.clamp(centre.z + Math.sin(a) * r, -TANK.d / 2 + 0.02, TANK.d / 2 - 0.02);
      const h = Math.max(this.surface.topAt(x, z), poolDistance(x, z) < 0 ? WATER_LEVEL : 0);
      if (h > start.y - 0.03) continue; // nothing to strike above the cloud base
      const score = h - 0.35 * r + 0.35 * Math.random() * S;
      if (score > bs) {bs = score; best.set(x, h, z);}
    }
    if (!Number.isFinite(bs)) best = new THREE.Vector3(centre.x, this.surface.topAt(centre.x, centre.z), centre.z);
    const water = poolDistance(best.x, best.z) < 0 && best.y <= WATER_LEVEL + 0.001;
    if (water) best.y = WATER_LEVEL;
    this.lightning.strike(start, best, strength, water);
  }

  /**
   * Moves the lamp along its day like Weatherglass's sun: it rises at about
   * 6:15, climbs, sets at about 18:15; brightness follows its height, so mornings
   * and evenings brighten and fade gradually, warming towards the horizon. A
   * change on the schedule glides there over a second or two.
   */
  private updateSun(dt: number) {
    const d = ((this.hours - this.sunHours) % 24 + 36) % 24 - 12;
    this.sunHours = (this.sunHours + d * (1 - Math.exp(-dt * 2.2)) + 24) % 24;
    const a = (this.sunHours - 6.25) / 24 * Math.PI * 2;
    const tilt = 0.5;
    this.sunDir.set(-Math.cos(a) * 0.96, Math.sin(a) * Math.cos(tilt), Math.sin(a) * Math.sin(tilt) * 0.3 + 0.2).normalize();
    const y = this.sunDir.y;
    this.sunElevation = y;
    this.daylight = smooth(-0.2, 0.62, y); // twilight from ~5:15, full by ~9:30
    this.golden = smooth(-0.12, 0.04, y) * (1 - smooth(0.12, 0.45, y));
    this.sunColor.setRGB(1, 0.88, 0.7)
      .lerp(SUN_GOLD, smooth(0.45, 0.0, y))
      .lerp(SUN_LOW, smooth(0.12, -0.03, y));
  }
  get rainAmount() {return this.rain.amount;}
  get mist() {return Math.min(1, this.fog.total * 6);}
  get flash() {return this.lightning.flash;}

  // --- tools ---------------------------------------------------------------
  /** A wind stroke through (x, z) at velocity (vx, vz) m/s. */
  stroke(x: number, z: number, vx: number, vz: number) {
    this.wind.addForce(x, z, vx, vz, 0.075, 0.55);
    this.wisps.stroke(x, z, vx, vz);
  }

  /** Pours fog: `kind` press, drag or hold. */
  pourFog(x: number, z: number, kind: 'down' | 'move' | 'hold', dt = 0, holdT = 0, dir?: THREE.Vector2) {
    const y = this.fog.groundAt(x, z) + 0.01;
    if (kind === 'down') {
      this.fog.splat(x, z, 0.055, 0.3, 0.045, 0.08, 1);
      this.fogVolume.emit(x, y, z, 6);
    } else if (kind === 'move') {
      this.fog.splat(x, z, 0.05, 0.26, 0.042, 0.075, 1);
      const side = dir ? new THREE.Vector2(-dir.y, dir.x).multiplyScalar(0.05) : new THREE.Vector2();
      if (Math.random() < 0.5) this.fogVolume.emit(x, y, z, 1, side.x, side.y);
    } else {
      const R = 0.045 + 0.03 * Math.min(1, holdT / 2.5);
      this.fog.splat(x, z, R, 1.6 * dt, 0.05, 0.095, 1);
      if (Math.random() < 16 * dt) this.fogVolume.emit(x, y, z, 1);
    }
  }

  // --------------------------------------------------------------------------
  update(dt: number, time: number, camera: THREE.PerspectiveCamera) {
    this.hours = (this.hours + this.timeFlow * dt + 24) % 24;
    this.updateSun(dt);
    const day = this.daylight;
    this.wind.storm = this.clouds.storminess;
    this.wind.update(dt, day);
    this.clouds.update(dt, time, this.wind, this.humidity, day);
    this.rain.update(dt, this.clouds.sources, camera, day);
    this.lightning.update(dt, day);
    this.fog.update(dt, day, this.humidity);
    this.wisps.update(dt, camera);
    // humidity rises with rain and fog, and the lamp dries the air
    const rain = this.rain.amount;
    this.humidity = THREE.MathUtils.clamp(this.humidity + (rain * 0.012 + this.mist * 0.03 - (0.02 + 0.03 * day) * (this.humidity - 0.62)) * dt, 0.3, 1);
    this.wet = THREE.MathUtils.clamp(this.wet + (rain * 0.12 + this.mist * 0.01 - 0.012 - 0.025 * day) * dt, 0, 1);
  }

  /** Light from the lamp, in the colours the volumes and rain use. */
  setLight(day: number, keyColor: THREE.Color, keyPos: THREE.Vector3, ambient: THREE.Color) {
    const flash = this.lightning.flash * (1 - 0.5 * day);
    const cl = this.clouds.shared;
    cl.uLightPos.value.copy(keyPos);
    cl.uFlash.value = flash;
    const ru = this.rain.uniforms;
    ru.uLight.value.copy(keyColor).multiplyScalar(0.25 + 0.75 * day);
    ru.uLightPos.value.copy(keyPos);
    ru.uAmbient.value.copy(ambient);
    ru.uFlash.value = flash;
    const fu = this.fogVolume.uniforms;
    fu.uKeyPos.value.copy(keyPos);
    fu.uKeyColor.value.copy(keyColor).multiplyScalar(0.06 + 0.94 * day);
    fu.uAmbient.value.copy(ambient);
    fu.uFlash.value = flash;
    this.wisps.setLight(day);
  }

  setPixelScale(pixelsPerUnit: number) {
    this.fogVolume.setPixelScale(pixelsPerUnit);
    this.rain.setPixelScale(pixelsPerUnit);
    this.lightning.setPixelScale(pixelsPerUnit);
  }

  setResolution(w: number, h: number) {
    this.rain.setResolution(w, h);
    this.lightning.setResolution(w, h);
    this.clouds.shared.uResolution.value.set(w, h);
    this.fogVolume.uniforms.uResolution.value.set(w, h);
  }

  /** Gives the volumes the scene's camera distances for the glass pass. */
  setDistance(tex: THREE.Texture | null) {
    this.clouds.shared.tDepth.value = tex;
    this.clouds.shared.uUseDepth.value = tex ? 1 : 0;
    this.fogVolume.uniforms.tDepth.value = tex;
    this.fogVolume.uniforms.uUseDepth.value = tex ? 1 : 0;
  }
}
