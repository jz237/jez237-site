// GLSL shared by the lizard skin, eyelids and spines: 3D Voronoi scales with an
// analytic height gradient, so the scales stay crisp at macro distances.
export const voronoiChunk = /* glsl */ `
vec3 lzHash3(vec3 p){
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}
float lzHash1(vec3 p){ return fract(sin(dot(p, vec3(17.13, 91.71, 47.37))) * 43758.5453); }
// Returns: x = distance to nearest feature, y = distance to the cell border,
// z = cell random id. grad1 = d(x)/dp, gradB = d(y)/dp.
vec3 lzVoronoi(vec3 p, float jitter, out vec3 grad1, out vec3 gradB){
  vec3 ip = floor(p), fp = fract(p);
  vec3 mg, mr; float md = 8.0;
  for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec3 g = vec3(float(i), float(j), float(k));
    vec3 o = 0.5 + (lzHash3(ip + g) - 0.5) * jitter;
    vec3 r = g + o - fp;
    float d = dot(r, r);
    if(d < md){ md = d; mr = r; mg = g; }
  }
  float bd = 8.0; vec3 bn = vec3(0.0, 1.0, 0.0);
  for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec3 g = mg + vec3(float(i), float(j), float(k));
    vec3 o = 0.5 + (lzHash3(ip + g) - 0.5) * jitter;
    vec3 r = g + o - fp;
    vec3 dr = r - mr;
    float l2 = dot(dr, dr);
    if(l2 > 1e-5){
      vec3 n = dr * inversesqrt(l2);
      float d = dot(0.5 * (mr + r), n);
      if(d < bd){ bd = d; bn = n; }
    }
  }
  float d1 = sqrt(md);
  grad1 = -mr / max(d1, 1e-4);
  gradB = -bn;
  return vec3(d1, bd, lzHash1(ip + mg));
}
// Domed scale: height and gradient in cell units.
float lzScale(vec3 p, float jitter, float edge, float dome, out vec3 grad, out vec3 cell){
  vec3 g1, gb;
  vec3 v = lzVoronoi(p, jitter, g1, gb);
  float t = clamp(v.y / edge, 0.0, 1.0);
  float s = t * t * (3.0 - 2.0 * t);
  float ds = 6.0 * t * (1.0 - t) / edge;
  float dm = 1.0 - dome * v.x * v.x;
  grad = ds * gb * dm + s * (-2.0 * dome * v.x) * g1;
  cell = v;
  return s * dm;
}
`;
