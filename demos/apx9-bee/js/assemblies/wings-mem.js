// wings-mem.js - the smart membrane: a cell-by-cell "pillow" mesh that lies on the cambered wing surface (every Voronoi cell is
// a slightly different glass facet, so each one catches the studio softboxes differently) plus a local glass material.
//
// Glass material: MeshPhysicalMaterial patched to output PREMULTIPLIED colour  rgb = diffuse * a + (specular + emissive),  a
// with blend (One, OneMinusSrcAlpha). A normal alpha blend would fade the reflections together with the body colour and the
// pane would look like grey fog; this keeps the highlights, the thin-film colour and the LED glow at full strength while the
// tinted body stays see-through.
import * as THREE from 'three';
import { GeoBuf } from './wings-geo.js';
import { surfaceZ, edgeSamples, mk } from './wings-shape.js';
import { uvOf } from './wings-tex.js';

/**
 * Membrane geometry. net = buildNetwork() result.
 *  rings   concentric rings per cell (pillow smoothness)       seg  boundary sample spacing (mm)
 */
export function membraneGeometry(net, { rings = 4, seg = 0.8, seed = 77 } = {}) {
  const R = mk(seed);
  const V = net.verts;
  const buf = new GeoBuf();
  const cache = new Map();
  const edge = (a, b) => {
    const lo = Math.min(a, b), hi = Math.max(a, b);
    const key = lo * 100003 + hi;
    let s = cache.get(key);
    if (!s) { s = edgeSamples(V[lo], V[hi], seg); cache.set(key, s); }
    return a < b ? s : s.slice().reverse();
  };
  const info = [];
  for (const c of net.cells) {
    const ids = c.ids;
    const ring0 = [];
    for (let k = 0; k < ids.length; k++) {
      const s = edge(ids[k], ids[(k + 1) % ids.length]);
      for (let i = 0; i < s.length - 1; i++) ring0.push(s[i]);
    }
    const n = ring0.length;
    if (n < 3) continue;
    const cx = c.cx, cy = c.cy;
    const r = Math.sqrt(c.area / Math.PI);
    // per-cell character: most cells bulge a little, a few sag; every one is tilted slightly so the reflections differ
    const sag = R() < 0.2;
    const H = sag ? -R.range(0.025, 0.06) : R.range(0.05, 0.13);
    const tilt = 0.09 * Math.min(1, r / 1.1);
    const tx = R.range(-tilt, tilt), ty = R.range(-tilt, tilt);
    info.push({ cx, cy, H, tx, ty });
    const v0 = buf.count, i0 = buf.idx.length;
    const rowStart = [];
    for (let k = 0; k <= rings; k++) {
      const s = k / rings;
      const w = 1 - s;
      rowStart.push(buf.count);
      if (k === rings) break;
      // 1 - (1 - s)^2: steep at the cell rim, flat at the crown
      const pil = 1 - (1 - s) * (1 - s);
      const tap = s < 0.3 ? (s / 0.3) * (s / 0.3) * (3 - 2 * (s / 0.3)) : 1;
      for (let j = 0; j < n; j++) {
        const b = ring0[j];
        const x = cx + (b[0] - cx) * w, y = cy + (b[1] - cy) * w;
        const z = k === 0 ? b[2] : surfaceZ(x, y) + H * pil + (tx * (x - cx) + ty * (y - cy)) * tap;
        const [u, v] = uvOf(x, y);
        buf.vert(x, y, z, 0, 0, 1, u, v);
      }
    }
    // crown vertex
    const crown = buf.count;
    {
      const x = cx, y = cy;
      const [u, v] = uvOf(x, y);
      buf.vert(x, y, surfaceZ(x, y) + H, 0, 0, 1, u, v);
    }
    for (let k = 0; k < rings - 1; k++) {
      const a0 = rowStart[k], a1 = rowStart[k + 1];
      for (let j = 0; j < n; j++) {
        const j1 = (j + 1) % n;
        buf.quad(a0 + j, a0 + j1, a1 + j1, a1 + j);
      }
    }
    const last = rowStart[rings - 1];
    for (let j = 0; j < n; j++) buf.tri(last + j, last + ((j + 1) % n), crown);
    buf.smooth(v0, i0);
  }
  const g = buf.geometry();
  g.userData.cells = info;
  return g;
}

/* ------------------------------------------------------------------ glass */
const PREMUL = /* glsl */`
	#ifdef OPAQUE
	diffuseColor.a = 1.0;
	#endif
	{
		const vec3 LUM = vec3( 0.2126, 0.7152, 0.0722 );
		float wa = clamp( diffuseColor.a * uGl.z, 0.0, 1.0 );
		vec3 Nn = normalize( normal );
		float ndv = clamp( dot( Nn, normalize( vViewPosition ) ), 0.0, 1.0 );
		float edge = 1.0 - ndv;
		float graze = edge * edge * edge;
		float film = texture2D( tFilm, vMapUv ).g;
		// frosted areas scatter (they follow the light); clear glass just tints what is behind it
		float frost = smoothstep( 0.28, 0.58, material.roughness );
		vec3 body = mix( diffuseColor.rgb * 0.92 * uGl.y, totalDiffuse, frost ) * wa;
		// reflections: a studio softbox is worth 10+ in HDR, so squash them toward a ceiling (uGl.x) - the pane sparkles
		// instead of turning into a white card, and a bright backdrop plus a highlight stays under the bloom threshold
		vec3 sp = totalSpecular;
		sp = sp / ( 1.0 + sp / uGl.x );
		float ls = dot( sp, LUM );
		// thin-film sheen: hue follows the film thickness and the viewing angle, strongest toward the cell rims
		float ph = film * 2.6 + edge * 1.4;
		vec3 hue = 0.6 + 0.4 * cos( 6.2831853 * ( ph + vec3( 0.0, 0.33, 0.67 ) ) );
		float af = ( 0.035 + 0.28 * graze + 0.07 * ( film - 0.5 ) * ( film - 0.5 ) * 4.0 ) * ( 1.0 - frost * 0.7 ) * uGl.w;
		// rim absorption: the thick edge of every glass cell turns smoky
		float rim = 0.5 * graze * ( 1.0 - frost );
		vec3 rimCol = vec3( 0.07, 0.10, 0.12 );
		vec3 rgb = body + sp + hue * af * 0.8 + rimCol * rim + totalEmissiveRadiance;
		float a = clamp( wa + ls + af + rim, 0.0, 1.0 );
		gl_FragColor = vec4( rgb, a );
	}
`;

/** Clear iridescent membrane glass. tex = makeMembraneTextures() result. */
export function glassMaterial(tex) {
  const m = new THREE.MeshPhysicalMaterial({
    name: 'wing glass',
    color: 0xffffff,
    map: tex.map,
    alphaMap: tex.alpha,
    roughness: 1,
    roughnessMap: tex.rough,
    metalness: 0,
    ior: 1.62,
    specularIntensity: 1,
    iridescence: 1,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [120, 760],
    iridescenceThicknessMap: tex.irid,
    emissive: 0xffffff,
    emissiveMap: tex.emis,
    emissiveIntensity: 3.2,
    normalMap: tex.normal,
    normalScale: new THREE.Vector2(0.5, 0.5),
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendEquationAlpha: THREE.AddEquation,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
  const gl = { value: new THREE.Vector4(0.8, 0.6, 0.8, 1.3) };       // x: reflection ceiling  y: body mul  z: alpha mul  w: film mul
  m.userData.gl = gl;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.tFilm = { value: tex.irid };
    shader.uniforms.uGl = gl;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D tFilm;\nuniform vec4 uGl;')
      .replace('#include <opaque_fragment>', PREMUL);
  };
  m.customProgramCacheKey = () => 'apx9-wing-glass-v5';
  return m;
}
