import * as T from 'three';
import { url } from './assets';

/** All positions and view bases use the decoded, height-one, Y-up fir model. */
export type FirAtlasView = {
  direction: number[]; right: number[]; up: number[];
  depthRange: number[]; rect: number[];
  azimuthDegrees: number; elevationDegrees: number;
};
export type FirAtlasVariant = {
  variant: number; center: number[]; frameSize: number[];
  atlasSize: number[]; tileSize: number[]; elevations: number[];
  albedo: string; normalDepth: string; views: FirAtlasView[];
};

// The same screen-space threshold gives complementary geometry/impostor coverage.
// Only the visible passes fade. Fixed shadow proxies retain the complete model.
const coverageFunction = `
float northCoverageThreshold() {
  return fract(52.9829189 * fract(dot(floor(gl_FragCoord.xy), vec2(.06711056, .00583715))));
}
`;
export const NORTH_BACKDROP_FADE = { start: 65, end: 90 };

/** Clone the original surface: the accepted nearby forest keeps its own shader. */
export function backdropGeometryMaterial(source: T.MeshStandardMaterial) {
  const material = source.clone();
  const compile = source.onBeforeCompile, key = source.customProgramCacheKey();
  material.name = source.name + '-ridge-geometry';
  // The AO override cannot reproduce the view-dependent coverage fade.
  material.alphaTest = Math.max(material.alphaTest, .001);
  material.onBeforeCompile = (shader, renderer) => {
    compile.call(material, shader, renderer);
    shader.vertexShader = 'varying float vNorthGeometryDistance;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
      #include <project_vertex>
      vec3 northTreeCenter = (modelMatrix * instanceMatrix * vec4(0.0, .5, 0.0, 1.0)).xyz;
      vNorthGeometryDistance = distance(cameraPosition, northTreeCenter);
    `);
    shader.fragmentShader = 'varying float vNorthGeometryDistance;\n' + coverageFunction + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphatest_fragment>', `
      #include <alphatest_fragment>
      float northBlend = smoothstep(${NORTH_BACKDROP_FADE.start.toFixed(1)}, ${NORTH_BACKDROP_FADE.end.toFixed(1)}, vNorthGeometryDistance);
      if (northCoverageThreshold() < northBlend) discard;
    `);
  };
  material.customProgramCacheKey = () => key + '|north-ridge-geometry-fade-v1';
  return material;
}

const vertexDeclarations = `
uniform vec3 northAtlasCenter;
uniform vec2 northFrameSize;
varying vec3 vNorthPlane;
varying vec3 vNorthDirection;
varying vec3 vNorthLocalCamera;
varying vec3 vNorthOrigin;
varying vec3 vNorthAxisX;
varying vec3 vNorthAxisY;
varying vec3 vNorthAxisZ;
varying float vNorthDistance;
`;
const projectVertex = `
mat4 northWorld = modelMatrix * instanceMatrix;
vNorthOrigin = northWorld[3].xyz;
vNorthAxisX = northWorld[0].xyz;
vNorthAxisY = northWorld[1].xyz;
vNorthAxisZ = northWorld[2].xyz;
vec3 northCameraDelta = cameraPosition - vNorthOrigin;
vec3 northLocalCamera = vec3(
  dot(northCameraDelta, vNorthAxisX) / dot(vNorthAxisX, vNorthAxisX),
  dot(northCameraDelta, vNorthAxisY) / dot(vNorthAxisY, vNorthAxisY),
  dot(northCameraDelta, vNorthAxisZ) / dot(vNorthAxisZ, vNorthAxisZ));
vNorthLocalCamera = northLocalCamera;
vNorthDirection = normalize(northLocalCamera - northAtlasCenter);
vec3 northHorizontal = vec3(vNorthDirection.z, 0.0, -vNorthDirection.x);
vec3 northRight = length(northHorizontal) > .00001 ? normalize(northHorizontal) : vec3(1.0, 0.0, 0.0);
vec3 northUp = normalize(cross(vNorthDirection, northRight));
vNorthPlane = northAtlasCenter + northRight * position.x * northFrameSize.x + northUp * position.y * northFrameSize.y;
vec4 northBillboardWorld = northWorld * vec4(vNorthPlane, 1.0);
vNorthDistance = distance(cameraPosition, (northWorld * vec4(northAtlasCenter, 1.0)).xyz);
vec4 mvPosition = viewMatrix * northBillboardWorld;
gl_Position = projectionMatrix * mvPosition;
`;

const fragmentDeclarations = `
#define QUARRY_STATIC_FRAGMENT_SURFACE
vec3 quarryStaticSurfacePosition;
vec3 quarryStaticSurfaceNormal;
uniform sampler2D northAlbedo;
uniform sampler2D northNormalDepth;
uniform vec2 northAtlasSize;
uniform vec2 northFrameSize;
uniform vec2 northElevations;
uniform vec3 northAtlasCenter;
uniform vec3 northViewDirection[16];
uniform vec3 northViewRight[16];
uniform vec3 northViewUp[16];
uniform vec2 northDepthRange[16];
uniform vec4 northViewRect[16];
uniform mat4 northProjection;
varying vec3 vNorthPlane;
varying vec3 vNorthDirection;
varying vec3 vNorthLocalCamera;
varying vec3 vNorthOrigin;
varying vec3 vNorthAxisX;
varying vec3 vNorthAxisY;
varying vec3 vNorthAxisZ;
varying float vNorthDistance;
${coverageFunction}

vec2 northProject(vec3 point, int frame) {
  vec3 offset = point - northAtlasCenter;
  return vec2(dot(offset, northViewRight[frame]) / northFrameSize.x + .5,
    .5 - dot(offset, northViewUp[frame]) / northFrameSize.y);
}
vec2 northAtlasUV(vec2 localUV, int frame, float lod) {
  vec4 rect = northViewRect[frame];
  // Clamp within this view at the coarsest mip sampled by trilinear filtering.
  // The bake's transparent gutter and power-of-two tiles isolate its mip chain.
  vec2 halfTexel = .5 * exp2(ceil(lod)) / northAtlasSize;
  return clamp(rect.xy + localUV * rect.zw, rect.xy + halfTexel, rect.xy + rect.zw - halfTexel);
}
float northTextureLOD(vec2 localUV, int frame) {
  vec2 pixels = localUV * northViewRect[frame].zw * northAtlasSize;
  float footprint = max(length(dFdx(pixels)), length(dFdy(pixels)));
  return clamp(log2(max(footprint, 1.0)), 0.0, 3.0);
}
void northSample(int frame, float weight, vec3 ray, inout vec4 color,
    inout vec3 surfaceNormal, inout vec3 surfacePoint) {
  vec3 planeOffset = vNorthPlane - northAtlasCenter;
  float denominator = max(.15, dot(ray, northViewDirection[frame]));
  vec3 point = vNorthPlane;
  vec2 localUV = northProject(point, frame);
  float lod = northTextureLOD(localUV, frame);
  // Solve along the current pixel ray. Simply shifting the baked point would
  // move it to another pixel and create doubled branches while orbiting.
  for (int iteration = 0; iteration < 2; iteration++) {
    float packedDepth = textureLod(northNormalDepth, northAtlasUV(localUV, frame, lod), lod).a;
    float depth = mix(northDepthRange[frame].x, northDepthRange[frame].y, packedDepth);
    float alongRay = (depth - dot(planeOffset, northViewDirection[frame])) / denominator;
    point = vNorthPlane + ray * alongRay;
    localUV = northProject(point, frame);
  }
  vec2 coordinates = northAtlasUV(localUV, frame, lod);
  vec4 sampleColor = textureLod(northAlbedo, coordinates, lod);
  vec4 packedSurface = textureLod(northNormalDepth, coordinates, lod);
  float inside = step(0.0, localUV.x) * step(localUV.x, 1.0) * step(0.0, localUV.y) * step(localUV.y, 1.0);
  float coverage = weight * sampleColor.a * inside;
  color += vec4(sampleColor.rgb * coverage, coverage);
  surfaceNormal += (packedSurface.rgb * 2.0 - 1.0) * coverage;
  surfacePoint += point * coverage;
}
`;

const sampleSurface = `
if (vNorthDistance <= ${NORTH_BACKDROP_FADE.start.toFixed(1)}) discard;
vec3 northCenterRay = normalize(vNorthDirection);
vec3 northRay = normalize(vNorthLocalCamera - vNorthPlane);
float northAzimuth = mod(atan(northCenterRay.x, northCenterRay.z) + 6.28318530718, 6.28318530718) * (8.0 / 6.28318530718);
int northAz0 = int(floor(northAzimuth));
int northAz1 = (northAz0 + 1) % 8;
float northAzWeight = fract(northAzimuth);
float northElevation = degrees(asin(clamp(northCenterRay.y, -1.0, 1.0)));
float northElWeight = clamp((northElevation - northElevations.x) / (northElevations.y - northElevations.x), 0.0, 1.0);
vec4 northColor = vec4(0.0);
vec3 northObjectNormal = vec3(0.0), northPoint = vec3(0.0);
northSample(northAz0, (1.0-northAzWeight)*(1.0-northElWeight), northRay, northColor, northObjectNormal, northPoint);
northSample(northAz1, northAzWeight*(1.0-northElWeight), northRay, northColor, northObjectNormal, northPoint);
northSample(northAz0+8, (1.0-northAzWeight)*northElWeight, northRay, northColor, northObjectNormal, northPoint);
northSample(northAz1+8, northAzWeight*northElWeight, northRay, northColor, northObjectNormal, northPoint);
if (northColor.a < .001) discard;
northPoint /= northColor.a;
northObjectNormal = normalize(northObjectNormal);
diffuseColor.rgb *= northColor.rgb / northColor.a;
diffuseColor.a *= northColor.a;
float northBlend = smoothstep(${NORTH_BACKDROP_FADE.start.toFixed(1)}, ${NORTH_BACKDROP_FADE.end.toFixed(1)}, vNorthDistance);
float northThreshold = northCoverageThreshold();
if (northThreshold >= northBlend || fract(northThreshold * 17.0) > diffuseColor.a) discard;
vec3 northWorldPoint = vNorthOrigin + vNorthAxisX * northPoint.x + vNorthAxisY * northPoint.y + vNorthAxisZ * northPoint.z;
quarryStaticSurfacePosition = northWorldPoint;
quarryStaticSurfaceNormal = normalize(
  vNorthAxisX * northObjectNormal.x / dot(vNorthAxisX, vNorthAxisX) +
  vNorthAxisY * northObjectNormal.y / dot(vNorthAxisY, vNorthAxisY) +
  vNorthAxisZ * northObjectNormal.z / dot(vNorthAxisZ, vNorthAxisZ));
vec4 northClip = northProjection * viewMatrix * vec4(northWorldPoint, 1.0);
gl_FragDepth = clamp(northClip.z / northClip.w * .5 + .5, 0.0, 1.0);
`;

/** Lit, depth-reprojected views use the same daylight, fog and environment as cars. */
export async function createNorthImpostorMaterial(atlas: FirAtlasVariant) {
  if (atlas.views.length !== 16 || atlas.elevations.length !== 2)
    throw new Error('Northern fir atlas requires eight azimuths at two elevations');
  const loader = new T.TextureLoader();
  const [albedo, normalDepth] = await Promise.all([
    loader.loadAsync(url(atlas.albedo)), loader.loadAsync(url(atlas.normalDepth)),
  ]);
  for (const texture of [albedo, normalDepth]) {
    texture.flipY = false;
    texture.wrapS = texture.wrapT = T.ClampToEdgeWrapping;
    texture.minFilter = T.LinearMipmapLinearFilter; texture.magFilter = T.LinearFilter;
    texture.anisotropy = 1;
  }
  albedo.colorSpace = T.SRGBColorSpace; normalDepth.colorSpace = T.NoColorSpace;
  const material = new T.MeshStandardMaterial({ name: 'north-ridge-atlas-' + atlas.variant,
    color: 0xffffff, roughness: 1, metalness: 0, envMapIntensity: .65,
    alphaTest: .001, side: T.DoubleSide });
  material.userData.quarryStaticFragmentSurface = true;
  const uniforms = {
    northAlbedo: { value: albedo }, northNormalDepth: { value: normalDepth },
    northAtlasCenter: { value: new T.Vector3().fromArray(atlas.center) },
    northFrameSize: { value: new T.Vector2().fromArray(atlas.frameSize) },
    northAtlasSize: { value: new T.Vector2().fromArray(atlas.atlasSize) },
    northElevations: { value: new T.Vector2().fromArray(atlas.elevations) },
    northViewDirection: { value: atlas.views.map(v => new T.Vector3().fromArray(v.direction)) },
    northViewRight: { value: atlas.views.map(v => new T.Vector3().fromArray(v.right)) },
    northViewUp: { value: atlas.views.map(v => new T.Vector3().fromArray(v.up)) },
    northDepthRange: { value: atlas.views.map(v => new T.Vector2().fromArray(v.depthRange)) },
    northViewRect: { value: atlas.views.map(v => new T.Vector4().fromArray(v.rect)) },
    northProjection: { value: new T.Matrix4() },
  };
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = vertexDeclarations + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', projectVertex);
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', 'vec4 worldPosition = northBillboardWorld;');
    shader.fragmentShader = fragmentDeclarations + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', sampleSurface);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_begin>', `
      #include <normal_fragment_begin>
      normal = transformDirection(quarryStaticSurfaceNormal, viewMatrix);
      nonPerturbedNormal = normal;
    `);
  };
  material.customProgramCacheKey = () => 'north-ridge-depth-atlas-v1';
  return { material, textures: [albedo, normalDepth],
    beforeRender: (_renderer: T.WebGLRenderer, _scene: T.Scene, camera: T.Camera) => {
      uniforms.northProjection.value.copy(camera.projectionMatrix);
    } };
}
