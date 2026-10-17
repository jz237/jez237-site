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
    // gfx pass 2026-10-16 (weather.js): ground height map (same bounds/layout as the wetness map) + facade weathering map
    uHgtTex: { value: null },
    uHgtB: { value: new THREE.Vector4(0, 0, 0, 0) },
    uFacTex: { value: null },
    uFacB: { value: new THREE.Vector4(0, 0, 0, 0) },
    uFacY: { value: new THREE.Vector2(0, 0) },
    uRoomK: { value: 1.0 },
    uRipple: { value: 1.0 },
    uWeatherK: { value: 1.0 },
    uWeatherLo: { value: 0.0 },
    // perf pass: baked noise (weather.js makeNoiseTexture) + rain-drop sites (makeRippleTexture)
    uNoiseTex: { value: null },
    uRipTex: { value: null },
  };
}

// facade / ground helpers (weather.js maps)
const WEATHER_PARS = /* glsl */ `
uniform sampler2D uHgtTex;
uniform vec4 uHgtB;
uniform sampler2D uFacTex;
uniform vec4 uFacB;
uniform vec2 uFacY;
uniform float uWeatherK;
uniform float uWeatherLo;
uniform sampler2D uNoiseTex;
float prGroundAt( vec2 xz ) {
  vec2 uv = vec2( ( xz.x - uHgtB.x ) * uHgtB.z, 1.0 - ( xz.y - uHgtB.y ) * uHgtB.w );
  return texture2D( uHgtTex, clamp( uv, vec2( 0.0 ), vec2( 1.0 ) ) ).r;
}
vec3 prFacade( vec3 p, vec3 n ) {
  float strip, u;
  if ( abs( n.x ) >= abs( n.z ) ) { strip = n.x > 0.0 ? 0.0 : 1.0; u = ( p.z - uFacB.y ) * uFacB.w; }
  else { strip = n.z > 0.0 ? 2.0 : 3.0; u = ( p.x - uFacB.x ) * uFacB.z; }
  float v = clamp( ( p.y - uFacY.x ) * uFacY.y, 0.02, 0.98 );
  return texture2D( uFacTex, vec2( u, ( strip + v ) * 0.25 ) ).rgb;
}
`;

const GLSL_COMMON = /* glsl */ `
vec3 prSrgbToLin( vec3 c ) { return mix( c / 12.92, pow( ( c + 0.055 ) / 1.055, vec3( 2.4 ) ), step( 0.04045, c ) ); }
float prHash12( vec2 p ) { vec3 p3 = fract( vec3( p.xyx ) * 0.1031 ); p3 += dot( p3, p3.yzx + 33.33 ); return fract( ( p3.x + p3.y ) * p3.z ); }
float prNoise( vec2 p ) {
  vec2 i = floor( p ), f = fract( p ); vec2 u = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( prHash12( i ), prHash12( i + vec2( 1.0, 0.0 ) ), u.x ), mix( prHash12( i + vec2( 0.0, 1.0 ) ), prHash12( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
}
float prFbm( vec2 p ) { float a = 0.5, s = 0.0; for ( int i = 0; i < 4; i ++ ) { s += a * prNoise( p ); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float prFbm2( vec2 p ) { return ( prNoise( p ) * 0.5 + prNoise( p * 2.03 + 17.1 ) * 0.25 ) * 1.3333; }
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
    'uReflMatrix', 'uReflOn', 'uReflStrength', 'uWetTex', 'uWetBounds', 'uHgtTex', 'uHgtB', 'uFacTex', 'uFacB', 'uFacY',
    'uRoomK', 'uRipple', 'uWeatherK', 'uWeatherLo', 'uNoiseTex', 'uRipTex']) U[k] = shared[k];
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
  // gfx pass 2026-10-16: haze with height falloff. Full haze in the street (below ~2.5 m above the road, where the
  // cast and props stand, so they match the world exactly), thinning higher up: rooflines and upper facades stand
  // darker against the brighter low haze and the horizon glow.
  fs = fs.replace('#include <fog_fragment>', /* glsl */ `
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
  #else
    float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
  #endif
  fogFactor *= mix( 0.5, 1.0, exp( - max( vPrWPos.y - 2.5, 0.0 ) * 0.1 ) );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`);
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

// gfx pass 2026-10-16: weathering of every kit piece (world space, no textures): no two pieces the same clean paint
// (tone variation per piece + low-frequency mottling), a dirt/splash band toward the ground, rust on iron (rails,
// grilles, fences, lamp housings; never on the cars). car / emissive / per-piece random come from the uber attributes.
function kitWeather(car, emis, rnd) {
  return /* glsl */ `
if ( uWeatherK > 0.5 ) {
  float wkCar = ${car}, wkEm = ${emis}, wkRnd = ${rnd};
  float wkK = 1.0 - wkEm;
  float wkH = vPrWPos.y - prGroundAt( vPrWPos.xz );
  vec2 wkP = vPrWPos.xz + vPrWPos.y * 0.7;
  vec4 wkA = texture2D( uNoiseTex, wkP * 0.1 + wkRnd * 0.87 );                       // R 0.8/m .. A 6.4/m
  vec4 wkB = texture2D( uNoiseTex, ( vPrWPos.xz * 1.3 + vPrWPos.y ) * 0.375 + 0.31 ); // G 6/m, A 24/m
  float wkV1 = wkA.r * 0.67 + wkA.g * 0.33, wkV2 = wkB.g;
  diffuseColor.rgb *= mix( 1.0, 0.76 + 0.34 * wkV1 + 0.1 * ( wkV2 - 0.5 ) + 0.16 * ( wkRnd - 0.5 ) * ( 1.0 - wkCar ), wkK );
  float wkBand = ( 1.0 - smoothstep( 0.03, 0.42 + 0.35 * wkV1, wkH ) ) * ( 1.0 - 0.5 * wkCar ) * step( -0.6, wkH );
  diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * 0.42 + vec3( 0.016, 0.0135, 0.011 ), wkBand * 0.7 * wkK );
  float wkIron = step( 0.15, metalnessFactor ) * ( 1.0 - wkCar ) * wkK;
  float wkRn = wkA.b * 0.67 + wkA.a * 0.33;
  float wkRust = smoothstep( 0.5, 0.7, wkRn + wkBand * 0.3 + wkRnd * 0.12 ) * wkIron;
  vec3 wkRc = mix( vec3( 0.075, 0.03, 0.012 ), vec3( 0.19, 0.08, 0.03 ), wkV2 );
  diffuseColor.rgb = mix( diffuseColor.rgb, wkRc, wkRust * 0.9 );
  metalnessFactor = mix( metalnessFactor, 0.05, wkRust );
  roughnessFactor = mix( roughnessFactor, 0.8, wkRust * 0.75 );
  // treads / sills / ledges: soaked, stained patches; vertical faces: rain runs; a fine mottle (not on the cars)
  vec3 wkN = normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
  float wkUpF = smoothstep( 0.5, 0.9, wkN.y ), wkSideF = 1.0 - smoothstep( 0.3, 0.6, abs( wkN.y ) );
  float wkStn = smoothstep( 0.45, 0.75, wkA.g ) * wkUpF;
  vec2 wkTg = normalize( vec2( -wkN.z, wkN.x ) + vec2( 1e-5 ) );
  float wkRuns = smoothstep( 0.55, 0.9, texture2D( uNoiseTex, vec2( dot( vPrWPos.xz, wkTg ) * 26.0, vPrWPos.y * 1.6 ) * 0.0625 ).g ) * wkSideF;
  float wkNC = wkK * ( 1.0 - wkCar );
  diffuseColor.rgb *= 1.0 - ( 0.32 * wkStn + 0.26 * wkRuns ) * wkNC;
  diffuseColor.rgb *= mix( 1.0, 0.9 + 0.2 * wkB.a, wkNC );
  roughnessFactor = mix( roughnessFactor, roughnessFactor * 0.5, wkStn * wkNC );
}
`;
}

// ---------------------------------------------------------------------------------------------- merged kit (uber)
export function uberMaterial(shared, { wetTops = true, side = THREE.FrontSide, weather = true } = {}) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 1, side, envMapIntensity: 1.3 });
  m.name = 'pr_uber';
  return patch(m, shared, `uber-${wetTops}-${side}-${weather}`, {
    vertPars: 'attribute vec4 albedoRough;\nattribute vec4 metalFlag;\nvarying vec4 vAlbedoRough;\nvarying vec4 vMetalFlag;\n',
    vertMain: 'vAlbedoRough = albedoRough; vMetalFlag = metalFlag;',
    fragPars: `varying vec4 vAlbedoRough;\nvarying vec4 vMetalFlag;\n${WEATHER_PARS}`,
    diffuse: 'vec4 diffuseColor = vec4( diffuse * prSrgbToLin( vAlbedoRough.rgb ), opacity );',
    afterRough: 'roughnessFactor = max( 0.03, vAlbedoRough.a * roughness ); metalnessFactor = vMetalFlag.x * metalness;',
    afterNormal: (wetTops ? WET_KIT : '') + (weather ? kitWeather('vMetalFlag.z', 'step( 0.01, vMetalFlag.y )', 'vMetalFlag.w') : ''),
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
// gfx pass 2026-10-16: every house window shows a room behind the glass (interior mapping in world space: a box room
// centred near the window, floor below the sill, walls / floor / ceiling / back wall with a doorway, furniture in
// silhouette) behind a curtain layer at the glass (drapes, venetian blinds, roller shade, sheer or nothing; the fabric
// is lit by the street lamps through the normal lighting and backlit by the room). Rooms are deterministic per window:
// most dark (only street light falling in near the glass), some with a dim lamp, a TV's cold flicker or a lit hallway;
// the 8 'lit windows' keep a bright warm lamp. Car glass (winInfo.w = 0) is unchanged.
const ROOM_GLSL = /* glsl */ `
varying vec4 vWin;
uniform float uRoomK;
uniform sampler2D uNoiseTex;
vec3 prRoomE = vec3( 0.0 );
vec3 prWallC( float s ) {
  vec3 a = mix( vec3( 0.50, 0.45, 0.36 ), vec3( 0.36, 0.40, 0.35 ), step( 0.45, s ) );
  a = mix( a, vec3( 0.42, 0.38, 0.41 ), step( 0.75, s ) );
  return mix( a, vec3( 0.55, 0.53, 0.49 ), step( 0.9, s ) );
}
void prWindowRoom( inout vec3 dcol, inout float rough, vec3 wn ) {
  vec3 D = -wn; D.y = 0.0; D = normalize( D + vec3( 1e-5 ) );
  vec3 A = vec3( -D.z, 0.0, D.x );
  float s1 = prHash12( vWin.xz * 1.37 + vWin.y * 3.1 );
  float s2 = prHash12( vWin.xz * 2.91 + 7.3 );
  float s3 = prHash12( vWin.zx * 0.71 + 1.9 );
  float s4 = prHash12( vWin.xz * 4.13 + 2.2 );
  float Wr = mix( 2.8, 4.6, s1 ), Hr = mix( 2.45, 2.8, s2 ), Dr = mix( 3.2, 6.0, s3 );
  float sillH = mix( 0.72, 0.95, s2 );
  vec3 rel = vPrWPos - vWin.xyz;
  float wx = dot( rel, A ), wy = rel.y;
  vec3 ro = vec3( clamp( wx + ( s4 - 0.5 ) * 0.9, -Wr * 0.47, Wr * 0.47 ), clamp( wy + sillH, 0.05, Hr - 0.05 ), 0.04 );
  vec3 vd = normalize( vPrWPos - cameraPosition );
  vec3 rd = vec3( dot( vd, A ), vd.y, max( dot( vd, D ), 0.03 ) );
  // (the exit plane is picked from the guarded direction's sign: a near-zero component must not flip it, or the hit
  // lands behind the glass and exp() below overflows -> NaN through the whole post chain)
  vec3 dv = vec3( abs( rd.x ) > 1e-4 ? rd.x : 1e-4, abs( rd.y ) > 1e-4 ? rd.y : 1e-4, rd.z );
  vec3 bnd = vec3( dv.x > 0.0 ? Wr * 0.5 : -Wr * 0.5, dv.y > 0.0 ? Hr : 0.0, Dr );
  vec3 tt = max( ( bnd - ro ) / dv, vec3( 0.0 ) );
  float th = min( min( tt.x, tt.y ), tt.z );
  vec3 hp = clamp( ro + rd * th, vec3( -Wr * 0.5, 0.0, 0.0 ), vec3( Wr * 0.5, Hr, Dr ) );
  float isSide = step( tt.x, min( tt.y, tt.z ) );
  float isHor = ( 1.0 - isSide ) * step( tt.y, tt.z );
  float isFlr = isHor * step( rd.y, 0.0 ), isCeil = isHor - isFlr;
  float isBack = clamp( 1.0 - isSide - isHor, 0.0, 1.0 );
  // albedo: wallpaper (faint stripes), dark floor boards / carpet, off-white ceiling, baseboard
  vec3 wc = prWallC( s1 * 0.6 + s3 * 0.4 ) * ( 0.9 + 0.1 * step( 0.5, fract( ( isSide > 0.5 ? hp.z : hp.x ) * 6.0 ) ) );
  vec3 fl = mix( vec3( 0.06, 0.04, 0.026 ), vec3( 0.09, 0.075, 0.065 ), step( 0.5, s4 ) ) * ( 0.85 + 0.15 * step( 0.5, fract( hp.x * 7.0 ) ) );
  vec3 alb = wc * ( isSide + isBack ) + fl * isFlr + vec3( 0.5, 0.49, 0.46 ) * isCeil;
  alb *= 1.0 - 0.45 * ( isSide + isBack ) * step( hp.y, 0.11 );
  float doorX = ( s2 - 0.5 ) * max( Wr - 1.3, 0.0 );
  float inDoor = isBack * step( abs( hp.x - doorX ), 0.42 ) * step( hp.y, 2.05 );
  float sofaX = ( s3 - 0.5 ) * max( Wr - 2.0, 0.0 );
  float sofa = isBack * step( abs( hp.x - sofaX ), 0.95 ) * step( hp.y, 0.82 + 0.1 * s1 ) * step( 0.3, s4 ) * ( 1.0 - inDoor );
  float dresser = isSide * step( abs( hp.z - Dr * mix( 0.3, 0.7, s2 ) ), 0.5 ) * step( hp.y, 1.0 ) * step( 0.5, s1 );
  float frameP = ( isSide + isBack ) * step( abs( ( isSide > 0.5 ? hp.z - Dr * 0.55 : hp.x + doorX * 0.5 ) ), 0.28 ) * step( abs( hp.y - 1.6 ), 0.22 ) * ( 1.0 - inDoor );
  alb = mix( alb, vec3( 0.02, 0.017, 0.014 ), max( sofa, dresser ) );
  alb *= 1.0 - 0.6 * frameP;
  // light in the room
  float state = prHash12( vWin.xz * 5.17 + vWin.y * 0.37 + 0.71 );
  float lit = vLit.a;
  float on = lit > 0.0 ? 1.0 : step( 0.72, state ) * step( state, 0.86 );
  float tv = lit > 0.0 ? 0.0 : step( 0.86, state ) * step( state, 0.93 );
  float hall = lit > 0.0 ? 0.0 : step( 0.93, state ) + step( 0.56, state ) * step( state, 0.72 );
  vec3 hn = isSide > 0.5 ? vec3( -sign( rd.x ), 0.0, 0.0 ) : isFlr > 0.5 ? vec3( 0.0, 1.0, 0.0 ) : isCeil > 0.5 ? vec3( 0.0, -1.0, 0.0 ) : vec3( 0.0, 0.0, -1.0 );
  // street light falling in through the window (every room): on the floor and walls near the glass
  vec3 E = alb * vec3( 0.010, 0.0115, 0.0135 ) * ( 0.2 + 0.8 * exp( - hp.z * 0.8 ) ) * ( 1.0 + isFlr * 1.5 );
  vec3 warm = lit > 0.0 ? prSrgbToLin( vLit.rgb ) : vec3( 1.0, 0.6, 0.3 );
  vec3 lp = vec3( ( s3 - 0.5 ) * Wr * 0.6, mix( 0.9, 1.4, s4 ), Dr * mix( 0.45, 0.85, s1 ) );
  vec3 lv = lp - hp; float ld2 = max( dot( lv, lv ), 0.35 );
  float cl = max( dot( hn, lv * inversesqrt( ld2 ) ), 0.0 ) * 0.75 + 0.25;
  E += alb * warm * on * cl / ld2 * ( lit > 0.0 ? 2.6 * lit : 0.22 );
  float tf = 0.5 + 0.5 * prHash12( vec2( floor( uTime * 6.0 ), s1 * 13.0 ) );
  E += alb * vec3( 0.32, 0.48, 0.95 ) * tv * tf * 0.045;
  vec3 hallC = vec3( 1.0, 0.68, 0.4 );
  E += hallC * 0.05 * hall * inDoor;
  E += alb * hallC * hall * 0.085 * exp( - length( vec2( hp.x - doorX, hp.z - Dr ) ) * 1.2 ) * ( isFlr + isSide * 0.6 + isCeil * 0.3 );
  E *= 1.0 - 0.9 * max( sofa, dresser ) * ( 1.0 - on * 0.5 );
  // curtain layer at the glass (pane coordinates: wx across from the window centre, wy above the sill)
  float hw = vWin.w * 0.5;
  float ct = prHash12( vWin.xz * 3.33 + vWin.y * 0.9 + 9.1 );
  vec3 fab = mix( vec3( 0.42, 0.38, 0.3 ), vec3( 0.2, 0.07, 0.05 ), step( 0.6, s2 ) );
  fab = mix( fab, vec3( 0.08, 0.09, 0.12 ), step( 0.85, s2 ) );
  fab = mix( fab, vec3( 0.55, 0.53, 0.48 ), step( s2, 0.22 ) );
  float cover = 0.0, trans = 0.25;
  if ( ct < 0.3 ) {
    float open = mix( 0.12, 0.8, s3 ) * hw;
    float cx = ( s4 - 0.5 ) * 0.25 * hw;
    cover = smoothstep( open - 0.015, open + 0.015, abs( wx - cx ) );
    fab *= 0.72 + 0.28 * sin( wx * 41.0 + sin( wy * 2.7 + s1 * 6.0 ) * 1.6 );
  } else if ( ct < 0.55 ) {
    float raise = mix( 0.5, 1.7, s4 );
    float slat = smoothstep( 0.1, 0.3, fract( wy / 0.026 ) );
    cover = step( wy, raise ) * mix( 0.85, 1.0, slat );
    fab = vec3( 0.52, 0.5, 0.45 ) * ( 0.72 + 0.28 * slat ) * ( 0.85 + 0.15 * s1 );
    trans = 0.15;
  } else if ( ct < 0.72 ) {
    float shade = mix( 0.15, 1.25, s3 );
    cover = smoothstep( shade - 0.008, shade + 0.008, wy );
    fab = mix( vec3( 0.5, 0.45, 0.34 ), vec3( 0.3, 0.29, 0.26 ), s4 );
    trans = 0.35;
  } else if ( ct < 0.84 ) {
    cover = 0.62; trans = 0.6;
    fab = vec3( 0.58, 0.56, 0.5 ) * ( 0.82 + 0.18 * sin( wx * 70.0 + wy * 3.0 ) );
  }
  vec3 back = ( warm * on * ( lit > 0.0 ? 1.4 * lit : 0.07 ) + vec3( 0.32, 0.48, 0.95 ) * tv * tf * 0.03 + hallC * hall * 0.015 + vec3( 0.002 ) );
  prRoomE = ( E * ( 1.0 - cover ) + back * fab * trans * cover ) * uRoomK;
  prRoomE = all( lessThan( abs( prRoomE ), vec3( 1e3 ) ) ) ? prRoomE : vec3( 0.0 );
  dcol = mix( dcol, fab * 0.55, cover );
  // grimy glass: smudges and a film low on the pane
  vec4 gN = texture2D( uNoiseTex, ( vPrWPos.xz + vPrWPos.y ) * 0.13 + 0.17 );
  rough = max( rough, 0.035 + 0.14 * gN.a * gN.g + 0.06 * ( 1.0 - smoothstep( 0.0, 0.25, wy ) ) );
}
`;

export function glassMaterial(shared) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.06, metalness: 0.0, envMapIntensity: 2.6 });
  m.name = 'pr_glass';
  return patch(m, shared, 'glass', {
    vertPars: 'attribute vec4 albedoRough;\nattribute vec4 litColor;\nattribute vec4 winInfo;\nvarying vec4 vAlbedoRough;\nvarying vec4 vLit;\nvarying vec2 vGUv;\nvarying vec4 vWin;\n',
    vertMain: 'vAlbedoRough = albedoRough; vLit = litColor; vGUv = uv; vWin = winInfo;',
    fragPars: `varying vec4 vAlbedoRough;\nvarying vec4 vLit;\nvarying vec2 vGUv;\n${ROOM_GLSL}`,
    diffuse: 'vec4 diffuseColor = vec4( diffuse * prSrgbToLin( vAlbedoRough.rgb ), opacity );',
    afterRough: 'roughnessFactor = max( 0.04, vAlbedoRough.a * 0.6 );',
    afterNormal: /* glsl */ `
      if ( vWin.w > 0.0 && uRoomK > 0.0 ) {
        vec3 prWN = normalize( ( vec4( nonPerturbedNormal, 0.0 ) * viewMatrix ).xyz );
        prWindowRoom( diffuseColor.rgb, roughnessFactor, prWN );
      }`,
    emissive: /* glsl */ `
      totalEmissiveRadiance += prRoomE;
      if ( vLit.a > 0.0 && vWin.w <= 0.0 ) {
        vec2 wuv = clamp( vGUv, 0.0, 1.0 );
        float curtain = smoothstep( 0.0, 0.2, wuv.x ) * smoothstep( 1.0, 0.8, wuv.x );
        float lampGrad = 0.55 + 0.45 * smoothstep( 0.05, 0.75, wuv.y );
        totalEmissiveRadiance += prSrgbToLin( vLit.rgb ) * vLit.a * 5.0 * mix( 0.3, 1.0, curtain ) * lampGrad;
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
export function texturedKitMaterial(shared, map, { alphaTest = 0, side = THREE.FrontSide, roughness = 0.55, metalness = 0, weather = true } = {}) {
  const m = new THREE.MeshStandardMaterial({ map, alphaTest, side, roughness, metalness, transparent: false });
  m.name = 'pr_kit_tex';
  return patch(m, shared, `kittex-${alphaTest > 0}-${side}-${weather}`, { fragPars: WEATHER_PARS, afterNormal: WET_KIT + (weather ? kitWeather('0.0', '0.0', '0.5') : '') });
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
uniform float uWallK;
uniform float uWallType;
uniform float uStain;
float prWetW = 0.0;
// gfx pass 2026-10-16: standing water (depth variation, rain ripples, oil film)
uniform float uRipple;
float prDeep = 0.0;
float prOil = 0.0;
// rain ripples: the nearest rain-drop site (weather.js makeRippleTexture, 4 m tile, NEAREST) re-hit on its own period;
// the ring is computed from the true offset to the site: one fetch, pure in t
uniform sampler2D uRipTex;
vec2 prRipple( vec2 p, float t ) {
  vec2 q = p * 0.25;
  vec4 d = texture2D( uRipTex, q );
  vec2 off = ( fract( q - d.rg + 0.5 ) - 0.5 ) * 4.0;
  float r = length( off ) + 1e-4;
  float per = 0.55 + 0.7 * d.a;
  float age = fract( t / per + d.b ) * per;
  float x = r - 0.32 * age;
  float e1 = max( 1.0 - x * x * 260.0, 0.0 ), e2 = max( 1.0 - age * 1.6, 0.0 );
  float env = e1 * e1 * e2 * e2 * min( age * 25.0, 1.0 ) * ( 1.0 - smoothstep( 0.11, 0.17, r ) );
  return off / r * sin( x * 85.0 ) * env;
}
`;

// gfx pass 2026-10-16: facade weathering on the chunk walls (uniform-gated: the walls share their programs with the
// ground). World-space: along-the-wall coordinate from the face normal, height above the sidewalk from the height
// map. Grime runs below sills / cornices / AC units (facade map R) with fine vertical streak structure, patchy soot,
// a dirt splash band with speckle at the foot, rust stains (B), efflorescence on brick, algae / mildew on siding and
// paint, and rain-wet runs (G + patches): darker and glossy (catch the lamps).
function wallWeather(lo) {
  return /* glsl */ `
if ( uWallK > 0.5 ) {
  vec3 wn = normalize( ( vec4( vNormal, 0.0 ) * viewMatrix ).xyz );
  float vert = smoothstep( 0.55, 0.85, 1.0 - abs( wn.y ) );
  vec2 tg = vec2( -wn.z, wn.x ); float tl = length( tg ); tg = tl > 1e-4 ? tg / tl : vec2( 1.0, 0.0 );
  float al = dot( vPrWPos.xz, tg );
  float hg = vPrWPos.y - prGroundAt( vPrWPos.xz + wn.xz * 0.5 );
  vec3 fm = prFacade( vPrWPos, wn );
  ${lo ? `
  // low tier (phones): the map envelopes only, no noise
  float stk = 0.5, pn = 0.5, bn = 0.15, speck = 0.0, wrn = 0.0;
  vec4 n2 = vec4( 0.5 ), n3 = vec4( 0.5 );` : `
  // one fetch: R 4.5/m (patches), G 9/m and B 18/m along x 0.4-0.8/m up (streaks), A 36/m (speckle)
  vec4 n1 = texture2D( uNoiseTex, vec2( al * 9.0, hg * 0.42 ) * 0.0625 );
  vec4 n2 = n1.argb, n3 = n1.gbar;
  float stk = smoothstep( 0.32, 0.86, n1.g * 0.6 + n1.b * 0.4 );
  float pn = n1.r;
  float bn = n1.r * 0.3 + n1.b * 0.15;
  float speck = smoothstep( 0.6, 0.8, n1.a ) * ( 1.0 - smoothstep( 0.12, 0.65 + bn, hg ) ) * vert;
  float wrn = smoothstep( 0.5, 0.72, n1.r * 0.6 + n1.g * 0.4 );`}
  float grime = clamp( fm.r * ( 0.35 + 1.4 * stk ) + smoothstep( 0.42, 0.78, pn ) * ( 0.14 + 0.45 * stk ) + 0.22 * stk * ( 0.4 + 0.6 * pn ), 0.0, 1.0 ) * vert;
  float band = ( 1.0 - smoothstep( 0.04, 0.3 + bn, hg ) ) * step( -0.4, hg ) * vert;
  float lum = dot( diffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
  vec3 soot = vec3( 0.042, 0.038, 0.035 );
  diffuseColor.rgb = mix( diffuseColor.rgb, mix( vec3( lum ), diffuseColor.rgb, 0.5 ) * 0.48 + soot * 0.5, grime * 0.82 );
  diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * 0.36 + soot * 0.3, clamp( band * 0.85 + speck * 0.5, 0.0, 1.0 ) );
  diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.12, 0.05, 0.02 ) * ( 0.5 + stk ), clamp( fm.b * ( 0.3 + 1.1 * stk ), 0.0, 1.0 ) * 0.8 * vert );
  ${lo ? '' : `
  // brick: salt blooms (type 1); siding / paint: algae + mildew (types 2, 3); branch-free (one program for all walls)
  float ef = smoothstep( 0.6, 0.82, n3.r * 0.6 + n2.a * 0.4 ) * clamp( 1.0 - smoothstep( 0.3, 1.6, hg ) + fm.r * 0.7, 0.0, 1.0 );
  float alg = smoothstep( 0.55, 0.8, n2.g * 0.5 + n2.a * 0.5 ) * ( 0.35 + stk );
  float isBrick = step( 0.5, uWallType ) * step( uWallType, 1.5 ), isPaint = step( 1.5, uWallType );
  diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.4, 0.39, 0.36 ), ef * 0.5 * vert * isBrick );
  diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.05, 0.06, 0.038 ) * ( lum * 2.2 + 0.3 ), clamp( alg, 0.0, 1.0 ) * 0.38 * vert * isPaint );`}
  float wr = clamp( fm.g * ( 0.45 + stk ) + wrn * ( 0.3 + 0.7 * stk ), 0.0, 1.0 );
  prWetW = clamp( max( wr, band ), 0.0, 1.0 ) * uWet * vert;
  diffuseColor.rgb *= 1.0 - 0.4 * prWetW;
}
`;
}

// Perf pass: every effect is compiled only into the programs that use it ('wet' street surfaces, 'wall' shells,
// 'plain' rest). On ANGLE / D3D the old uniform-gated branches were flattened, so dead code still ran on every
// fragment (the puddle fbm + the 10-tap wet-street reflection on every wall, the ripples everywhere).
export function groundMaterial(shared, { map, normalMap, roughMap, k = 1, rough = 0.9, wet = 0, pudLo = 0.6, pudAmt = 0,
  wetDark = 0.85, wetRough = 0.8, normalScale = 1, name = 'ground', alphaGutter = false, vertexColors = true, gutterK = 0,
  depK = 0, wetRefl = 0, dampFoot = false, wall = false, wallType = 0, stain = 0, ripple = true, lowTier = false } = {}) {
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
  const role = wall ? 'wall' : (pudAmt > 0 || wetRefl > 0) ? 'wet' : 'plain';
  const isWet = role === 'wet', isWall = role === 'wall';
  const doRipple = isWet && pudAmt > 0 && ripple && !lowTier;
  const doStain = isWet && ripple && !lowTier;   // high tier only; uniform-weighted (uStain): sidewalks / lots
  const pudU = { uPudLo: { value: pudLo }, uPudAmt: { value: pudAmt }, uWetDark: { value: wetDark }, uWetRough: { value: wetRough },
    uGutterK: { value: gutterK }, uDepK: { value: depK }, uWetRefl: { value: wetRefl },
    uWallK: { value: wall ? 1 : 0 }, uWallType: { value: wallType }, uStain: { value: stain } };
  m.userData.pudU = pudU;
  const opts = {
    // damp foot of the focus finish walls: the game's weathering coordinates (UV1 = along, height above the sidewalk;
    // V flipped by the glTF export) darken and gloss the splash zone
    vertPars: dampFoot ? 'attribute vec2 uv1;\nvarying float vPrHgt;\n' : '',
    vertMain: dampFoot ? 'vPrHgt = 1.0 - uv1.y;' : '',
    fragPars: PUDDLE_PARS + WEATHER_PARS + (dampFoot ? 'varying float vPrHgt;\n' : ''),
    afterColor: /* glsl */ `
      ${alphaGutter ? '#ifdef USE_MAP\n diffuseColor.a = sampledDiffuseColor.a * clamp( pow( max( vColor.a, 0.0 ), 0.6 ) * 1.6, 0.0, 1.0 );\n#endif' : 'diffuseColor.a = 1.0;'}
      prPuddle = 0.0;
      ${isWet ? `
      if ( uPudAmt > 0.0 ) {
        vec3 wm = vec3( 0.0 );
        if ( uWetBounds.z > 0.0 ) {
          vec2 wuv = vec2( ( vPrWPos.x - uWetBounds.x ) * uWetBounds.z, 1.0 - ( vPrWPos.z - uWetBounds.y ) * uWetBounds.w );
          if ( wuv.x > 0.0 && wuv.x < 1.0 && wuv.y > 0.0 && wuv.y < 1.0 ) wm = texture2D( uWetTex, wuv ).rgb;
        }
        float pn = prFbm( vPrWPos.xz * 0.33 + 3.1 ) * 0.62 + prFbm( vPrWPos.xz * 1.35 + 7.7 ) * 0.38;
        float lo = uPudLo - uGutterK * wm.r - uDepK * wm.g;
        prPuddle = smoothstep( lo, lo + 0.045, pn ) * uPudAmt * uWet;
        // deep water (mirror) vs shallow margins (the asphalt still shows through, rougher)
        prDeep = smoothstep( lo + 0.025, lo + 0.11, pn );
      }` : ''}
      diffuseColor.rgb *= mix( 1.0, uWetDark, uWet ) * mix( 1.0, mix( 0.72, 0.5, prDeep ), prPuddle );
      ${doStain ? `
      // worn city concrete (sidewalks, lots): soaked darker patches, old stains, gum spots
      {
        vec4 sN = texture2D( uNoiseTex, vPrWPos.xz * 0.075 + 0.53 );
        float st = smoothstep( 0.5, 0.75, sN.r * 0.67 + sN.g * 0.33 ) * ( 0.55 + 0.45 * sN.b );
        float gum = smoothstep( 0.86, 0.95, sN.a ) * ( 1.0 - prPuddle );   // dark spots (gum / tar drops)
        diffuseColor.rgb *= 1.0 - uStain * ( 0.38 * st + 0.4 * gum );
        prWetW = st * 0.6 * uStain;
      }` : ''}
      ${dampFoot ? `{ float dn = prNoise( vPrWPos.xz * 3.0 + vPrWPos.y ) * 0.18;
        prDamp = ( 1.0 - smoothstep( 0.12, 0.42 + dn, vPrHgt ) ) * step( -0.5, vPrHgt ) * uWet;
        diffuseColor.rgb *= 1.0 - 0.32 * prDamp; }` : ''}
      ${isWall ? wallWeather(lowTier) : ''}`,
    afterRough: `roughnessFactor = mix( roughnessFactor * mix( 1.0, uWetRough, uWet ), mix( 0.11, 0.025, prDeep ), prPuddle );
      ${dampFoot ? 'roughnessFactor = mix( roughnessFactor, roughnessFactor * 0.55, prDamp );' : ''}
      ${isWall || doStain ? 'roughnessFactor = mix( roughnessFactor, min( roughnessFactor, 0.3 ), prWetW );' : ''}`,
    afterNormal: /* glsl */ `
      prRawN = normal;
      ${isWet ? `normal = normalize( mix( normal, nonPerturbedNormal, prPuddle * mix( 0.7, 0.96, prDeep ) ) );` : ''}
      { vec3 dn = fwidth( normal ); roughnessFactor = max( roughnessFactor, clamp( length( dn ) * 1.4, 0.0, 0.55 ) ); }`,
    afterLights: isWet ? /* glsl */ `
      if ( uReflOn > 0.5 && ( prPuddle > 0.01 || uWetRefl > 0.0 ) ) {
        vec4 rc = uReflMatrix * vec4( vPrWPos, 1.0 );
        vec2 nd = ( prRawN.xy - nonPerturbedNormal.xy );
        float fres = 0.04 + 0.96 * pow( 1.0 - saturate( dot( geometryNormal, geometryViewDir ) ), 5.0 );
        // puddles: a sharp mirror, rippled by the surface normal map and the rain rings (computed here, after the
        // lights: nothing extra stays live across the lamp loop; planar-reflection tier only)
        vec2 rip = vec2( 0.0 );
        ${doRipple ? `if ( prPuddle > 0.05 ) {
          vec2 rg = prRipple( vPrWPos.xz, uTime ) * 0.5 * prPuddle * mix( 0.6, 1.0, prDeep ) * ( 1.0 - smoothstep( 14.0, 26.0, length( vPrWPos - cameraPosition ) ) );
          rip = ( viewMatrix * vec4( - rg.x, 0.0, - rg.y, 0.0 ) ).xy;
        }` : ''}
        vec4 rp = rc; rp.xy += ( nd + rip ) * 0.06 * rc.w;
        vec3 rcol = texture2DProj( uReflTex, rp ).rgb;
        reflectedLight.indirectSpecular += rcol * prPuddle * uReflStrength * mix( 0.25, 1.0, fres ) * mix( 0.6, 1.0, prDeep );
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
      }` : '',
  };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, pudU);
    inject(shader, shared, opts);
  };
  m.customProgramCacheKey = () => `pr-ground-${!!map}-${!!normalMap}-${!!roughMap}-${alphaGutter}-${vertexColors}-${dampFoot}-${role}-${doRipple}-${doStain}-${lowTier}`;
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
