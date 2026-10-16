// Night materials for the Witte St world port (ENV agent).
//
// All world materials are MeshStandardMaterial with small onBeforeCompile injections:
//  * fake lamps: every streetlight / porch lantern / lit-window spill is evaluated in the world shaders through
//    Three's own RE_Direct (diffuse + GGX specular, no shadow) from a uniform array. world.update() sets each lamp's
//    fake intensity to (1 - share served by a real LightPool light), so a lamp always lights the street at full
//    strength whether or not the pool currently gives it one of its few real lights (no popping, constant cost).
//  * uber (merged kit): per-vertex albedo (sRGB bytes) + roughness + metalness attributes, so ~150 game material
//    slots render with one material per merge group.
//  * wet: rain-wet horizontal surfaces (darker, glossier) and deterministic puddles (world-space value noise) on
//    the street, gutters and sidewalks; optional planar reflection sampled in the puddles (high quality).
import * as THREE from 'three';

export const FAKE_MAX = 24;
export const LAMP_MAX = 32;

export function makeShared() {
  const v4 = () => new THREE.Vector4(0, -1000, 0, 0.001);
  return {
    uFakePos: { value: Array.from({ length: FAKE_MAX }, v4) },
    uFakeCol: { value: Array.from({ length: FAKE_MAX }, () => new THREE.Vector4(0, 0, 0, -2)) },
    uFakeDir: { value: Array.from({ length: FAKE_MAX }, () => new THREE.Vector4(0, -1, 0, 1)) },
    uFakeCount: { value: 0 },
    uLampI: { value: Array.from({ length: LAMP_MAX }, () => new THREE.Vector3()) },
    uTime: { value: 0 },
    uWet: { value: 1.0 },
    uAutumn: { value: 1.0 },
    uReflTex: { value: null },
    uReflMatrix: { value: new THREE.Matrix4() },
    uReflOn: { value: 0.0 },
    uReflStrength: { value: 1.0 },
    uWetTex: { value: null },
    uWetBounds: { value: new THREE.Vector4(0, 0, 0, 0) },
  };
}

const GLSL_COMMON = /* glsl */ `
vec3 prSrgbToLin( vec3 c ) { return mix( c / 12.92, pow( ( c + 0.055 ) / 1.055, vec3( 2.4 ) ), step( 0.04045, c ) ); }
float prHash12( vec2 p ) { vec3 p3 = fract( vec3( p.xyx ) * 0.1031 ); p3 += dot( p3, p3.yzx + 33.33 ); return fract( ( p3.x + p3.y ) * p3.z ); }
float prNoise( vec2 p ) {
  vec2 i = floor( p ), f = fract( p ); vec2 u = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( prHash12( i ), prHash12( i + vec2( 1.0, 0.0 ) ), u.x ), mix( prHash12( i + vec2( 0.0, 1.0 ) ), prHash12( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
}
float prFbm( vec2 p ) { float a = 0.5, s = 0.0; for ( int i = 0; i < 4; i ++ ) { s += a * prNoise( p ); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
`;

const FAKE_PARS = /* glsl */ `
#define PR_FAKE_MAX ${FAKE_MAX}
uniform vec4 uFakePos[ PR_FAKE_MAX ];
uniform vec4 uFakeCol[ PR_FAKE_MAX ];
uniform vec4 uFakeDir[ PR_FAKE_MAX ];
uniform int uFakeCount;
`;

const FAKE_APPLY = /* glsl */ `
#if defined( RE_Direct )
for ( int fi = 0; fi < PR_FAKE_MAX; fi ++ ) {
  if ( fi >= uFakeCount ) break;
  vec3 flv = ( viewMatrix * vec4( uFakePos[ fi ].xyz, 1.0 ) ).xyz - geometryPosition;
  float fd = length( flv );
  float frange = uFakePos[ fi ].w;
  if ( fd > frange || fd < 1e-4 ) continue;
  IncidentLight fLight;
  fLight.direction = flv / fd;
  float fatt = getDistanceAttenuation( fd, frange, 2.0 );
  float fcone = 1.0;
  if ( uFakeCol[ fi ].w > -1.5 ) {
    vec3 fsd = normalize( ( viewMatrix * vec4( uFakeDir[ fi ].xyz, 0.0 ) ).xyz );
    fcone = getSpotAttenuation( uFakeCol[ fi ].w, uFakeDir[ fi ].w, dot( - fLight.direction, fsd ) );
  }
  fLight.color = uFakeCol[ fi ].rgb * fatt * fcone;
  fLight.visible = true;
  RE_Direct( fLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
}
#endif
`;

const WPOS_VERT_PARS = /* glsl */ `varying vec3 vPrWPos;\n`;
const WPOS_VERT = /* glsl */ `
{
  vec4 prw = vec4( transformed, 1.0 );
  #ifdef USE_INSTANCING
    prw = instanceMatrix * prw;
  #endif
  vPrWPos = ( modelMatrix * prw ).xyz;
}
`;

function inject(shader, shared, opts) {
  const U = shader.uniforms;
  for (const k of ['uFakePos', 'uFakeCol', 'uFakeDir', 'uFakeCount', 'uLampI', 'uTime', 'uWet', 'uAutumn', 'uReflTex',
    'uReflMatrix', 'uReflOn', 'uReflStrength', 'uWetTex', 'uWetBounds']) U[k] = shared[k];
  let vs = shader.vertexShader;
  let fs = shader.fragmentShader;
  vs = vs.replace('#include <common>', `#include <common>\n${WPOS_VERT_PARS}uniform float uTime;\n${opts.vertPars || ''}`);
  vs = vs.replace('#include <project_vertex>', `${opts.vertPre || ''}\n#include <project_vertex>\n${WPOS_VERT}\n${opts.vertMain || ''}`);
  fs = fs.replace('#include <common>', `#include <common>\n${GLSL_COMMON}\nvarying vec3 vPrWPos;\nuniform float uTime;\nuniform float uWet;\nuniform float uAutumn;\n${FAKE_PARS}\n${opts.fragPars || ''}`);
  if (opts.diffuse) fs = fs.replace('vec4 diffuseColor = vec4( diffuse, opacity );', opts.diffuse);
  if (opts.afterColor) fs = fs.replace('#include <color_fragment>', `#include <color_fragment>\n${opts.afterColor}`);
  if (opts.afterMap) fs = fs.replace('#include <map_fragment>', `#include <map_fragment>\n${opts.afterMap}`);
  if (opts.afterRough) fs = fs.replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\n${opts.afterRough}`);
  if (opts.afterNormal) fs = fs.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${opts.afterNormal}`);
  if (opts.emissive) fs = fs.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${opts.emissive}`);
  if (opts.fake !== false) fs = fs.replace('#include <lights_fragment_end>', `${FAKE_APPLY}\n#include <lights_fragment_end>`);
  if (opts.afterLights) fs = fs.replace('#include <aomap_fragment>', `#include <aomap_fragment>\n${opts.afterLights}`);
  shader.vertexShader = vs;
  shader.fragmentShader = fs;
}

function patch(mat, shared, key, opts) {
  mat.onBeforeCompile = (shader) => inject(shader, shared, opts);
  mat.customProgramCacheKey = () => `pr-world-${key}`;
  return mat;
}

// wet horizontal surfaces of kit pieces (tops of steps, car roofs, sills): darker + glossier
const WET_KIT = /* glsl */ `
{
  { vec3 dn = fwidth( normal ); roughnessFactor = max( roughnessFactor, clamp( length( dn ) * 1.2, 0.0, 0.5 ) ); }
  vec3 prNW = normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
  float prUp = smoothstep( 0.35, 0.92, prNW.y ) * uWet;
  roughnessFactor = mix( roughnessFactor, roughnessFactor * 0.45 + 0.03, prUp * 0.85 );
  diffuseColor.rgb *= mix( 1.0, 0.8, prUp * ( 1.0 - metalnessFactor ) );
}
`;

// ---------------------------------------------------------------------------------------------- merged kit (uber)
export function uberMaterial(shared, { wetTops = true, side = THREE.FrontSide } = {}) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 1, side, envMapIntensity: 1.3 });
  m.name = 'pr_uber';
  return patch(m, shared, `uber-${wetTops}-${side}`, {
    vertPars: 'attribute vec4 albedoRough;\nattribute vec2 metalFlag;\nvarying vec4 vAlbedoRough;\nvarying vec2 vMetalFlag;\n',
    vertMain: 'vAlbedoRough = albedoRough; vMetalFlag = metalFlag;',
    fragPars: 'varying vec4 vAlbedoRough;\nvarying vec2 vMetalFlag;\n',
    diffuse: 'vec4 diffuseColor = vec4( diffuse * prSrgbToLin( vAlbedoRough.rgb ), opacity );',
    afterRough: 'roughnessFactor = max( 0.03, vAlbedoRough.a * roughness ); metalnessFactor = vMetalFlag.x * metalness;',
    afterNormal: wetTops ? WET_KIT : '',
    emissive: 'totalEmissiveRadiance += diffuseColor.rgb * vMetalFlag.y * 4.0;',
  });
}

// ------------------------------------------------------------------------------------------------- lamp lenses
export function lampMaterial(shared) {
  const m = new THREE.MeshStandardMaterial({ color: 0xb8bcc0, roughness: 0.35, metalness: 0 });
  m.name = 'pr_lamps';
  return patch(m, shared, 'lamp', {
    vertPars: 'attribute float lampId;\nvarying float vLampId;\n',
    vertMain: 'vLampId = lampId;',
    fragPars: `uniform vec3 uLampI[ ${LAMP_MAX} ];\nvarying float vLampId;\n`,
    emissive: 'totalEmissiveRadiance += uLampI[ int( vLampId + 0.5 ) ];',
    fake: false,
  });
}

// ------------------------------------------------------------------------------------------- windows / car glass
export function glassMaterial(shared) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.06, metalness: 0.0, envMapIntensity: 2.6 });
  m.name = 'pr_glass';
  return patch(m, shared, 'glass', {
    vertPars: 'attribute vec4 albedoRough;\nattribute vec4 litColor;\nvarying vec4 vAlbedoRough;\nvarying vec4 vLit;\nvarying vec2 vGUv;\n',
    vertMain: 'vAlbedoRough = albedoRough; vLit = litColor; vGUv = uv;',
    fragPars: 'varying vec4 vAlbedoRough;\nvarying vec4 vLit;\nvarying vec2 vGUv;\n',
    diffuse: 'vec4 diffuseColor = vec4( diffuse * prSrgbToLin( vAlbedoRough.rgb ), opacity );',
    afterRough: 'roughnessFactor = max( 0.04, vAlbedoRough.a * 0.6 );',
    emissive: /* glsl */ `
      if ( vLit.a > 0.0 ) {
        vec2 wuv = clamp( vGUv, 0.0, 1.0 );
        float curtain = smoothstep( 0.0, 0.2, wuv.x ) * smoothstep( 1.0, 0.8, wuv.x );
        float lampGrad = 0.55 + 0.45 * smoothstep( 0.05, 0.75, wuv.y );
        float blind = mix( 1.0, 0.82 + 0.18 * step( 0.45, fract( wuv.y * 15.0 ) ), step( 0.5, fract( vLit.a * 7.0 ) ) );
        totalEmissiveRadiance += prSrgbToLin( vLit.rgb ) * vLit.a * 5.0 * mix( 0.3, 1.0, curtain ) * lampGrad * blind;
      }`,
  });
}

// ------------------------------------------------------------------------------------------------- foliage
export function foliageMaterial(shared, map, { weeds = false } = {}) {
  const m = new THREE.MeshStandardMaterial({ map, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.82, metalness: 0,
    color: weeds ? 0xd8d0b8 : 0xd8e6cc });
  m.name = weeds ? 'pr_weeds' : 'pr_leaves';
  return patch(m, shared, weeds ? 'weeds' : 'leaves', {
    vertPars: 'attribute vec4 wind;\n',
    vertPre: /* glsl */ `
      {
        float flex = wind.r, phase = wind.a * 6.2831, flutter = wind.b;
        vec3 wp = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;
        float gust = 0.6 + 0.4 * sin( uTime * 0.37 + wp.x * 0.05 + wp.z * 0.03 );
        transformed.x += sin( uTime * 1.7 + phase + wp.z * 0.2 ) * 0.035 * flex * gust;
        transformed.z += cos( uTime * 1.3 + phase * 1.3 + wp.x * 0.2 ) * 0.03 * flex * gust;
        transformed.y += sin( uTime * 6.0 + phase * 3.0 ) * 0.01 * flutter * gust;
      }`,
    afterMap: weeds ? /* glsl */ `
      { float l = dot( diffuseColor.rgb, vec3( 0.3, 0.59, 0.11 ) );
        diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.55, 0.45, 0.28 ) * l * 2.0, 0.65 * uAutumn ); }` : /* glsl */ `
      {
        float tree = prHash12( floor( vPrWPos.xz * 0.12 ) + 3.7 );
        float leaf = prHash12( floor( vPrWPos.xz * 2.3 + vPrWPos.y * 1.7 ) );
        float l = dot( diffuseColor.rgb, vec3( 0.3, 0.59, 0.11 ) );
        vec3 autumn = mix( vec3( 0.55, 0.2, 0.05 ), vec3( 0.75, 0.52, 0.12 ), leaf );
        autumn = mix( autumn, vec3( 0.35, 0.22, 0.12 ), step( 0.7, prHash12( floor( vPrWPos.xz * 1.1 ) ) ) );
        diffuseColor.rgb = mix( diffuseColor.rgb, autumn * l * 2.4, uAutumn * mix( 0.72, 0.97, tree ) );
        if ( prHash12( floor( vPrWPos.xyz * 1.3 ).xz + floor( vPrWPos.y * 1.3 ) * 7.0 ) < 0.3 * uAutumn ) discard;
      }`,
  });
}

// ------------------------------------------------------------------------------------------------- textured kit
export function texturedKitMaterial(shared, map, { alphaTest = 0, side = THREE.FrontSide, roughness = 0.55, metalness = 0 } = {}) {
  const m = new THREE.MeshStandardMaterial({ map, alphaTest, side, roughness, metalness, transparent: false });
  m.name = 'pr_kit_tex';
  return patch(m, shared, `kittex-${alphaTest > 0}-${side}`, { afterNormal: WET_KIT });
}

// ------------------------------------------------------------------------------------------------- chunk ground / walls
const PUDDLE_PARS = /* glsl */ `
uniform float uWetRefl;
uniform float uPudLo;
uniform float uPudAmt;
uniform float uGutterK;
uniform float uDepK;
uniform sampler2D uWetTex;
uniform vec4 uWetBounds;
vec3 prRawN;
uniform float uWetDark;
uniform float uWetRough;
uniform sampler2D uReflTex;
uniform mat4 uReflMatrix;
uniform float uReflOn;
uniform float uReflStrength;
float prPuddle;
float prDamp = 0.0;
`;

export function groundMaterial(shared, { map, normalMap, roughMap, k = 1, rough = 0.9, wet = 0, pudLo = 0.6, pudAmt = 0,
  wetDark = 0.85, wetRough = 0.8, normalScale = 1, name = 'ground', alphaGutter = false, vertexColors = true, gutterK = 0,
  depK = 0, wetRefl = 0, dampFoot = false } = {}) {
  const m = new THREE.MeshStandardMaterial({ map: map || null, normalMap: normalMap || null, roughnessMap: roughMap || null,
    roughness: rough, metalness: 0, vertexColors, color: new THREE.Color(k, k, k) });
  if (normalMap) m.normalScale = new THREE.Vector2(normalScale, -normalScale); // game normal maps are DirectX-style
  if (alphaGutter) {
    m.alphaTest = 0.35;
    m.polygonOffset = true;
    m.polygonOffsetFactor = -1;
    m.polygonOffsetUnits = -2;
  }
  m.name = `pr_${name}`;
  const pudU = { uPudLo: { value: pudLo }, uPudAmt: { value: pudAmt }, uWetDark: { value: wetDark }, uWetRough: { value: wetRough },
    uGutterK: { value: gutterK }, uDepK: { value: depK }, uWetRefl: { value: wetRefl } };
  m.userData.pudU = pudU;
  const opts = {
    // damp foot of the focus finish walls: the game's weathering coordinates (UV1 = along, height above the sidewalk;
    // V flipped by the glTF export) darken and gloss the splash zone
    vertPars: dampFoot ? 'attribute vec2 uv1;\nvarying float vPrHgt;\n' : '',
    vertMain: dampFoot ? 'vPrHgt = 1.0 - uv1.y;' : '',
    fragPars: PUDDLE_PARS + (dampFoot ? 'varying float vPrHgt;\n' : ''),
    afterColor: /* glsl */ `
      ${alphaGutter ? '#ifdef USE_MAP\n diffuseColor.a = sampledDiffuseColor.a * clamp( pow( max( vColor.a, 0.0 ), 0.6 ) * 1.6, 0.0, 1.0 );\n#endif' : 'diffuseColor.a = 1.0;'}
      prPuddle = 0.0;
      if ( uPudAmt > 0.0 ) {
        vec3 wm = vec3( 0.0 );
        if ( uWetBounds.z > 0.0 ) {
          vec2 wuv = vec2( ( vPrWPos.x - uWetBounds.x ) * uWetBounds.z, 1.0 - ( vPrWPos.z - uWetBounds.y ) * uWetBounds.w );
          if ( wuv.x > 0.0 && wuv.x < 1.0 && wuv.y > 0.0 && wuv.y < 1.0 ) wm = texture2D( uWetTex, wuv ).rgb;
        }
        float pn = prFbm( vPrWPos.xz * 0.33 + 3.1 ) * 0.62 + prFbm( vPrWPos.xz * 1.35 + 7.7 ) * 0.38;
        float lo = uPudLo - uGutterK * wm.r - uDepK * wm.g;
        prPuddle = smoothstep( lo, lo + 0.045, pn ) * uPudAmt * uWet;
      }
      diffuseColor.rgb *= mix( 1.0, uWetDark, uWet ) * mix( 1.0, 0.55, prPuddle );
      ${dampFoot ? `{ float dn = prNoise( vPrWPos.xz * 3.0 + vPrWPos.y ) * 0.18;
        prDamp = ( 1.0 - smoothstep( 0.12, 0.42 + dn, vPrHgt ) ) * step( -0.5, vPrHgt ) * uWet;
        diffuseColor.rgb *= 1.0 - 0.32 * prDamp; }` : ''}`,
    afterRough: `roughnessFactor = mix( roughnessFactor * mix( 1.0, uWetRough, uWet ), 0.03, prPuddle );
      ${dampFoot ? 'roughnessFactor = mix( roughnessFactor, roughnessFactor * 0.55, prDamp );' : ''}`,
    afterNormal: /* glsl */ `
      prRawN = normal;
      normal = normalize( mix( normal, nonPerturbedNormal, prPuddle * 0.92 ) );
      { vec3 dn = fwidth( normal ); roughnessFactor = max( roughnessFactor, clamp( length( dn ) * 1.4, 0.0, 0.55 ) ); }`,
    afterLights: /* glsl */ `
      if ( uReflOn > 0.5 && ( prPuddle > 0.01 || uWetRefl > 0.0 ) ) {
        vec4 rc = uReflMatrix * vec4( vPrWPos, 1.0 );
        vec2 nd = ( prRawN.xy - nonPerturbedNormal.xy );
        float fres = 0.04 + 0.96 * pow( 1.0 - saturate( dot( geometryNormal, geometryViewDir ) ), 5.0 );
        // puddles: a sharp mirror, rippled by the surface normal map
        vec4 rp = rc; rp.xy += nd * 0.06 * rc.w;
        vec3 rcol = texture2DProj( uReflTex, rp ).rgb;
        reflectedLight.indirectSpecular += rcol * prPuddle * uReflStrength * mix( 0.25, 1.0, fres );
        // the rest of the wet surface: smeared vertical streaks of the lamps / windows (classic wet street)
        if ( uWetRefl > 0.0 ) {
          vec3 rs = vec3( 0.0 );
          float jit = prHash12( gl_FragCoord.xy );
          for ( int k = 0; k < 10; k ++ ) {
            vec4 ro = rc; float o = ( ( float( k ) + jit ) / 10.0 - 0.5 ) * 0.085;
            ro.y += o * rc.w; ro.x += ( fract( jit * 7.31 + float( k ) * 0.37 ) - 0.5 ) * 0.008 * rc.w; ro.xy += nd * 0.12 * rc.w;
            rs += min( texture2DProj( uReflTex, ro ).rgb, vec3( 0.7 ) );   // firefly clamp (tiny lamp heads)
          }
          rs *= 0.1;
          // soft knee: keep the streaks of lamps / lit windows / lit facades, drop the dim sky sheen (wide streets
          // looking at the horizon glow otherwise turn into a pale band)
          rs = max( rs - vec3( 0.014 ), vec3( 0.0 ) ) * 1.15;
          float glossy = pow( saturate( 1.0 - roughnessFactor ), 2.0 );
          reflectedLight.indirectSpecular += rs * ( 1.0 - prPuddle ) * uWetRefl * uWet * glossy * fres * uReflStrength;
        }
      }`,
  };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, pudU);
    inject(shader, shared, opts);
  };
  m.customProgramCacheKey = () => `pr-ground-${!!map}-${!!normalMap}-${!!roughMap}-${alphaGutter}-${vertexColors}-${dampFoot}`;
  return m;
}

// wires: dark, a little sheen, gentle sway from the game's wind span data (vertex colour: span t, phase, weight)
export function wireMaterial(shared) {
  const m = new THREE.MeshStandardMaterial({ color: 0x0b0b0b, roughness: 0.5, metalness: 0.2, vertexColors: false });
  m.name = 'pr_wire';
  return patch(m, shared, 'wire', {
    vertPre: /* glsl */ `
      {
        float sag = sin( 3.14159 * clamp( color.r, 0.0, 1.0 ) );
        float ph = color.g * 6.2831;
        transformed.x += sin( uTime * 0.9 + ph ) * 0.025 * sag;
        transformed.y += sin( uTime * 1.2 + ph * 1.7 ) * 0.012 * sag;
      }`,
    vertPars: 'attribute vec4 color;\n',
  });
}


// ------------------------------------------------------------------------------------------------- lamp halos
// Soft camera-facing glow around every lamp head / lantern (light scattering in the damp night air), one instanced
// draw call; per-instance colour = lamp colour x intensity (flicker included), set by world.update().
export function haloMaterial() {
  return new THREE.ShaderMaterial({
    name: 'pr_halo',
    transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: true,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vFade;
      void main() {
        vUv = uv;
        #ifdef USE_INSTANCING_COLOR
          vCol = instanceColor;
        #else
          vCol = vec3( 0.0 );
        #endif
        vec4 c = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
        float size = length( instanceMatrix[ 0 ].xyz );
        // fade when the camera is very close (no halo filling the screen) and with distance (haze)
        float d = length( c.xyz );
        vFade = smoothstep( 1.5, 4.0, d ) * exp( - d * 0.012 );
        c.xy += position.xy * size;
        gl_Position = projectionMatrix * c;
      }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vFade;
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = dot( p, p );
        float g = exp( - r * 4.2 ) * 0.7 + exp( - r * 24.0 ) * 0.45;
        gl_FragColor = vec4( vCol * g * vFade, 1.0 );
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}
