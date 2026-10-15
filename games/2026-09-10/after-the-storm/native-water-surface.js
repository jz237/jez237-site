// Presentation of the reconstructed field; this module never evolves it.
// Source raw plane/cell impulses remain in native-water-field/native-water.
// Here each Q8.8 height is floored to a signed whole unit BEFORE adding the
// datum and wrapping signed16, just as the rendered lattice vertices are.
// No forcing phase, random stream, patch schedule or amplitude cap is supplied.
import * as T from './vendor/three.module.js';
import {NATIVE_WATER_GRID,locateNativeWaterCell} from './native-water-field.js';

export const NATIVE_WATER_SURFACE_SCALE=.025;
const {columns:COLS,rows:ROWS}=NATIVE_WATER_GRID,SIZE=COLS*ROWS,F=Math.fround;
const SHEAR=F(1/Math.sqrt(3)),STRETCH=F(2/Math.sqrt(3));
const signed16=value=>(value<<16)>>16;
const inactive=()=>({height:0,slopeX:0,slopeZ:0});
function scaleValue(scale){
  if(!Number.isFinite(scale)||!Number.isFinite(F(scale))||F(scale)<=0||!Number.isFinite(F(1/scale))||F(1/scale)<=0)
    throw new RangeError('scale and its reciprocal must be finite, positive and representable as float32');
  return scale;
}
function datumValue(datum){
  if(!Number.isInteger(datum)||datum< -32768||datum>32767)
    throw new RangeError('datumNative must be a signed16 integer');
  return datum;
}
function heights(field){
  if(!(field?.heightQ instanceof Int16Array)||field.heightQ.length!==SIZE)
    throw new TypeError('Expected a native water field with a complete Int16 heightQ grid');
  return field.heightQ;
}
function worldLocation(x,z,scale){
  if(!Number.isFinite(x)||!Number.isFinite(z))throw new TypeError('world XZ must be finite');
  // The GPU receives float32 world positions and an explicit reciprocal scale.
  // Multiplication avoids GPU division approximations moving an integer seam.
  const inverse=F(1/scale);
  return locateNativeWaterCell(F(F(x)*inverse),F(F(z)*inverse));
}
function sampleWhole(getWhole,x,z,scale,datum){
  const p=worldLocation(x,z,scale),[a,b,c]=p.indices.map(i=>signed16(getWhole(i)+datum));
  const u=-p.offsetU/64,v=-p.offsetV/64;
  const heightNative=p.upperTriangle?(1-v)*a+(v-u)*b+u*c:(1-u)*a+(u-v)*b+v*c;
  const du=(p.upperTriangle?c-b:b-a)/64,dv=(p.upperTriangle?b-a:c-b)/64;
  // Slopes are the planar gradients of the selected rendered triangle, not
  // derivatives of the integer lookup staircase. Height and XZ use the SAME
  // scale, so it cancels in the dimensionless world-space gradients.
  return {height:heightNative*scale,slopeX:du,slopeZ:SHEAR*du+STRETCH*dv};
}

/**
 * CPU counterpart of nativeWaterSurface(vec2 worldXZ). Coordinates follow the
 * shader float32 input/reciprocal-scale convention, then queryNativeWaterField's rendered
 * triangle. Returned height includes datum; do not add sea level again.
 * CPU final arithmetic is double; GPU highp float results agree to float32
 * precision. Very large world coordinates lose detail before either lookup.
 */
export function sampleNativeWaterSurface(field,xWorld,zWorld,
  {scale=NATIVE_WATER_SURFACE_SCALE,datumNative=field?.datumNative}={}){
  const h=heights(field);scaleValue(scale);datumValue(datumNative);
  return sampleWhole(i=>h[i]>>8,xWorld,zWorld,scale,datumNative);
}

/**
 * WebGL2/GLSL ES3 snippet, usable in either vertex or fragment stages of the
 * existing Three ShaderMaterial (which targets ES3). Sample at WORLD XZ after
 * the mesh transform; this imposes no mesh topology/resolution or camera snap.
 * Merge an instance's uniforms, then use:
 *   vec3 surface = nativeWaterSurfaceOr(worldXZ, modernSurface);
 * Inactive returns modernSurface unchanged. No modern detail/wake is silently
 * added to an active field. Highp float is required in both shader stages.
 * World XZ converted to native units must stay within the field query's
 * supported +/-1e9 range. Use the same axis/scale convention for CPU and GPU.
 */
export const nativeWaterSurfaceGLSL=/* glsl */`
uniform highp sampler2D nativeWaterHeights;
uniform highp float nativeWaterScale;
uniform highp float nativeWaterInverseScale;
uniform highp int nativeWaterDatumNative;
uniform highp int nativeWaterActive;

// Rebuild the binary32 significand/exponent so a compiler cannot fuse this
// rounded product with a following operation across a source truncation seam.
// A plain temporary alone does not prevent multiply-add contraction in ES3.
float nativeWaterRounded(float value) {
  uint bits = floatBitsToUint(value);
  uint exponent = (bits >> 23u) & 255u;
  if (exponent == 0u) return uintBitsToFloat(bits);
  float magnitude = float((bits & 8388607u) | 8388608u)
    * exp2(float(int(exponent) - 150));
  return (bits & 2147483648u) == 0u ? magnitude : -magnitude;
}

// Avoid implementation-dependent signs of integer '%' with negative operands.
int nativeWaterRemainder(int x, int divisor) {
  return x < 0 ? -((-x) % divisor) : x % divisor;
}
int nativeWaterPositiveMod(int x, int divisor) {
  int r = nativeWaterRemainder(x, divisor);
  return r < 0 ? r + divisor : r;
}
float nativeWaterVertex(ivec2 cell) {
  int column = nativeWaterPositiveMod(cell.x, 128);
  int row = nativeWaterPositiveMod(cell.y + cell.x - column, 384);
  int h = int(texelFetch(nativeWaterHeights, ivec2(column, row), 0).r)
    + nativeWaterDatumNative;
  return float(nativeWaterPositiveMod(h + 32768, 65536) - 32768);
}
vec3 nativeWaterSurface(vec2 worldXZ) {
  if (nativeWaterActive == 0) return vec3(0.0);
  highp vec2 p = vec2(nativeWaterRounded(worldXZ.x * nativeWaterInverseScale),
    nativeWaterRounded(worldXZ.y * nativeWaterInverseScale));
  highp float zShear = nativeWaterRounded(p.y * 0.5773502588272095);
  // int(float) truncates toward zero BEFORE the signed remainder and floor.
  ivec2 q = ivec2(p.x + zShear, nativeWaterRounded(p.y * 1.154700517654419));
  q = ivec2(nativeWaterRemainder(q.x, 24576), nativeWaterRemainder(q.y, 24576));
  ivec2 cell = ivec2(floor(vec2(q) / 64.0));
  vec2 f = vec2(q - cell * 64) / 64.0;
  float a = nativeWaterVertex(cell);
  float c = nativeWaterVertex(cell + ivec2(1, 1));
  float heightNative;
  vec2 gradient;
  if (f.y > f.x) {
    float b = nativeWaterVertex(cell + ivec2(0, 1));
    heightNative = (1.0 - f.y) * a + (f.y - f.x) * b + f.x * c;
    gradient = vec2(c - b, b - a) / 64.0;
  } else {
    float b = nativeWaterVertex(cell + ivec2(1, 0));
    heightNative = (1.0 - f.x) * a + (f.x - f.y) * b + f.y * c;
    gradient = vec2(b - a, c - b) / 64.0;
  }
  return vec3(heightNative * nativeWaterScale, gradient.x,
    gradient.x * 0.5773502588272095 + gradient.y * 1.154700517654419);
}
vec3 nativeWaterSurfaceOr(vec2 worldXZ, vec3 modernSurface) {
  if (nativeWaterActive == 0) return modernSurface;
  return nativeWaterSurface(worldXZ);
}
`;

/**
 * Per-renderer presentation snapshot. sync() copies whole native heights; it
 * neither enables the field nor advances simulation. A caller must explicitly
 * setEnabled(true) after the first sync. Later syncs preserve that selection.
 * CPU sample() and GPU uniforms read the same snapshot until the next sync.
 * Do not mutate texture.image.data or uniforms directly. Sharing this instance
 * between views is safe when they present the same field snapshot.
 *
 * R32F/nearest texelFetch needs WebGL2, not float-linear-filter or a float render
 * target extension. Reset clears the snapshot and disables it; dispose releases
 * its texture. The caller owns replay/DTO state and material/renderer disposal.
 */
export function createNativeWaterSurface({scale=NATIVE_WATER_SURFACE_SCALE}={}){
  scaleValue(scale);
  const data=new Float32Array(SIZE),texture=new T.DataTexture(data,COLS,ROWS,T.RedFormat,T.FloatType);
  texture.name='Native water rendered whole heights';texture.internalFormat='R32F';
  texture.minFilter=texture.magFilter=T.NearestFilter;
  texture.wrapS=texture.wrapT=T.ClampToEdgeWrapping;
  texture.generateMipmaps=false;texture.flipY=false;texture.unpackAlignment=1;
  texture.colorSpace=T.NoColorSpace;texture.needsUpdate=true;
  const uniforms={nativeWaterHeights:{value:texture},nativeWaterScale:{value:scale},nativeWaterInverseScale:{value:F(1/scale)},
    nativeWaterDatumNative:{value:0},nativeWaterActive:{value:0}};
  let ready=false,disposed=false,revision=0;
  const alive=()=>{if(disposed)throw new Error('Native water surface is disposed');};
  const api={uniforms,
    get texture(){return disposed?null:texture;},
    get enabled(){return uniforms.nativeWaterActive.value!==0;},
    get ready(){return ready;},get disposed(){return disposed;},get revision(){return revision;},
    sync(field,{datumNative=field?.datumNative}={}){
      alive();const h=heights(field);datumValue(datumNative);
      for(let i=0;i<SIZE;i++)data[i]=h[i]>>8;
      uniforms.nativeWaterDatumNative.value=datumNative;
      texture.needsUpdate=true;ready=true;revision++;return api;
    },
    setEnabled(enabled){
      alive();if(typeof enabled!=='boolean')throw new TypeError('enabled must be boolean');
      if(enabled&&!ready)throw new Error('Sync a native water field before enabling its surface');
      uniforms.nativeWaterActive.value=enabled?1:0;return api;
    },
    sample(xWorld,zWorld){
      alive();return api.enabled?sampleWhole(i=>data[i],xWorld,zWorld,scale,uniforms.nativeWaterDatumNative.value):inactive();
    },
    sampleOr(xWorld,zWorld,modernSurface){
      alive();return api.enabled?api.sample(xWorld,zWorld):modernSurface;
    },
    reset(){
      alive();data.fill(0);uniforms.nativeWaterDatumNative.value=0;uniforms.nativeWaterActive.value=0;
      texture.needsUpdate=true;ready=false;revision++;return api;
    },
    dispose(){
      if(disposed)return;
      uniforms.nativeWaterActive.value=0;uniforms.nativeWaterHeights.value=null;
      ready=false;disposed=true;texture.dispose();
    }
  };
  return api;
}
