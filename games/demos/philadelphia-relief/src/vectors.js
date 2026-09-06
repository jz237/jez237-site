/**
 * Vector overlays: rivers, roads, rail, boundaries, parks and open water,
 * draped on the terrain.
 *
 * Lines are expanded to screen-space-width ribbons in the vertex shader, which
 * is the only way a road network stays readable across a camera that moves
 * from 190 km out to 1.2 km. Vertices carry their *raw* elevation rather than a
 * baked world Y, so the exaggeration slider moves the overlays and the ground
 * together instead of tearing them apart.
 */

import { hexToRgb } from './themes.js?v=philly-2026090609';

const LINE_VERTEX = /* glsl */ `
  attribute vec3  aOther;      // the far end of this segment
  attribute float aSide;       // -1 / +1, which edge of the ribbon
  attribute float aElev;       // metres, this vertex
  attribute float aOtherElev;  // metres, far end
  attribute vec4 aCrossing;    // distance from each end, and junction flags

  uniform vec2  uResolution;
  uniform float uWidth;        // device-independent pixels
  uniform float uExag;
  uniform float uLift;         // world units above the surface
  uniform float uNear;
  uniform float uRoadWidth;

  varying float vAlong;
  varying float vRoadPhase;
  varying vec4 vCrossing;
  uniform float uStreetDetail;

  void main() {
    vec3 a = vec3(position.x, aElev * uExag + uLift, position.z);
    vec3 b = vec3(aOther.x, aOtherElev * uExag + uLift, aOther.z);

    vec2 roadDir = normalize(b.xz - a.xz + vec2(0.000001));
    float directionSign = roadDir.x < 0.0 || (abs(roadDir.x) < 0.00001 && roadDir.y < 0.0) ? -1.0 : 1.0;
    roadDir *= directionSign;
    vRoadPhase = dot(a.xz, roadDir);
    vCrossing = aCrossing;
    a.xz += vec2(-roadDir.y, roadDir.x) * aSide * uRoadWidth * 0.5 * uStreetDetail;
    vec4 va = modelViewMatrix * vec4(a, 1.0);
    vec4 vb = modelViewMatrix * vec4(b, 1.0);

    // Trim whichever end sits behind the near plane back onto it, so segments
    // passing under a low camera do not swing wildly across the screen.
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
    vec2 dir = (sb - sa) * directionSign;
    float len = length(dir);
    dir = len > 1e-5 ? dir / len : vec2(1.0, 0.0);
    // Called perp rather than normal: three declares a normal attribute for
    // every ShaderMaterial, and shadowing it here would only confuse.
    vec2 perp = vec2(-dir.y, dir.x);

    vAlong = aSide;
    ca.xy += (perp * aSide * uWidth * (1.0 - uStreetDetail) * 0.5 / uResolution) * ca.w;
    gl_Position = ca;
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlong;
  varying float vRoadPhase;
  varying vec4 vCrossing;
  uniform float uStreetDetail;
  uniform float uRoadWidth;

  void main() {
    // Soften the ribbon edge so thin lines do not crawl when the camera moves.
    float edge = 1.0 - smoothstep(0.55, 1.0, abs(vAlong));
    vec3 color = uColor;
    if (uStreetDetail > 0.01) {
      float curb = smoothstep(0.74, 0.82, abs(vAlong));
      float aa = max(fwidth(vAlong), 0.012);
      float center = 1.0 - smoothstep(0.015, 0.015 + aa, abs(vAlong));
      float dash = step(0.5, fract(vRoadPhase / 12.0));
      vec3 street = mix(vec3(0.095, 0.11, 0.12), vec3(0.42, 0.40, 0.35), curb);
      float junctionGap = min(mix(1000.0, vCrossing.x, vCrossing.z),
        mix(1000.0, vCrossing.y, vCrossing.w));
      float lane = smoothstep(10.0, 13.0, junctionGap);
      street = mix(street, vec3(0.74, 0.65, 0.38), center * dash * lane);
      // Illustrative zebra crossings only at real multi-way street junctions.
      float crossBand = smoothstep(5.5, 6.0, junctionGap)
        * (1.0 - smoothstep(9.0, 9.5, junctionGap));
      float stripeCoord = vAlong * uRoadWidth / 2.4;
      float stripeAA = max(fwidth(stripeCoord), 0.02);
      float stripe = smoothstep(0.15, 0.15 + stripeAA, fract(stripeCoord))
        * (1.0 - smoothstep(0.65 - stripeAA, 0.65, fract(stripeCoord)));
      float readable = 1.0 - smoothstep(0.35, 0.8, stripeAA);
      street = mix(street, vec3(0.82, 0.83, 0.77),
        crossBand * stripe * readable * (1.0 - curb));
      color = mix(color, street, uStreetDetail);
      edge = 1.0 - smoothstep(0.94, 1.0, abs(vAlong));
    }
    gl_FragColor = vec4(color, mix(uOpacity, 0.94, uStreetDetail) * edge);
    if (gl_FragColor.a < 0.004) discard;
  }
`;

const AREA_VERTEX = /* glsl */ `
  attribute float aElev;
  uniform float uExag;
  uniform float uLift;
  varying vec3 vWorld;
  varying float vElev;

  void main() {
    vec3 p = vec3(position.x, aElev * uExag + uLift, position.z);
    vWorld = p;
    vElev = aElev;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const AREA_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform vec3  uFogColor;
  uniform float uFogDensity;
  uniform float uCompareClip;
  uniform float uComparePosition;
  uniform float uViewportWidth;
  uniform vec3  uCameraPos;
  varying vec3  vWorld;
  varying float vElev;

  void main() {
    if (uCompareClip > 0.5
        && gl_FragCoord.x / max(uViewportWidth, 1.0) < uComparePosition) discard;
    float dist = length(vWorld - uCameraPos);
    float depth = dist * uFogDensity * exp(-max(0.0, vElev) / 260.0);
    float fog = 1.0 - exp(-depth * depth);
    vec3 color = mix(uColor, uFogColor, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(color, uOpacity);
  }
`;

const WATER_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3  uColor;        // deep
  uniform vec3  uShallow;
  uniform vec3  uSpecColor;
  uniform vec3  uSunDir;
  uniform vec3  uCameraPos;
  uniform vec3  uFogColor;
  uniform vec3  uFogTint;
  uniform float uFogDensity;
  uniform float uIntensity;
  uniform float uTime;
  varying vec3  vWorld;
  varying float vElev;

  void main() {
    vec3 view = normalize(uCameraPos - vWorld);

    // A couple of crossed low-frequency waves stand in for surface texture.
    // Deliberately gentle: at regional scale a river should read as a sheet,
    // not as an ocean.
    float w1 = sin(vWorld.x * 0.0016 + uTime * 0.30);
    float w2 = sin(vWorld.z * 0.0021 - uTime * 0.24);
    float w3 = sin((vWorld.x + vWorld.z) * 0.0009 + uTime * 0.17);
    vec3 normal = normalize(vec3((w1 + w3) * 0.05, 1.0, (w2 - w3) * 0.05));

    float fresnel = pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 3.0);
    vec3 body = mix(uColor, uShallow, fresnel * 0.85);

    vec3 halfVec = normalize(uSunDir + view);
    float glint = pow(max(0.0, dot(normal, halfVec)), 220.0);
    float sheen = pow(max(0.0, dot(normal, halfVec)), 24.0) * 0.25;

    // Water has to survive being 100 km away through haze, so it carries a
    // sky term of its own rather than relying on the glint alone.
    vec3 color = body + uSpecColor * (glint * 2.2 + sheen) * uIntensity;
    color += uSpecColor * fresnel * 0.34 * uIntensity;
    color += uShallow * 0.22 * uIntensity;

    float dist = length(vWorld - uCameraPos);
    // Rivers sit at river level, where the height-based haze is thickest;
    // holding some of it back keeps the Delaware legible to the horizon.
    float depth = dist * uFogDensity * 0.72 * exp(-max(0.0, vElev) / 260.0);
    float fog = 1.0 - exp(-depth * depth);
    float towardSun = max(0.0, dot(normalize(vWorld - uCameraPos), uSunDir));
    color = mix(color, mix(uFogColor, uFogTint, pow(towardSun, 3.0)), clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Project a lon/lat pair into scene X/Z metres. */
function toLocal(projection, lon, lat) {
  return [projection.lonToX(lon), projection.latToZ(lat)];
}

/**
 * Collect every polyline out of a GeoJSON FeatureCollection, filtered and
 * grouped by a caller-supplied key so each group can become one mesh.
 */
export function groupLines(geojson, keyOf) {
  const groups = new Map();
  for (const feature of geojson?.features || []) {
    const type = feature.geometry?.type;
    if (type !== 'LineString' && type !== 'MultiLineString') continue;
    const key = keyOf(feature.properties || {});
    if (key === null || key === undefined) continue;
    const parts = type === 'LineString'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
    const bucket = groups.get(key) || [];
    for (const part of parts) if (part && part.length >= 2) bucket.push(part);
    groups.set(key, bucket);
  }
  return groups;
}

/** Same, for polygon outer rings. */
export function collectRings(geojson, minArea = 0) {
  const rings = [];
  for (const feature of geojson?.features || []) {
    const g = feature.geometry;
    if (!g) continue;
    const props = feature.properties || {};
    if (minArea && props.area && props.area < minArea) continue;
    if (g.type === 'Polygon') {
      if (g.coordinates[0]?.length >= 4) {
        rings.push({ ring: g.coordinates[0], holes: g.coordinates.slice(1), props });
      }
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates) {
        if (poly[0]?.length >= 4) rings.push({ ring: poly[0], holes: poly.slice(1), props });
      }
    }
  }
  return rings;
}

/** Find true junctions by unique adjacent coordinates, excluding ordinary bends. */
export function streetJunctions(parts) {
  const neighbours = new Map();
  const key = (point) => `${point[0]},${point[1]}`;
  for (const part of parts) {
    for (let i = 1; i < part.length; i += 1) {
      const a = key(part[i - 1]), b = key(part[i]);
      if (a === b) continue;
      if (!neighbours.has(a)) neighbours.set(a, new Set());
      if (!neighbours.has(b)) neighbours.set(b, new Set());
      neighbours.get(a).add(b); neighbours.get(b).add(a);
    }
  }
  return new Set([...neighbours].filter(([, adjacent]) => adjacent.size >= 3).map(([key]) => key));
}

/**
 * Build one ribbon mesh from a set of polylines.
 * Every segment becomes an independent quad, which keeps the buffer layout
 * trivial and lets the shader handle joins by simple overdraw.
 */
export function buildLineMesh(THREE, parts, ctx, options) {
  const { projection, sampleElevation } = ctx;
  const junctions = options.crosswalks ? streetJunctions(parts) : new Set();
  let segments = 0;
  for (const part of parts) segments += part.length - 1;
  if (segments <= 0) return null;

  const positions = new Float32Array(segments * 4 * 3);
  const others = new Float32Array(segments * 4 * 3);
  const sides = new Float32Array(segments * 4);
  const crossings = new Float32Array(segments * 4 * 4);
  const elevs = new Float32Array(segments * 4);
  const otherElevs = new Float32Array(segments * 4);
  const indices = new (segments * 4 > 65535 ? Uint32Array : Uint16Array)(segments * 6);

  let v = 0;
  let i = 0;
  for (const part of parts) {
    for (let p = 0; p < part.length - 1; p += 1) {
      const [ax, az] = toLocal(projection, part[p][0], part[p][1]);
      const [bx, bz] = toLocal(projection, part[p + 1][0], part[p + 1][1]);
      const length = Math.hypot(bx - ax, bz - az);
      const junctionA = junctions.has(`${part[p][0]},${part[p][1]}`) ? 1 : 0;
      const junctionB = junctions.has(`${part[p + 1][0]},${part[p + 1][1]}`) ? 1 : 0;
      const ae = sampleElevation(part[p][0], part[p][1]);
      const be = sampleElevation(part[p + 1][0], part[p + 1][1]);

      // Two vertices at each end, offset to opposite ribbon edges.
      for (let k = 0; k < 4; k += 1) {
        const atStart = k < 2;
        const idx = v + k;
        positions[idx * 3] = atStart ? ax : bx;
        positions[idx * 3 + 2] = atStart ? az : bz;
        others[idx * 3] = atStart ? bx : ax;
        others[idx * 3 + 2] = atStart ? bz : az;
        elevs[idx] = atStart ? ae : be;
        otherElevs[idx] = atStart ? be : ae;
        sides[idx] = k % 2 === 0 ? -1 : 1;
        crossings.set([atStart ? 0 : length, atStart ? length : 0, junctionA, junctionB], idx * 4);
      }
      indices[i] = v; indices[i + 1] = v + 1; indices[i + 2] = v + 2;
      indices[i + 3] = v + 2; indices[i + 4] = v + 1; indices[i + 5] = v + 3;
      v += 4;
      i += 6;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aOther', new THREE.BufferAttribute(others, 3));
  geometry.setAttribute('aSide', new THREE.BufferAttribute(sides, 1));
  geometry.setAttribute('aCrossing', new THREE.BufferAttribute(crossings, 4));
  geometry.setAttribute('aElev', new THREE.BufferAttribute(elevs, 1));
  geometry.setAttribute('aOtherElev', new THREE.BufferAttribute(otherElevs, 1));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uWidth: { value: options.width ?? 2 },
      uRoadWidth: { value: options.roadWidth || 0 },
      uStreetDetail: { value: 0 },
      uColor: { value: new THREE.Vector3(1, 1, 1) },
      uOpacity: { value: options.opacity ?? 1 },
      uExag: { value: 14 },
      uLift: { value: 60 },
      uNear: { value: 1 },
    },
    vertexShader: LINE_VERTEX,
    fragmentShader: LINE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  setVec3(material.uniforms.uColor.value, options.color || '#ffffff');

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = options.renderOrder ?? 10;
  mesh.name = options.name || 'lines';
  return { mesh, material, segments };
}

/**
 * Ear-clipping triangulation for a simple polygon.
 *
 * The park and water rings come out of the build step already clipped to the
 * region rectangle, so they are simple in practice. The iteration guard means a
 * pathological ring degrades to a partial fan rather than hanging the tab.
 */
/** A ring without its duplicated closing vertex. */
function openRing(ring) {
  const n = ring.length;
  return n > 1 && ring[0][0] === ring[n - 1][0] && ring[0][1] === ring[n - 1][1]
    ? ring.slice(0, -1) : ring;
}

/**
 * Triangulate an outer ring with holes. With three.js at hand this is earcut
 * (ShapeUtils.triangulateShape), which copes with the long concave rings of
 * a floodplain and with islands; indices refer to the outer ring's points
 * followed by each hole's points in order. Without it, the pure ear clipper
 * below handles the outer ring alone.
 */
export function triangulateWithHoles(earcut, THREE, outer, holes) {
  if (earcut && THREE?.Vector2) {
    const contour = outer.map(([x, z]) => new THREE.Vector2(x, z));
    const holeVecs = holes.map((h) => h.map(([x, z]) => new THREE.Vector2(x, z)));
    const faces = earcut(contour, holeVecs);
    const out = new Array(faces.length * 3);
    for (let i = 0; i < faces.length; i += 1) {
      out[i * 3] = faces[i][0];
      out[i * 3 + 1] = faces[i][1];
      out[i * 3 + 2] = faces[i][2];
    }
    return out;
  }
  return triangulate(outer);
}

export function triangulate(points) {
  const n = points.length;
  if (n < 3) return [];
  const indices = [];
  const available = [];
  for (let i = 0; i < n; i += 1) available.push(i);

  // Ear clipping needs a known winding; normalise to counter-clockwise.
  if (signedArea(points) < 0) available.reverse();

  let guard = n * n + 64;
  let cursor = 0;
  while (available.length > 3 && guard-- > 0) {
    const len = available.length;
    const i0 = available[(cursor + len - 1) % len];
    const i1 = available[cursor % len];
    const i2 = available[(cursor + 1) % len];
    const a = points[i0];
    const b = points[i1];
    const c = points[i2];

    if (cross(a, b, c) > 0 && !anyPointInside(points, available, i0, i1, i2)) {
      indices.push(i0, i1, i2);
      available.splice(cursor % len, 1);
      cursor = 0;
      guard = available.length * available.length + 64;
    } else {
      cursor += 1;
      if (cursor > len * 2) break;   // no ear found; ring is not simple
    }
  }
  if (available.length === 3) indices.push(available[0], available[1], available[2]);
  return indices;
}

function signedArea(points) {
  let total = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    total += a[0] * b[1] - b[0] * a[1];
  }
  return total / 2;
}

function cross(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function anyPointInside(points, available, i0, i1, i2) {
  const a = points[i0];
  const b = points[i1];
  const c = points[i2];
  for (const idx of available) {
    if (idx === i0 || idx === i1 || idx === i2) continue;
    const p = points[idx];
    if (cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0) return true;
  }
  return false;
}

/** Build a filled, terrain-draped mesh from a list of rings. */
export function buildAreaMesh(THREE, rings, ctx, options) {
  const { projection, sampleElevation } = ctx;
  const positions = [];
  const elevs = [];
  const indices = [];

  const earcut = THREE?.ShapeUtils?.triangulateShape;
  for (const entry of rings) {
    const ring = entry.ring || entry;
    const pts = openRing(ring);
    if (pts.length < 3) continue;
    const holes = (entry.holes || []).map(openRing).filter((h) => h.length >= 3);

    const local = pts.map(([lon, lat]) => toLocal(projection, lon, lat));
    const localHoles = holes.map((h) => h.map(([lon, lat]) => toLocal(projection, lon, lat)));
    const tris = triangulateWithHoles(earcut, THREE, local, localHoles);
    if (!tris.length) continue;

    const base = positions.length / 3;
    const all = [pts, ...holes];
    const allLocal = [local, ...localHoles];
    for (let r = 0; r < all.length; r += 1) {
      for (let i = 0; i < all[r].length; i += 1) {
        positions.push(allLocal[r][i][0], 0, allLocal[r][i][1]);
        elevs.push(sampleElevation(all[r][i][0], all[r][i][1]));
      }
    }
    for (const t of tris) indices.push(base + t);
  }

  if (!indices.length) return null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('aElev', new THREE.BufferAttribute(new Float32Array(elevs), 1));
  geometry.setIndex(positions.length / 3 > 65535
    ? new THREE.BufferAttribute(new Uint32Array(indices), 1)
    : new THREE.BufferAttribute(new Uint16Array(indices), 1));

  const isWater = options.kind === 'water';
  const uniforms = {
    uColor: { value: new THREE.Vector3() },
    uOpacity: { value: options.opacity ?? 1 },
    uExag: { value: 14 },
    uLift: { value: 20 },
    uFogColor: { value: new THREE.Vector3() },
    uFogDensity: { value: 1.2e-5 },
    uCameraPos: { value: new THREE.Vector3() },
    uCompareClip: { value: 0 },
    uComparePosition: { value: 0.5 },
    uViewportWidth: { value: 1 },
  };
  if (isWater) {
    uniforms.uShallow = { value: new THREE.Vector3() };
    uniforms.uSpecColor = { value: new THREE.Vector3() };
    uniforms.uSunDir = { value: new THREE.Vector3(0, 1, 0) };
    uniforms.uFogTint = { value: new THREE.Vector3() };
    uniforms.uIntensity = { value: 0.75 };
    uniforms.uTime = { value: 0 };
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: AREA_VERTEX,
    fragmentShader: isWater ? WATER_FRAGMENT : AREA_FRAGMENT,
    transparent: !isWater,
    depthWrite: isWater,
    side: THREE.DoubleSide,
  });
  setVec3(material.uniforms.uColor.value, options.color || '#ffffff');

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = options.renderOrder ?? 5;
  mesh.name = options.name || 'area';
  return { mesh, material, triangles: indices.length / 3 };
}

export function setVec3(target, hex) {
  const [r, g, b] = hexToRgb(hex, true);
  target.set(r, g, b);
}
