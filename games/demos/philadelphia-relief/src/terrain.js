/**
 * The terrain surface: heightmap decode, adaptive mesh, and the shader that
 * does most of the visual work.
 *
 * Mesh strategy — one draw call, no LOD seams. Rather than a uniform grid
 * (which is either too coarse in the Wissahickon gorge or absurdly dense at
 * the regional view) or a clipmap (which needs stitching), the grid is
 * *log-warped in the vertex shader* around the camera target. Vertices bunch up
 * where you are looking and spread out toward the horizon, and the mesh always
 * covers the whole region. Adjusting the warp is a uniform update, so nothing
 * is ever re-uploaded.
 */

import { hexToRgb, getTheme, bakeRamp } from './themes.js?v=philly-2026090402';

const VERTEX_SHADER = /* glsl */ `
  uniform sampler2D uHeight;
  uniform vec2  uCenter;        // camera target, region-normalised (0..1)
  uniform float uWarp;          // log-warp strength; ~0 is a uniform grid
  uniform float uExag;
  uniform vec2  uRegionSize;    // metres
  uniform float uReliefOn;

  varying vec2  vUv;
  varying vec3  vWorld;
  varying float vElev;

  // Map a uniform grid parameter s to a region coordinate, concentrating
  // samples near c. The exponential makes cell size grow with distance from
  // the target, which is what keeps screen-space density roughly even.
  float warpAxis(float s, float c, float k) {
    float t = (s - 0.5) * 2.0;                 // -1 .. 1
    float a = abs(t);
    float d = (exp(k * a) - 1.0) / (exp(k) - 1.0);
    float span = t < 0.0 ? c : (1.0 - c);
    return clamp(c + sign(t) * span * d, 0.0, 1.0);
  }

  void main() {
    float k = max(uWarp, 0.001);
    vec2 g = vec2(warpAxis(uv.x, uCenter.x, k), warpAxis(uv.y, uCenter.y, k));
    vUv = g;

    float h = texture2D(uHeight, g).r;
    vElev = h;

    vec3 pos = vec3((g.x - 0.5) * uRegionSize.x,
                    h * uExag * uReliefOn,
                    (g.y - 0.5) * uRegionSize.y);
    vWorld = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uHeight;
  uniform sampler2D uMacro;      // heavily downsampled heights, for ambient occlusion
  uniform sampler2D uRamp;       // hypsometric LUT
  uniform sampler2D uImagery;    // georeferenced USGS orthoimagery

  uniform vec3  uSunDir;         // world space, pointing toward the sun
  uniform vec3  uSunColor;
  uniform vec3  uSkyColor;
  uniform vec3  uGroundColor;
  uniform vec3  uFogColor;
  uniform vec3  uFogTint;
  uniform vec3  uContourColor;
  uniform vec3  uContourIndexColor;
  uniform vec3  uCameraPos;

  uniform float uKey;
  uniform float uAmbient;
  uniform float uFogDensity;
  uniform float uElevLo;
  uniform float uElevHi;
  uniform float uExag;
  uniform float uContourStrength;
  uniform float uContourInterval;
  uniform float uHillshade;
  uniform float uReliefOn;
  uniform float uImageryOn;
  uniform float uWaterLevel;
  uniform float uExposure;
  uniform vec2  uSpacing;        // metres between height samples, x and z
  uniform vec2  uTexel;

  varying vec2  vUv;
  varying vec3  vWorld;
  varying float vElev;

  void main() {
    // ---- surface normal from the height field --------------------------
    float hL = texture2D(uHeight, vUv - vec2(uTexel.x, 0.0)).r;
    float hR = texture2D(uHeight, vUv + vec2(uTexel.x, 0.0)).r;
    float hN = texture2D(uHeight, vUv - vec2(0.0, uTexel.y)).r;
    float hS = texture2D(uHeight, vUv + vec2(0.0, uTexel.y)).r;

    // A flat surface when relief is switched off, so hillshade and contours
    // still read but the ground is a plan view.
    float exag = mix(1.0, uExag, uReliefOn);
    vec3 n = normalize(vec3(
      -(hR - hL) * exag / (2.0 * uSpacing.x),
      1.0,
      -(hS - hN) * exag / (2.0 * uSpacing.y)));

    // ---- base colour ---------------------------------------------------
    // Normalised across the 2nd-98th percentile band rather than the absolute
    // min/max: a handful of hilltops in Berks County should not squash the
    // whole city into the darkest tenth of the ramp.
    float tE = clamp((vElev - uElevLo) / max(uElevHi - uElevLo, 1.0), 0.0, 1.0);
    tE = pow(tE, 0.78);
    vec3 reliefBase = texture2D(uRamp, vec2(tE, 0.5)).rgb;
    vec3 aerialBase = texture2D(uImagery, vUv).rgb;
    vec3 base = mix(reliefBase, aerialBase, uImageryOn);

    float slope = 1.0 - n.y;
    base = mix(base, base * 0.70, smoothstep(0.015, 0.40, slope));

    // Ground that sits at river level reads damp rather than dusty.
    float lowland = 1.0 - smoothstep(uWaterLevel, uWaterLevel + 12.0, vElev);
    base = mix(base, base * vec3(0.82, 0.88, 0.98), lowland * 0.35);

    // ---- ambient occlusion from the macro height -----------------------
    float macro = texture2D(uMacro, vUv).r;
    float concavity = vElev - macro;
    float ao = mix(0.55, 1.0, smoothstep(-28.0, 22.0, concavity));

    // ---- lighting ------------------------------------------------------
    float ndl = dot(n, uSunDir);
    float diffuse = max(0.0, ndl);
    // Wrapped term: keeps the shadow side reading as shape, not a black hole.
    float wrapped = max(0.0, (ndl + 0.35) / 1.35);
    vec3 key = uSunColor * uKey * mix(diffuse, wrapped, 0.35);
    vec3 sky = uSkyColor * uAmbient * (0.5 + 0.5 * n.y);
    vec3 bounce = uGroundColor * uAmbient * 0.3 * (0.5 - 0.5 * n.y);

    // Gain. The ramp is a reflectance (~0.10-0.35 linear) and the incident
    // light at a 19 deg sun is well under 1.0, so without this the product
    // lands near black and the relief disappears into the ground colour.
    vec3 reliefLit = base * (key + sky + bounce) * ao * uExposure;
    // Preserve the orthoimage's real colour while letting the DEM add subtle
    // directional shape. A full material-light multiplication made roofs and
    // streets nearly black at dusk, which defeated the point of the imagery.
    float aerialShade = clamp(0.82 + ndl * 0.18, 0.72, 1.08);
    vec3 aerialLit = aerialBase * aerialShade * mix(0.88, 1.0, ao);
    vec3 lit = mix(reliefLit, aerialLit, uImageryOn);

    vec3 viewDir = normalize(uCameraPos - vWorld);
    vec3 halfVec = normalize(uSunDir + viewDir);
    lit += uSunColor * pow(max(0.0, dot(n, halfVec)), 90.0)
      * 0.03 * uKey * (1.0 - uImageryOn);

    // Flat cartographic shading when the hillshade layer is off. Named
    // flatShade because plain "flat" is a reserved interpolation qualifier
    // in GLSL ES 3.0, which is what three compiles to on WebGL 2.
    vec3 reliefFlat = reliefBase * (uAmbient * 0.6 + 0.75) * uExposure * 0.8;
    vec3 flatShade = mix(reliefFlat, aerialBase, uImageryOn);
    vec3 color = mix(flatShade, lit, uHillshade);

    // ---- contours ------------------------------------------------------
    if (uContourStrength > 0.001 && uContourInterval > 0.0) {
      float e = vElev / uContourInterval;
      float w = fwidth(e);
      float d = min(fract(e), 1.0 - fract(e));
      float line = 1.0 - smoothstep(0.0, w * 1.4, d);

      float e5 = vElev / (uContourInterval * 5.0);
      float w5 = fwidth(e5);
      float d5 = min(fract(e5), 1.0 - fract(e5));
      float index = 1.0 - smoothstep(0.0, w5 * 1.4, d5);

      // Where one pixel spans more than about a third of an interval the
      // lines would alias into a grey wash, so fade them out instead.
      float legible = 1.0 - smoothstep(0.30, 0.85, w);
      float amount = uContourStrength * legible;
      color = mix(color, uContourColor, clamp(line * amount * 0.75, 0.0, 1.0));
      color = mix(color, uContourIndexColor, clamp(index * amount, 0.0, 1.0));
    }

    // ---- atmosphere ----------------------------------------------------
    vec3 toFrag = vWorld - uCameraPos;
    float dist = length(toFrag);
    // Real elevation, not the exaggerated height: haze pools in the valleys
    // and thins over the ridges regardless of the exaggeration setting.
    float heightFalloff = exp(-max(0.0, vElev) / 260.0);
    // Squared falloff: linear extinction fogged the near ground as heavily as
    // the horizon and flattened the whole frame to one colour.
    float depth = dist * uFogDensity * heightFalloff;
    float fogAmount = 1.0 - exp(-depth * depth);

    float towardSun = max(0.0, dot(normalize(toFrag), uSunDir));
    vec3 fogColor = mix(uFogColor, uFogTint, pow(towardSun, 3.0));
    color = mix(color, fogColor, clamp(fogAmount, 0.0, 1.0));

    // Dissolve the region boundary into haze so the data's edge reads as
    // distance rather than as a cliff at the end of the world.
    vec2 toEdge = min(vUv, 1.0 - vUv);
    float edgeFade = smoothstep(0.0, 0.045, min(toEdge.x, toEdge.y));
    color = mix(fogColor, color, edgeFade);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Decode the packed heightmap image into metres.
 *
 * Encoding is `elev = elevMin + (R * 256 + G) * step`. The probes in
 * terrain.json are re-checked here: if a browser's colour management ever
 * altered the bytes on their way through the canvas the elevations would be
 * quietly wrong, and silently-wrong terrain is worse than none.
 */
export function decodeHeightmap(imageData, meta) {
  const { width, height } = meta;
  const { min: elevMin, step } = meta.elevation;
  const px = imageData.data;
  const grid = new Float32Array(width * height);
  for (let i = 0, p = 0; i < grid.length; i += 1, p += 4) {
    grid[i] = elevMin + (px[p] * 256 + px[p + 1]) * step;
  }

  const failures = [];
  for (const probe of meta.probes || []) {
    const p = (probe.y * width + probe.x) * 4;
    const q = px[p] * 256 + px[p + 1];
    if (q !== probe.q) failures.push({ ...probe, got: q });
  }
  return { grid, probeFailures: failures };
}

/** Box-downsample the height grid for the cheap ambient-occlusion term. */
export function buildMacroGrid(grid, width, height, size = 256) {
  const out = new Float32Array(size * size);
  const sx = width / size;
  const sy = height / size;
  for (let y = 0; y < size; y += 1) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.min(height, Math.floor((y + 1) * sy));
    for (let x = 0; x < size; x += 1) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.min(width, Math.floor((x + 1) * sx));
      let sum = 0;
      let count = 0;
      for (let yy = y0; yy < y1; yy += 1) {
        for (let xx = x0; xx < x1; xx += 1) {
          sum += grid[yy * width + xx];
          count += 1;
        }
      }
      out[y * size + x] = count ? sum / count : 0;
    }
  }
  return out;
}

export const MESH_SEGMENTS = {
  performance: 384,
  balanced: 704,
  cinematic: 1024,
};

/**
 * Warp strength for a given orbit distance. Tuned so the cells nearest the
 * target stay near the DEM's own 46 m sample spacing at close range, while the
 * regional view stays close to a uniform grid.
 */
export function warpForDistance(distanceM) {
  const k = 3.4 - 0.55 * Math.log(Math.max(distanceM, 1) / 1000);
  return Math.min(3.4, Math.max(0.35, k));
}

export function createTerrain(THREE, options) {
  const { meta, grid, macro, imagery = null, quality = 'balanced' } = options;
  const { width, height } = meta;
  const regionW = meta.projection.widthM;
  const regionH = meta.projection.heightM;
  const elevMin = meta.elevation.min;
  const elevRange = Math.max(1, meta.elevation.max - meta.elevation.min);

  const heightTex = makeHeightTexture(THREE, grid, width, height);
  const macroSize = Math.round(Math.sqrt(macro.length));
  const macroTex = makeHeightTexture(THREE, macro, macroSize, macroSize);
  const rampTex = makeRampTexture(THREE, 'dusk');
  const imageryTex = makeImageryTexture(THREE, imagery);

  const uniforms = {
    uHeight: { value: heightTex },
    uMacro: { value: macroTex },
    uRamp: { value: rampTex },
    uImagery: { value: imageryTex },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uWarp: { value: 1.0 },
    uExag: { value: 14 },
    uRegionSize: { value: new THREE.Vector2(regionW, regionH) },
    uSpacing: { value: new THREE.Vector2(regionW / (width - 1), regionH / (height - 1)) },
    uTexel: { value: new THREE.Vector2(1 / width, 1 / height) },
    uSunDir: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
    uSunColor: { value: new THREE.Vector3(1, 1, 1) },
    uSkyColor: { value: new THREE.Vector3(0.4, 0.5, 0.7) },
    uGroundColor: { value: new THREE.Vector3(0.3, 0.25, 0.2) },
    uFogColor: { value: new THREE.Vector3(0.7, 0.6, 0.5) },
    uFogTint: { value: new THREE.Vector3(1, 0.8, 0.5) },
    uContourColor: { value: new THREE.Vector3(0.1, 0.08, 0.05) },
    uContourIndexColor: { value: new THREE.Vector3(0.05, 0.04, 0.02) },
    uCameraPos: { value: new THREE.Vector3() },
    uKey: { value: 1.15 },
    uAmbient: { value: 0.34 },
    uFogDensity: { value: 1.2e-5 },
    uElevLo: { value: meta.stats?.p02M ?? elevMin },
    uElevHi: { value: meta.stats?.p98M ?? elevMin + elevRange },
    uContourStrength: { value: 0.34 },
    uContourInterval: { value: 25 },
    uHillshade: { value: 1 },
    uReliefOn: { value: 1 },
    uImageryOn: { value: 0 },
    uWaterLevel: { value: 2 },
    uExposure: { value: 2.3 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    extensions: { derivatives: true },
  });

  const segments = MESH_SEGMENTS[quality] || MESH_SEGMENTS.balanced;
  const geometry = buildGridGeometry(THREE, segments, regionW, regionH);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'terrain';
  // The mesh always spans the whole region and its vertices move in the
  // shader, so three's bounding volumes cannot describe it usefully.
  mesh.frustumCulled = false;

  return {
    mesh,
    material,
    uniforms,
    segments,
    hasImagery: !!imagery,

    setTheme(themeId) {
      const theme = getTheme(themeId);
      writeRampRGBA(rampTex.image.data, themeId);
      rampTex.needsUpdate = true;
      setVec3(uniforms.uSunColor.value, theme.sunColor);
      setVec3(uniforms.uSkyColor.value, theme.skyFill || theme.skyHorizon);
      setVec3(uniforms.uGroundColor.value, theme.ramp[2][1]);
      setVec3(uniforms.uFogColor.value, theme.fog);
      setVec3(uniforms.uFogTint.value, theme.fogTint);
      setVec3(uniforms.uContourColor.value, theme.contour);
      setVec3(uniforms.uContourIndexColor.value, theme.contourIndex);
    },

    dispose() {
      geometry.dispose();
      material.dispose();
      heightTex.dispose();
      macroTex.dispose();
      rampTex.dispose();
      imageryTex.dispose();
    },
  };
}

/** Browser image -> north-up terrain texture. Row 0 and UV y=0 are north. */
function makeImageryTexture(THREE, image) {
  if (!image) {
    const tex = new THREE.DataTexture(
      new Uint8Array([96, 104, 88, 255]), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    return tex;
  }
  const tex = new THREE.Texture(image);
  tex.flipY = false;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

function setVec3(target, hex) {
  const [r, g, b] = hexToRgb(hex, true);
  target.set(r, g, b);
}

/**
 * A flat grid carrying only UVs; the vertex shader derives every position.
 * The stored positions describe the unwarped layout so three still has a
 * sensible bounding box for the mesh.
 */
function buildGridGeometry(THREE, segments, regionW, regionH) {
  const n = segments + 1;
  const positions = new Float32Array(n * n * 3);
  const uvs = new Float32Array(n * n * 2);
  for (let y = 0; y < n; y += 1) {
    const v = y / segments;
    for (let x = 0; x < n; x += 1) {
      const u = x / segments;
      const i = y * n + x;
      positions[i * 3] = (u - 0.5) * regionW;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (v - 0.5) * regionH;
      uvs[i * 2] = u;
      uvs[i * 2 + 1] = v;
    }
  }
  const quads = segments * segments;
  const IndexArray = n * n > 65535 ? Uint32Array : Uint16Array;
  const indices = new IndexArray(quads * 6);
  let p = 0;
  for (let y = 0; y < segments; y += 1) {
    for (let x = 0; x < segments; x += 1) {
      const a = y * n + x;
      const b = a + 1;
      const c = a + n;
      const d = c + 1;
      indices[p] = a; indices[p + 1] = c; indices[p + 2] = b;
      indices[p + 3] = b; indices[p + 4] = c; indices[p + 5] = d;
      p += 6;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  return geometry;
}

/**
 * Elevations as a half-float red texture. Half-float linear filtering is core
 * in WebGL2 (full float filtering is only an extension), and at ~0.25 m
 * precision over this region it is finer than the source DEM.
 */
function makeHeightTexture(THREE, values, width, height) {
  const half = new Uint16Array(values.length);
  for (let i = 0; i < values.length; i += 1) half[i] = THREE.DataUtils.toHalfFloat(values[i]);
  const tex = new THREE.DataTexture(half, width, height, THREE.RedFormat, THREE.HalfFloatType);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

/** RGB ramp bytes expanded to the RGBA layout DataTexture expects. */
function writeRampRGBA(target, themeId) {
  const rgb = bakeRamp(themeId, 256);
  for (let i = 0; i < 256; i += 1) {
    target[i * 4] = rgb[i * 3];
    target[i * 4 + 1] = rgb[i * 3 + 1];
    target[i * 4 + 2] = rgb[i * 3 + 2];
    target[i * 4 + 3] = 255;
  }
  return target;
}

function makeRampTexture(THREE, themeId) {
  const data = writeRampRGBA(new Uint8Array(256 * 4), themeId);
  const tex = new THREE.DataTexture(data, 256, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Map the 0..1 fog control onto an extinction coefficient.
 *
 * Paired with the squared falloff in the shader, so the useful range is much
 * smaller than a linear-fog coefficient would be: at the 0.4 default the
 * foreground stays clear and the far side of the region sits at roughly
 * three-quarters haze.
 */
export function fogDensityFor(control) {
  return Math.pow(Math.max(0, control), 1.35) * 2.4e-5;
}
