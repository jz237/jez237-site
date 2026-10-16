// Rain-beaded car glass for car A (CAR agent). Static beads + a few running drops with wet trails, all procedural
// in the shader (deterministic from the film time uniform), so it holds up from 0.3 m.
//
// high:   MeshPhysicalMaterial transmission. The transmitted lookup is replaced: clear glass samples the opaque frame
//         behind it unchanged (the street stays crisp), each drop samples an inverted, minified, slightly blurred patch
//         of the frame around it (a drop is a tiny fisheye lens), so the lamps behind show up as bright points inside
//         the drops and bloom. The transmission target is HDR, so they keep their intensity.
// medium/low: premultiplied transparent glass (no extra scene pass); drops show as specular beads.
//
// Pane coordinates: makeRainGlass().prepare(mesh) projects every vertex onto a constant frame per pane (windshield,
// rear window, left/right side glass) in the mesh's own space -> attribute aDrop (u, v in metres; v up the glass).
import * as THREE from 'three';

const DROP_GLSL = /* glsl */`
uniform float uTime;
uniform float uSeed;
uniform float uWet;
uniform float uCraze;
uniform vec2 uImpact;
varying vec3 vDrop;     // u, v (metres), slope (0 vertical .. 1 flat)
varying vec3 vDU;       // view-space pane axes
varying vec3 vDV;
varying float vInner;
float rgHash(vec2 p) { p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
vec2 rgHash2(vec2 p) { return vec2(rgHash(p), rgHash(p + 17.31)); }
// one cell layer of static beads -> vec4(lens xy (-1..1 inside the bead), cap height, radius in metres)
vec4 rgLayer(vec2 p, float cell, float prob, float rmin, float rmax, float seed, float sag) {
  vec2 q = p / cell;
  vec2 id = floor(q);
  vec2 f = fract(q) - 0.5;
  if (rgHash(id + seed) > prob) return vec4(0.0);
  vec2 rnd = rgHash2(id * 1.37 + seed * 3.1);
  float r = mix(rmin, rmax, rnd.x * rnd.x * rnd.y + 0.15 * rnd.y);
  vec2 c = (rgHash2(id + seed * 7.7) - 0.5) * max(0.0, 0.92 - 2.0 * r);
  vec2 d = f - c;
  // beads on steep glass sag: flatter top, heavier bottom
  d.y *= mix(1.0, 1.0 + 0.35 * sign(d.y), sag);
  float dist = length(d) / r;
  if (dist >= 1.0) return vec4(0.0);
  float h = sqrt(1.0 - dist * dist);
  return vec4(d / r, h, r * cell);
}
// the whole drop field at pane point p: vec4(lens xy, height 0..1, kind: 0 none, 1 bead, 2 trail)
vec4 rgDrops(vec2 p, float slope, out float trail) {
  float sag = 1.0 - slope;
  vec4 best = vec4(0.0);
  float bestH = 0.0;
  vec4 l;
  // running drops: one per 7 cm column (60%), stick-slip down the glass, wrapping every 1.3 m of glass
  trail = 0.0;
  float W = 0.07;
  float col = floor(p.x / W);
  float ch = rgHash(vec2(col, uSeed * 3.3));
  float clear = 0.0;
  if (ch < 0.6) {
    float sp = mix(0.012, 0.05, rgHash(vec2(col, 9.1 + uSeed))) * mix(1.0, 0.35, slope);
    float om = mix(1.3, 3.1, rgHash(vec2(col, 4.7)));
    float ph = rgHash(vec2(col, 2.2)) * 60.0;
    float s = sp * (uTime + ph - 0.85 * sin(om * (uTime + ph)) / om);
    float vd = 0.65 - mod(s, 1.3);                        // drop centre (v), wraps
    float ux = (col + 0.25 + 0.5 * rgHash(vec2(col, 5.5))) * W;
    float dv = p.y - vd;                                  // > 0 above the drop (the trail)
    float wob = 0.0025 * sin(p.y * 37.0 + col * 1.7) + 0.0015 * sin(p.y * 91.0 + col);
    float du = p.x - ux - wob;
    float rr = mix(0.0022, 0.0034, rgHash(vec2(col, 7.3)));
    // the drop (a teardrop: elongated upward)
    vec2 dd = vec2(du, dv > 0.0 ? dv * 0.55 : dv * 1.05);
    float dist = length(dd) / rr;
    if (dist < 1.0) { float h = sqrt(1.0 - dist * dist); best = vec4(dd / rr, h, 1.0); bestH = h * 1.4; }
    // the wet trail it leaves (thin, fades with distance), with tiny beads strung along it
    float L = 0.18;
    if (dv > 0.0 && dv < L) {
      float wtr = mix(0.0011, 0.0004, dv / L);
      float tr = 1.0 - smoothstep(wtr * 0.6, wtr * 1.6, abs(du));
      trail = tr * (1.0 - dv / L);
      clear = (1.0 - smoothstep(0.002, 0.0045, abs(du))) * (1.0 - smoothstep(L * 0.7, L, dv));
      float bead = floor(dv / 0.006);
      if (rgHash(vec2(col, bead)) < 0.35) {
        vec2 bd = vec2(du, mod(dv, 0.006) - 0.003) / (wtr * 1.3);
        float bdist = length(bd);
        if (bdist < 1.0 && bestH < 0.5) { best = vec4(bd, sqrt(1.0 - bdist * bdist) * 0.7, 1.0); bestH = 0.5; }
      }
    }
  }
  // static beads: big, medium, mist (the running drops swept their path clear)
  float keep = 1.0 - clear;
  l = rgLayer(p, 0.0085, 0.42 * keep, 0.16, 0.42, uSeed + 1.0, sag);
  if (l.z * 1.2 > bestH) { best = vec4(l.xy, l.z, 1.0); bestH = l.z * 1.2; }
  l = rgLayer(p + 0.37, 0.0042, 0.5 * keep, 0.14, 0.4, uSeed + 2.0, sag);
  if (l.z > bestH) { best = vec4(l.xy, l.z * 0.85, 1.0); bestH = l.z; }
  l = rgLayer(p + 0.71, 0.0019, 0.55 * keep, 0.18, 0.42, uSeed + 3.0, sag);
  if (l.z * 0.6 > bestH) { best = vec4(l.xy, l.z * 0.5, 1.0); bestH = l.z * 0.6; }
  return best;
}
// tempered-glass crazing (Voronoi cells ~1.1 cm): 1 on the crack lines
float rgCraze(vec2 p) {
  vec2 q = p / 0.011;
  vec2 id = floor(q), f = fract(q);
  float d1 = 9.0, d2 = 9.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j));
    vec2 c = o + rgHash2(id + o + 3.7) * 0.85 + 0.075;
    float d = length(c - f);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return 1.0 - smoothstep(0.02, 0.07, d2 - d1);
}
`;

// pane frames in the glass mesh's own space (car frame for the body glass; doors are axis-aligned when closed)
function paneFrame(n) {
  // n: outward-ish normal. classify -> canonical outward normal
  let o;
  if (Math.abs(n.z) > 0.55) o = new THREE.Vector3(0, 0.12, Math.sign(n.z)).normalize();           // side glass
  else if (n.x > 0) o = new THREE.Vector3(0.53, 0.85, 0).normalize();                           // windshield
  else o = new THREE.Vector3(-0.5, 0.87, 0).normalize();                                        // rear window
  const U = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), o).normalize();
  const V = new THREE.Vector3().crossVectors(o, U).normalize();
  const slope = Math.abs(o.y) > 0.7 ? 1 - Math.acos(Math.min(1, Math.abs(o.y))) / (Math.PI / 2) : 0.1;
  return { o, U, V, slope };
}

export function makeRainGlass({ quality = 'high', envMap = null, seed = 1, smash = false } = {}) {
  const transmissive = quality === 'high';
  const uniforms = {
    uTime: { value: 0 }, uSeed: { value: seed }, uWet: { value: 1 }, uCraze: { value: 0 },
    uImpact: { value: new THREE.Vector2(0, 0) }, uLens: { value: 0.16 }, uBulge: { value: 0 },
  };
  let mat;
  if (transmissive) {
    mat = new THREE.MeshPhysicalMaterial({
      name: smash ? 'CarASmashGlass' : 'CarARainGlass', color: 0xeef3f1, metalness: 0, roughness: 0.03,
      transmission: 1, thickness: 0, ior: 1.33, envMap, envMapIntensity: 0.6, specularIntensity: 1,
    });
    mat.depthWrite = false; // the lamp halos / rain behind the glass still draw (they are transparent, not in the transmission frame)
  } else {
    mat = new THREE.MeshStandardMaterial({
      name: smash ? 'CarASmashGlassLo' : 'CarARainGlassLo', color: 0xb7c2c3, roughness: 0.04, metalness: 0,
      transparent: true, opacity: 0.12, depthWrite: false, envMap, envMapIntensity: 1.6,
    });
    mat.blending = THREE.CustomBlending;
    mat.blendSrc = THREE.OneFactor; mat.blendDst = THREE.OneMinusSrcAlphaFactor;
    mat.blendSrcAlpha = THREE.OneFactor; mat.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
  }
  mat.side = THREE.FrontSide;
  mat.userData.uniforms = uniforms;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec3 aDrop; attribute vec3 aDU; attribute vec3 aDV; attribute float aInner;
        varying vec3 vDrop; varying vec3 vDU; varying vec3 vDV; varying float vInner;
        uniform float uBulge; uniform vec2 uImpact;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vDrop = aDrop; vInner = aInner;
        vDU = normalize((modelViewMatrix * vec4(aDU, 0.0)).xyz);
        vDV = normalize((modelViewMatrix * vec4(aDV, 0.0)).xyz);
        ${smash ? `{ float dI = length(aDrop.xy - uImpact); transformed -= cross(aDU, aDV) * uBulge * exp(-dI * dI * 18.0); }` : ''}`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        ${DROP_GLSL}
        uniform float uLens;
        float rgH; vec2 rgL; float rgTrail; float rgKind;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        {
          vec4 dr = rgDrops(vDrop.xy, vDrop.z, rgTrail);
          rgH = dr.z * uWet; rgL = dr.xy; rgKind = dr.w;
          roughnessFactor = mix(roughnessFactor, 0.07, step(0.001, rgH));
          ${smash ? 'float cz = rgCraze(vDrop.xy) * uCraze; roughnessFactor = mix(roughnessFactor, 0.6, cz);' : ''}
        }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (rgH > 0.001) {
          // bead normal: tilts outward from the bead centre (lens coords rgL), steep at the rim
          vec2 g = rgL / max(0.12, sqrt(max(1e-4, 1.0 - dot(rgL, rgL))));
          normal = normalize(normal + (vDU * g.x + vDV * g.y) * 0.85);
        }
        if (rgTrail > 0.0) normal = normalize(normal + vDU * 0.15 * rgTrail);`);
    if (transmissive) {
      sh.fragmentShader = sh.fragmentShader.replace('#include <transmission_fragment>', `
        #ifdef USE_TRANSMISSION
          material.transmission = transmission;
          material.transmissionAlpha = 1.0;
          {
            vec4 ndc = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
            vec2 suv = ndc.xy / ndc.w * 0.5 + 0.5;
            // a bead is a tiny fisheye: it shows an inverted, minified patch of the frame around it
            vec2 lens = vDU.xy * rgL.x + vDV.xy * rgL.y;
            suv -= lens * uLens * step(0.001, rgH);
            suv += vDU.xy * 0.004 * rgTrail;
            float lod = rgH > 0.001 ? 1.6 + 1.2 * (1.0 - rgH) : 0.0;
            ${smash ? 'lod = max(lod, cz_lod);' : ''}
            vec4 tl = textureBicubic(transmissionSamplerMap, clamp(suv, vec2(0.001), vec2(0.999)), lod);
            vec3 nW = transformNormalByInverseViewMatrix(normal, viewMatrix);
            vec3 vW = normalize(cameraPosition - vWorldPosition);
            vec3 F = EnvironmentBRDF(nW, vW, material.specularColorBlended, material.specularF90, material.roughness);
            // the bead rim goes dark (light leaves sideways), the centre stays bright
            float rim = rgH > 0.001 ? mix(0.35, 1.0, smoothstep(0.0, 0.55, rgH)) : 1.0;
            vec3 transmitted = (1.0 - F) * tl.rgb * material.diffuseContribution * rim;
            totalDiffuse = mix(totalDiffuse, transmitted, material.transmission);
          }
        #endif`);
    }
    if (smash) {
      sh.fragmentShader = sh.fragmentShader
        .replace('float rgH; vec2 rgL;', 'float cz_lod = 0.0; float cz = 0.0; float rgH; vec2 rgL;')
        // the crazing spreads from the impact point (uCraze 0..1 = radius 0..0.95 m); crazed glass goes milky
        .replace('float cz = rgCraze(vDrop.xy) * uCraze;', 'float czr = (1.0 - smoothstep(uCraze * 0.95 - 0.06, uCraze * 0.95, length(vDrop.xy - uImpact))) * step(0.001, uCraze); cz = rgCraze(vDrop.xy) * czr; cz_lod = 3.0 * czr;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(0.55, 0.6, 0.58) * cz * 0.25;`);
    }
    if (!transmissive) {
      sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
        vec3 gSpec = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
        vec3 gDiff = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
        float gA = clamp(diffuseColor.a + rgH * 0.25 ${smash ? '+ cz * 0.6' : ''}, 0.0, 1.0);
        gl_FragColor = vec4(gDiff * gA + gSpec * (1.0 + rgH * 1.5), gA);`);
    } else if (smash) {
      sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
        totalDiffuse = mix(totalDiffuse, vec3(0.06, 0.065, 0.06), cz * 0.5);
        outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
        #include <opaque_fragment>`);
    }
  };
  mat.customProgramCacheKey = () => `rainglass-${transmissive ? 't' : 'p'}-${smash ? 's' : 'n'}`;

  const prepared = new WeakSet();
  return {
    material: mat,
    uniforms,
    transmissive,
    // compute the per-vertex pane coordinates (call once per mesh that uses this material). toCar: Matrix4 from the
    // mesh's space to the car frame (classification only; the pane coordinates stay in the mesh's own space so the
    // beads ride with a swinging door)
    prepare(mesh, toCar = new THREE.Matrix4()) {
      const g = mesh.geometry.clone();
      mesh.geometry = g;
      if (prepared.has(g)) return;
      const pos = g.attributes.position, nor = g.attributes.normal;
      const n = pos.count;
      const aDrop = new Float32Array(n * 3), aDU = new Float32Array(n * 3), aDV = new Float32Array(n * 3), aInner = new Float32Array(n);
      const p = new THREE.Vector3(), nn = new THREE.Vector3(), pc = new THREE.Vector3(), nc = new THREE.Vector3();
      const nm = new THREE.Matrix3().getNormalMatrix(toCar);
      for (let i = 0; i < n; i++) {
        p.fromBufferAttribute(pos, i);
        nn.fromBufferAttribute(nor, i);
        pc.copy(p).applyMatrix4(toCar);
        nc.copy(nn).applyMatrix3(nm).normalize();
        // classify by the outward direction from the cabin centre (the inner surface's normals point inward)
        const out = new THREE.Vector3(pc.x - (-0.4), pc.y - 0.85, pc.z).normalize();
        const inner = nc.dot(out) < 0;
        nn.copy(nc);
        const f = paneFrame(inner ? nn.clone().negate() : nn);
        aDrop[i * 3] = p.dot(f.U); aDrop[i * 3 + 1] = p.dot(f.V); aDrop[i * 3 + 2] = f.slope;
        aDU[i * 3] = f.U.x; aDU[i * 3 + 1] = f.U.y; aDU[i * 3 + 2] = f.U.z;
        aDV[i * 3] = f.V.x; aDV[i * 3 + 1] = f.V.y; aDV[i * 3 + 2] = f.V.z;
        aInner[i] = inner ? 1 : 0;
      }
      g.setAttribute('aDrop', new THREE.BufferAttribute(aDrop, 3));
      g.setAttribute('aDU', new THREE.BufferAttribute(aDU, 3));
      g.setAttribute('aDV', new THREE.BufferAttribute(aDV, 3));
      g.setAttribute('aInner', new THREE.BufferAttribute(aInner, 1));
      prepared.add(g);
    },
    // pane coordinates of a point in the mesh's space (for the impact point)
    paneCoords(pLocal, nLocal) { const f = paneFrame(nLocal); return new THREE.Vector2(pLocal.dot(f.U), pLocal.dot(f.V)); },
    update(t) { uniforms.uTime.value = t; },
  };
}
