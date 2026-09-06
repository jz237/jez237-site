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

import { hexToRgb } from './themes.js?v=philly-2026090610';
import {
  parseTier, extrudeBuildings, buildBridge, mergeSolids, tierGrow, drawFraction,
  drawIndexCount, heightScale, distanceToBox, distanceToFootprint, TIER_ORDER, resample,
} from './structures-data.js?v=philly-2026090610';
import { damp } from './geo.js?v=philly-2026090610';

const VERTEX_SHADER = /* glsl */ `
  attribute float aGround;     // DEM elevation under the structure, metres
  attribute vec2  aInfo;       // (structure height, base offset), metres
  attribute float aYear;       // documented construction year, 0 = undated
  varying float vYear;
  varying float vHeight;
  varying float vStorey;
  varying float vStyle;
  #ifdef LANDMARK
  attribute vec4 aClock;
  varying vec4 vClock;
  attribute float aStyle;
  attribute float aModel;      // which schematic model this vertex belongs to
  varying float vModel;
  #endif

  uniform float uExag;         // terrain exaggeration
  uniform float uHScale;       // structural vertical scale
  uniform float uGrow;         // 0..1 rise-from-the-ground factor

  varying vec3  vWorld;
  varying float vElev;         // real ground elevation, for the haze
  varying float vRel;          // 0 at the base, 1 at the roof

  void main() {
    // Landmark models store absolute structural y (base already included).
    #ifdef LANDMARK
    float structural = position.y * uGrow;
    vModel = aModel;
    vStyle = aStyle;
    vClock = vec4(aClock.x, aGround * uExag + aClock.y * uHScale, aClock.z, aClock.w);
    #else
    float structural = (aInfo.y + position.y) * uGrow;
    vStyle = smoothstep(24.0, 65.0, aInfo.x);
    #endif
    vec3 p = vec3(position.x, aGround * uExag + structural * uHScale + 0.5, position.z);
    vHeight = aInfo.x;
    vStorey = position.y;
    vWorld = p;
    vElev = aGround;
    vRel = aInfo.x > 0.0 ? clamp((position.y - aInfo.y) / aInfo.x, 0.0, 1.0) : 0.0;
    vYear = aYear;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uFacade;
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
  uniform float uEraYear;      // 9999 = present; else the era's year
  uniform float uHybrid;
  uniform float uCompareHistory;
  uniform float uComparePosition;
  uniform float uViewportWidth;
  varying float vYear;
  varying float vHeight;
  varying float vStorey;
  varying float vStyle;
  #ifdef LANDMARK
  varying vec4 vClock;
  uniform float uSelected;
  uniform vec3  uHighlight;
  uniform float uPulse;
  varying float vModel;
  #endif

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
    vec3 surveyNeutral = mix(vec3(0.18, 0.21, 0.23), vec3(0.34, 0.37, 0.38), roof);
    // Procedural architectural finishes, illustrative rather than surveyed facades.
    vec3 tangent = normalize(vec3(n.z, 0.0, -n.x) + vec3(0.00001));
    float across = dot(vWorld, tangent);
    vec2 bay = vec2(across / mix(2.6, 3.2, vStyle), vStorey / mix(3.2, 3.8, vStyle));
    vec2 cell = fract(bay);
    vec2 aa = max(fwidth(bay), vec2(0.015));
    float legible = 1.0 - smoothstep(0.65, 1.5, max(aa.x, aa.y));
    vec2 opening = smoothstep(vec2(0.16), vec2(0.16) + aa, cell)
      * (1.0 - smoothstep(vec2(0.78) - aa, vec2(0.78), cell));
    float window = opening.x * opening.y * (1.0 - roof) * legible * uFacade;
    float variation = fract(sin(floor(vHeight) * 71.17) * 43758.54);
    vec3 masonry = mix(vec3(0.25, 0.10, 0.065), vec3(0.48, 0.38, 0.27), variation);
    #ifdef LANDMARK
    masonry = vec3(0.64, 0.60, 0.49);
    #endif
    vec3 glass = mix(vec3(0.018, 0.052, 0.08), vec3(0.09, 0.19, 0.25), max(0.0, n.y + 0.45));
    vec3 facade = mix(masonry, vec3(0.18, 0.24, 0.28), vStyle);
    facade = mix(facade, glass, window);
    float course = (1.0 - smoothstep(0.03, 0.03 + aa.y, cell.y)) * legible;
    facade = mix(facade, vec3(0.53, 0.49, 0.40), course * (1.0 - vStyle) * 0.55);
    float cornice = smoothstep(0.96, 0.985, vRel) * (1.0 - roof);
    facade = mix(facade, vec3(0.48, 0.45, 0.37), cornice * (1.0 - vStyle));
    vec2 roofCell = fract(vWorld.xz / 18.0);
    vec2 roofAA = max(fwidth(vWorld.xz / 18.0), vec2(0.015));
    vec2 vent = smoothstep(vec2(0.34), vec2(0.34) + roofAA, roofCell)
      * (1.0 - smoothstep(vec2(0.55) - roofAA, vec2(0.55), roofCell));
    float roofOccupied = step(0.86, fract(sin(dot(floor(vWorld.xz / 18.0), vec2(32.7, 91.2))) * 43758.5));
    float roofDetail = vent.x * vent.y * roofOccupied
      * (1.0 - smoothstep(0.2, 0.6, max(roofAA.x, roofAA.y)));
    vec3 roofFinish = uRoof * mix(0.48, 0.82, variation);
    roofFinish = mix(roofFinish, vec3(0.12, 0.14, 0.14), roofDetail);
    base = mix(base, mix(facade, roofFinish, roof), uFacade);
    #ifdef LANDMARK
    if (vClock.w > 0.0 && roof < 0.1) {
      vec2 dial = vec2(dot(vWorld.xz - vClock.xz, tangent.xz), vWorld.y - vClock.y) / vClock.w;
      float ring = length(dial);
      float clockAA = max(fwidth(ring), 0.015);
      float disk = 1.0 - smoothstep(0.93, 0.93 + clockAA, ring);
      vec3 clockColor = vec3(0.87, 0.83, 0.68);
      float tick = step(0.90, cos(atan(dial.y, dial.x) * 12.0)) * smoothstep(0.7, 0.76, ring);
      float minute = (1.0 - smoothstep(0.04, 0.07, abs(dot(dial, vec2(0.5, -0.866)))))
        * step(0.0, dot(dial, vec2(0.866, 0.5))) * (1.0 - step(0.73, ring));
      float hour = (1.0 - smoothstep(0.055, 0.085, abs(dot(dial, vec2(0.5, 0.866)))))
        * step(0.0, dot(dial, vec2(-0.866, 0.5))) * (1.0 - step(0.5, ring));
      clockColor = mix(clockColor, vec3(0.035, 0.045, 0.04), max(tick, max(minute, hour)));
      base = mix(base, clockColor, disk);
    }
    #endif

    // A touch of darkening toward the base, where streets and neighbours
    // shadow the lower storeys.
    base *= mix(0.8, 1.0, vRel);

    // Faces turned away from a low sun are most of what a skyline shows, so
    // the wrap is generous and the sky fill is hemispheric rather than
    // top-only; otherwise the city is a black cut-out at dusk.
    float ndl = dot(n, uSunDir);
    float diffuse = max(0.0, ndl);
    float wrapped = max(0.0, (ndl + 0.35) / 1.35);
    vec3 key = uSunColor * uKey * 0.85 * mix(diffuse, wrapped, 0.35);
    vec3 sky = uSkyColor * uAmbient * (0.85 + 0.15 * n.y);
    // Ground bounce warms the shadow side a little.
    vec3 bounce = uFogColor * uAmbient * 0.35 * max(0.0, -ndl);
    vec3 color = base * (key + sky + bounce) * uExposure;
    // Keep the aerial overlay chromatically neutral even under the warm dusk
    // sun.  The geometry is a survey aid here, not a second painted city.
    float reflection = pow(1.0 - max(0.0, dot(n, viewDir)), 3.0);
    color += uSkyColor * reflection * window * vStyle * 0.32;
    float occupied = step(0.64, fract(sin(dot(floor(bay), vec2(12.9898, 78.233))) * 43758.5));
    color += vec3(1.0, 0.67, 0.28) * occupied * window * uGlowAmount * 1.8;

    // Historical views: documented-newer buildings vanish; undated ones fade
    // into the haze, because a missing date is not a missing building.
    float displayYear = uEraYear;
    if (uCompareHistory > 0.5
        && gl_FragCoord.x / max(uViewportWidth, 1.0) < uComparePosition) {
      displayYear = 9999.0;
    }
    if (displayYear < 9000.0) {
      if (vYear > displayYear) discard;
      if (vYear < 1.0) {
        // Ghost: a 2 px screen-space checker keeps every other pixel, so the
        // undated fabric reads as a hatched shadow in any theme, and what
        // remains is dimmed and pulled toward the haze.
        vec2 cell = floor(gl_FragCoord.xy * 0.5);
        if (mod(cell.x + cell.y, 2.0) < 1.0) discard;
        color = mix(color, uFogColor, 0.45) * 0.55;
      }
    }

    // Night themes light the upper floors; restrained so towers read as
    // lit buildings, not lanterns.
    color += uGlow * uGlowAmount * (0.35 + 0.65 * vRel) * (1.0 - roof * 0.8)
      * (1.0 - uHybrid);

    #ifdef LANDMARK
    // A selected model glows with the accent colour and breathes gently.
    if (uSelected >= 0.0 && abs(vModel - uSelected) < 0.5) {
      color = mix(color, uHighlight, 0.42 + 0.18 * uPulse);
    }
    #endif

    // In aerial mode, keep roof forms and façade direction without painting
    // opaque blocks over the photography. Screen-door transparency preserves
    // correct depth ordering across the consolidated building meshes.
    if (uHybrid > 0.001) {
      float keep = mix(0.08, 0.24, roof) * uHybrid + (1.0 - uHybrid);
      vec2 ditherCell = floor(gl_FragCoord.xy);
      float threshold = fract(ditherCell.x * 0.75487766 + ditherCell.y * 0.56984029);
      if (threshold > keep) discard;
    }

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
  attribute float aYear;
  varying float vYear;
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
    vYear = aYear;
    ca.xy += (perp * aSide * uWidth * 0.5 / uResolution) * ca.w;
    gl_Position = ca;
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform float uEraYear;
  varying float vAlong;
  varying float vYear;
  void main() {
    if (uEraYear < 9000.0 && vYear > uEraYear) discard;
    float edge = 1.0 - smoothstep(0.5, 1.0, abs(vAlong));
    gl_FragColor = vec4(uColor, uOpacity * edge);
    if (gl_FragColor.a < 0.004) discard;
  }
`;

export function createStructures(THREE, options) {
  const { manifest, tierBuffers, bridgesDoc, landmarkModels, projection, sampleElevation,
    quality } = options;

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
    uEraYear: { value: 9999 },
    uAmbient: { value: 0.42 },
    uFogDensity: { value: 1e-5 },
    uExposure: { value: 1.25 },
    uWall: { value: new THREE.Vector3(0.6, 0.55, 0.5) },
    uRoof: { value: new THREE.Vector3(0.4, 0.37, 0.34) },
    uGlow: { value: new THREE.Vector3(1, 0.7, 0.4) },
    uGlowAmount: { value: 0 },
    uHybrid: { value: 0 },
    uCompareHistory: { value: 0 },
    uComparePosition: { value: 0.5 },
    uViewportWidth: { value: 1 },
  };

  function makeSolidMaterial(landmark = false, facade = true) {
    const uniforms = { ...sharedUniforms, uGrow: { value: 1 }, uFacade: { value: facade ? 1 : 0 } };
    if (landmark) {
      uniforms.uSelected = { value: -1 };
      uniforms.uHighlight = { value: new THREE.Vector3(1, 0.7, 0.4) };
      uniforms.uPulse = { value: 0 };
    }
    return new THREE.ShaderMaterial({
      uniforms,
      defines: landmark ? { LANDMARK: 1 } : {},
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
    geometry.setAttribute('aYear', new THREE.BufferAttribute(
      packed.year || new Float32Array(packed.vertexCount), 1));
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
    // Replace only footprints inside an authored landmark footprint, avoiding duplicate volumes.
    parsed.buildings = parsed.buildings.filter((building) => {
      let x = 0, z = 0;
      for (let i = 0; i < building.poly.length; i += 2) {
        x += building.poly[i]; z += building.poly[i + 1];
      }
      const count = building.poly.length / 2;
      x = x / count + originX; z = z / count + originZ;
      return !(landmarkModels?.models || []).some((m) => m.replaceRadius > 0
        && building.height >= m.replaceMinHeight && Math.hypot(x - m.x, z - m.z) < m.replaceRadius);
    });
    parsed.count = parsed.buildings.length;
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
    tiers.push({ zone: zone.id, tier: tierMeta.tier, mesh, packed, parsed, originX, originZ,
      box, grow: 0, count: parsed.count, meta: tierMeta });
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
      // Every vertex of a bridge carries its opening year for the era views.
      built.solids.year = new Float32Array(built.solids.vertexCount).fill(spec.opened || 0);
      for (const seg of built.lines) seg.year = spec.opened || 0;
      solidParts.push(built.solids);
      lineSegs.push(...built.lines);
      bridgeInfo.push({ id: spec.id, name: spec.name, type: spec.type, opened: spec.opened || 0,
        lengthM: Math.round(built.lengthM), lines: built.lines.length });
    }
    if (solidParts.length) {
      const merged = mergeSolids(solidParts);
      const mesh = new THREE.Mesh(solidGeometry(merged), makeSolidMaterial(false, false));
      mesh.name = 'structures-bridges';
      mesh.renderOrder = 21;
      mesh.frustumCulled = false;
      group.add(mesh);
      bridgeSolid = { mesh, packed: merged };
    }
    if (lineSegs.length) {
      bridgeLines = buildLineSegments(THREE, lineSegs);
      bridgeLines.material.uniforms.uEraYear = sharedUniforms.uEraYear;
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
    const year = new Float32Array(n * 4);
    const index = new Uint32Array(n * 6);
    let v = 0;
    let i = 0;
    for (const s of segs) {
      for (let k = 0; k < 4; k += 1) {
        const atStart = k < 2;
        const idx = v + k;
        year[idx] = s.year || 0;
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
    geometry.setAttribute('aYear', new THREE3.BufferAttribute(year, 1));
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

  // ---- landmark models ------------------------------------------------------
  // One mesh for every schematic model, plus an invisible proxy box per model
  // for picking: the geometry's y is structural, not world, so a raycast
  // against it would land in the wrong place; the proxies are placed in world
  // space every frame with the current exaggeration.
  let landmarkMesh = null;
  const proxies = [];
  let selectedModel = -1;
  if (landmarkModels && landmarkModels.vertexCount > 0) {
    const geometry = solidGeometry(landmarkModels);
    geometry.setAttribute('aModel', new THREE.BufferAttribute(landmarkModels.model, 1));
    geometry.setAttribute('aStyle', new THREE.BufferAttribute(landmarkModels.style, 1));
    geometry.setAttribute('aClock', new THREE.BufferAttribute(landmarkModels.clock, 4));
    landmarkMesh = new THREE.Mesh(geometry, makeSolidMaterial(true));
    landmarkMesh.name = 'structures-landmarks';
    landmarkMesh.renderOrder = 23;
    landmarkMesh.frustumCulled = false;
    group.add(landmarkMesh);
    for (const m of landmarkModels.models) {
      const proxy = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
      proxy.visible = false;
      proxy.userData.model = m;
      proxy.position.set(m.x, 0, m.z);
      proxies.push(proxy);
      group.add(proxy);
    }
  }

  // ---- per-frame ----------------------------------------------------------
  const camXZ = { x: 0, z: 0 };
  let clock = 0;
  let lastStats = { drawnBuildings: 0, drawCalls: 0, tiers: [] };

  // The selected footprint lives outside the structures group so inspection
  // still works in the default aerial-only mode.
  const inspectionGroup = new THREE.Group();
  inspectionGroup.name = 'building-inspection';
  let selectedBuilding = null;
  let buildingOutline = null;

  function setSelectedBuilding(record) {
    if (buildingOutline) {
      inspectionGroup.remove(buildingOutline);
      buildingOutline.geometry.dispose();
      buildingOutline.material.dispose();
      buildingOutline = null;
    }
    selectedBuilding = record || null;
    if (!record?.ring?.length) return;
    const points = record.ring.map(([x, z]) => new THREE.Vector3(x, 0, z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffc46b, transparent: true, opacity: 0.96,
      depthTest: false, depthWrite: false,
    });
    buildingOutline = new THREE.LineLoop(geometry, material);
    buildingOutline.name = 'selected-building-footprint';
    buildingOutline.renderOrder = 60;
    inspectionGroup.add(buildingOutline);
  }

  function update(ctx) {
    const { camera, state, exaggeration, dt, sunDir, fogDensity } = ctx;
    const on = !!state.layers.structures;
    group.visible = on;
    const hScale = heightScale(exaggeration, state.structureHeight);
    const hybrid = 0; // Detailed facades remain opaque over aerial photography.
    if (buildingOutline && selectedBuilding) {
      const shownAsVolume = on && hybrid < 0.98;
      const height = shownAsVolume ? selectedBuilding.height * hScale : 0;
      buildingOutline.position.y = selectedBuilding.ground * exaggeration + height + 4;
      buildingOutline.visible = true;
    }
    if (!on) {
      lastStats = { drawnBuildings: 0, drawCalls: 0, tiers: [] };
      return lastStats;
    }
    const detail = state.structureDetail;
    const q = state.quality;
    camXZ.x = camera.position.x;
    camXZ.z = camera.position.z;

    sharedUniforms.uExag.value = exaggeration;
    sharedUniforms.uHScale.value = hScale;
    sharedUniforms.uSunDir.value.copy(sunDir);
    sharedUniforms.uCameraPos.value.copy(camera.position);
    sharedUniforms.uKey.value = (ctx.light || state).keyLight;
    sharedUniforms.uAmbient.value = (ctx.light || state).ambient;
    sharedUniforms.uFogDensity.value = fogDensity;
    sharedUniforms.uHybrid.value = hybrid;
    sharedUniforms.uCompareHistory.value = state.compareMode === 'history' ? 1 : 0;
    sharedUniforms.uComparePosition.value = state.comparePosition;

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

    // Landmark models sit at the tall tier's range and share the highlight.
    clock += dt;
    if (landmarkMesh) {
      const u = landmarkMesh.material.uniforms;
      u.uPulse.value = 0.5 + 0.5 * Math.sin(clock * 3);
      u.uSelected.value = selectedModel;
      calls += 1;
      for (const proxy of proxies) {
        const m = proxy.userData.model;
        const y0 = m.ground * exaggeration;
        const h = Math.max(4, m.top * hScale);
        proxy.position.set(m.x, y0 + h / 2, m.z);
        proxy.scale.set(m.radius * 2, h, m.radius * 2);
      }
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
    inspectionGroup,
    tiers,
    bridges: bridgeInfo,
    update,

    get buildingTotal() { return buildingTotal; },
    get landmarkModelCount() { return proxies.length; },

    /** Historical view: 9999 shows everything; an era year hides the newer and ghosts the undated. */
    setEra(year) {
      sharedUniforms.uEraYear.value = Number.isFinite(year) ? year : 9999;
    },
    get eraYear() { return sharedUniforms.uEraYear.value; },
    /** Bridges that exist at the current era year (all have opening years). */
    get visibleBridges() {
      const y = sharedUniforms.uEraYear.value;
      return bridgeInfo.filter((b) => !b.opened || b.opened <= y).map((b) => b.name);
    },

    /** Pick a landmark model under a raycaster; returns its model record or null. */
    pickLandmark(raycaster) {
      if (!proxies.length || !group.visible) return null;
      const hits = raycaster.intersectObjects(proxies, false);
      return hits.length ? hits[0].object.userData.model : null;
    },

    /** Find the footprint under a world-space ground point, with a small click tolerance. */
    pickBuildingAt(x, z, toleranceM = 18) {
      let best = null;
      let bestDistance = toleranceM;
      for (const t of tiers) {
        if (distanceToBox(x, z, t.box) > toleranceM) continue;
        const lx = x - t.originX;
        const lz = z - t.originZ;
        for (let index = 0; index < t.parsed.buildings.length; index += 1) {
          const building = t.parsed.buildings[index];
          const distance = distanceToFootprint(lx, lz, building.poly);
          if (distance > bestDistance) continue;
          const ring = [];
          let cx = 0;
          let cz = 0;
          for (let i = 0; i < building.poly.length; i += 2) {
            const px = t.originX + building.poly[i];
            const pz = t.originZ + building.poly[i + 1];
            ring.push([px, pz]);
            cx += px;
            cz += pz;
          }
          cx /= ring.length;
          cz /= ring.length;
          bestDistance = distance;
          best = {
            ...building, id: `${t.zone}/${t.tier}/${index}`,
            zone: t.zone, tier: t.tier, ring, x: cx, z: cz,
            ground: groundAt(cx, cz), distance,
          };
          if (distance === 0) return best;
        }
      }
      return best;
    },

    setSelectedBuilding,
    get selectedBuilding() { return selectedBuilding; },

    setSelectedModel(index) {
      selectedModel = Number.isInteger(index) ? index : -1;
    },

    modelByLandmark(name) {
      const p = proxies.find((x) => x.userData.model.landmark === name);
      return p ? p.userData.model : null;
    },
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
      sharedUniforms.uViewportWidth.value = w;
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
      if (landmarkMesh) setVec3(landmarkMesh.material.uniforms.uHighlight.value, theme.ui.accent);
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
      if (landmarkMesh) {
        landmarkMesh.geometry.dispose();
        landmarkMesh.material.dispose();
      }
      for (const proxy of proxies) proxy.geometry.dispose();
      setSelectedBuilding(null);
      inspectionGroup.parent?.remove(inspectionGroup);
      group.parent?.remove(group);
    },
  };
}

function setVec3(target, hex) {
  const [r, g, b] = hexToRgb(hex, true);
  target.set(r, g, b);
}
