// Soot laid over the finished opaque scene (render_scorch.js): boxes around
// the parts of the world that hold any, drawn by their far faces so that it
// makes no difference whether the camera is inside one. With PRESSED the
// same program draws the marks heavy landings leave: a box a mark, the
// mark a disc of pressed earth in it.
import { VOXEL } from './engine.js';
import { FRAME } from './shaders.js';

export const SCORCH_VS = `
${FRAME}
layout(location = 0) in vec3 aMin;
layout(location = 1) in vec3 aMax;
flat out vec3 vMin;
flat out vec3 vMax;
void main() {
  // Twelve triangles from the vertex number: face, then corner of the face.
  int face = gl_VertexID / 6, k = gl_VertexID - face * 6;
  int axis = face >> 1;
  vec2 c = vec2(float(k == 1 || k == 2 || k == 4), float(k == 2 || k == 4 || k == 5));
  float side = float(face & 1);
  // Wound so that every face is seen from outside the box anticlockwise.
  if (side < 0.5) c = c.yx;
  vec3 t = axis == 0 ? vec3(side, c) : axis == 1 ? vec3(c.y, side, c.x) : vec3(c, side);
  vMin = aMin;
  vMax = aMax;
  gl_Position = uViewProj * vec4(mix(aMin, aMax, t), 1.0);
}
`;

export const SCORCH_FS = `
${FRAME}
uniform sampler2D uDepth;
uniform highp sampler3D uScorch;
uniform sampler2D uNoise;
uniform highp usampler3D uSolid0;  // one bit per voxel: solid when the scene was built (bytes along x, then z, then y)
uniform sampler3D uOcc;    // how much of each 20 cm cell is solid world now (x, z, y)
uniform sampler3D uSkyVis; // how much of the sky reaches each 40 cm cell (x, z, y)
uniform vec3 uScorchInv;   // one over the world's size (m)
flat in vec3 vMin;
flat in vec3 vMax;
out vec4 oColor;
#define VOXELS ${(1 / VOXEL).toFixed(4)}
// What soot leaves of the light under an open sky, and the shares of the
// sky between which it goes from the shade's soot to that.
#define SOOT_OPEN vec3(0.2, 0.19, 0.18)
#define SOOT_SKY_LO 0.15
#define SOOT_SKY_HI 0.5
// Metres from the world's box side over which a mark fades out, and the
// soot (as the volume holds it: 0.56 at four fifths of a blast's reach)
// under which a face that looks up takes none.
#define SOOT_SIDE 2.0
#define SOOT_UP_NONE 0.56
void main() {
  float d = texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r;
  // (The sky is not in any box either, but this says so sooner.)
  if (d >= 1.0) discard;
  vec4 h = uInvViewProj * vec4(gl_FragCoord.xy * uScreen.xy * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  vec3 wp = h.xyz / h.w;
  // Boxes one behind the other cover the same pixel: the surface is in one
  // of them at most.
  if (any(lessThan(wp, vMin)) || any(greaterThanEqual(wp, vMax))) discard;
#ifdef PRESSED
  // The box is the mark's own: its middle is where the thing came down,
  // half its width how far the mark reaches. All of it at the middle,
  // none at the reach.
  vec2 off = (wp.xz - (vMin.xz + vMax.xz) * 0.5) / ((vMax.x - vMin.x) * 0.5);
  float s = 1.0 - dot(off, off);
  if (s <= 0.0) discard;
#else
  float s = textureLod(uScorch, wp * uScorchInv, 0.0).r;
  // The volume ends at the world's box and the ground goes on beyond it:
  // a mark that reaches the box's side is let fade over its last two
  // metres, not cut along a ruled line (a rocket at a tree five metres
  // from the edge left a rectangle on the lawn, straight on one side).
  // (Taken off the mark at the end, after the ground's own rule below:
  // taken off before it, that rule's threshold made a ruled line of the
  // fade again, a metre and a half inside the box.)
  vec2 side = min(wp.xz, 1.0 / uScorchInv.xz - wp.xz);
  float edge = smoothstep(0.0, SOOT_SIDE, min(side.x, side.y));
  if (s * edge < 0.004) discard;
#endif
  // Soot is on what stood there when the blast went off. A piece that has
  // come down onto a burnt spot since lies where there was air when the
  // scene was built: a little way into the surface, was that solid? Into
  // it along its own normal, taken from the depth around the pixel: along
  // the view ray, a face seen at a slant was left at its own surface, and
  // which side of it the test fell on went by rounding (pale lines along
  // the cubes of a tree's crown, whose faces are all seen at a slant
  // somewhere). Where the depth breaks (a silhouette) the normal means
  // nothing, and the ray's way in is tried as well.
  vec3 toP = wp - uCamPos.xyz;
  float dist = length(toP);
  vec3 gn = cross(dFdx(wp), dFdy(wp));
  float gl2 = dot(gn, gn);
  vec3 inward = gl2 > 0.0 ? gn * inversesqrt(gl2) : toP / dist;
  if (dot(inward, toP) < 0.0) inward = -inward;
  ivec3 size = textureSize(uSolid0, 0);
  ivec3 v = ivec3(floor((wp + inward * 0.03) * VOXELS));
  bool inside = v.x >= 0 && v.y >= 0 && v.z >= 0 && v.x < size.x * 8 && v.z < size.y && v.y < size.z;
  bool built = inside && ((texelFetch(uSolid0, ivec3(v.x >> 3, v.z, v.y), 0).r >> uint(v.x & 7)) & 1u) != 0u;
  if (!built) {
    // A surface drawn smoother than its voxels (a lawn's slope, a worn
    // edge) lies a little above them where a step was: 3 cm in is still
    // the air of the scene as built there, and the soot had pale dashes
    // along every step of a burnt lawn. A voxel and a bit further in is
    // the ground under it. (What has come down onto a burnt spot since is
    // thicker than that, but for the thin rim of a heap.)
    ivec3 u = ivec3(floor((wp + inward * 0.13) * VOXELS));
    bool under = u.x >= 0 && u.y >= 0 && u.z >= 0 && u.x < size.x * 8 && u.z < size.y && u.y < size.z;
    if (under && ((texelFetch(uSolid0, ivec3(u.x >> 3, u.z, u.y), 0).r >> uint(u.x & 7)) & 1u) != 0u) { built = true; v = u; }
  }
  if (!built) {
    ivec3 w = ivec3(floor((wp + toP * (0.03 / dist)) * VOXELS));
    bool within = w.x >= 0 && w.y >= 0 && w.z >= 0 && w.x < size.x * 8 && w.z < size.y && w.y < size.z;
    if (within && ((texelFetch(uSolid0, ivec3(w.x >> 3, w.z, w.y), 0).r >> uint(w.x & 7)) & 1u) != 0u) { built = true; v = w; }
    inside = inside || within;
  }
#ifdef PRESSED
  // (The ground beyond the world's box is as it was built, all of it: a
  // crane's head comes down out there.)
  if (inside) {
#else
  {
#endif
    if (!built) discard;
    // And it is on what still stands there. A body that has come away from
    // the wall falls through where walls and floors were: with nothing of
    // the world left in the cell it is in, it carries none of their soot
    // (it showed the shapes of what had stood there, sliding over it).
    if (texelFetch(uOcc, v.xzy >> 1, 0).r == 0.0) discard;
  }
  // The noise is laid along the world's diagonal, so that walls, floors and
  // ceilings all get it at the same mild slant and none of them edge-on;
  // its level from how large a pixel is out there.
  vec2 uv = vec2(dot(wp, vec3(0.7071, -0.7071, 0.0)), dot(wp, vec3(0.4082, 0.4082, -0.8165))) * 0.23;
  float lod = max(log2(dist * 2.0 * uProj.w * uScreen.y * 0.23 * 128.0), 0.0);
  vec2 n = textureLod(uNoise, uv, lod).rg;
  // Solid where the blast was near, in patches further out, nothing at its
  // reach: the edge is the noise's, not a circle's.
#ifdef PRESSED
  // Pressed and scuffed earth: darker and browner than what it was, the
  // green gone out of a lawn; patches at its rim, the noise's edge.
  // (A mark is a metre or two across: its rim is broken up by the noise
  // at a third of the soot's scale, or it is a clean disc.)
  vec2 m = textureLod(uNoise, uv * 3.0 + 0.37, max(lod + 1.58, 0.0)).rg;
  float a = smoothstep(0.0, 0.45, s - (1.0 - m.r) * 0.75 - (1.0 - n.r) * 0.2) * (0.75 + 0.25 * m.g);
  vec3 keep = mix(vec3(1.0), vec3(0.74, 0.56, 0.46), a);
#else
  // What looks up (the ground, a floor, a roof) is burnt nearer in than
  // what faces the blast: all of it to half the reach as a wall is, none
  // beyond four fifths of it. (One rocket left a lawn darker over a disc
  // fifteen metres across; grass singes close in and no further.)
  float up = smoothstep(0.5, 0.9, -inward.y);
  // (The riser of a step in a lawn or a kerb is ground too: it faces
  // sideways, but nothing stood over it. Taken for walls, the risers of a
  // burnt lawn were black lines in rows round the mark.)
  if (up < 1.0) {
    ivec3 o = ivec3(floor((wp + inward * 0.05 + vec3(0.0, 0.3, 0.0)) * VOXELS));
    bool over = o.x >= 0 && o.y >= 0 && o.z >= 0 && o.x < size.x * 8 && o.z < size.y && o.y < size.z
      && ((texelFetch(uSolid0, ivec3(o.x >> 3, o.z, o.y), 0).r >> uint(o.x & 7)) & 1u) != 0u;
    if (!over) up = 1.0;
  }
  s = mix(s, smoothstep(SOOT_UP_NONE, 1.0, s), up) * edge;
  float a = smoothstep(0.0, 0.3, s - (1.0 - n.r) * 0.42);
  a *= 0.82 + 0.18 * n.g;
  // Soot takes more than half the light where little of the sky reaches,
  // four fifths under an open sky; where it is thin the surface under it
  // is singed, a little brown. (It took three quarters everywhere: in the
  // sun a black smudge, but the inside of a hole, which is in shade and all
  // of it within the blast, went to a flat black with nothing to see in
  // it. Then more than half everywhere: the rooms were right, and on a
  // sunlit brick front the wall round a rocket's hole read as clean, the
  // soot on it as a faint shadow.) The sky is asked for a cell out from
  // the surface, in the air in front of it.
  // On what stands, that is: the ground under an open sky is as it was
  // (at four fifths a burnt lawn was a black rectangle).
  float open = smoothstep(SOOT_SKY_LO, SOOT_SKY_HI, textureLod(uSkyVis, (wp - inward * 0.4 + vec3(0.0, 0.2, 0.0)).xzy * uSkyVisInv.xyz, 0.0).r) * (1.0 - up);
  vec3 keep = mix(vec3(1.0), mix(vec3(0.44, 0.41, 0.38), SOOT_OPEN, open), a);
#endif
#ifdef HDR_ENCODE
  // (The scene holds the square root of its light here.)
  keep = sqrt(keep);
#endif
  oColor = vec4(1.0 - keep, 0.0);
}
`;
