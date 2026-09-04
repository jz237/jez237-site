/**
 * Structures layer — the THREE half.
 *
 * Buildings arrive per zone and per height tier as pre-sorted binary streams
 * (tallest first). Each tier becomes exactly one draw call whose draw range is
 * a prefix of the tallest buildings, so the density slider and the quality
 * mode simply move that prefix. Whole tiers frustum-cull as a unit and grow
 * out of the ground as the camera approaches their range.
 *
 * Bridges are one solid draw call (decks, piers, towers) and one line draw
 * call (cables, hangers, chords) for every bridge together.
 *
 * Bounded cost: at most zones x tiers + 2 draw calls, no per-structure
 * objects, no DOM.
 */

import { hexToRgb } from './themes.js';
import {
  parseTier, extrudeBuildings, buildBridge, mergeSolids, tierGrow, drawFraction,
  drawIndexCount, heightScale, distanceToBox, TIER_ORDER, resample,
} from './structures-data.js';
import { damp } from './geo.js';

const VERTEX_SHADER = /* glsl */ `
  attribute float aGround;     // DEM elevation under the structure, metres
  attribute vec2  aInfo;       // (structure height, base offset), metres

  uniform float uExag;         // terrain exaggeration
  uniform float uHScale;       // structural vertical scale
  uniform float uGrow;         // 0..1 rise-from-the-ground factor

  varying vec3  vWorld;
  varying float vElev;         // real ground elevation, for the haze
  varying float vRel;          // 0 at the base, 1 at the roof

  void main() {
    float structural = (aInfo.y + position.y) * uGrow;
    vec3 p = vec3(position.x, aGround * uExag + structural * uHScale + 0.5, position.z);
    vWorld = p;
    vElev = aGround;
    vRel = aInfo.x > 0.0 ? clamp(position.y / aInfo.x, 0.0, 1.0) : 0.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3  uWall;
  uniform vec3  uRoof;
  uniform vec3  uGlow;
  uniform float uGlowAmount;
  uniform vec3  uSunDir;
  uniform vec3  uSunColor;
  uniform vec3  uSkyColor;
  uniform vec3  uFogColor;
  uniform vec3  uFogTint;
  uniform vec3  uCameraPos;
  uniform float uKey;
  uniform float uAmbient;
  uniform float uFogDensity;
  uniform float uExposure;

  varying vec3  vWorld;
  varying float vElev;
  varying float vRel;

  void main() {
    // Flat face normal from screen-space derivatives: no normal attribute,
    // shared ring vertices, crisp edges.
    vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    vec3 viewDir = normalize(uCameraPos - vWorld);
    if (dot(n, viewDir) < 0.0) n = -n;

    float roof = smoothstep(0.55, 0.85, n.y);
    vec3 base = mix(uWall, uRoof, roof);

    // A touch of darkening toward the base, where streets and neighbours
    // shadow the lower storeys.
    base *= mix(0.8, 1.0, vRel);

    // Faces turned away from a low sun are most of what a skyline shows, so
    // the wrap is generous and the sky fill is hemispheric rather than
    // top-only; otherwise the city is a black cut-out at dusk.
    float ndl = dot(n, uSunDir);
    float diffuse = max(0.0, ndl);
    float wrapped = max(0.0, (ndl + 0.65) / 1.65);
    vec3 key = uSunColor * uKey * 0.85 * mix(diffuse, wrapped, 0.6);
    vec3 sky = uSkyColor * uAmbient * (0.85 + 0.15 * n.y);
    // Ground bounce warms the shadow side a little.
    vec3 bounce = uFogColor * uAmbient * 0.35 * max(0.0, -ndl);
    vec3 color = base * (key + sky + bounce) * uExposure;

    // Night themes light the upper floors; restrained so towers read as
    // lit buildings, not lanterns.
    color += uGlow * uGlowAmount * (0.35 + 0.65 * vRel) * (1.0 - roof * 0.8);

    vec3 toFrag = vWorld - uCameraPos;
    float dist = length(toFrag);
    float depth = dist * uFogDensity * exp(-max(0.0, vElev) / 260.0);
    float fog = 1.0 - exp(-depth * depth);
    float towardSun = max(0.0, dot(normalize(toFrag), uSunDir));
    vec3 fogColor = mix(uFogColor, uFogTint, pow(towardSun, 3.0));
    color = mix(color, fogColor, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Thin members (cables, chords, hangers): a screen-space ribbon whose height
// is ground*exag + structural*hScale, like the solids.
const LINE_VERTEX = /* glsl */ `
  attribute vec3  aOther;
  attribute float aSide;
  attribute float aElev;
  attribute float aOtherElev;
  attribute float aStruct;
  attribute float aOtherStruct;

  uniform vec2  uResolution;
  uniform float uWidth;
  uniform float uExag;
  uniform float uHScale;
  uniform float uGrow;
  uniform float uNear;

  varying float vAlong;

  void main() {
    vec3 a = vec3(position.x, aElev * uExag + aStruct * uHScale * uGrow + 0.5, position.z);
    vec3 b = vec3(aOther.x, aOtherElev * uExag + aOtherStruct * uHScale * uGrow + 0.5, aOther.z);

    vec4 va = modelViewMatrix * vec4(a, 1.0);
    vec4 vb = modelViewMatrix * vec4(b, 1.0);
    float nearZ = -uNear;
    if (va.z > nearZ && vb.z < nearZ) {
      va.xyz = mix(va.xyz, vb.xyz, (nearZ - va.z) / (vb.z - va.z));
    } else if (vb.z > nearZ && va.z < nearZ) {
      vb.xyz = mix(vb.xyz, va.xyz, (nearZ - vb.z) / (va.z - vb.z));
    }
    vec4 ca = projectionMatrix * va;
    vec4 cb = projectionMatrix * vb;
    vec2 sa = (ca.xy / max(ca.w, 1e-6)) * uResolution;
    vec2 sb = (cb.xy / max(cb.w, 1e-6)) * uResolution;
    vec2 dir = sb - sa;
    float len = length(dir);
    dir = len > 1e-5 ? dir / len : vec2(1.0, 0.0);
    vec2 perp = vec2(-dir.y, dir.x);
    vAlong = aSide;
    ca.xy += (perp * aSide * uWidth * 0.5 / uResolution) * ca.w;
    gl_Position = ca;
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlong;
  void main() {
    float edge = 1.0 - smoothstep(0.5, 1.0, abs(vAlong));
    gl_FragColor = vec4(uColor, uOpacity * edge);
    if (gl_FragColor.a < 0.004) discard;
  }
`;

export function createStructures(THREE, options) {
  const { manifest, tierBuffers, bridgesDoc, projection, sampleElevation, quality } = options;

  const group = new THREE.Group();
  group.name = 'structures';

  const groundAt = (x, z) => sampleElevation(projection.xToLon(x), projection.zToLat(z));

  const sharedUniforms = {
    uExag: { value: 10 },
    uHScale: { value: 1 },
    uSunDir: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
    uSunColor: { value: new THREE.Vector3(1, 1, 1) },
    uSkyColor: { value: new THREE.Vector3(0.4, 0.5, 0.7) },
    uFogColor: { value: new THREE.Vector3(0.7, 0.6, 0.5) },
    uFogTint: { value: new THREE.Vector3(1, 0.8, 0.5) },
    uCameraPos: { value: new THREE.Vector3() },
    uKey: { value: 1.2 },
    uAmbient: { value: 0.42 },
    uFogDensity: { value: 1e-5 },
    uExposure: { value: 2.1 },
    uWall: { value: new THREE.Vector3(0.6, 0.55, 0.5) },
    uRoof: { value: new THREE.Vector3(0.4, 0.37, 0.34) },
    uGlow: { value: new THREE.Vector3(1, 0.7, 0.4) },
    uGlowAmount: { value: 0 },
  };

  function makeSolidMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: { ...sharedUniforms, uGrow: { value: 1 } },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side: THREE.DoubleSide,
      extensions: { derivatives: true },
    });
  }

  function solidGeometry(packed) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(packed.position, 3));
    geometry.setAttribute('aGround', new THREE.BufferAttribute(packed.ground, 1));
    geometry.setAttribute('aInfo', new THREE.BufferAttribute(packed.info, 2));
    geometry.setIndex(new THREE.BufferAttribute(packed.index, 1));
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
    return geometry;
  }

  // ---- building tiers -----------------------------------------------------
  const tiers = [];   // { zone, tier, mesh, packed, box, grow }
  let buildingTotal = 0;

  function addTier(zone, tierMeta, buffer) {
    const parsed = parseTier(buffer);
    const originX = projection.lonToX(zone.origin.lon);
    const originZ = projection.latToZ(zone.origin.lat);
    const packed = extrudeBuildings(parsed.buildings, { originX, originZ, groundAt });
    const geometry = solidGeometry(packed);
    const mesh = new THREE.Mesh(geometry, makeSolidMaterial());
    mesh.name = `structures-${zone.id}-${tierMeta.tier}`;
    mesh.renderOrder = 20;
    // Bounding volumes are honest here (positions are real world xz, and the
    // vertical range is small next to the horizontal), so let three cull.
    mesh.frustumCulled = true;
    // Stretch the bounds vertically for the largest exaggeration the sliders
    // allow, so a skyline is never culled while it is still on screen.
    // Positions hold raw structural heights; the shader adds ground * exag
    // and scales the rest, so the true vertical extent can exceed the stored
    // one by several kilometres at the far end of the sliders. Pad the sphere
    // so three never culls a skyline that is still on screen.
    geometry.boundingSphere.radius += 6000;
    group.add(mesh);
    const box = {
      minX: projection.lonToX(zone.bounds.west), maxX: projection.lonToX(zone.bounds.east),
      minZ: projection.latToZ(zone.bounds.north), maxZ: projection.latToZ(zone.bounds.south),
    };
    tiers.push({ zone: zone.id, tier: tierMeta.tier, mesh, packed, box, grow: 0,
      count: parsed.count, meta: tierMeta });
    buildingTotal += parsed.count;
    return parsed.count;
  }

  for (const zone of manifest?.zones || []) {
    for (const tierMeta of zone.tiers || []) {
      const buffer = tierBuffers?.get?.(tierMeta.file);
      if (buffer) addTier(zone, tierMeta, buffer);
    }
  }

  // ---- bridges ------------------------------------------------------------
  let bridgeSolid = null;
  let bridgeLines = null;
  const bridgeInfo = [];

  if (bridgesDoc?.bridges?.length) {
    const solidParts = [];
    const lineSegs = [];
    for (const spec of bridgesDoc.bridges) {
      const worldLine = (spec.centerline || []).map(([lon, lat]) =>
        [projection.lonToX(lon), projection.latToZ(lat)]);
      if (worldLine.length < 2) continue;
      const built = buildBridge(spec, resample(worldLine, 40), groundAt);
      if (!built) continue;
      solidParts.push(built.solids);
      lineSegs.push(...built.lines);
      bridgeInfo.push({ id: spec.id, name: spec.name, type: spec.type,
        lengthM: Math.round(built.lengthM), lines: built.lines.length });
    }
    if (solidParts.length) {
      const merged = mergeSolids(solidParts);
      const mesh = new THREE.Mesh(solidGeometry(merged), makeSolidMaterial());
      mesh.name = 'structures-bridges';
      mesh.renderOrder = 21;
      mesh.frustumCulled = false;
      group.add(mesh);
      bridgeSolid = { mesh, packed: merged };
    }
    if (lineSegs.length) {
      bridgeLines = buildLineSegments(THREE, lineSegs);
      group.add(bridgeLines.mesh);
    }
  }

  function buildLineSegments(THREE3, segs) {
    const n = segs.length;
    const position = new Float32Array(n * 4 * 3);
    const other = new Float32Array(n * 4 * 3);
    const side = new Float32Array(n * 4);
    const elev = new Float32Array(n * 4);
    const otherElev = new Float32Array(n * 4);
    const struct = new Float32Array(n * 4);
    const otherStruct = new Float32Array(n * 4);
    const index = new Uint32Array(n * 6);
    let v = 0;
    let i = 0;
    for (const s of segs) {
      for (let k = 0; k < 4; k += 1) {
        const atStart = k < 2;
        const idx = v + k;
        position[idx * 3] = atStart ? s.a[0] : s.b[0];
        position[idx * 3 + 2] = atStart ? s.a[1] : s.b[1];
        other[idx * 3] = atStart ? s.b[0] : s.a[0];
        other[idx * 3 + 2] = atStart ? s.b[1] : s.a[1];
        elev[idx] = atStart ? s.ga : s.gb;
        otherElev[idx] = atStart ? s.gb : s.ga;
        struct[idx] = atStart ? s.sa : s.sb;
        otherStruct[idx] = atStart ? s.sb : s.sa;
        side[idx] = k % 2 === 0 ? -1 : 1;
      }
      index[i] = v; index[i + 1] = v + 1; index[i + 2] = v + 2;
      index[i + 3] = v + 2; index[i + 4] = v + 1; index[i + 5] = v + 3;
      v += 4;
      i += 6;
    }
    const geometry = new THREE3.BufferGeometry();
    geometry.setAttribute('position', new THREE3.BufferAttribute(position, 3));
    geometry.setAttribute('aOther', new THREE3.BufferAttribute(other, 3));
    geometry.setAttribute('aSide', new THREE3.BufferAttribute(side, 1));
    geometry.setAttribute('aElev', new THREE3.BufferAttribute(elev, 1));
    geometry.setAttribute('aOtherElev', new THREE3.BufferAttribute(otherElev, 1));
    geometry.setAttribute('aStruct', new THREE3.BufferAttribute(struct, 1));
    geometry.setAttribute('aOtherStruct', new THREE3.BufferAttribute(otherStruct, 1));
    geometry.setIndex(new THREE3.BufferAttribute(index, 1));
    const material = new THREE3.ShaderMaterial({
      uniforms: {
        uResolution: { value: new THREE3.Vector2(1, 1) },
        uWidth: { value: 1.6 },
        uColor: { value: new THREE3.Vector3(0.9, 0.9, 0.9) },
        uOpacity: { value: 0.9 },
        uExag: { value: 10 },
        uHScale: { value: 1 },
        uGrow: { value: 1 },
        uNear: { value: 1 },
      },
      vertexShader: LINE_VERTEX,
      fragmentShader: LINE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE3.DoubleSide,
    });
    const mesh = new THREE3.Mesh(geometry, material);
    mesh.name = 'structures-bridge-lines';
    mesh.renderOrder = 22;
    mesh.frustumCulled = false;
    return { mesh, material, segments: n };
  }

  // ---- per-frame ----------------------------------------------------------
  const camXZ = { x: 0, z: 0 };
  let lastStats = { drawnBuildings: 0, drawCalls: 0, tiers: [] };

  function update(ctx) {
    const { camera, state, exaggeration, dt, sunDir, fogDensity } = ctx;
    const on = !!state.layers.structures;
    group.visible = on;
    if (!on) {
      lastStats = { drawnBuildings: 0, drawCalls: 0, tiers: [] };
      return lastStats;
    }
    const hScale = heightScale(exaggeration, state.structureHeight);
    const detail = state.structureDetail;
    const q = state.quality;
    camXZ.x = camera.position.x;
    camXZ.z = camera.position.z;

    sharedUniforms.uExag.value = exaggeration;
    sharedUniforms.uHScale.value = hScale;
    sharedUniforms.uSunDir.value.copy(sunDir);
    sharedUniforms.uCameraPos.value.copy(camera.position);
    sharedUniforms.uKey.value = state.keyLight;
    sharedUniforms.uAmbient.value = state.ambient;
    sharedUniforms.uFogDensity.value = fogDensity;

    const fraction = drawFraction(q, detail);
    let drawn = 0;
    let calls = 0;
    const tierStats = [];
    for (const t of tiers) {
      const d = distanceToBox(camXZ.x, camXZ.z, t.box);
      const target = tierGrow(t.tier, d, q, detail);
      t.grow = damp(t.grow, target, target > t.grow ? 0.18 : 0.1, dt);
      if (t.grow < 0.01) t.grow = target > 0 ? t.grow : 0;
      const visible = t.grow > 0.005;
      t.mesh.visible = visible;
      if (!visible) continue;
      t.mesh.material.uniforms.uGrow.value = t.grow;
      const count = drawIndexCount(t.packed, fraction);
      t.mesh.geometry.setDrawRange(0, count);
      const buildings = Math.round(t.packed.buildingCount * fraction);
      drawn += buildings;
      calls += 1;
      tierStats.push({ zone: t.zone, tier: t.tier, buildings, grow: Number(t.grow.toFixed(2)),
        distanceKm: Number((d / 1000).toFixed(1)) });
    }

    // Bridges are big enough to keep at every range the tall tier uses.
    const bridgeGrow = tiers.length ? Math.max(0.35, tiers.reduce((m, t) => Math.max(m, t.grow), 0)) : 1;
    if (bridgeSolid) {
      bridgeSolid.mesh.material.uniforms.uGrow.value = 1;
      bridgeSolid.mesh.visible = true;
      calls += 1;
    }
    if (bridgeLines) {
      const u = bridgeLines.material.uniforms;
      u.uExag.value = exaggeration;
      u.uHScale.value = hScale;
      u.uGrow.value = 1;
      u.uNear.value = camera.near;
      bridgeLines.mesh.visible = bridgeGrow > 0;
      calls += 1;
    }

    lastStats = { drawnBuildings: drawn, drawCalls: calls, tiers: tierStats,
      fraction: Number(fraction.toFixed(2)), hScale: Number(hScale.toFixed(2)) };
    return lastStats;
  }

  return {
    group,
    tiers,
    bridges: bridgeInfo,
    update,

    get buildingTotal() { return buildingTotal; },
    get loadedTiers() { return tiers.map((t) => `${t.zone}/${t.tier}`); },
    stats() { return lastStats; },

    /** Attach a tier that was fetched after start-up (quality raised). */
    addTier,

    /** Drop a tier's GPU memory (quality lowered on a phone). */
    removeTier(zoneId, tierName) {
      const idx = tiers.findIndex((t) => t.zone === zoneId && t.tier === tierName);
      if (idx < 0) return false;
      const [t] = tiers.splice(idx, 1);
      group.remove(t.mesh);
      t.mesh.geometry.dispose();
      t.mesh.material.dispose();
      buildingTotal -= t.count;
      return true;
    },

    hasTier(zoneId, tierName) {
      return tiers.some((t) => t.zone === zoneId && t.tier === tierName);
    },

    setResolution(w, h) {
      if (bridgeLines) bridgeLines.material.uniforms.uResolution.value.set(w, h);
    },

    setTheme(theme) {
      const s = theme.structure || {};
      setVec3(sharedUniforms.uWall.value, s.wall || '#8a8078');
      setVec3(sharedUniforms.uRoof.value, s.roof || '#5f5750');
      setVec3(sharedUniforms.uGlow.value, s.glow || '#ffb964');
      sharedUniforms.uGlowAmount.value = s.glowAmount ?? 0;
      setVec3(sharedUniforms.uSunColor.value, theme.sunColor);
      setVec3(sharedUniforms.uSkyColor.value, theme.skyFill || theme.skyHorizon);
      setVec3(sharedUniforms.uFogColor.value, theme.fog);
      setVec3(sharedUniforms.uFogTint.value, theme.fogTint);
      if (bridgeLines) setVec3(bridgeLines.material.uniforms.uColor.value, s.cable || '#e8e0d6');
    },

    dispose() {
      for (const t of tiers) {
        t.mesh.geometry.dispose();
        t.mesh.material.dispose();
      }
      tiers.length = 0;
      if (bridgeSolid) {
        bridgeSolid.mesh.geometry.dispose();
        bridgeSolid.mesh.material.dispose();
      }
      if (bridgeLines) {
        bridgeLines.mesh.geometry.dispose();
        bridgeLines.material.dispose();
      }
      group.parent?.remove(group);
    },
  };
}

function setVec3(target, hex) {
  const [r, g, b] = hexToRgb(hex, true);
  target.set(r, g, b);
}
